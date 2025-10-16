const express = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 9;
// const myPlaintextPassword = "s0//P4$$w0rD";
// const someOtherPlaintextPassword = "not_bacon";
var jwt = require('jsonwebtoken');
const UserModel = require("../models/userModel");
const ProfileModel = require("../models/ProfileModel");
const UserRouter = express.Router();

/// SignUp
/// client username, email & password from req.body
/// npm bycrypt helps to hash the password

UserRouter.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // hash the raw password
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        res.status(500).json({ message: "Something went wrong" });
      } else {
        // hash generated
        // console.log("rawpassword->", password,"hashed password-->",hash);
        // store this password in DB along with other userdata

      let user = await UserModel.create({ username, email, password: hash });
        res.status(201).json({ message: "Signup Sucess",user });
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});




UserRouter.post("/login", async (req, res) => {
  /// email and password
  try {
    /// check whether user is    present,
   const { email, password } = req.body;
   let user = await UserModel.findOne({ email });  
     let Profile= await ProfileModel.find({email})
let userProfile = true;

if (!Profile || Profile.length === 0) {
  userProfile = false;
}   
    
    if (!user) {
      /// if no, send res as signup   ya 
      res.status(404).json({ message: "User Not Found, Please Signup" });
    } else {
      /// user found
      // if yes, comapare the password
      let hash = user.password; /// hashed - stored password from DB    DB se password liye hai
      bcrypt.compare(password, hash).then(function (result){
        // result == true
        ///console.log(result);
        if (result == true) {
          // if comparision true, then login success
          /// generate jwt and send along with the response
          var token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY);
          //console.log(token)
          res.status(200).json({ message: "Login Sucesss", token ,userProfile,Profile});
        } else {
          /// else wrong password
          res.status(403).json({ message: "Wrong Password" });
        }
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});


module.exports=UserRouter