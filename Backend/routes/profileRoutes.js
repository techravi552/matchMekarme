import express from "express";
import multer from "multer";
import Profile from "../models/Profile.js";

const router = express.Router();

// 📂 Storage config for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// ✅ CREATE Profile
router.post("/", upload.single("profileImage"), async (req, res) => {
  try {
    const { name, email, city, number, gender, shortBio, age } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Profile image is required" });
    }

    const profile = new Profile({
      name,
      email,
      city,
      number,
      gender,
      shortBio,
      age,
      profileImage: req.file.filename
    });

    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ READ all profiles
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ READ single profile
router.get("/:id", async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE profile
router.put("/:id", upload.single("profileImage"), async (req, res) => {
  try {
    const { name, email, city, number, gender, shortBio, age } = req.body;

    const updateData = { name, email, city, number, gender, shortBio, age };
    if (req.file) updateData.profileImage = req.file.filename;

    const profile = await Profile.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ DELETE profile
router.delete("/:id", async (req, res) => {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.id);
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json({ message: "Profile deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
