// backend/models/Complaint.js
const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  residentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  apartmentNumber: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'resolved'], 
    default: 'pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);