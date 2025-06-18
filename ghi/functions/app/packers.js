const express = require('express');
const authMiddleware = require('../utils/authMiddleware');

module.exports = (db) => {
    // eslint-disable-next-line
    const router = express.Router()

    // GET /api/packer - Get current packer profile
    router.get('/', authMiddleware, async (req, res) => {
        try {
            const doc = await db.collection('users').doc(req.user.id).get();
            if (!doc.exists) {
                return res.status(404).json({error: 'Packer not found'});
            }
            const userData = doc.data();
            delete userData.password; // Don't send password
            res.json({id: doc.id, ...userData});
        } catch (err) {
            console.error('Error fetching packer:', err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    // GET /api/packers - Get all packers
    router.get('/all', authMiddleware, async (req, res) => {
        try {
            const snapshot = await db.collection('users').get();
            const packers = snapshot.docs.map((doc) => {
                const userData = doc.data();
                delete userData.password; // Don't send passwords
                return {
                    id: doc.id,
                    ...userData,
                };
            });
            res.json(packers);
        } catch (err) {
            console.error('Error fetching all packers:', err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    // PUT /api/packer/edit - Update packer profile
    router.put('/edit', authMiddleware, async (req, res) => {
        try {
            const {name, email, phone, bio} = req.body;
            const updateData = {};
            if (name) updateData.name = name;
            if (email) updateData.email = email;
            if (phone) updateData.phone = phone;
            if (bio) updateData.bio = bio;

            await db.collection('users').doc(req.user.id).update(updateData);
            const updatedDoc = await db
                .collection('users')
                .doc(req.user.id)
                .get();
            const userData = updatedDoc.data();
            delete userData.password;
            res.json({id: updatedDoc.id, ...userData});
        } catch (err) {
            console.error('Error updating profile:', err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    // GET /api/packer/:packerId/specialtys
    // - Get specialties for specific packer
    router.get('/:packerId/specialtys', async (req, res) => {
        try {
            const snapshot = await db
                .collection('packer_specialtys')
                .where('packerId', '==', req.params.packerId)
                .get();

            const specialties = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            res.json(specialties);
        } catch (err) {
            console.error('Error fetching packer specialties:', err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    // GET /api/packer/gigs/booked - Get booked gigs for current packer
    router.get('/gigs/booked', authMiddleware, async (req, res) => {
        try {
            const snapshot = await db
                .collection('gig_assignments')
                .where('packerId', '==', req.user.id)
                .where('status', '==', 'booked')
                .get();

            const gigIds = snapshot.docs.map((doc) => doc.data().gigId);
            if (gigIds.length === 0) {
                return res.json([]);
            }

            const gigs = [];
            for (const gigId of gigIds) {
                const gigDoc = await db.collection('gigs').doc(gigId).get();
                if (gigDoc.exists) {
                    gigs.push({id: gigDoc.id, ...gigDoc.data()});
                }
            }
            res.json(gigs);
        } catch (err) {
            console.error('Error fetching booked gigs:', err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    // GET /api/packer/gigs/all - Get all gigs for current packer
    router.get('/gigs/all', authMiddleware, async (req, res) => {
        try {
            const snapshot = await db
                .collection('gig_assignments')
                .where('packerId', '==', req.user.id)
                .get();

            const gigIds = snapshot.docs.map((doc) => doc.data().gigId);
            if (gigIds.length === 0) {
                return res.json([]);
            }

            const gigs = [];
            for (const gigId of gigIds) {
                const gigDoc = await db.collection('gigs').doc(gigId).get();
                if (gigDoc.exists) {
                    gigs.push({id: gigDoc.id, ...gigDoc.data()});
                }
            }
            res.json(gigs);
        } catch (err) {
            console.error('Error fetching all gigs for packer:', err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    return router;
};
