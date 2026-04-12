// backend/models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  invoiceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'MaintenanceInvoice', 
    required: true 
  },
  residentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amountPaid: { 
    type: Number, 
    required: true 
  },
  paymentDate: { 
    type: Date, 
    default: Date.now 
  },
  paymentMethod: { 
    type: String, 
    default: 'Online' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);