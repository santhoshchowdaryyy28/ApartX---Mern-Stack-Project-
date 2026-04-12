// backend/controllers/mainController.js
const User = require('../models/User');
const MaintenanceInvoice = require('../models/MaintenanceInvoice');
const Complaint = require('../models/Complaint');
const Payment = require('../models/Payment');
const Notice = require('../models/Notice');

// ─── PROFILE ────────────────────────────────────────────────────────────────

const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── INVOICES ────────────────────────────────────────────────────────────────

// Admin: Create invoice for a resident
const createInvoice = async (req, res) => {
  try {
    const { residentId, apartmentNumber, amount, dueDate } = req.body;

    if (!residentId || !apartmentNumber || !amount) {
      return res.status(400).json({ message: 'residentId, apartmentNumber, and amount are required' });
    }

    const invoice = await MaintenanceInvoice.create({
      residentId,
      apartmentNumber,
      amount,
      dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Resident: Get my invoices
const getMyInvoices = async (req, res) => {
  try {
    const invoices = await MaintenanceInvoice.find({ residentId: req.user.id }).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all invoices
const getAllInvoices = async (req, res) => {
  try {
    const invoices = await MaintenanceInvoice.find()
      .populate('residentId', 'name email apartmentNumber')
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PAYMENTS ────────────────────────────────────────────────────────────────

// Resident: Pay an invoice
const makePayment = async (req, res) => {
  try {
    const { invoiceId, amountPaid, paymentMethod } = req.body;

    const invoice = await MaintenanceInvoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    // Only the invoice owner can pay
    if (invoice.residentId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not your invoice' });
    }

    if (invoice.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Invoice already fully paid' });
    }

    const payment = await Payment.create({
      invoiceId,
      residentId: req.user.id,
      amountPaid,
      paymentMethod: paymentMethod || 'Online'
    });

    // Update invoice status
    invoice.paymentStatus = amountPaid >= invoice.amount ? 'paid' : 'partial';
    await invoice.save();

    res.status(201).json({ payment, invoiceStatus: invoice.paymentStatus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Resident: My payment history
const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ residentId: req.user.id })
      .populate('invoiceId', 'apartmentNumber amount dueDate')
      .sort({ paymentDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: All payments
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('residentId', 'name email apartmentNumber')
      .populate('invoiceId', 'amount dueDate apartmentNumber')
      .sort({ paymentDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── COMPLAINTS ───────────────────────────────────────────────────────────────

// Resident: Submit complaint
const submitComplaint = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) return res.status(400).json({ message: 'Description is required' });

    const complaint = await Complaint.create({
      residentId: req.user.id,
      apartmentNumber: req.user.apartmentNumber || 'Unknown',
      description
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Resident: My complaints
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ residentId: req.user.id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: All complaints
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('residentId', 'name email')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update complaint status
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'in-progress', 'resolved'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('residentId', 'name email');

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── NOTICES ─────────────────────────────────────────────────────────────────

// Admin: Post a notice
const postNotice = async (req, res) => {
  try {
    const { title, message, priority } = req.body;

    if (!title || !message) return res.status(400).json({ message: 'Title and message are required' });

    const notice = await Notice.create({
      title,
      message,
      postedBy: req.user.id,
      priority: priority || 'normal'
    });

    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Everyone: Get all notices
const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete a notice
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json({ message: 'Notice deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── ADMIN DASHBOARD / REPORTS ───────────────────────────────────────────────

const getFinancialReport = async (req, res) => {
  try {
    const totalInvoiced = await MaintenanceInvoice.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalCollected = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: '$amountPaid' } } }
    ]);
    const pendingInvoices = await MaintenanceInvoice.countDocuments({ paymentStatus: 'pending' });
    const paidInvoices = await MaintenanceInvoice.countDocuments({ paymentStatus: 'paid' });
    const partialInvoices = await MaintenanceInvoice.countDocuments({ paymentStatus: 'partial' });
    const totalComplaints = await Complaint.countDocuments();
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });

    res.json({
      billing: {
        totalInvoiced: totalInvoiced[0]?.total || 0,
        totalCollected: totalCollected[0]?.total || 0,
        outstanding: (totalInvoiced[0]?.total || 0) - (totalCollected[0]?.total || 0),
        pendingInvoices,
        paidInvoices,
        partialInvoices
      },
      complaints: {
        total: totalComplaints,
        resolved: resolvedComplaints,
        pending: pendingComplaints,
        inProgress: totalComplaints - resolvedComplaints - pendingComplaints
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: List all residents
const getAllResidents = async (req, res) => {
  try {
    const residents = await User.find({ role: 'resident' }).select('-password');
    res.json(residents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  createInvoice,
  getMyInvoices,
  getAllInvoices,
  makePayment,
  getMyPayments,
  getAllPayments,
  submitComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  postNotice,
  getNotices,
  deleteNotice,
  getFinancialReport,
  getAllResidents
};