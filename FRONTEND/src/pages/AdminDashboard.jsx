import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FinancialReport from '../components/admin/FinancialReport';
import ManageInvoices from '../components/admin/ManageInvoices';
import ManageComplaints from '../components/admin/ManageComplaints';
import ManageNotices from '../components/admin/ManageNotices';
import ManageResidents from '../components/admin/ManageResidents';

const tabs = ['Report', 'Invoices', 'Complaints', 'Notices', 'Residents'];

const tabIcons = {
  Report: '📊',
  Invoices: '🧾',
  Complaints: '📋',
  Notices: '📢',
  Residents: '👥'
};

export default function AdminDashboard() {
  const [active, setActive] = useState('Report');
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('adminUser') || '{}');

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const renderTab = () => {
    if (active === 'Report')     return <FinancialReport />;
    if (active === 'Invoices')   return <ManageInvoices />;
    if (active === 'Complaints') return <ManageComplaints />;
    if (active === 'Notices')    return <ManageNotices />;
    if (active === 'Residents')  return <ManageResidents />;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .dash-root {
          min-height: 100vh;
          background: #07070f;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
        }

        .dash-topbar {
          background: #0b0b16;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .dash-topbar::after {
          content:''; position:absolute; bottom:0;left:0;right:0; height:1px;
          background: linear-gradient(90deg,transparent,rgba(248,113,113,0.3),transparent);
        }

        .dash-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .dash-logo-box {
          width: 32px; height: 32px;
          background: linear-gradient(135deg,#dc2626,#991b1b);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px;
        }

        .dash-topbar-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .dash-welcome {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
        }
        .dash-welcome span {
          color: rgba(255,255,255,0.8);
          font-weight: 500;
        }

        .dash-admin-badge {
          display: flex; align-items: center; gap: 7px;
          background: rgba(220,38,38,0.1);
          border: 1px solid rgba(220,38,38,0.2);
          border-radius: 100px;
          padding: 5px 12px;
          font-size: 11px;
          color: #f87171;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .dash-admin-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #ef4444;
          animation: blink 2s infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

        .logout-btn {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 7px 16px;
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .logout-btn:hover {
          background: rgba(220,38,38,0.1);
          border-color: rgba(220,38,38,0.3);
          color: #f87171;
        }

        .dash-nav {
          background: #0b0b16;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding: 0 40px;
          display: flex;
          gap: 4px;
        }

        .nav-tab {
          padding: 14px 20px;
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          cursor: pointer;
          border: none;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: center;
          gap: 7px;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
          letter-spacing: 0.3px;
        }
        .nav-tab:hover {
          color: rgba(255,255,255,0.65);
        }
        .nav-tab.active {
          color: #f87171;
          border-bottom-color: #dc2626;
        }

        .dash-body {
          padding: 36px 40px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 400;
          color: #fff;
          margin-bottom: 6px;
          letter-spacing: -0.5px;
        }
        .section-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          margin-bottom: 28px;
          font-weight: 300;
        }

        /* CARDS */
        .report-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 14px;
          margin-bottom: 32px;
        }

        .report-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 20px 22px;
          transition: border-color 0.2s;
        }
        .report-card:hover {
          border-color: rgba(255,255,255,0.12);
        }
        .report-card-label {
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 10px;
        }
        .report-card-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 600;
          color: #fff;
          line-height: 1;
        }
        .report-card.green .report-card-value { color: #4ade80; }
        .report-card.red .report-card-value { color: #f87171; }
        .report-card.yellow .report-card-value { color: #fbbf24; }

        /* FORM STYLES */
        .dash-form {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 24px 28px;
          margin-bottom: 28px;
        }
        .dash-form-title {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.6);
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 18px;
        }
        .dash-field-label {
          display: block;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 7px;
        }
        .dash-input, .dash-select, .dash-textarea {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 14px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          margin-bottom: 14px;
          transition: border-color 0.2s, background 0.2s;
        }
        .dash-input::placeholder { color: rgba(255,255,255,0.18); }
        .dash-input:focus, .dash-select:focus, .dash-textarea:focus {
          border-color: rgba(248,113,113,0.4);
          background: rgba(248,113,113,0.04);
        }
        .dash-select option { background: #0b0b16; color: #fff; }
        .dash-textarea { resize: vertical; min-height: 90px; }

        .dash-btn {
          background: linear-gradient(135deg,#dc2626,#991b1b);
          border: none;
          border-radius: 10px;
          padding: 12px 24px;
          font-size: 13px;
          font-weight: 500;
          color: #fff;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.5px;
          transition: opacity 0.2s, transform 0.2s;
          box-shadow: 0 4px 16px rgba(220,38,38,0.25);
        }
        .dash-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .dash-btn:active { transform: translateY(0); }

        .success-msg {
          background: rgba(74,222,128,0.08);
          border: 1px solid rgba(74,222,128,0.2);
          color: #4ade80;
          font-size: 13px;
          padding: 10px 14px;
          border-radius: 8px;
          margin-bottom: 14px;
        }
        .error-msg {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          color: #f87171;
          font-size: 13px;
          padding: 10px 14px;
          border-radius: 8px;
          margin-bottom: 14px;
        }

        /* LIST ITEMS */
        .dash-list { display: flex; flex-direction: column; gap: 10px; }

        .dash-list-item {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 18px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          transition: border-color 0.2s;
        }
        .dash-list-item:hover { border-color: rgba(255,255,255,0.12); }

        .item-name {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          margin-bottom: 4px;
        }
        .item-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.3);
        }
        .item-amount {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 600;
          color: #fff;
          text-align: right;
        }

        /* BADGES */
        .badge {
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 100px;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
        .badge-green { background: rgba(74,222,128,0.1); color: #4ade80; }
        .badge-yellow { background: rgba(251,191,36,0.1); color: #fbbf24; }
        .badge-red { background: rgba(248,113,113,0.1); color: #f87171; }
        .badge-urgent { background: rgba(220,38,38,0.15); color: #f87171; border: 1px solid rgba(220,38,38,0.25); }

        /* STATUS BUTTONS */
        .status-btns { display: flex; gap: 6px; margin-top: 12px; flex-wrap: wrap; }
        .status-btn {
          font-size: 11px;
          padding: 5px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
        }
        .status-btn:hover { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.7); }
        .status-btn.active-btn {
          background: rgba(220,38,38,0.15);
          border-color: rgba(220,38,38,0.3);
          color: #f87171;
        }

        /* RESIDENT CARDS */
        .residents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 14px;
        }
        .resident-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: border-color 0.2s;
        }
        .resident-card:hover { border-color: rgba(255,255,255,0.12); }
        .resident-avatar {
          width: 42px; height: 42px;
          border-radius: 50%;
          background: rgba(220,38,38,0.15);
          border: 1px solid rgba(220,38,38,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 500; color: #f87171;
          flex-shrink: 0;
        }

        /* NOTICE CARD */
        .notice-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 18px 22px;
          transition: border-color 0.2s;
        }
        .notice-card:hover { border-color: rgba(255,255,255,0.12); }
        .notice-card.urgent { border-color: rgba(220,38,38,0.25); }

        .notice-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .notice-title { font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.85); margin-bottom: 6px; }
        .notice-body { font-size: 13px; color: rgba(255,255,255,0.4); line-height: 1.6; }
        .notice-date { font-size: 11px; color: rgba(255,255,255,0.2); margin-top: 10px; }

        .delete-btn {
          background: transparent;
          border: 1px solid rgba(248,113,113,0.2);
          border-radius: 7px;
          padding: 5px 12px;
          font-size: 11px;
          color: rgba(248,113,113,0.6);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .delete-btn:hover { background: rgba(220,38,38,0.1); color: #f87171; border-color: rgba(220,38,38,0.3); }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }

        .empty-state {
          text-align: center;
          padding: 48px 20px;
          color: rgba(255,255,255,0.2);
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .dash-topbar { padding: 0 20px; }
          .dash-nav { padding: 0 20px; overflow-x: auto; }
          .dash-body { padding: 24px 20px; }
        }
      `}</style>

      <div className="dash-root">

        {/* TOPBAR */}
        <div className="dash-topbar">
          <div className="dash-logo">
            <div className="dash-logo-box">🛡️</div>
            ApartX
          </div>
          <div className="dash-topbar-right">
            <div className="dash-welcome">
              Welcome, <span>{admin.name}</span>
            </div>
            <div className="dash-admin-badge">
              <div className="dash-admin-dot" /> Admin
            </div>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </div>

        {/* NAV TABS */}
        <div className="dash-nav">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`nav-tab ${active === tab ? 'active' : ''}`}
              onClick={() => setActive(tab)}
            >
              {tabIcons[tab]} {tab}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className="dash-body">
          {renderTab()}
        </div>

      </div>
    </>
  );
}