import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

import profileRoutes from "./routes/profileRoutes.js";


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json())

app.use("/uploads", express.static("uploads"))

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`)

//   await reloadAllRoutines();
});
