const gigs = [];

function getAll() {
    return gigs;
}

function getById(id) {
    return gigs.find((g) => g.id === id);
}

function addGigToMule(muleId, gigId) {
    const mule = require('./muleService').getById(muleId);
    if (!mule) return null;

    const gig = getById(gigId);
    if (!gig || mule.gigs.includes(gigId)) {
        return null;
    }
    gig.mules.push(muleId);
    return gig;
}

function removeGigFromMule(muleId, gigId) {
    const mule = require('./muleService').getById(muleId);
    if (!mule) return null;

    const gig = getById(gigId);
    if (!gig) return false;
    gig.mules = gig.mules.filter((id) => id !== muleId);
    return true;
}

module.exports = {
    getAll,
    getById,
    addGigToMule,
    removeGigFromMule,
};
