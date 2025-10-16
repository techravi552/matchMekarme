const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    
    name: {type:String,require:true},
    email:{type:String},
    age: Number,
    gender: String,
    city: String,
    bio: String,
    photo:{type:String},
      gallery: [String],
      likedBy:[String]
    
})
 
const ProfileModel = mongoose.model("Profile", userSchema);

module.exports = ProfileModel;