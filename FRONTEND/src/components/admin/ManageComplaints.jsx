import { useEffect, useState } from 'react';
import { getAllComplaints, updateComplaint } from '../../utils/adminApi';

export default function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => { getAllComplaints().then(r => setComplaints(r.data)); }, []);

  const handleStatus = async (id, status) => {
    const { data } = await updateComplaint(id, { status });
    setComplaints(complaints.map(c => c._id === id ? data : c));
  };

  const statusClass = (s) =>
    s === 'resolved' ? 'badge-green' : s === 'in-progress' ? 'badge-yellow' : 'badge-red';

  return (
    <div>
      <h2 className="section-heading">Complaints</h2>
      <p className="section-sub">View and update resident complaints</p>

      <div className="dash-list">
        {complaints.length === 0 && <div className="empty-state">No complaints yet</div>}
        {complaints.map(c => (
          <div key={c._id} className="dash-list-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div>
                <div className="item-name">{c.residentId?.name} — Apt {c.apartmentNumber}</div>
                <div className="item-sub" style={{ marginTop: 6, fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{c.description}</div>
                <div className="item-sub" style={{ marginTop: 6 }}>{new Date(c.createdAt).toLocaleDateString()}</div>
              </div>
              <span className={`badge ${statusClass(c.status)}`} style={{ flexShrink: 0 }}>{c.status}</span>
            </div>
            <div className="status-btns">
              {['pending', 'in-progress', 'resolved'].map(s => (
                <button
                  key={s}
                  className={`status-btn ${c.status === s ? 'active-btn' : ''}`}
                  onClick={() => handleStatus(c._id, s)}
                >{s}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}