let labels = [
    { id:1, name:'work',    owner:1, parent:null },
    { id:2, name:'friends', owner:1, parent:null },
];
let nextId = labels.length + 1;

function getAllLabels()    { return labels; }
function getLabelById(id)  { return labels.find(l=>l.id===id); }
function createNewLabel(owner, name) {
    const lab = {id: nextId++, owner, name, parent: null};
    labels.push(lab);
    return lab;
}
    function createSublabel(owner, parent, name) {
        // check parent exists:
        if (!labels.find(l => l.id === parent)) return null;
        const newLabel = {
            id: labels.length ? labels[labels.length - 1].id + 1 : 1,
            name,
            owner,
            parent,
        };
        labels.push(newLabel);
        return newLabel;
    }
function editLabelById(id, name) {
    const lab = getLabelById(id);
    if (!lab) return null;
    lab.name = name;
    return lab;
}
function deleteLabelById(id) {
    const idx = labels.findIndex(l=>l.id===id);
    if (idx<0) return false;
    labels.splice(idx,1);
    return true;
}

module.exports = {
    getAllLabels, getLabelById,
    createNewLabel, createSublabel,
    editLabelById, deleteLabelById
};
