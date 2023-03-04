const mongoose = require('mongoose');
const UserSchema = require("./User")


const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },

});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;