// backend/routes/mainRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const {
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
} = require('../controllers/mainController');

const router = express.Router();

// ── Profile ──────────────────────────────────────────
router.get('/profile', protect, getProfile);

// ── Invoices ─────────────────────────────────────────
router.get('/invoices/my', protect, getMyInvoices);                          // Resident
router.post('/invoices', protect, adminOnly, createInvoice);                 // Admin
router.get('/invoices', protect, adminOnly, getAllInvoices);                  // Admin

// ── Payments ─────────────────────────────────────────
router.post('/payments', protect, makePayment);                              // Resident
router.get('/payments/my', protect, getMyPayments);                          // Resident
router.get('/payments', protect, adminOnly, getAllPayments);                  // Admin

// ── Complaints ───────────────────────────────────────
router.post('/complaints', protect, submitComplaint);                        // Resident
router.get('/complaints/my', protect, getMyComplaints);                      // Resident
router.get('/complaints', protect, adminOnly, getAllComplaints);              // Admin
router.put('/complaints/:id/status', protect, adminOnly, updateComplaintStatus); // Admin

// ── Notices ──────────────────────────────────────────
router.get('/notices', protect, getNotices);                                 // Everyone
router.post('/notices', protect, adminOnly, postNotice);                     // Admin
router.delete('/notices/:id', protect, adminOnly, deleteNotice);             // Admin

// ── Admin Dashboard ──────────────────────────────────
router.get('/admin/report', protect, adminOnly, getFinancialReport);         // Admin
router.get('/admin/residents', protect, adminOnly, getAllResidents);          // Admin

module.exports = router;