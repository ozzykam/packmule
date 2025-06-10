const express = require('express');
const authMiddleware = require('../middleware/auth');
const specialtyService = require('../services/specialtyService');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
    res.json(specialtyService.getAll());
});

router.get('/mule/:muleId', authMiddleware, (req, res) => {
    const specialties = specialtyService
        .getByMuleId(parseInt(req.params.muleId));
    if (!specialties) {
        return res.status(404)
            .json({error: 'No specialties found for this mule'});
    }
    res.json(specialties);
});

router.post('/mule', authMiddleware, (req, res) => {
    const result = specialtyService.addToMule(req.user.id, req.body);
    if (!result) {
        return res
            .status(409)
            .json({error: 'Specialty already exists for mule'});
    }
    res.json(result);
});

router.delete('/mule/:specialtyId', authMiddleware, (req, res) => {
    const result = specialtyService
        .removeFromMule(req.user.id, parseInt(req.params.specialtyId));
    if (!result) {
        return res.status(404)
            .json({error: 'Specialty not found for this mule'});
    }
    res.json({success: result});
});

module.exports = router;
