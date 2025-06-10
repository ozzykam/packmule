const mules = [];

function getById(id) {
    return mules.find((m) => m.id === id);
}

function getAll() {
    return mules;
}

function updateProfile(id, updates) {
    const mule = getById(id);
    if (!mule) return null;
    Object.assign(mule, updates);
    return mule;
}

module.exports = {getById, getAll, updateProfile};
