import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "../api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Jost:wght@300;400;500&display=swap');

  .glow-wrapper {
    min-height:100vh; display:flex; flex-direction:column;
    align-items:center; justify-content:center; padding:2rem 1rem;
    background:linear-gradient(160deg,#FAF0EB 0%,#F2E4DA 50%,#EDD8CE 100%);
    position:relative; overflow:hidden;
  }
  .glow-brand { text-align:center; margin-bottom:1.75rem; position:relative; z-index:2; }
  .glow-brand-icon {
    width:56px; height:56px; background:linear-gradient(135deg,#E8B4A8 0%,#C8896E 100%);
    border-radius:50%; margin:0 auto .7rem;
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 4px 24px rgba(200,137,110,.38);
  }
  .glow-brand-icon svg { width:28px; height:28px; fill:white; }
  .glow-brand-name {
    font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:600;
    color:#8B4D3A; letter-spacing:4px; text-transform:uppercase; margin:0;
  }
  .glow-brand-tagline {
    font-family:'Jost',sans-serif; font-size:11px; font-weight:300;
    color:#9C7B72; letter-spacing:2px; text-transform:uppercase; margin:0;
  }
  .glow-card {
    background:rgba(255,255,255,.80); backdrop-filter:blur(18px);
    border-radius:22px; border:1px solid rgba(232,180,168,.38);
    padding:2.25rem 2.25rem 2rem; width:100%; max-width:430px;
    position:relative; z-index:2; box-shadow:0 8px 48px rgba(139,77,58,.09);
  }
  .glow-label {
    font-family:'Jost',sans-serif; font-size:11px; font-weight:500;
    letter-spacing:1px; text-transform:uppercase; color:#9C7B72;
    display:block; margin-bottom:5px;
  }
  .glow-input {
    width:100%; border:1px solid rgba(200,137,110,.28); border-radius:11px;
    padding:10px 40px 10px 14px; font-family:'Jost',sans-serif; font-size:14px;
    color:#3D1F14; background:rgba(250,246,243,.65); transition:all .2s; outline:none;
    box-sizing:border-box;
  }
  .glow-input:focus { border-color:#C8896E; box-shadow:0 0 0 3px rgba(200,137,110,.13); background:white; }
  .glow-input-wrap { position:relative; }
  .glow-input-icon {
    position:absolute; right:12px; top:50%; transform:translateY(-50%);
    color:#E8B4A8; font-size:13px; cursor:pointer; user-select:none;
  }
  .glow-btn {
    width:100%; padding:12px; border:none; border-radius:11px;
    background:linear-gradient(135deg,#C8896E 0%,#8B4D3A 100%); color:white;
    font-family:'Jost',sans-serif; font-size:13px; font-weight:500;
    letter-spacing:1.5px; text-transform:uppercase; cursor:pointer;
    transition:all .25s; box-shadow:0 4px 18px rgba(139,77,58,.3); margin-top:4px;
  }
  .glow-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 28px rgba(139,77,58,.4); }
  .glow-btn:disabled { opacity:.65; cursor:not-allowed; }
  .glow-section-title { font-family:'Cormorant Garamond',serif; font-size:23px; font-weight:500; color:#8B4D3A; margin:0 0 3px; }
  .glow-section-sub   { font-family:'Jost',sans-serif; font-size:12px; color:#9C7B72; font-weight:300; margin-bottom:1.5rem; }
  .glow-alert { border-radius:11px; padding:12px 14px; margin-bottom:1rem; font-family:'Jost',sans-serif; font-size:13px; line-height:1.5; }
  .glow-alert-error   { background:rgba(220,53,69,.08);  border:1px solid rgba(220,53,69,.25);  color:#8B2030; }
  .glow-alert-success { background:rgba(25,135,84,.08);  border:1px solid rgba(25,135,84,.25);  color:#155235; }
  .glow-strength-bar  { height:3px; border-radius:2px; background:#F2EAE4; margin-top:6px; overflow:hidden; }
  .glow-strength-fill { height:100%; border-radius:2px; background:linear-gradient(90deg,#E8B4A8,#C8896E); transition:width .4s ease; }
  .glow-hint { font-family:'Jost',sans-serif; font-size:11px; color:#9C7B72; margin-top:4px; padding-left:2px; }
  .glow-confirm-icon {
    width:64px; height:64px; border-radius:50%;
    background:linear-gradient(135deg,#E8B4A8,#C8896E);
    display:flex; align-items:center; justify-content:center;
    margin:0 auto 1.25rem; font-size:28px;
    box-shadow:0 4px 24px rgba(200,137,110,.3);
  }
  .glow-confirm-title { font-family:'Cormorant Garamond',serif; font-size:24px; font-weight:500; color:#8B4D3A; text-align:center; margin:0 0 8px; }
  .glow-confirm-body  { font-family:'Jost',sans-serif; font-size:13px; color:#9C7B72; text-align:center; line-height:1.7; margin:0 0 1.5rem; }
  .glow-footer { text-align:center; margin-top:1.25rem; font-family:'Jost',sans-serif; font-size:12px; color:#9C7B72; }
  .glow-link { color:#C8896E; text-decoration:none; }
  .glow-link:hover { color:#8B4D3A; }
`;

function DropIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C9.5 5 7 8 7 11a5 5 0 0010 0c0-3-2.5-6-5-9zM9 17.5C9 19.4 10.3 21 12 21s3-1.6 3-3.5c0-1.5-1-3-3-4-2 1-3 2.5-3 4z"/>
    </svg>
  );
}

function getStrength(val) {
  let score = 0;
  if (val.length >= 8)          score++;
  if (/[A-Z]/.test(val))        score++;
  if (/[0-9]/.test(val))        score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const widths = ["0%","25%","50%","75%","100%"];
  const labels = ["","Weak password","Fair password","Good password","Strong password"];
  return { width: widths[score], label: score > 0 ? labels[score] : "Use 8+ characters with letters and numbers" };
}

// ── Forgot Password (enter email) ──
function ForgotPasswordForm() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [alert,   setAlert]   = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setAlert(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{ textAlign: "center" }}>
        <div className="glow-confirm-icon">✉️</div>
        <p className="glow-confirm-title">Check your inbox</p>
        <p className="glow-confirm-body">
          If <strong style={{ color: "#8B4D3A" }}>{email}</strong> is registered,
          we've sent a reset link valid for <strong>60 minutes</strong>.
          <br/><br/>Check your spam folder if you don't see it.
        </p>
        <button className="glow-btn" onClick={() => navigate("/auth")}>
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="glow-section-title">Forgot password?</p>
      <p className="glow-section-sub">We'll send a reset link to your email</p>

      {alert && <div className="glow-alert glow-alert-error">{alert}</div>}

      <div style={{ marginBottom: "1.25rem" }}>
        <label className="glow-label">Email address</label>
        <div className="glow-input-wrap">
          <input
            type="email" className="glow-input" placeholder="you@example.com"
            required value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <span className="glow-input-icon">✦</span>
        </div>
      </div>

      <button type="submit" className="glow-btn" disabled={loading}>
        {loading ? "Sending…" : "Send Reset Link"}
      </button>

      <p className="glow-footer">
        Remember your password?{" "}
        <a href="#" className="glow-link" onClick={(e) => { e.preventDefault(); navigate("/auth"); }}>
          Sign in
        </a>
      </p>
    </form>
  );
}

// ── Reset Password (enter new password) ──
function ResetPasswordForm({ token, email }) {
  const navigate = useNavigate();
  const [form,     setForm]     = useState({ password: "", password_confirmation: "" });
  const [showPw,   setShowPw]   = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);
  const [alert,    setAlert]    = useState(null);

  const strength = getStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (form.password !== form.password_confirmation) {
      return setAlert({ type: "error", message: "Passwords do not match." });
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, token, ...form });
      setDone(true);
    } catch (err) {
      const data = err.response?.data;
      setAlert({ type: "error", message: data?.message || "Reset failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div style={{ textAlign: "center" }}>
        <div className="glow-confirm-icon">✅</div>
        <p className="glow-confirm-title">Password reset!</p>
        <p className="glow-confirm-body">
          Your password has been updated successfully.<br/>
          You can now sign in with your new password.
        </p>
        <button className="glow-btn" onClick={() => navigate("/auth")}>
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="glow-section-title">New password</p>
      <p className="glow-section-sub">Choose a strong password for your account</p>

      {alert && <div className={`glow-alert glow-alert-${alert.type}`}>{alert.message}</div>}

      <div style={{ marginBottom: "1rem" }}>
        <label className="glow-label">New Password</label>
        <div className="glow-input-wrap">
          <input
            type={showPw ? "text" : "password"} className="glow-input"
            placeholder="••••••••" required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <span className="glow-input-icon" onClick={() => setShowPw(!showPw)}>
            {showPw ? "🙈" : "👁"}
          </span>
        </div>
        <div className="glow-strength-bar">
          <div className="glow-strength-fill" style={{ width: strength.width }} />
        </div>
        <p className="glow-hint">{strength.label}</p>
      </div>

      <div style={{ marginBottom: "1.25rem" }}>
        <label className="glow-label">Confirm New Password</label>
        <div className="glow-input-wrap">
          <input
            type={showConf ? "text" : "password"} className="glow-input"
            placeholder="••••••••" required
            value={form.password_confirmation}
            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
          />
          <span className="glow-input-icon" onClick={() => setShowConf(!showConf)}>
            {showConf ? "🙈" : "👁"}
          </span>
        </div>
      </div>

      <button type="submit" className="glow-btn" disabled={loading}>
        {loading ? "Resetting…" : "Reset Password"}
      </button>
    </form>
  );
}

// ── Root export ──
export default function ResetPasswordPage() {
  const { token }        = useParams();
  const [searchParams]   = useSearchParams();
  const email            = searchParams.get("email");

  return (
    <>
      <style>{styles}</style>
      <div className="glow-wrapper">
        <div className="glow-brand">
          <div className="glow-brand-icon"><DropIcon /></div>
          <p className="glow-brand-name">Glow</p>
          <p className="glow-brand-tagline">Radiant skin, naturally</p>
        </div>
        <div className="glow-card">
          {token && email
            ? <ResetPasswordForm token={token} email={email} />
            : <ForgotPasswordForm />
          }
        </div>
      </div>
    </>
  );
}