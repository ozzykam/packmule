const express = require('express')
const authMiddleware = require('../utils/authMiddleware')

module.exports = (db) => {
    const router = express.Router()

    router.get('/', authMiddleware, async (req, res) => {
        try {
            const snapshot = await db.collection('gigs').get()
            const gigs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            if (gigs.length === 0) {
                return res.status(404).json({ error: 'No gigs found' })
            }
            res.json(gigs)
        } catch (err) {
            console.error('Error fetching gigs:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    router.get('/:gigId', authMiddleware, async (req, res) => {
        try {
            const doc = await db.collection('gigs').doc(req.params.gigId).get()
            if (!doc.exists) {
                return res.status(404).json({ error: 'Gig not found' })
            }
            res.json({ id: doc.id, ...doc.data() })
        } catch (err) {
            console.error('Error fetching gig:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    router.post('/:gigId', authMiddleware, async (req, res) => {
        try {
            const assignment = {
                muleId: req.user.id,
                gigId: req.params.gigId,
                assignedAt: new Date().toISOString(),
            }

            // Prevent duplicates
            const existing = await db
                .collection('gig_assignments')
                .where('muleId', '==', req.user.id)
                .where('gigId', '==', req.params.gigId)
                .get()

            if (!existing.empty) {
                return res.status(400).json({ error: 'Gig already assigned' })
            }

            await db.collection('gig_assignments').add(assignment)
            res.json(assignment)
        } catch (err) {
            console.error('Error assigning gig:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    router.delete('/:gigId', authMiddleware, async (req, res) => {
        try {
            const assignments = await db
                .collection('gig_assignments')
                .where('muleId', '==', req.user.id)
                .where('gigId', '==', req.params.gigId)
                .get()

            if (assignments.empty) {
                return res.status(400).json({ error: 'Assignment not found' })
            }

            const batch = db.batch()
            assignments.forEach((doc) => batch.delete(doc.ref))
            await batch.commit()

            res.json({ success: true })
        } catch (err) {
            console.error('Error removing assignment:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    return router
}
