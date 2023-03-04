const mongoose = require("mongoose");
const articleSchema = require("./Article")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide an Name!"],
        unique: [false],
      },

      token: {
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

      likedArticles: [{
        type: String,
      }],
  })
  
  module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);