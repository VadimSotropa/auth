require('../db/dbConnect');
const mongoose = require('mongoose');

const schema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    picture: {
        type: String
    }
});

const Login = mongoose.model('login', schema);

module.exports = Login;