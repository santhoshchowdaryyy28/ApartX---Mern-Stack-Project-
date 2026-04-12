import { useEffect, useState } from 'react';
import { getNotices, postNotice, deleteNotice } from '../../utils/adminApi';

export default function ManageNotices() {
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState({ title: '', message: '', priority: 'normal' });
  const [msg, setMsg] = useState('');

  useEffect(() => { getNotices().then(r => setNotices(r.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await postNotice(form);
    setNotices([data, ...notices]);
    setForm({ title: '', message: '', priority: 'normal' });
    setMsg('Notice posted!');
    setTimeout(() => setMsg(''), 3000);
  };

  const handleDelete = async (id) => {
    await deleteNotice(id);
    setNotices(notices.filter(n => n._id !== id));
  };

  return (
    <div>
      <h2 className="section-heading">Notice Board</h2>
      <p className="section-sub">Post announcements to all residents</p>

      <div className="dash-form">
        <div className="dash-form-title">Post New Notice</div>
        {msg && <div className="success-msg">{msg}</div>}
        <form onSubmit={handleSubmit}>
          <label className="dash-field-label">Title</label>
          <input className="dash-input" placeholder="Notice title..."
            value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <label className="dash-field-label">Message</label>
          <textarea className="dash-textarea" placeholder="Write your announcement..."
            value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
          <label className="dash-field-label">Priority</label>
          <select className="dash-select" value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
          </select>
          <button type="submit" className="dash-btn">Post Notice →</button>
        </form>
      </div>

      <div className="dash-list">
        {notices.length === 0 && <div className="empty-state">No notices posted yet</div>}
        {notices.map(n => (
          <div key={n._id} className={`notice-card ${n.priority === 'urgent' ? 'urgent' : ''}`}>
            <div className="notice-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div className="notice-title">{n.title}</div>
                  {n.priority === 'urgent' && <span className="badge badge-urgent">Urgent</span>}
                </div>
                <div className="notice-body">{n.message}</div>
                <div className="notice-date">{new Date(n.createdAt).toLocaleDateString()} · Posted by {n.postedBy?.name}</div>
              </div>
              <button className="delete-btn" onClick={() => handleDelete(n._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}