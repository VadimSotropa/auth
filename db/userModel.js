const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name!"],
    unique: [false],
  },

  token: {
    type: String,
    required: [true, "Please provide a token!"],
    unique: [false],
  },

  email: {
    type: String,
    required: [true, "Please provide an email!"],
    unique: [false, "Email exists"],
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

  likedArticles: [
    {
      article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
      },
      title: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);