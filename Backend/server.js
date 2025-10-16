const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const app = express();
const cors = require("cors");
const connectToDB = require("./config/db");
const UserRouter = require("./routes/userRoutes.js");
const ProfileRouter = require("./routes/ProfileRoutes.js");
const cloudinary = require('cloudinary').v2;

// massageing 
const { Redis } = require("@upstash/redis");

const http = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");
const GroupRoutes = require("./routes/ChatRoutes.js");
const GroupChatModel = require("./models/GroupChatModel.js");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

connectToDB();
console.log(process.env.CLOUDINARY_API_SECRET);
console.log(process.env.UPSTASH_REDIS_REST_URL);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let userDetails = {}; // clientId -> user info (name + photo)

// 🔵 SOCKET.IO Events
io.on("connection", (client) => {
  console.log("✅ Client connected:", client.id);

  // Register user
  client.on("registerUser", async (userData) => {
    userDetails[client.id] = userData;
    console.log("🧍 Registered:", userData.name);

    // Send last 15 messages
    let chatHistoryJSON = await redis.lrange("AllChatsToUI", 0, -1);
    
    // ✅ FIX: Upstash Redis returns already parsed data
    let chatHistoryArray = [];
    if (Array.isArray(chatHistoryJSON)) {
      chatHistoryArray = chatHistoryJSON.map(item => {
        // If item is string, parse it; if already object, use directly
        return typeof item === 'string' ? JSON.parse(item) : item;
      });
    }
    
    client.emit("chat_History", chatHistoryArray);
  });

  // Send Message
  client.on("sendMessage", async (message) => {
    const sender = userDetails[client.id];
    if (!sender) return;

    const chatObj = {
      from: sender.name,
      photo: sender.photo,
      message: message,
      timeStamp: new Date(),
    };

    // Push to Redis (for UI + DB)
    await redis.rpush("AllChatsToUI", JSON.stringify(chatObj));
    await redis.rpush("NewChatsToDB", JSON.stringify(chatObj));

    // Fetch full chat list and broadcast to all
    const chatHistoryJSON = await redis.lrange("AllChatsToUI", 0, -1);
    
    // ✅ FIX: Handle both string and object formats
    let chatHistoryArray = [];
    if (Array.isArray(chatHistoryJSON)) {
      chatHistoryArray = chatHistoryJSON.map(item => {
        return typeof item === 'string' ? JSON.parse(item) : item;
      });
    }
    
    io.emit("chat_History", chatHistoryArray);
  });

  // Disconnect
  client.on("disconnect", () => {
    console.log("❌ Client disconnected:", client.id);
    delete userDetails[client.id];
  });
});

// CRON JOB: every 30 seconds save Redis → MongoDB
cron.schedule("*/30 * * * * *", async () => {
  console.log("⏰ Cron started to sync chats...");

  let chatHistoryJSON = await redis.lrange("NewChatsToDB", 0, -1);
  if (!chatHistoryJSON || chatHistoryJSON.length === 0) {
    console.log("No new chats to sync.");
    return;
  }

  // ✅ FIX: Handle both string and object formats
  const chatArray = chatHistoryJSON.map(item => {
    return typeof item === 'string' ? JSON.parse(item) : item;
  });
  
  await GroupChatModel.insertMany(chatArray);
  await redis.del("NewChatsToDB");

  // Maintain latest 15 chats
  await redis.del("AllChatsToUI");
  let recentChats = await GroupChatModel.find().sort({ timeStamp: -1 }).limit(15);
  recentChats = recentChats.reverse();
  for (const chat of recentChats) {
    await redis.rpush("AllChatsToUI", JSON.stringify(chat));
  }

  console.log("✅ Chats saved to DB and Redis refreshed.");
});

app.use(express.json());
app.use(cors()); 

app.use("/profile", ProfileRouter);
app.use("/GourpChat", GroupRoutes);

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use("/users", UserRouter);

app.get("/test", (req, res) => {
  res.status(200).json({ message: "This is test route" });
});

// Handling undefined route
app.use((req, res) => {
  try {
    res.status(200).json({ message: "This request is undefined" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

server.listen(PORT, () => {
  console.log("Server started");
});