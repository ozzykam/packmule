const admin = require('firebase-admin');
const db = admin.firestore();

async function getById(id) {
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists) return null;
    return {id: doc.id, ...doc.data()};
}

async function getAll() {
    const snapshot = await db.collection('users').get();
    return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
}

async function updateProfile(id, updates) {
    const ref = db.collection('users').doc(id);
    await ref.update(updates);
    const updated = await ref.get();
    return {id: updated.id, ...updated.data()};
}

module.exports = {getById, getAll, updateProfile};
