const express = require('express');
const authMiddleware = require('../middleware/auth');
const muleService = require('../services/muleService');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
    const mule = muleService.getById(req.user.id);
    if (!mule) {
        return res.status(404).json({error: 'Mule not found'});
    }
    res.json(mule);
});

router.get('/all', authMiddleware, (req, res) => {
    const mules = muleService.getAll();
    res.json(mules);
});

router.put('/edit', authMiddleware, (req, res) => {
    const updated = muleService.updateProfile(req.user.id, req.body);
    if (!updated) {
        return res.status(400).json({error: 'Could not update profile'});
    }
    res.json(updated);
});

module.exports = router;
