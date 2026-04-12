import { useEffect, useState } from 'react';
import { getAllInvoices, createInvoice, getResidents } from '../../utils/adminApi';

export default function ManageInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [residents, setResidents] = useState([]);
  const [form, setForm] = useState({ residentId: '', apartmentNumber: '', amount: '', dueDate: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getAllInvoices().then(r => setInvoices(r.data));
    getResidents().then(r => setResidents(r.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createInvoice(form);
      setInvoices([data, ...invoices]);
      setMsg('Invoice created successfully!');
      setForm({ residentId: '', apartmentNumber: '', amount: '', dueDate: '' });
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error creating invoice');
    }
  };

  const handleResidentChange = (e) => {
    const resident = residents.find(r => r._id === e.target.value);
    setForm({ ...form, residentId: e.target.value, apartmentNumber: resident?.apartmentNumber || '' });
  };

  const statusClass = (s) =>
    s === 'paid' ? 'badge-green' : s === 'partial' ? 'badge-yellow' : 'badge-red';

  return (
    <div>
      <h2 className="section-heading">Invoices</h2>
      <p className="section-sub">Create and manage maintenance invoices</p>

      <div className="dash-form">
        <div className="dash-form-title">Create New Invoice</div>
        {msg && <div className="success-msg">{msg}</div>}
        <form onSubmit={handleSubmit}>
          <label className="dash-field-label">Select Resident</label>
          <select className="dash-select" value={form.residentId} onChange={handleResidentChange} required>
            <option value="">Choose a resident...</option>
            {residents.map(r => (
              <option key={r._id} value={r._id}>{r.name} — Apt {r.apartmentNumber}</option>
            ))}
          </select>
          <div className="form-row">
            <div>
              <label className="dash-field-label">Amount (₹)</label>
              <input type="number" className="dash-input" placeholder="e.g. 3000"
                value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            </div>
            <div>
              <label className="dash-field-label">Due Date</label>
              <input type="date" className="dash-input"
                value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="dash-btn">Create Invoice →</button>
        </form>
      </div>

      <div className="dash-list">
        {invoices.length === 0 && <div className="empty-state">No invoices yet</div>}
        {invoices.map(inv => (
          <div key={inv._id} className="dash-list-item">
            <div>
              <div className="item-name">{inv.residentId?.name || 'Resident'}</div>
              <div className="item-sub">Apt {inv.apartmentNumber} · Due {new Date(inv.dueDate).toLocaleDateString()}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="item-amount">₹{inv.amount}</div>
              <span className={`badge ${statusClass(inv.paymentStatus)}`}>{inv.paymentStatus}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}