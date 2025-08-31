const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    name: String,
    data: String,
    size: Number,
    type: String,
  },
  { _id: false }
);

const mailSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    owner: { type: Number, required: true },
    from: { type: Number, required: true },
    sentTo: { type: [Number], default: [] },
    subject: { type: String, default: '' },
    body: { type: String, default: '' },
    labels: { type: [Number], default: [] },
    isRead: { type: Boolean, default: false },
    isStarred: { type: Boolean, default: false },
    isTrashed: { type: Boolean, default: false },
    isSpam: { type: Boolean, default: false },
    isDraft: { type: Boolean, default: false },
    files: { type: [fileSchema], default: [] },
  },
  {
    timestamps: true,
    collection: 'mails',
  }
);

mailSchema.index({ owner: 1, isDraft: 1, createdAt: -1 });

module.exports = mongoose.models.Mail || mongoose.model('Mail', mailSchema);


