/* eslint new-cap: "off" */
const express = require('express');
const jwt = require('../utils/jwt');
const hash = require('../utils/hash');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Mock database calls for now
const users = [];
let idCounter = 1;

router.post('/signup', (req, res) => {
    const {username, password, name, email, phone, bio} = req.body;
    const hashed = hash.hashPassword(password);
    const user = {
        id: idCounter++,
        username,
        password: hashed,
        name,
        email,
        phone,
        bio,
    };
    users.push(user);

    const token = jwt.generateJWT({id: user.id, username: user.username});
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
    });
    res.json({id: user.id, username: user.username, name, email, phone});
});

router.post('/signin', (req, res) => {
    const {username, password} = req.body;
    const user = users.find((u) => u.username === username);
    if (!user || !hash.verifyPassword(password, user.password)) {
        return res.status(401).json({error: 'Invalid credentials'});
    }
    const token = jwt.generateJWT({id: user.id, username: user.username});
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
    });
    res.json({id: user.id, username});
});

router.get('/authenticate', authMiddleware, (req, res) => {
    res.json(req.user);
});

router.delete('/signout', (req, res) => {
    res.clearCookie('token');
    res.status(204).send();
});

module.exports = router;
