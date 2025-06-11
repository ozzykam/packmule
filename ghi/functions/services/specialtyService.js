const admin = require('firebase-admin');
const db = admin.firestore();

const getAll = async () => {
    const snapshot = await db.collection('specialties').get();
    const specialties = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return specialties;
};

const getByMuleId = async (muleId) => {
    const snapshot = await db.collection('mule_specialties')
        .where('muleId', '==', muleId)
        .get();
    const muleSpecialties = snapshot.docs.map((doc) => doc.data());
    return muleSpecialties;
};

const addToMule = async (muleId, specialty) => {
    const existing = await getByMuleId(muleId);
    if (existing.some((s) => s.id === specialty.id)) {
        return null;
    }
    await db.collection('mule_specialties').add({
        muleId,
        ...specialty,
    });
    return specialty;
};

const removeFromMule = async (muleId, specialtyId) => {
    const snapshot = await db.collection('mule_specialties')
        .where('muleId', '==', muleId)
        .where('id', '==', specialtyId)
        .get();
    const batch = db.batch();
    snapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();
    return true;
};

module.exports = {
    getAll,
    getByMuleId,
    addToMule,
    removeFromMule,
};
