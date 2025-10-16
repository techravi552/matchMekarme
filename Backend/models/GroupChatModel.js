const mongoose = require("mongoose");

const GroupChatSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true, // कौन भेज रहा है — user name या userId
  },
  photo: {
    type: String, // profile photo का URL
    default: "", // अगर photo ना हो तो खाली string
  },
  message: {
    type: String,
    required: true,
  },
  timeStamp: {
    type: Date,
    default: Date.now, // हर message का टाइम अपने आप save होगा
  },
});

const GroupChatModel = mongoose.model("GroupChat", GroupChatSchema);

module.exports = GroupChatModel;





// const mongoose = require("mongoose");

// const GroupChat  = new mongoose.Schema({
  
//       from: String,
//       photo:{type:String},
//       message: String,
//       timeStamp: Date,
// })

// const GroupChatModel = mongoose.model("GroupChat ", GroupChat);

// module.exports = GroupChatModel;

