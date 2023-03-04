const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },

  likes: [{type: mongoose.Schema.Types.ObjectId, ref : 'users'}],
});

module.exports = mongoose.model('Article', ArticleSchema);