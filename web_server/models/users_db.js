const User = require('../db/models/User');
const Counter = require('../db/models/Counter');

async function nextSequence(sequenceName) {
    const updated = await Counter.findByIdAndUpdate(
        sequenceName,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return updated.seq;
}

async function getAllUsers() {
    const users = await User.find({}).lean();
    return users.map(u => ({
        id: u.id,
        fullName: u.fullName,
        mail: u.mail,
        password: u.password,
        dateOfBirth: u.dateOfBirth,
        image: u.image,
    }));
}

async function getUserById(id) {
    const u = await User.findOne({ id }).lean();
    if (!u) return undefined;
    return { id: u.id, fullName: u.fullName, mail: u.mail, password: u.password, dateOfBirth: u.dateOfBirth, image: u.image };
}

async function getSafeUserById(id) {
    const u = await User.findOne({ id }).lean();
    if (!u) return undefined;
    return { id: u.id, fullName: u.fullName, mail: u.mail, image: u.image, dateOfBirth: u.dateOfBirth };
}

async function getUserByMail(mail) {
    const u = await User.findOne({ mail }).lean();
    if (!u) return undefined;
    return { id: u.id, fullName: u.fullName, mail: u.mail };
}

async function userExist(mail) {
    const count = await User.countDocuments({ mail });
    return count > 0;
}

async function isAuthorizeUser(mail, password) {
    const u = await User.findOne({ mail, password }).lean();
    if (!u) return undefined;
    return { id: u.id, mail: u.mail, fullName: u.fullName, dateOfBirth: u.dateOfBirth, image: u.image };
}

async function createUser(fullName, mail, password, dateOfBirth, image) {
    const id = await nextSequence('users');
    const created = await User.create({ id, fullName, mail, password, dateOfBirth, image });
    return { id: created.id, fullName: created.fullName, mail: created.mail, password: created.password, dateOfBirth: created.dateOfBirth, image: created.image };
}

async function updateUser(id, password, image) {
    if (!id || (!password && !image)) return 400;
    const update = {};
    if (image !== undefined) update.image = image;
    if (password !== undefined) update.password = password;
    const updated = await User.findOneAndUpdate({ id }, { $set: update }, { new: true }).lean();
    if (!updated) return 404;
    return { id: updated.id, fullName: updated.fullName, mail: updated.mail, image: updated.image, dateOfBirth: updated.dateOfBirth };
}

module.exports = {
    getAllUsers,
    getUserById,
    getSafeUserById,
    createUser,
    userExist,
    isAuthorizeUser,
    getUserByMail,
    updateUser
};


