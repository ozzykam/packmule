const admin = require('firebase-admin');
const db = admin.firestore();

async function getAll() {
    const snapshot = await db.collection('gigs').get();
    return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
}

async function getById(id) {
    const doc = await db.collection('gigs').doc(id).get();
    if (!doc.exists) return null;
    return {id: doc.id, ...doc.data()};
}

async function addGigToPacker(packerId, gigId) {
    const gigRef = db.collection('gigs').doc(gigId);
    const gigDoc = await gigRef.get();
    if (!gigDoc.exists) return null;

    const data = gigDoc.data();
    const packers = data.packers || [];
    if (packers.includes(packerId)) return null;

    packers.push(packerId);
    await gigRef.update({packers});
    const updated = await gigRef.get();
    return {id: updated.id, ...updated.data()};
}

async function removeGigFromPacker(packerId, gigId) {
    const gigRef = db.collection('gigs').doc(gigId);
    const gigDoc = await gigRef.get();
    if (!gigDoc.exists) return false;

    const data = gigDoc.data();
    const updatedPackers = (data.packers || []).filter((id) => id !== packerId);
    await gigRef.update({packers: updatedPackers});
    return true;
}

module.exports = {getAll, getById, addGigToPacker, removeGigFromPacker};
