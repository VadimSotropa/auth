const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an Email!"],
        unique: [false],
      },

      email: {
        type: String,
        required: [true, "Please provide an Name!"],
        unique: [false, "Email Exist"],
      },
    
      password: {
        type: String,
        required: [true, "Please provide a password!"],
        unique: false,
      },
    
  })
  
  module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);