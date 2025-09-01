const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    fullName: { type: String, required: true },
    mail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    dateOfBirth: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);


