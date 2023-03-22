const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const uid2 = require('uid2');
const jwt = require("jsonwebtoken");
const auth = require("./auth");
// require database connection 
const dbConnect = require("./db/dbConnect");
const router = express.Router();

// execute database connection 
dbConnect();
const User = require("./db/User");
const Article = require('./db/Article');
// Google cod part



// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// body parser configuration
app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

app.post("/register", (request, response) => {
  // Check if email already exists in database
  User.findOne({ email: request.body.email }, (error, existingUser) => {
    if (error) {
      // return error if there was an issue with the database
      response.status(500).send({
        message: "Error creating user",
        error,
      });
    } else if (existingUser) {
      // return error if email already exists in database
      response.status(400).send({
        message: "Email already exists",
      });
    } else {
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
          });

          // save the new user
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
    }
  });
});

// login endpoint
app.post("/login", (request, response) => {
  // check if email exists
  User.findOne({ email: request.body.email })

    // if email exists
    .then((user) => {
      // compare the password entered and the hashed password found
      bcrypt
        .compare(request.body.password, user.password)

        // if the passwords match
        .then((passwordCheck) => {

          // check if password matches
          if(!passwordCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }

          response.status(200).send({
            message: "Login Successful",
            token: user.token,
          });
        })
        // catch error if password does not match
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
});

app.get('/user/:email', async (request, response) => {
  try {
    const { email } = request.params;

    // Retrieve the user's information from the database
    const user = await User.findOne({ email });

    // If user is found, return the name, email, and token properties
    if (user) {
      const { name, email, token, likedArticles} = user;
      response.status(200).send({ name, email, token, likedArticles });
    } else {
      response.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    response.status(500).send({ message: 'Server error' });
  }
});



app.post('/Like', async (req, res) => {
  try {
    const token = req.body.token;
    const article = req.body.article;

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    if (user.likedArticles.includes(article)) {
      return res.json({ msg: 'Article already liked' });
    }

    user.likedArticles.push(article);
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', err: err.message });
  }
});

app.delete('/Like', async (req, res) => {
  try {
    const token = req.body.token;
    const article = req.body.article;

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    if (!user.likedArticles.includes(article)) {
      return res.status(404).json({ msg: 'Article not found' });
    }

    user.likedArticles = user.likedArticles.filter((liked) => liked !== article);
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', err: err.message });
  }
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
