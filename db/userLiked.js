const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('Article', ArticleSchema);