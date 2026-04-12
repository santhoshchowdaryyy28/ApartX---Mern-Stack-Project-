const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  priority: { type: String, enum: ['normal', 'urgent'], default: 'normal' }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);