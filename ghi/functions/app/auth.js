const express = require('express');
const jwt = require('../utils/jwt');
const hash = require('../utils/hash');
const authMiddleware = require('../middleware/auth');
const {db} = require('../index'); // 🔧Import db from shared initialized instance

// eslint-disable-next-line new-cap
const router = express.Router();

// 🔥 Signup Route
router.post('/signup', async (req, res) => {
    try {
        console.log('🔥 Starting signup process');
        const {username, password, name, email, phone, bio} = req.body || {};

        console.log('🔥 Incoming data:', {
            username,
            hasPassword: !!password,
            name,
            email,
            phone,
        });

        if (!username || !password) {
            console.log('❌ Missing username or password');
            return res
                .status(400)
                .json({error: 'Username and password required'});
        }

        const existingSnap = await db
            .collection('users')
            .where('username', '==', username)
            .get();
        console.log('🔥 Existing username query executed');

        if (!existingSnap.empty) {
            console.log('❌ Username already exists');
            return res.status(409).json({error: 'Username already exists'});
        }

        const hashedPassword = hash.hashPassword(password);
        const newUserRef = await db.collection('users').add({
            username,
            password: hashedPassword,
            name,
            email,
            phone,
            bio,
        });

        console.log('✅ New user created with ID:', newUserRef.id);

        const token = jwt.generateJWT({id: newUserRef.id, username});

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        res.json({id: newUserRef.id, username, name, email, phone, token});
    } catch (err) {
        console.error('🔥 Signup error:', err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// 🔥 Signin Route
router.post('/signin', async (req, res) => {
    try {
        console.log('🔥 Starting signin process');
        const {username, password} = req.body;

        const snapshot = await db
            .collection('users')
            .where('username', '==', username)
            .get();
        console.log('🔥 Query executed for signin');

        if (snapshot.empty) {
            console.log('❌ No user found for username');
            return res.status(401).json({error: 'Invalid credentials'});
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        const isValid = hash.verifyPassword(password, userData.password);
        if (!isValid) {
            console.log('❌ Invalid password');
            return res.status(401).json({error: 'Invalid credentials'});
        }

        const token = jwt.generateJWT({
            id: userDoc.id,
            username: userData.username,
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        res.json({
            id: userDoc.id,
            username: userData.username,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            token,
        });
    } catch (err) {
        console.error('🔥 Signin error:', err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// 🔥 Authenticate Route
router.get('/authenticate', authMiddleware, (req, res) => {
    res.json(req.user);
});

// 🔥 Signout Route
router.delete('/signout', (req, res) => {
    res.clearCookie('token');
    res.status(204).send();
});

module.exports = router;
