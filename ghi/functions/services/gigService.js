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

async function addGigToMule(muleId, gigId) {
    const gigRef = db.collection('gigs').doc(gigId);
    const gigDoc = await gigRef.get();
    if (!gigDoc.exists) return null;

    const data = gigDoc.data();
    const mules = data.mules || [];
    if (mules.includes(muleId)) return null;

    mules.push(muleId);
    await gigRef.update({mules});
    const updated = await gigRef.get();
    return {id: updated.id, ...updated.data()};
}

async function removeGigFromMule(muleId, gigId) {
    const gigRef = db.collection('gigs').doc(gigId);
    const gigDoc = await gigRef.get();
    if (!gigDoc.exists) return false;

    const data = gigDoc.data();
    const updatedMules = (data.mules || []).filter((id) => id !== muleId);
    await gigRef.update({mules: updatedMules});
    return true;
}

module.exports = {getAll, getById, addGigToMule, removeGigFromMule};
