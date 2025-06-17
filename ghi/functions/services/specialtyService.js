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

const getByPackerId = async (packerId) => {
    const snapshot = await db.collection('packer_specialties')
        .where('packerId', '==', packerId)
        .get();
    const packerSpecialties = snapshot.docs.map((doc) => doc.data());
    return packerSpecialties;
};

const addToPacker = async (packerId, specialty) => {
    const existing = await getByPackerId(packerId);
    if (existing.some((s) => s.id === specialty.id)) {
        return null;
    }
    await db.collection('packer_specialties').add({
        packerId,
        ...specialty,
    });
    return specialty;
};

const removeFromPacker = async (packerId, specialtyId) => {
    const snapshot = await db.collection('packer_specialties')
        .where('packerId', '==', packerId)
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
    getByPackerId,
    addToPacker,
    removeFromPacker,
};
