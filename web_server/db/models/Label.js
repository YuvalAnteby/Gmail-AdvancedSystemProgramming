const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    owner: { type: Number, required: true },
    parent: { type: Number, default: null },
  },
  {
    timestamps: true,
    collection: 'labels',
  }
);

// Prevent duplicate names for the same owner and parent
labelSchema.index({ owner: 1, name: 1, parent: 1 }, { unique: true });

module.exports = mongoose.models.Label || mongoose.model('Label', labelSchema);


