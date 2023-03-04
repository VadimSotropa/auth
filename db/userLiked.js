const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },

  User: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  }],

});

module.exports = mongoose.model('Article', ArticleSchema);