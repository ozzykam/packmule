const express = require('express')
const jwt = require('../utils/jwt')
const hash = require('../utils/hash')
const authMiddleware = require('../middleware/auth')
const admin = require('firebase-admin')

const router = express.Router()
const db = admin.firestore()

// ✅ Signup Route
router.post('/signup', async (req, res) => {
    try {
        const body = req.body || {}

        // Log entire request payload for debugging
        console.log(
            '🔥 Incoming signup payload:',
            JSON.stringify(body, null, 2)
        )

        const username = body.username?.trim() || ''
        const password = body.password || ''
        const name = body.name || ''
        const email = body.email || ''
        const phone = body.phone || ''
        const bio = body.bio || ''

        // Validate required fields
        if (!username || !password) {
            console.warn('⚠ Missing username or password')
            return res
                .status(400)
                .json({ error: 'Username and password are required.' })
        }

        // Check for existing user
        const existing = await db
            .collection('users')
            .where('username', '==', username)
            .get()

        if (!existing.empty) {
            console.warn('⚠ Username already exists:', username)
            return res.status(409).json({ error: 'Username already exists' })
        }

        const hashed = hash.hashPassword(password)

        const newUserRef = await db.collection('users').add({
            username,
            password: hashed,
            name,
            email,
            phone,
            bio,
        })

        const user = {
            id: newUserRef.id,
            username,
            name,
            email,
            phone,
        }

        const token = jwt.generateJWT({ id: user.id, username: user.username })

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        })

        res.json({ ...user, token })
    } catch (err) {
        console.error('🔥 Signup error:', err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// ✅ Signin Route
router.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body || {}

        console.log('🔥 Incoming signin attempt for username:', username)

        if (!username || !password) {
            console.warn('⚠ Missing username or password for signin')
            return res
                .status(400)
                .json({ error: 'Username and password are required.' })
        }

        const snapshot = await db
            .collection('users')
            .where('username', '==', username)
            .get()

        if (snapshot.empty) {
            console.warn('⚠ Username not found:', username)
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const userDoc = snapshot.docs[0]
        const userData = userDoc.data()

        const isValid = hash.verifyPassword(password, userData.password)
        if (!isValid) {
            console.warn('⚠ Invalid password for user:', username)
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const user = {
            id: userDoc.id,
            username: userData.username,
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
        }

        const token = jwt.generateJWT({ id: user.id, username: user.username })

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        })

        res.json({ ...user, token })
    } catch (err) {
        console.error('🔥 Signin error:', err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// ✅ Auth check route
router.get('/authenticate', authMiddleware, (req, res) => {
    res.json(req.user)
})

// ✅ Signout route
router.delete('/signout', (req, res) => {
    res.clearCookie('token')
    res.status(204).send()
})

module.exports = router
