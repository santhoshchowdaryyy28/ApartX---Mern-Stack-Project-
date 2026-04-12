import { useState } from "react";
import API from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    apartmentNumber: "",
    contactDetails: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      alert("Account Created ✅");
      window.location.href = "/";
    } catch (err) {
      alert("Error creating account ❌");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name",            label: "Full Name",        type: "text",     placeholder: "John Doe" },
    { name: "email",           label: "Email Address",    type: "email",    placeholder: "you@example.com" },
    { name: "password",        label: "Password",         type: "password", placeholder: "Min 8 characters" },
    { name: "apartmentNumber", label: "Apartment Number", type: "text",     placeholder: "e.g. A-204" },
    { name: "contactDetails",  label: "Phone Number",     type: "text",     placeholder: "+91 98765 43210" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .reg-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #07070f;
        }

        /* ── LEFT VISUAL ── */
        .reg-left {
          flex: 1;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px;
        }

        .reg-left-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg,#0c0c22 0%,#07070f 70%);
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          animation: drift 9s ease-in-out infinite alternate;
        }
        .orb1 { width:380px;height:380px;background:rgba(16,185,129,0.2);top:-60px;right:-80px; }
        .orb2 { width:260px;height:260px;background:rgba(59,130,246,0.2);bottom:100px;left:-40px;animation-delay:3s; }
        .orb3 { width:180px;height:180px;background:rgba(139,92,246,0.2);top:50%;left:50%;animation-delay:6s; }

        @keyframes drift {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(25px,15px) scale(1.06); }
        }

        .steps-card {
          position: relative;
          z-index: 2;
          max-width: 360px;
          width: 100%;
        }

        .steps-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 42px;
          font-weight: 300;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }
        .steps-title em { font-style: italic; color: #6ee7b7; }

        .steps-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          font-weight: 300;
          line-height: 1.7;
          margin-bottom: 48px;
        }

        .step-list { display: flex; flex-direction: column; gap: 24px; }

        .step-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .step-num {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: rgba(110,231,183,0.1);
          border: 1px solid rgba(110,231,183,0.3);
          color: #6ee7b7;
          font-size: 13px;
          font-weight: 500;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .step-text-title {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          margin-bottom: 3px;
        }
        .step-text-desc {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          font-weight: 300;
          line-height: 1.6;
        }

        /* ── RIGHT FORM ── */
        .reg-right {
          flex: 0 0 480px;
          background: #0d0d18;
          border-left: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 56px 52px;
          position: relative;
          overflow-y: auto;
        }

        .reg-right::before {
          content:'';
          position:absolute;
          top:0;left:0;right:0;
          height:1px;
          background: linear-gradient(90deg, transparent, rgba(110,231,183,0.4), transparent);
        }

        .form-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          color: #fff;
          letter-spacing: 1px;
          margin-bottom: 40px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .form-logo-icon {
          width: 30px; height: 30px;
          background: linear-gradient(135deg,#059669,#0d9488);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px;
        }

        .form-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 34px;
          font-weight: 400;
          color: #fff;
          margin-bottom: 6px;
          letter-spacing: -0.5px;
        }
        .form-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          margin-bottom: 36px;
          font-weight: 300;
        }

        .field-group { margin-bottom: 16px; }
        .field-label {
          display: block;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 7px;
        }
        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 13px 16px;
          font-size: 14px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.25s, background 0.25s;
        }
        .field-input::placeholder { color: rgba(255,255,255,0.2); }
        .field-input:focus {
          border-color: rgba(110,231,183,0.5);
          background: rgba(110,231,183,0.05);
        }

        .reg-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #059669, #0d9488);
          border: none;
          border-radius: 10px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.5px;
          cursor: pointer;
          margin-top: 8px;
          transition: opacity 0.2s, transform 0.2s;
          position: relative;
          overflow: hidden;
        }
        .reg-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .reg-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .reg-btn::after {
          content:'';
          position:absolute;
          inset:0;
          background: linear-gradient(135deg,rgba(255,255,255,0.1),transparent);
        }

        .form-footer {
          text-align: center;
          margin-top: 24px;
          font-size: 13px;
          color: rgba(255,255,255,0.3);
        }
        .form-footer a {
          color: #6ee7b7;
          cursor: pointer;
          text-decoration: none;
          font-weight: 500;
        }
        .form-footer a:hover { text-decoration: underline; }

        @media (max-width: 900px) {
          .reg-left { display: none; }
          .reg-right { flex: 1; padding: 48px 28px; }
        }
      `}</style>

      <div className="reg-root">

        {/* LEFT */}
        <div className="reg-left">
          <div className="reg-left-bg" />
          <div className="orb orb1" />
          <div className="orb orb2" />
          <div className="orb orb3" />

          <div className="steps-card">
            <h1 className="steps-title">Join Your<br /><em>Community</em></h1>
            <p className="steps-sub">
              Register once and get full access to billing, complaints, and announcements for your apartment.
            </p>
            <div className="step-list">
              {[
                ["01", "Create Account", "Fill in your basic info to get started."],
                ["02", "Verify Apartment", "Your unit number links you to the right records."],
                ["03", "Access Dashboard", "View invoices, raise complaints, and more."],
              ].map(([num, title, desc]) => (
                <div className="step-item" key={num}>
                  <div className="step-num">{num}</div>
                  <div>
                    <div className="step-text-title">{title}</div>
                    <div className="step-text-desc">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="reg-right">
          <div className="form-logo">
            <div className="form-logo-icon">🏢</div>
            ApartX
          </div>

          <h2 className="form-heading">Create Account</h2>
          <p className="form-sub">Set up your resident profile</p>

          {fields.map(({ name, label, type, placeholder }) => (
            <div className="field-group" key={name}>
              <label className="field-label">{label}</label>
              <input
                className="field-input"
                name={name}
                type={type}
                placeholder={placeholder}
                value={form[name]}
                onChange={handleChange}
              />
            </div>
          ))}

          <button className="reg-btn" onClick={handleRegister} disabled={loading}>
            {loading ? "Creating Account…" : "Create Account"}
          </button>

          <p className="form-footer">
            Already have an account?{" "}
            <a onClick={() => (window.location.href = "/")}>Sign in</a>
          </p>
        </div>

      </div>
    </>
  );
}