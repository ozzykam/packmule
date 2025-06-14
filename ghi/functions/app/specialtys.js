const express = require('express')
const authMiddleware = require('../utils/authMiddleware')

module.exports = (db) => {
    const router = express.Router()

    router.get('/', authMiddleware, async (req, res) => {
        try {
            const snapshot = await db.collection('specialtys').get()
            const specialties = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            res.json(specialties)
        } catch (err) {
            console.error('Error fetching specialties:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    router.get('/mule/:muleId', authMiddleware, async (req, res) => {
        try {
            const snapshot = await db
                .collection('mule_specialtys')
                .where('muleId', '==', req.params.muleId)
                .get()

            const specialties = snapshot.docs.map((doc) => doc.data())
            res.json(specialties)
        } catch (err) {
            console.error('Error fetching specialties for mule:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    router.post('/mule', authMiddleware, async (req, res) => {
        try {
            const { specialtyId, specialtyName } = req.body
            const exists = await db
                .collection('mule_specialtys')
                .where('muleId', '==', req.user.id)
                .where('specialtyId', '==', specialtyId)
                .get()

            if (!exists.empty) {
                return res
                    .status(409)
                    .json({ error: 'Specialty already exists' })
            }

            const specialty = {
                muleId: req.user.id,
                specialtyId,
                specialtyName,
            }
            await db.collection('mule_specialtys').add(specialty)
            res.json(specialty)
        } catch (err) {
            console.error('Error adding specialty:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    router.delete('/mule/:specialtyId', authMiddleware, async (req, res) => {
        try {
            const snapshot = await db
                .collection('mule_specialtys')
                .where('muleId', '==', req.user.id)
                .where('specialtyId', '==', req.params.specialtyId)
                .get()

            if (snapshot.empty) {
                return res
                    .status(404)
                    .json({ error: 'Specialty not found for this mule' })
            }

            const batch = db.batch()
            snapshot.forEach((doc) => batch.delete(doc.ref))
            await batch.commit()

            res.json({ success: true })
        } catch (err) {
            console.error('Error deleting specialty:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    return router
}
