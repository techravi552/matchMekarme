import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  city: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true
  },
  shortBio: {
    type: String,
    required: true,
    minlength: [50, "Short bio must be at least 20 words (≈50 chars)"]
  },
  age: {
    type: Number,
    required: true
  },
  profileImage: {
    type: String,
    required: true
  }
});

export default mongoose.model("Profile", profileSchema);
