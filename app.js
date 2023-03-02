const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const Article = require('./models/article');

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const canAddFavorite = true; // Set to true by default when a user registers

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      res.status(500).send(err);
    } else {
      const user = new User({
        name: name,
        email: email,
        password: hash,
        canAddFavorite: canAddFavorite,
        likedArticles: [], // Initialize likedArticles array to empty
      });
      user.save((err, result) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(201).send({
            message: 'User created successfully',
            id: result._id,
          });
        }
      });
    }
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        res.status(401).send({
          message: 'Authentication failed',
        });
      } else {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err || !result) {
            res.status(401).send({
              message: 'Authentication failed',
            });
          } else {
            res.status(200).send({
              message: 'Login successful',
              id: user._id,
            });
          }
        });
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.post('/users/:userId/favorites', (req, res) => {
  const { userId } = req.params;
  const { cryptoId } = req.body;

  User.findById(userId, (err, user) => {
    if (err || !user) {
      res.status(404).send({
        message: 'User not found',
      });
    } else {
      user.likedArticles.push(cryptoId);
      user.save((err, result) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(201).send({
            message: 'Favorite added successfully',
            likedArticle: cryptoId,
          });
        }
      });
    }
  });
});
// free endpoint
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});

module.exports = app;
