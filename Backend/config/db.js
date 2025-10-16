const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    // Connect using environment variable
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ Failed To Connect DB");
    console.error("Error Details:", err.message);

    // Optional: exit process if DB connection fails
    process.exit(1);
  }
};

module.exports = connectToDB;
