const Label = require('../db/models/Label');
const Counter = require('../db/models/Counter');

async function nextSequence(sequenceName) {
    const updated = await Counter.findByIdAndUpdate(
        sequenceName,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return updated.seq;
}

async function getAllLabels(userId) {
    return Label.find({ owner: userId }).lean();
}

async function getLabelById(id, owner) {
    return Label.findOne({ id, owner }).lean();
}

async function createNewLabel(owner, name) {
    // unique index on {owner,name,parent:null}
    const id = await nextSequence('labels');
    try {
        const created = await Label.create({ id, owner, name, parent: null });
        return created.toObject();
    } catch (err) {
        if (err && err.code === 11000) return null; // duplicate
        throw err;
    }
}

async function isDuplicateLabel(owner, name, parent = null, excludeId = null) {
    const query = { owner, name, parent };
    if (excludeId !== null) {
        query.id = { $ne: excludeId };
    }
    const existing = await Label.findOne(query).lean();
    return !!existing;
}

async function createSublabel(owner, parent, name) {
    const parentLabel = await Label.findOne({ id: parent, owner }).lean();
    if (!parentLabel) return null;
    if (await isDuplicateLabel(owner, name, parent)) throw new Error('409');
    const id = await nextSequence('labels');
    const created = await Label.create({ id, owner, name, parent });
    return created.toObject();
}

async function editLabelById(id, owner, newName) {
    const existing = await Label.findOne({ id, owner });
    if (!existing) return null;
    if (await isDuplicateLabel(owner, newName, existing.parent, id)) throw new Error('409');
    existing.name = newName;
    await existing.save();
    return existing.toObject();
}

async function deleteLabelById(id, owner) {
    const existing = await Label.findOne({ id, owner }).lean();
    if (!existing) return false;
    // delete children recursively
    const children = await Label.find({ parent: id, owner }).lean();
    for (const child of children) {
        // eslint-disable-next-line no-await-in-loop
        await deleteLabelById(child.id, owner);
    }
    await Label.deleteOne({ id, owner });
    return true;
}

module.exports = {
    getAllLabels,
    getLabelById,
    createNewLabel,
    createSublabel,
    editLabelById,
    deleteLabelById,
};
