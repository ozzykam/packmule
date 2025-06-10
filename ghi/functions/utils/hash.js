const bcrypt = require('bcryptjs');

function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
}

function verifyPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

module.exports = {hashPassword, verifyPassword};
