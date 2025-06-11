const express = require('express');
const jwt = require('../utils/jwt');
const hash = require('../utils/hash');
const authMiddleware = require('../middleware/auth');
const admin = require('firebase-admin');

// eslint-disable-next-line new-cap
const router = express.Router();
const db = admin.firestore();

router.post('/signup', async (req, res) => {
    const {username, password, name, email, phone, bio} = req.body;

    // Check if user already exists
    const existing = await db
        .collection('users')
        .where('username', '==', username)
        .get();
    if (!existing.empty) {
        return res.status(409).json({error: 'Username already exists'});
    }

    const hashed = hash.hashPassword(password);
    const newUserRef = await db.collection('users').add({
        username,
        password: hashed,
        name,
        email,
        phone,
        bio,
    });

    const user = {
        id: newUserRef.id,
        username,
        name,
        email,
        phone,
    };

    const token = jwt.generateJWT({id: user.id, username: user.username});

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });

    res.json({...user, token});
});

router.post('/signin', async (req, res) => {
    const {username, password} = req.body;

    const snapshot = await db
        .collection('users')
        .where('username', '==', username)
        .get();
    if (snapshot.empty) {
        return res.status(401).json({error: 'Invalid credentials'});
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    const isValid = hash.verifyPassword(password, userData.password);
    if (!isValid) {
        return res.status(401).json({error: 'Invalid credentials'});
    }

    const user = {
        id: userDoc.id,
        username: userData.username,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
    };

    const token = jwt.generateJWT({id: user.id, username: user.username});

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });

    res.json({...user, token});
});

router.get('/authenticate', authMiddleware, (req, res) => {
    res.json(req.user);
});

router.delete('/signout', (req, res) => {
    res.clearCookie('token');
    res.status(204).send();
});

module.exports = router;
