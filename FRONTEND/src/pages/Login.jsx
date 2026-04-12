import { useState } from "react";
import API from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #07070f;
        }

        .login-left {
          flex: 1.3;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 52px;
        }

        .apt-photo {
          position: absolute;
          inset: 0;
          background-image: url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&q=85&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
          animation: slowzoom 14s ease-in-out infinite alternate;
        }

        @keyframes slowzoom {
          from { transform: scale(1.0); }
          to   { transform: scale(1.08); }
        }

        .apt-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to top, rgba(4,4,14,0.97) 0%, rgba(4,4,14,0.6) 40%, rgba(4,4,14,0.25) 100%),
            linear-gradient(to right, rgba(4,4,14,0.4) 0%, transparent 70%);
        }

        .apt-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 25% 85%, rgba(109,60,220,0.28) 0%, transparent 55%);
        }

        .photo-topbar {
          position: absolute;
          top: 0; left: 0; right: 0;
          padding: 28px 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 3;
          background: linear-gradient(to bottom, rgba(4,4,14,0.55), transparent);
        }

        .photo-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .photo-logo-box {
          width: 34px; height: 34px;
          background: linear-gradient(135deg,#7c3aed,#4338ca);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px;
        }

        .live-badge {
          display: flex; align-items: center; gap: 7px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 100px;
          padding: 6px 14px;
          font-size: 12px;
          color: rgba(255,255,255,0.7);
        }
        .live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #22c55e;
          animation: blink 2s infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

        .left-content { position: relative; z-index: 3; }

        .left-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 7px 16px;
          border-radius: 100px;
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(200,170,255,0.9);
          margin-bottom: 22px;
        }
        .left-tag-dot { width:6px;height:6px;border-radius:50%;background:#a78bfa;animation:blink 2s infinite; }

        .left-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(44px, 4.5vw, 66px);
          font-weight: 400;
          line-height: 1.05;
          color: #fff;
          margin-bottom: 18px;
          letter-spacing: -1px;
          text-shadow: 0 2px 20px rgba(0,0,0,0.5);
        }
        .left-title em { font-style: italic; color: #c4b5fd; }

        .left-desc {
          font-size: 14px;
          color: rgba(255,255,255,0.48);
          font-weight: 300;
          line-height: 1.75;
          max-width: 360px;
          margin-bottom: 36px;
        }

        .stats-bar {
          display: flex;
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 16px;
          overflow: hidden;
          max-width: 400px;
        }
        .stat-box {
          flex: 1;
          padding: 18px 20px;
          text-align: center;
          border-right: 1px solid rgba(255,255,255,0.08);
        }
        .stat-box:last-child { border-right: none; }
        .stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px; font-weight: 600; color: #fff; line-height: 1;
        }
        .stat-lbl {
          font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
          color: rgba(255,255,255,0.35); margin-top: 5px;
        }

        /* RIGHT FORM */
        .login-right {
          flex: 0 0 460px;
          background: #0b0b16;
          border-left: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 64px 52px;
          position: relative;
        }
        .login-right::before {
          content:''; position:absolute; top:0;left:0;right:0; height:1px;
          background: linear-gradient(90deg,transparent,rgba(167,139,250,0.6),transparent);
        }
        .login-right::after {
          content:''; position:absolute; bottom:0;right:0;
          width:200px;height:200px;
          background: radial-gradient(circle at bottom right,rgba(109,60,220,0.1),transparent 70%);
          pointer-events:none;
        }

        .form-eyebrow {
          font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
          color: rgba(167,139,250,0.7); margin-bottom: 12px;
          display: flex; align-items: center; gap: 8px;
        }
        .form-eyebrow::before {
          content:''; display:inline-block; width:20px; height:1px;
          background: rgba(167,139,250,0.5);
        }

        .form-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 42px; font-weight: 400; color: #fff;
          margin-bottom: 6px; letter-spacing: -0.5px; line-height: 1.1;
        }
        .form-sub {
          font-size: 13px; color: rgba(255,255,255,0.3);
          margin-bottom: 40px; font-weight: 300;
        }

        .field-group { margin-bottom: 18px; }
        .field-label {
          display: block; font-size: 11px; letter-spacing: 2px;
          text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 8px;
        }
        .field-wrap { position: relative; }
        .field-icon {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%); font-size: 15px;
          pointer-events: none; opacity: 0.45;
        }
        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 14px 16px 14px 42px;
          font-size: 14px; color: #fff;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
        }
        .field-input::placeholder { color: rgba(255,255,255,0.18); }
        .field-input:focus {
          border-color: rgba(167,139,250,0.5);
          background: rgba(167,139,250,0.05);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
        }

        .error-msg {
          background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);
          color: #fca5a5; font-size: 13px; padding: 11px 14px;
          border-radius: 8px; margin-bottom: 18px;
          display: flex; align-items: center; gap: 8px;
        }

        .login-btn {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg,#7c3aed,#4338ca);
          border: none; border-radius: 10px; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          font-weight: 500; letter-spacing: 0.5px; cursor: pointer;
          margin-top: 8px;
          transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
          position: relative; overflow: hidden;
          box-shadow: 0 4px 24px rgba(124,58,237,0.3);
        }
        .login-btn:hover { opacity:0.92; transform:translateY(-1px); box-shadow:0 8px 32px rgba(124,58,237,0.45); }
        .login-btn:active { transform:translateY(0); }
        .login-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; box-shadow:none; }
        .login-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.1),transparent); }

        .divider {
          display: flex; align-items: center; gap: 12px; margin: 24px 0;
        }
        .divider-line { flex:1; height:1px; background:rgba(255,255,255,0.07); }
        .divider-text { font-size:12px; color:rgba(255,255,255,0.2); }

        .form-footer { text-align:center; font-size:13px; color:rgba(255,255,255,0.3); }
        .form-footer a { color:#a78bfa; cursor:pointer; text-decoration:none; font-weight:500; }
        .form-footer a:hover { color:#c4b5fd; }

        @media (max-width:900px) {
          .login-left { display:none; }
          .login-right { flex:1; padding:48px 28px; }
        }
      `}</style>

      <div className="login-root">

        {/* LEFT APARTMENT PHOTO */}
        <div className="login-left">
          <div className="apt-photo" />
          <div className="apt-overlay" />
          <div className="apt-glow" />

          <div className="photo-topbar">
            <div className="photo-logo">
              <div className="photo-logo-box">🏢</div>
              ApartX
            </div>
            <div className="live-badge">
              <div className="live-dot" /> Portal Online
            </div>
          </div>

          <div className="left-content">
            <div className="left-tag">
              <div className="left-tag-dot" /> Resident Portal
            </div>
            <h1 className="left-title">
              Premium<br /><em>Gated</em><br />Community
            </h1>
            <p className="left-desc">
              Your all-in-one portal for billing, maintenance requests, and community management — available 24/7.
            </p>
            <div className="stats-bar">
              <div className="stat-box">
                <div className="stat-num">240+</div>
                <div className="stat-lbl">Units</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">24/7</div>
                <div className="stat-lbl">Support</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">99%</div>
                <div className="stat-lbl">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="login-right">
          <div className="form-eyebrow">Resident Access</div>
          <h2 className="form-heading">Welcome<br />back.</h2>
          <p className="form-sub">Sign in to your apartment account</p>

          {error && <div className="error-msg">⚠ {error}</div>}

          <div className="field-group">
            <label className="field-label">Email Address</label>
            <div className="field-wrap">
              <span className="field-icon">✉️</span>
              <input
                className="field-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <div className="field-wrap">
              <span className="field-icon">🔒</span>
              <input
                className="field-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
          </div>

          <button className="login-btn" onClick={handleLogin} disabled={loading}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>

          <div className="divider">
            <div className="divider-line" />
            <div className="divider-text">or</div>
            <div className="divider-line" />
          </div>

          <p className="form-footer">
            No account yet?{" "}
            <a onClick={() => (window.location.href = "/register")}>Create one free</a>
          </p>
        </div>

      </div>
    </>
  );
}