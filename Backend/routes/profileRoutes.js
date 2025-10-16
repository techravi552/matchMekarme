const ProfileModel = require("../models/ProfileModel");
const express=require("express")
let ProfileRouter=express.Router()
require("dotenv").config();
const fs = require('fs');
const multer  = require('multer');
const authMiddleware = require("../middlewares/authMiddleware");
const UserModel = require("../models/userModel");

const cloudinary = require('cloudinary').v2;




// Cloudinary config

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'my-uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})


const upload = multer({ storage: storage })



//Route to create a new student
 ProfileRouter.post("/create",upload.single("photo"),async (req,res)=>{
     
try {

const {name,email,age,gender,city,bio}=req.body



//Create student record with Base64-encoded image
// photopath=req.file?req.file.path:null

// cloudnary data ulr upload kar dete hai

    let photoUrl = null;

    // Agar photo upload hui hai to Cloudinary par upload karo
    if (req.file) {
      // Cloudinary par upload karo
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profiles', // Cloudinary me folder name
        resource_type: 'auto'
      });
      
      // Cloudinary se mila URL save karo
      photoUrl = result.secure_url;
      
      // Local file delete karo (optional - cleanup ke liye)
      fs.unlinkSync(req.file.path);
    }




const ProfileData=new ProfileModel({
    name,
    email,
    age,
    gender,
    city,
    bio,
    photo:photoUrl
})

await ProfileData.save();
res.status(201).json({message:"Profile create successfully ",profile:ProfileData})
    } catch (error) {
        console.log(error)
res.status(404).json({message:"some erro happaend "})

    }

 })




// ✅ Route 2: Get all profiles
ProfileRouter.get("/all", async (req, res) => {
  try {
    const profiles = await ProfileModel.find({});
    
    res.status(200).json({
      message: "Profiles fetched successfully",
      profiles: profiles
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({
      message: "Error fetching profiles",
      error: error.message
    });
  }
});




//for profile 

ProfileRouter.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const userProfile = await ProfileModel.findOne({ email });
    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(userProfile);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});



// PUT - Update Profile
ProfileRouter.put("/update/:id",authMiddleware,async (req, res) => {
  try {
    const { id } = req.params;

    // console.log(id)

    // Ensure user can only update their own profile
    // if (req.user.id !== id) {
    //   return res.status(403).json({ message: "Unauthorized to update this profile" });
    // }

    const updatedUser = await ProfileModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true } // return updated doc
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
});





// 📸 Upload new gallery photo (JWT Protected)
ProfileRouter.post("/upload-photo/:email", authMiddleware, upload.single("photo"), async (req, res) => {
  try {
    const { email } = req.params;

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded!" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "gallery_photos",
      resource_type: "auto",
    });

    // Delete local file
    fs.unlinkSync(req.file.path);

    // Update user's gallery (array push)
    const updatedProfile = await ProfileModel.findOneAndUpdate(
      { email },
      { $push: { gallery: result.secure_url } },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Photo uploaded successfully",
      gallery: updatedProfile.gallery,
    });
  } catch (error) {
    console.error("Error uploading photo:", error);
    res.status(500).json({ message: "Error uploading photo", error: error.message });
  }
});





// ensure correct path

ProfileRouter.post("/like/:email", authMiddleware, async (req, res) => {
  try {
    const { email } = req.params; // jis profile ko like karna hai
    const currentUserId = req.user.userId; // JWT se mila user id

    // ✅ Current user ka data nikaal lo
    const currentUser = await UserModel.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }

    // ✅ Target profile (jis user ko like kar rahe ho)
    const targetProfile = await ProfileModel.findOne({ email });
    if (!targetProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // ✅ Check karo — kya currentUser ne pehle se like kiya hua hai?
    const alreadyLiked = targetProfile.likedBy.includes(currentUser.email);

    // ✅ Agar already liked tha → unlike kar do
    if (alreadyLiked) {
      await ProfileModel.updateOne(
        { email },
        { $pull: { likedBy: currentUser.email } }
      );
      return res.json({ liked: false, match: false, message: "Like removed 👎" });
    }

    // ✅ Naya like add karo
    await ProfileModel.updateOne(
      { email },
      { $addToSet: { likedBy: currentUser.email } }
    );

    // ✅ Ab check karo ki kya target user ne bhi mujhe like kiya hai?
    const myProfile = await ProfileModel.findOne({ email: currentUser.email });
    const isMutualLike = myProfile?.likedBy?.includes(targetProfile.email);

    if (isMutualLike) {
      return res.json({
        liked: true,
        match: true,
        message: "It's a Match 💞 You both liked each other!",
      });
    } else {
      return res.json({
        liked: true,
        match: false,
        message: "Profile liked ❤️",
      });
    }
  } catch (error) {
    console.error("Like toggle error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});







// http://localhost:5000/profile/like/rajeshavar@gmail.com

// ProfileRouter.get("/getOneProfile/:email",async(req,res)=>{


//    try {
//       const targetProfile = await ProfileModel.findOne({ email });
//      if (!targetProfile) {
//        return res.status(404).json({ message: "Profile not found" });
//      }
 
//      return res.json({Profile:targetProfile})
//    } catch (error) {
//      return res.json({"massage":"something is wrog "})
//    }

// })



 module.exports=ProfileRouter