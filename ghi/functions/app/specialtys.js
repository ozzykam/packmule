const express = require('express');
const authMiddleware = require('../utils/authMiddleware');

module.exports = (db) => {
    // eslint-disable-next-line
    const router = express.Router()

    // GET /api/specialtys - Get all specialties
    router.get('/', async (req, res) => {
        try {
            const snapshot = await db.collection('specialtys').get();
            const specialties = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            res.json(specialties);
        } catch (err) {
            console.error('Error fetching specialties:', err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    // POST /api/specialtys - Create new specialty
    router.post('/', authMiddleware, async (req, res) => {
        try {
            const {name, specialtyTypeId} = req.body;
            if (!name || !specialtyTypeId) {
                return res.status(400).json({
                    error: 'Name and specialty_type_id required',
                });
            }

            const specialty = {name, specialtyTypeId};
            const docRef = await db.collection('specialtys').add(specialty);
            res.json({id: docRef.id, ...specialty});
        } catch (err) {
            console.error('Error creating specialty:', err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    // GET /api/specialtys/:id - Get specialty by ID
    router.get('/:id', async (req, res) => {
        try {
            const doc = await db
                .collection('specialtys')
                .doc(req.params.id)
                .get();
            if (!doc.exists) {
                return res.status(404).json({error: 'Specialty not found'});
            }
            res.json({id: doc.id, ...doc.data()});
        } catch (err) {
            console.error('Error fetching specialty:', err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    // DELETE /api/specialtys/:id - Delete specialty
    router.delete('/:id', authMiddleware, async (req, res) => {
        try {
            await db.collection('specialtys').doc(req.params.id).delete();
            res.json({success: true});
        } catch (err) {
            console.error('Error deleting specialty:', err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    router.get('/packer/:packerId', authMiddleware, async (req, res) => {
        try {
            const snapshot = await db
                .collection('packer_specialtys')
                .where('packerId', '==', req.params.packerId)
                .get();

            const specialties = snapshot.docs.map((doc) => doc.data());
            res.json(specialties);
        } catch (err) {
            console.error('Error fetching specialties for packer:', err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    router.post('/packer', authMiddleware, async (req, res) => {
        try {
            const {specialtyId, specialtyName} = req.body;
            const exists = await db
                .collection('packer_specialtys')
                .where('packerId', '==', req.user.id)
                .where('specialtyId', '==', specialtyId)
                .get();

            if (!exists.empty) {
                return res
                    .status(409)
                    .json({error: 'Specialty already exists'});
            }

            const specialty = {
                packerId: req.user.id,
                specialtyId,
                specialtyName,
            };
            await db.collection('packer_specialtys').add(specialty);
            res.json(specialty);
        } catch (err) {
            console.error('Error adding specialty:', err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    router.delete('/packer/:specialtyId', authMiddleware, async (req, res) => {
        try {
            const snapshot = await db
                .collection('packer_specialtys')
                .where('packerId', '==', req.user.id)
                .where('specialtyId', '==', req.params.specialtyId)
                .get();

            if (snapshot.empty) {
                return res
                    .status(404)
                    .json({error: 'Specialty not found for this packer'});
            }

            const batch = db.batch();
            snapshot.forEach((doc) => batch.delete(doc.ref));
            await batch.commit();

            res.json({success: true});
        } catch (err) {
            console.error('Error deleting specialty:', err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    return router;
};
