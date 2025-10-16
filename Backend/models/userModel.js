const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:String,
    email:{type:String,unique:true},
    password:{type:String}
    
})

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;