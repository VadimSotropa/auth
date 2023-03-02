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

app.post("/register", (request, response) => {
  // hash the password
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      // create a new user instance and collect the data
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
        name: request.body.name,
        token: uid2(32),
        canAddFavorite: true,
        likedArticles: [], // Initialize likedArticles array to empty
      });
      user
        .save()
        // return success if the new user is added to the database successfully
        .then((result) => {
          response.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        // catch error if the new user wasn't added successfully to the database
        .catch((error) => {
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });
      })
      // catch error if the password hash isn't successful
      .catch((e) => {
        response.status(500).send({
          message: "Password was not hashed successfully",
          e,
        });
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

app.post('/users/:token/favorites', (req, res) => {
  const { token } = req.params;
  const { cryptoId } = req.body;

  User.findById(token, (err, user) => {
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
