// backend/models/Apartment.js
const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
  apartmentNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  buildingBlock: { 
    type: String, 
    required: true 
  },
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Apartment', apartmentSchema);