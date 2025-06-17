const express = require('express');
const authMiddleware = require('../utils/authMiddleware');

module.exports = (db) => {
    // eslint-disable-next-line
    const router = express.Router()

    // GET /api/gigs - Get all gigs
    router.get('/', authMiddleware, async (req, res) => {
        try {
            const snapshot = await db.collection('gigs').get();
            const gigs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            res.json(gigs);
        } catch (err) {
            console.error('Error fetching gigs:', err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    // POST /api/gigs - Create new gig
    router.post('/', authMiddleware, async (req, res) => {
        try {
            const {
                name,
                pictureUrl,
                description,
                status,
                location,
                pay,
                date,
            } = req.body;
            if (!name || !description) {
                return res
                    .status(400)
                    .json({error: 'Name and description are required'});
            }

            const gig = {
                name,
                picture_url: pictureUrl || '',
                description,
                status: status || 'pending',
                location: location || '',
                pay: pay || 0,
                date: date || new Date().toISOString(),
                created_at: new Date().toISOString(),
            };

            const docRef = await db.collection('gigs').add(gig);
            res.json({id: docRef.id, ...gig});
        } catch (err) {
            console.error('Error creating gig:', err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    // PUT /api/gigs/:id - Update gig
    router.put('/:id', authMiddleware, async (req, res) => {
        try {
            const gigRef = db.collection('gigs').doc(req.params.id);
            const doc = await gigRef.get();

            if (!doc.exists) {
                return res.status(404).json({error: 'Gig not found'});
            }

            const updateData = req.body;
            updateData.updated_at = new Date().toISOString();

            await gigRef.update(updateData);
            const updatedDoc = await gigRef.get();
            res.json({id: updatedDoc.id, ...updatedDoc.data()});
        } catch (err) {
            console.error('Error updating gig:', err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    // DELETE /api/gigs/:id - Delete gig
    router.delete('/:id', authMiddleware, async (req, res) => {
        try {
            await db.collection('gigs').doc(req.params.id).delete();
            res.json({success: true});
        } catch (err) {
            console.error('Error deleting gig:', err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    // GET /api/gigs/:id - Get gig by ID
    router.get('/:id', authMiddleware, async (req, res) => {
        try {
            const doc = await db.collection('gigs').doc(req.params.id).get();
            if (!doc.exists) {
                return res.status(404).json({error: 'Gig not found'});
            }
            res.json({id: doc.id, ...doc.data()});
        } catch (err) {
            console.error('Error fetching gig:', err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    // POST /api/gigs/:id/specialtys - Add specialty to gig
    router.post('/:id/specialtys', authMiddleware, async (req, res) => {
        try {
            const {specialtyId, specialtyName} = req.body;
            if (!specialtyId || !specialtyName) {
                return res
                    .status(400)
                    .json({
                        error: 'specialtyId and specialtyName are required',
                    });
            }

            const exists = await db
                .collection('gig_specialtys')
                .where('gigId', '==', req.params.id)
                .where('specialtyId', '==', specialtyId)
                .get();

            if (!exists.empty) {
                return res
                    .status(409)
                    .json({error: 'Specialty already exists for this gig'});
            }

            const gigSpecialty = {
                gigId: req.params.id,
                specialtyId,
                specialtyName,
            };

            const docRef = await db
                .collection('gig_specialtys')
                .add(gigSpecialty);
            res.json({id: docRef.id, ...gigSpecialty});
        } catch (err) {
            console.error('Error adding specialty to gig:', err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    // GET /api/gigs/:id/specialtys - Get specialties for gig
    router.get('/:id/specialtys', async (req, res) => {
        try {
            const snapshot = await db
                .collection('gig_specialtys')
                .where('gigId', '==', req.params.id)
                .get();

            const specialties = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            res.json(specialties);
        } catch (err) {
            console.error('Error fetching gig specialties:', err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    // DELETE /api/gigs/:gigId/specialty - Remove specialty from gig
    router.delete('/:gigId/specialty', authMiddleware, async (req, res) => {
        try {
            const {specialtyId} = req.body;
            const snapshot = await db
                .collection('gig_specialtys')
                .where('gigId', '==', req.params.gigId)
                .where('specialtyId', '==', specialtyId)
                .get();

            if (snapshot.empty) {
                return res
                    .status(404)
                    .json({error: 'Specialty not found for this gig'});
            }

            const batch = db.batch();
            snapshot.forEach((doc) => batch.delete(doc.ref));
            await batch.commit();

            res.json({success: true});
        } catch (err) {
            console.error('Error removing specialty from gig:', err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    // POST /api/gigs/:id/assign - Assign gig to current packer
    router.post('/:id/assign', authMiddleware, async (req, res) => {
        try {
            const assignment = {
                packerId: req.user.id,
                gigId: req.params.id,
                status: 'pending',
                assignedAt: new Date().toISOString(),
            };

            // Prevent duplicates
            const existing = await db
                .collection('gig_assignments')
                .where('packerId', '==', req.user.id)
                .where('gigId', '==', req.params.id)
                .get();

            if (!existing.empty) {
                return res.status(400).json({error: 'Gig already assigned'});
            }

            const docRef = await db
                .collection('gig_assignments')
                .add(assignment);
            res.json({id: docRef.id, ...assignment});
        } catch (err) {
            console.error('Error assigning gig:', err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    // DELETE /api/gigs/:id/unassign - Remove gig assignment from current packer
    router.delete('/:id/unassign', authMiddleware, async (req, res) => {
        try {
            const assignments = await db
                .collection('gig_assignments')
                .where('packerId', '==', req.user.id)
                .where('gigId', '==', req.params.id)
                .get();

            if (assignments.empty) {
                return res.status(400).json({error: 'Assignment not found'});
            }

            const batch = db.batch();
            assignments.forEach((doc) => batch.delete(doc.ref));
            await batch.commit();

            res.json({success: true});
        } catch (err) {
            console.error('Error removing assignment:', err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    return router;
};
