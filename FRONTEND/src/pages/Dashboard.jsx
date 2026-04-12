import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [complaint, setComplaint] = useState("");
  const [message, setMessage] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await API.get("/profile");
        setUser(profile.data);
        const inv = await API.get("/invoices");
        setInvoices(inv.data);
      } catch {}
    };
    fetchData();
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const submitComplaint = async () => {
    if (!complaint.trim()) return;
    setSubmitting(true);
    try {
      await API.post("/complaints", { description: complaint });
      setMessage("success");
      setComplaint("");
    } catch {
      setMessage("error");
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  const totalDue = invoices.filter(i => i.paymentStatus !== "paid").reduce((s, i) => s + i.amount, 0);
  const paidCount = invoices.filter(i => i.paymentStatus === "paid").length;

  const statusColor = (s) => {
    if (s === "paid") return { bg: "rgba(16,185,129,0.15)", color: "#6ee7b7", border: "rgba(16,185,129,0.3)" };
    if (s === "overdue") return { bg: "rgba(239,68,68,0.12)", color: "#fca5a5", border: "rgba(239,68,68,0.3)" };
    return { bg: "rgba(245,158,11,0.12)", color: "#fcd34d", border: "rgba(245,158,11,0.3)" };
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #07070f; }

        .dash-root {
          min-height: 100vh;
          background: #07070f;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          display: flex;
        }

        /* ── SIDEBAR ── */
        .sidebar {
          width: 240px;
          flex-shrink: 0;
          background: #0d0d18;
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          padding: 32px 0;
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .sidebar-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          color: #fff;
          padding: 0 28px 36px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 20px;
        }
        .sidebar-logo-icon {
          width: 32px; height: 32px;
          background: linear-gradient(135deg,#7c3aed,#4f46e5);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }

        .nav-label {
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          padding: 0 28px;
          margin-bottom: 8px;
          margin-top: 16px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 28px;
          font-size: 13.5px;
          color: rgba(255,255,255,0.45);
          cursor: pointer;
          transition: all 0.2s;
          border-left: 2px solid transparent;
          margin: 1px 0;
        }
        .nav-item:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.03); }
        .nav-item.active {
          color: #c4b5fd;
          background: rgba(167,139,250,0.08);
          border-left-color: #7c3aed;
        }
        .nav-item .nav-icon { font-size: 16px; width: 20px; text-align: center; }

        .sidebar-bottom {
          margin-top: auto;
          padding: 20px 28px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .user-mini {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        .user-avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg,#7c3aed,#4f46e5);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 600;
          flex-shrink: 0;
        }
        .user-name { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.8); }
        .user-role { font-size: 11px; color: rgba(255,255,255,0.3); }

        .logout-btn {
          width: 100%;
          padding: 10px 14px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px;
          color: #fca5a5;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .logout-btn:hover { background: rgba(239,68,68,0.18); }

        /* ── MAIN CONTENT ── */
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          overflow: auto;
        }

        /* ── TOPBAR ── */
        .topbar {
          padding: 24px 40px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(13,13,24,0.6);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .topbar-left h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 400;
          letter-spacing: -0.3px;
        }
        .topbar-left p {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          margin-top: 2px;
          font-weight: 300;
        }

        .topbar-right { display: flex; align-items: center; gap: 12px; }
        .topbar-badge {
          background: rgba(167,139,250,0.12);
          border: 1px solid rgba(167,139,250,0.25);
          color: #c4b5fd;
          font-size: 12px;
          padding: 6px 14px;
          border-radius: 100px;
        }

        /* ── PAGE BODY ── */
        .page-body { padding: 36px 40px; flex: 1; }

        /* ── STATS ROW ── */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: #0d0d18;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 24px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.25s;
        }
        .stat-card:hover { border-color: rgba(167,139,250,0.25); }
        .stat-card::before {
          content:'';
          position:absolute;
          top:0;left:0;right:0;
          height:2px;
        }
        .stat-card.purple::before { background: linear-gradient(90deg,#7c3aed,#4f46e5); }
        .stat-card.green::before  { background: linear-gradient(90deg,#059669,#0d9488); }
        .stat-card.amber::before  { background: linear-gradient(90deg,#d97706,#f59e0b); }
        .stat-card.red::before    { background: linear-gradient(90deg,#dc2626,#ef4444); }

        .stat-icon { font-size: 22px; margin-bottom: 12px; }
        .stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 600;
          color: #fff;
          line-height: 1;
          margin-bottom: 6px;
        }
        .stat-label { font-size: 12px; color: rgba(255,255,255,0.35); letter-spacing: 0.5px; }

        /* ── GRID ── */
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
        }

        /* ── CARD ── */
        .card {
          background: #0d0d18;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
        }
        .card-header {
          padding: 22px 28px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 400;
          color: #fff;
        }
        .card-sub { font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 2px; }
        .card-body { padding: 24px 28px; }

        /* ── INVOICE LIST ── */
        .invoice-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .invoice-item:last-child { border-bottom: none; }
        .inv-left { display: flex; align-items: center; gap: 14px; }
        .inv-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: rgba(167,139,250,0.1);
          border: 1px solid rgba(167,139,250,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 17px;
        }
        .inv-month { font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.85); }
        .inv-date  { font-size: 11px; color: rgba(255,255,255,0.3); margin-top: 2px; }
        .inv-amount {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 600;
          color: #fff;
          margin-right: 16px;
        }
        .inv-status {
          font-size: 11px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 100px;
          border: 1px solid;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        /* ── PROFILE CARD ── */
        .profile-avatar-lg {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg,#7c3aed,#4f46e5);
          display: flex; align-items: center; justify-content: center;
          font-size: 28px; font-weight: 600;
          margin: 0 auto 20px;
        }
        .profile-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          color: #fff;
          text-align: center;
          margin-bottom: 4px;
        }
        .profile-email { font-size: 13px; color: rgba(255,255,255,0.35); text-align: center; margin-bottom: 24px; }

        .profile-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 13px;
        }
        .profile-row:last-child { border-bottom: none; }
        .profile-row-label { color: rgba(255,255,255,0.35); }
        .profile-row-val { color: rgba(255,255,255,0.85); font-weight: 500; }

        /* ── COMPLAINT SECTION ── */
        .complaint-wrap { margin-top: 24px; }

        .complaint-textarea {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 14px 16px;
          font-size: 14px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          resize: none;
          height: 100px;
          transition: border-color 0.25s, background 0.25s;
          margin-bottom: 12px;
        }
        .complaint-textarea::placeholder { color: rgba(255,255,255,0.2); }
        .complaint-textarea:focus {
          border-color: rgba(167,139,250,0.4);
          background: rgba(167,139,250,0.05);
        }

        .submit-btn {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg,#7c3aed,#4f46e5);
          border: none;
          border-radius: 10px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
        }
        .submit-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .alert {
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 13px;
          margin-top: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .alert-success { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25); color: #6ee7b7; }
        .alert-error   { background: rgba(239,68,68,0.1);  border: 1px solid rgba(239,68,68,0.25);  color: #fca5a5; }

        /* empty state */
        .empty-state {
          text-align: center;
          padding: 48px 0;
          color: rgba(255,255,255,0.2);
          font-size: 14px;
        }
        .empty-state .empty-icon { font-size: 36px; margin-bottom: 12px; }

        @media (max-width: 1200px) { .stats-row { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 900px) {
          .sidebar { display: none; }
          .content-grid { grid-template-columns: 1fr; }
          .page-body { padding: 24px 20px; }
          .topbar { padding: 18px 20px; }
          .stats-row { grid-template-columns: repeat(2,1fr); }
        }
      `}</style>

      <div className="dash-root">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">🏢</div>
            ApartX
          </div>

          <div className="nav-label">Main</div>
          {[
            { id: "overview", icon: "⊞", label: "Overview" },
            { id: "invoices", icon: "💳", label: "Invoices" },
            { id: "complaints", icon: "🛠", label: "Complaints" },
          ].map(({ id, icon, label }) => (
            <div
              key={id}
              className={`nav-item ${activeTab === id ? "active" : ""}`}
              onClick={() => setActiveTab(id)}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </div>
          ))}

          <div className="nav-label">Account</div>
          <div className={`nav-item ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
            <span className="nav-icon">👤</span>
            Profile
          </div>

          <div className="sidebar-bottom">
            {user && (
              <div className="user-mini">
                <div className="user-avatar">{user.name?.[0]?.toUpperCase() || "U"}</div>
                <div>
                  <div className="user-name">{user.name}</div>
                  <div className="user-role">{user.role || "Resident"}</div>
                </div>
              </div>
            )}
            <button className="logout-btn" onClick={logout}>Sign Out</button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main-content">

          {/* TOPBAR */}
          <div className="topbar">
            <div className="topbar-left">
              <h1>
                {activeTab === "overview"   && "Dashboard"}
                {activeTab === "invoices"   && "Invoices"}
                {activeTab === "complaints" && "Raise Complaint"}
                {activeTab === "profile"    && "My Profile"}
              </h1>
              <p>
                {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <div className="topbar-right">
              {user?.apartmentNumber && (
                <div className="topbar-badge">🏠 Apt {user.apartmentNumber}</div>
              )}
            </div>
          </div>

          <div className="page-body">

            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <>
                <div className="stats-row">
                  <div className="stat-card purple">
                    <div className="stat-icon">💳</div>
                    <div className="stat-value">₹{totalDue.toLocaleString("en-IN")}</div>
                    <div className="stat-label">Total Due</div>
                  </div>
                  <div className="stat-card green">
                    <div className="stat-icon">✅</div>
                    <div className="stat-value">{paidCount}</div>
                    <div className="stat-label">Paid Invoices</div>
                  </div>
                  <div className="stat-card amber">
                    <div className="stat-icon">🧾</div>
                    <div className="stat-value">{invoices.length}</div>
                    <div className="stat-label">Total Invoices</div>
                  </div>
                  <div className="stat-card red">
                    <div className="stat-icon">⚠️</div>
                    <div className="stat-value">{invoices.filter(i => i.paymentStatus === "overdue").length}</div>
                    <div className="stat-label">Overdue</div>
                  </div>
                </div>

                <div className="content-grid">
                  {/* Recent Invoices */}
                  <div className="card">
                    <div className="card-header">
                      <div>
                        <div className="card-title">Recent Invoices</div>
                        <div className="card-sub">Your latest billing records</div>
                      </div>
                    </div>
                    <div className="card-body">
                      {invoices.length === 0 ? (
                        <div className="empty-state">
                          <div className="empty-icon">📄</div>
                          No invoices yet
                        </div>
                      ) : (
                        invoices.slice(0, 5).map((inv) => {
                          const s = statusColor(inv.paymentStatus);
                          return (
                            <div className="invoice-item" key={inv._id}>
                              <div className="inv-left">
                                <div className="inv-icon">🧾</div>
                                <div>
                                  <div className="inv-month">Monthly Rent</div>
                                  <div className="inv-date">Due: {new Date(inv.dueDate).toLocaleDateString("en-IN")}</div>
                                </div>
                              </div>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <span className="inv-amount">₹{inv.amount?.toLocaleString("en-IN")}</span>
                                <span className="inv-status" style={{ background: s.bg, color: s.color, borderColor: s.border }}>
                                  {inv.paymentStatus}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Profile summary */}
                  <div className="card">
                    <div className="card-header">
                      <div className="card-title">Profile</div>
                    </div>
                    <div className="card-body">
                      {user ? (
                        <>
                          <div className="profile-avatar-lg">{user.name?.[0]?.toUpperCase() || "U"}</div>
                          <div className="profile-name">{user.name}</div>
                          <div className="profile-email">{user.email}</div>
                          {[
                            ["Role", user.role || "Resident"],
                            ["Apartment", user.apartmentNumber || "—"],
                            ["Phone", user.contactDetails || "—"],
                          ].map(([label, val]) => (
                            <div className="profile-row" key={label}>
                              <span className="profile-row-label">{label}</span>
                              <span className="profile-row-val">{val}</span>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="empty-state"><div className="empty-icon">👤</div>Loading…</div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* INVOICES TAB */}
            {activeTab === "invoices" && (
              <div className="card">
                <div className="card-header">
                  <div>
                    <div className="card-title">All Invoices</div>
                    <div className="card-sub">{invoices.length} records found</div>
                  </div>
                </div>
                <div className="card-body">
                  {invoices.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📄</div>No invoices found
                    </div>
                  ) : (
                    invoices.map((inv) => {
                      const s = statusColor(inv.paymentStatus);
                      return (
                        <div className="invoice-item" key={inv._id}>
                          <div className="inv-left">
                            <div className="inv-icon">🧾</div>
                            <div>
                              <div className="inv-month">Monthly Rent</div>
                              <div className="inv-date">Due: {new Date(inv.dueDate).toLocaleDateString("en-IN")}</div>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <span className="inv-amount">₹{inv.amount?.toLocaleString("en-IN")}</span>
                            <span className="inv-status" style={{ background: s.bg, color: s.color, borderColor: s.border }}>
                              {inv.paymentStatus}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* COMPLAINTS TAB */}
            {activeTab === "complaints" && (
              <div style={{ maxWidth: 620 }}>
                <div className="card">
                  <div className="card-header">
                    <div>
                      <div className="card-title">Raise a Complaint</div>
                      <div className="card-sub">Describe the issue and we'll get back to you</div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="complaint-wrap">
                      <textarea
                        className="complaint-textarea"
                        placeholder="e.g. Water leakage in bathroom, elevator not working..."
                        value={complaint}
                        onChange={(e) => setComplaint(e.target.value)}
                      />
                      <button className="submit-btn" onClick={submitComplaint} disabled={submitting || !complaint.trim()}>
                        {submitting ? "Submitting…" : "Submit Complaint"}
                      </button>
                      {message === "success" && (
                        <div className="alert alert-success">✅ Complaint submitted successfully</div>
                      )}
                      {message === "error" && (
                        <div className="alert alert-error">❌ Something went wrong. Try again.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div style={{ maxWidth: 500 }}>
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">My Profile</div>
                  </div>
                  <div className="card-body">
                    {user ? (
                      <>
                        <div className="profile-avatar-lg">{user.name?.[0]?.toUpperCase() || "U"}</div>
                        <div className="profile-name">{user.name}</div>
                        <div className="profile-email">{user.email}</div>
                        {[
                          ["Role", user.role || "Resident"],
                          ["Apartment", user.apartmentNumber || "—"],
                          ["Phone", user.contactDetails || "—"],
                          ["Member Since", user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN") : "—"],
                        ].map(([label, val]) => (
                          <div className="profile-row" key={label}>
                            <span className="profile-row-label">{label}</span>
                            <span className="profile-row-val">{val}</span>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="empty-state"><div className="empty-icon">👤</div>Loading profile…</div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}