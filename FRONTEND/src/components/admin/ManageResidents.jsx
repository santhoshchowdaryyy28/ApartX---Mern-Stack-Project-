import { useEffect, useState } from 'react';
import { getResidents } from '../../utils/adminApi';

export default function ManageResidents() {
  const [residents, setResidents] = useState([]);

  useEffect(() => { getResidents().then(r => setResidents(r.data)); }, []);

  return (
    <div>
      <h2 className="section-heading">Residents</h2>
      <p className="section-sub">{residents.length} registered residents</p>

      <div className="residents-grid">
        {residents.length === 0 && <div className="empty-state">No residents yet</div>}
        {residents.map(r => (
          <div key={r._id} className="resident-card">
            <div className="resident-avatar">{r.name.charAt(0).toUpperCase()}</div>
            <div>
              <div className="item-name">{r.name}</div>
              <div className="item-sub">{r.email}</div>
              <div className="item-sub">Apt {r.apartmentNumber || 'N/A'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}