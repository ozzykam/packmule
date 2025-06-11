const express = require('express')
const authMiddleware = require('../utils/authMiddleware')

module.exports = (db) => {
    const router = express.Router()

    router.get('/', authMiddleware, async (req, res) => {
        try {
            const doc = await db.collection('users').doc(req.user.id).get()
            if (!doc.exists) {
                return res.status(404).json({ error: 'Mule not found' })
            }
            res.json({ id: doc.id, ...doc.data() })
        } catch (err) {
            console.error('Error fetching mule:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    router.get('/all', authMiddleware, async (req, res) => {
        try {
            const snapshot = await db.collection('users').get()
            const mules = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            res.json(mules)
        } catch (err) {
            console.error('Error fetching all mules:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    router.put('/edit', authMiddleware, async (req, res) => {
        try {
            await db.collection('users').doc(req.user.id).update(req.body)
            const updatedDoc = await db
                .collection('users')
                .doc(req.user.id)
                .get()
            res.json({ id: updatedDoc.id, ...updatedDoc.data() })
        } catch (err) {
            console.error('Error updating profile:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    return router
}
