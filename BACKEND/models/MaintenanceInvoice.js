// backend/models/MaintenanceInvoice.js
const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  residentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  apartmentNumber: { 
    type: String, 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  dueDate: { 
    type: Date, 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'partial'], 
    default: 'pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceInvoice', invoiceSchema);