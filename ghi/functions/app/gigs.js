const express = require('express');
const authMiddleware = require('../middleware/auth');
const gigService = require('../services/gigService');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
    const gigs = gigService.getAll();
    if (!gigs) {
        return res.status(404).json({error: 'No gigs found'});
    }
    res.json(gigs);
});

router.get('/:gigId', authMiddleware, (req, res) => {
    const gig = gigService.getById(parseInt(req.params.gigId));
    if (!gig) {
        return res.status(404).json({error: 'Gig not found'});
    }
    res.json(gig);
});

router.post('/:gigId', authMiddleware, (req, res) => {
    const result = gigService
        .addGigToMule(req.user.id, parseInt(req.params.gigId));
    if (!result) {
        return res.status(400).json({error: 'Could not add gig to mule'});
    }
    res.json(result);
});

router.delete('/:gigId', authMiddleware, (req, res) => {
    const removed = gigService
        .removeGigFromMule(req.user.id, parseInt(req.params.gigId));
    if (!removed) {
        return res.status(400).json({error: 'Could not remove gig from mule'});
    }
    res.json({success: removed});
});

module.exports = router;
