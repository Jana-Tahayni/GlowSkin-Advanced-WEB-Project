import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "./api";

/* ─────────────────────────────────────────────
   Styles
───────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --teal-50:  #e8f5f2;
    --teal-100: #c0e4db;
    --teal-200: #8fcfc3;
    --teal-400: #3fa08c;
    --teal-600: #1f6b5e;
    --teal-700: #184f46;
    --teal-800: #103830;
    --cream-50:  #faf8f4;
    --cream-100: #f4f0e8;
    --cream-200: #ece5d8;
    --cream-400: #d4c9b2;
    --warm-text: #3d2e1e;
    --muted:     #7a8c89;
    --border:    #ddd8cf;
    --input-bg:  #faf8f5;
    --radius-sm: 10px;
    --radius-md: 14px;
    --radius-lg: 20px;
    --ease: cubic-bezier(.4,0,.2,1);
  }

  /* ── Root layout ── */
  .rp-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 1.25rem;
    font-family: 'DM Sans', sans-serif;
    background: var(--cream-100);
    position: relative;
    overflow: hidden;
  }

  /* Background grid */
  .rp-bg-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(31,107,94,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(31,107,94,.04) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  /* Background orbs */
  .rp-orb1 {
    position: absolute; width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle at 40% 40%, rgba(63,160,140,.12) 0%, transparent 65%);
    top: -180px; right: -180px; pointer-events: none;
  }
  .rp-orb2 {
    position: absolute; width: 360px; height: 360px; border-radius: 50%;
    background: radial-gradient(circle at 60% 60%, rgba(143,207,195,.09) 0%, transparent 65%);
    bottom: -100px; left: -100px; pointer-events: none;
  }

  /* ── Wrapper column ── */
  .rp-col {
    position: relative; z-index: 2;
    width: 100%; max-width: 420px;
    display: flex; flex-direction: column; align-items: center; gap: 0;
    animation: rp-fadeup .5s var(--ease) both;
  }

  @keyframes rp-fadeup {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Logo ── */
  .rp-logo {
    display: flex; align-items: center; gap: 11px;
    margin-bottom: 2rem;
  }
  .rp-logo-badge {
    width: 42px; height: 42px; border-radius: 12px;
    background: var(--teal-700);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    box-shadow: 0 4px 16px rgba(24,79,70,.28);
  }
  .rp-logo-name {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 600;
    color: var(--warm-text); letter-spacing: .3px;
  }

  /* ── Card ── */
  .rp-card {
    width: 100%;
    background: white;
    border: 1px solid rgba(212,201,178,.55);
    border-radius: var(--radius-lg);
    padding: 2.5rem 2.25rem 2.25rem;
    box-shadow:
      0 4px 6px rgba(16,56,48,.04),
      0 14px 52px rgba(16,56,48,.08),
      0 1px 0 rgba(255,255,255,.9) inset;
  }

  /* ── Section header ── */
  .rp-title {
    font-family: 'Playfair Display', serif;
    font-size: 27px; font-weight: 600;
    color: var(--warm-text); margin-bottom: 5px; line-height: 1.2;
  }
  .rp-subtitle {
    font-size: 13px; font-weight: 300;
    color: var(--muted); margin-bottom: 1.75rem; line-height: 1.6;
  }

  /* ── Fields ── */
  .rp-field { margin-bottom: 1rem; }

  .rp-label {
    display: block;
    font-size: 11.5px; font-weight: 500;
    letter-spacing: .9px; text-transform: uppercase;
    color: #5a7570; margin-bottom: 6px;
  }
  .rp-label-row {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 6px;
  }
  .rp-label-row .rp-label { margin-bottom: 0; }

  .rp-input-wrap { position: relative; }
  .rp-icon-left {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    color: var(--cream-400); pointer-events: none; display: flex;
  }
  .rp-icon-right {
    position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
    color: var(--cream-400); cursor: pointer; display: flex;
    transition: color .2s;
  }
  .rp-icon-right:hover { color: var(--teal-600); }

  .rp-input {
    width: 100%; padding: 11px 40px;
    border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    background: var(--input-bg);
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--warm-text);
    outline: none; transition: all .22s var(--ease); -webkit-appearance: none;
  }
  .rp-input:focus {
    border-color: var(--teal-400); background: white;
    box-shadow: 0 0 0 3.5px rgba(63,160,140,.1);
  }
  .rp-input::placeholder { color: #c2bdb5; }
  .rp-input:hover:not(:focus) { border-color: #c4bdb2; }

  /* Single icon (no left icon) */
  .rp-input.no-left { padding-left: 14px; }

  /* ── Strength ── */
  .rp-strength-track {
    height: 3px; background: var(--cream-200);
    border-radius: 2px; margin-top: 8px; overflow: hidden;
  }
  .rp-strength-fill {
    height: 100%; border-radius: 2px;
    background: linear-gradient(90deg, var(--teal-200), var(--teal-600));
    transition: width .4s ease;
  }
  .rp-hint { font-size: 11.5px; color: var(--muted); margin-top: 5px; }

  /* ── Button ── */
  .rp-btn {
    width: 100%; padding: 13px; border: none;
    border-radius: var(--radius-sm); background: var(--teal-700);
    color: white; font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500; letter-spacing: .5px;
    cursor: pointer; transition: all .22s var(--ease); margin-top: 4px;
  }
  .rp-btn:hover:not(:disabled) { background: var(--teal-800); }
  .rp-btn:active:not(:disabled) { transform: scale(.99); }
  .rp-btn:disabled { opacity: .55; cursor: not-allowed; }

  /* ── Alerts ── */
  .rp-alert {
    border-radius: var(--radius-sm); padding: 11px 14px;
    margin-bottom: 1.1rem; font-size: 13px; line-height: 1.55;
  }
  .rp-alert-error   { background: #fdf0ef; border: 1px solid #f0c4be; color: #7a2a20; }
  .rp-alert-success { background: #edf7f4; border: 1px solid #b0ddd0; color: #1a4f3e; }

  /* ── Confirm (success / sent) screen ── */
  .rp-confirm-icon {
    width: 68px; height: 68px; border-radius: 50%;
    background: linear-gradient(135deg, var(--teal-100), var(--teal-400));
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.25rem; font-size: 28px;
    box-shadow: 0 6px 28px rgba(31,107,94,.22);
  }
  .rp-confirm-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px; font-weight: 600;
    color: var(--warm-text); text-align: center; margin-bottom: 10px;
  }
  .rp-confirm-body {
    font-size: 13px; font-weight: 300; color: var(--muted);
    text-align: center; line-height: 1.8; margin-bottom: 1.75rem;
  }

  /* ── Footer ── */
  .rp-footer {
    text-align: center; margin-top: 1.4rem;
    font-size: 13px; color: var(--muted);
  }
  .rp-link { color: var(--teal-600); text-decoration: none; font-weight: 500; }
  .rp-link:hover { color: var(--teal-800); text-decoration: underline; }

  /* ── Responsive ── */
  @media (max-width: 500px) {
    .rp-card { padding: 2rem 1.5rem 1.75rem; }
    .rp-title { font-size: 23px; }
  }
`;

/* ─────────────────────────────────────────────
   SVG Icons
───────────────────────────────────────────── */
const Icon = {
  Mail: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  ),
  Lock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  Eye: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  EyeOff: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
      <line x1="2" y1="2" x2="22" y2="22"/>
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7"/>
    </svg>
  ),
};

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function getStrength(val) {
  let score = 0;
  if (val.length >= 8)          score++;
  if (/[A-Z]/.test(val))        score++;
  if (/[0-9]/.test(val))        score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const widths = ["0%", "25%", "50%", "75%", "100%"];
  const labels = ["", "Weak password", "Fair password", "Good password", "Strong password"];
  return {
    width: widths[score],
    label: score > 0 ? labels[score] : "Use 8+ characters with letters and numbers",
  };
}

function PwField({ placeholder, value, onChange, show, onToggle }) {
  return (
    <div className="rp-input-wrap">
      <span className="rp-icon-left"><Icon.Lock /></span>
      <input
        type={show ? "text" : "password"}
        className="rp-input"
        placeholder={placeholder}
        required
        value={value}
        onChange={onChange}
      />
      <span className="rp-icon-right" onClick={onToggle}>
        {show ? <Icon.EyeOff /> : <Icon.Eye />}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Forgot Password — enter email
───────────────────────────────────────────── */
function ForgotPasswordForm() {
  const navigate      = useNavigate();
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [alert,   setAlert]   = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setAlert(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) return (
    <div style={{ textAlign: "center" }}>
      <div className="rp-confirm-icon">✉️</div>
      <p className="rp-confirm-title">Check your inbox</p>
      <p className="rp-confirm-body">
        If <strong style={{ color: "#184f46" }}>{email}</strong> is registered,
        we've sent a reset link valid for <strong>60 minutes</strong>.
        <br /><br />
        Check your spam folder if you don't see it.
      </p>
      <button className="rp-btn" onClick={() => navigate("/auth")}>
        Back to Sign In
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <p className="rp-title">Forgot password?</p>
      <p className="rp-subtitle">Enter your email and we'll send you a reset link</p>

      {alert && <div className="rp-alert rp-alert-error">{alert}</div>}

      <div className="rp-field">
        <label className="rp-label">Email Address</label>
        <div className="rp-input-wrap">
          <span className="rp-icon-left"><Icon.Mail /></span>
          <input
            type="email"
            className="rp-input"
            placeholder="hello@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <button type="submit" className="rp-btn" disabled={loading}>
        {loading ? "Sending…" : "Send Reset Link"}
      </button>

      <p className="rp-footer">
        <a
          href="#"
          className="rp-link"
          style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
          onClick={(e) => { e.preventDefault(); navigate("/auth"); }}
        >
          <Icon.ArrowLeft /> Back to Sign In
        </a>
      </p>
    </form>
  );
}

/* ─────────────────────────────────────────────
   Reset Password — enter new password
───────────────────────────────────────────── */
function ResetPasswordForm({ token, email }) {
  const navigate = useNavigate();
  const [form,     setForm]     = useState({ password: "", password_confirmation: "" });
  const [showPw,   setShowPw]   = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);
  const [alert,    setAlert]    = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const strength = getStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    if (form.password !== form.password_confirmation)
      return setAlert({ type: "error", message: "Passwords do not match." });
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

  if (done) return (
    <div style={{ textAlign: "center" }}>
      <div className="rp-confirm-icon">✅</div>
      <p className="rp-confirm-title">Password updated!</p>
      <p className="rp-confirm-body">
        Your password has been reset successfully.<br />
        You can now sign in with your new password.
      </p>
      <button className="rp-btn" onClick={() => navigate("/auth")}>
        Go to Sign In
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <p className="rp-title">New password</p>
      <p className="rp-subtitle">Choose a strong password for your account</p>

      {alert && <div className={`rp-alert rp-alert-${alert.type}`}>{alert.message}</div>}

      <div className="rp-field">
        <label className="rp-label">New Password</label>
        <PwField
          placeholder="Create a strong password"
          value={form.password}
          onChange={set("password")}
          show={showPw}
          onToggle={() => setShowPw(v => !v)}
        />
        {form.password && (
          <>
            <div className="rp-strength-track">
              <div className="rp-strength-fill" style={{ width: strength.width }} />
            </div>
            <p className="rp-hint">{strength.label}</p>
          </>
        )}
      </div>

      <div className="rp-field">
        <label className="rp-label">Confirm New Password</label>
        <PwField
          placeholder="Repeat your password"
          value={form.password_confirmation}
          onChange={set("password_confirmation")}
          show={showConf}
          onToggle={() => setShowConf(v => !v)}
        />
      </div>

      <button type="submit" className="rp-btn" disabled={loading}>
        {loading ? "Resetting…" : "Reset Password"}
      </button>

      <p className="rp-footer">
        <a
          href="#"
          className="rp-link"
          style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
          onClick={(e) => { e.preventDefault(); navigate("/auth"); }}
        >
          <Icon.ArrowLeft /> Back to Sign In
        </a>
      </p>
    </form>
  );
}

/* ─────────────────────────────────────────────
   Root export  (/forgot-password  &  /reset-password/:token)
───────────────────────────────────────────── */
export default function ResetPasswordPage() {
  const { token }      = useParams();
  const [searchParams] = useSearchParams();
  const email          = searchParams.get("email");

  return (
    <>
      <style>{styles}</style>
      <div className="rp-root">
        <div className="rp-bg-grid" />
        <div className="rp-orb1" />
        <div className="rp-orb2" />

        <div className="rp-col">
          {/* Logo */}
          <div className="rp-logo">
            <div className="rp-logo-badge">✦</div>
            <span className="rp-logo-name">GlowSkin</span>
          </div>

          {/* Card */}
          <div className="rp-card">
            {token && email
              ? <ResetPasswordForm token={token} email={email} />
              : <ForgotPasswordForm />
            }
          </div>
        </div>
      </div>
    </>
  );
}