const jwt = require('jsonwebtoken');
const Login = require('../models/loginModel');

require('dotenv').config()
const authenticateUser = async (req, res, next) => {
    let idToken = req.cookies['login'];

    try {
        const decodedMessage = jwt.verify(idToken,  process.env.CLIENT_SECRET);
        await Login.findOne({
            email: decodedMessage
        });
        next();
    }
    catch (e) {
        res.status(401).send({
            error: e
        })
    }
}

module.exports = { authenticateUser };