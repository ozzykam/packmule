const jwt = require('jsonwebtoken');
const SECRET = process.env.SIGNING_KEY || 'dev-secret';

function generateJWT(user) {
    return jwt.sign({user}, SECRET, {expiresIn: '7d'});
}

function verifyJWT(token) {
    return jwt.verify(token, SECRET);
}

module.exports = {generateJWT, verifyJWT};
