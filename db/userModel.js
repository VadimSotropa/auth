const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide an Name!"],
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

      canAddFavorite: {
        type: Boolean,
        required: [true, "Please provide a password!"],
        unique: false,
      },
  })
  
  module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);