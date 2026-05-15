import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

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

  .gs-root {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 46% 1fr;
    font-family: 'DM Sans', sans-serif;
    background: var(--cream-100);
  }

  /* Left hero */
  .gs-left {
    position: relative;
    min-height: 100vh;
    background: var(--teal-700);
    padding: 2.5rem 3rem 3rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .gs-left-orb1 {
    position: absolute; width: 420px; height: 420px; border-radius: 50%;
    background: radial-gradient(circle at 40% 40%, rgba(63,160,140,.22) 0%, transparent 70%);
    top: -80px; right: -140px; pointer-events: none;
  }
  .gs-left-orb2 {
    position: absolute; width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle at 60% 60%, rgba(143,207,195,.12) 0%, transparent 70%);
    bottom: 40px; left: -80px; pointer-events: none;
  }
  .gs-left-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  .gs-logo {
    display: flex; align-items: center; gap: 11px;
    margin-bottom: 4rem;
    position: relative; z-index: 2;
  }
  .gs-logo-badge {
    width: 42px; height: 42px; border-radius: 12px;
    background: rgba(255,255,255,.12);
    border: 1px solid rgba(255,255,255,.18);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; backdrop-filter: blur(6px);
  }
  .gs-logo-name {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 600;
    color: white; letter-spacing: .3px;
  }

  .gs-hero {
    flex: 1; display: flex; flex-direction: column;
    justify-content: center; position: relative; z-index: 2;
  }
  .gs-pill {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,.1);
    border: 1px solid rgba(255,255,255,.16);
    border-radius: 999px; padding: 5px 14px;
    font-size: 11px; font-weight: 500;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--teal-200); margin-bottom: 1.4rem; width: fit-content;
  }
  .gs-pill-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--teal-200); }
  .gs-hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(30px, 3.2vw, 46px); font-weight: 700;
    color: white; line-height: 1.15; margin-bottom: 1.4rem;
  }
  .gs-hero-title em { font-style: italic; color: var(--teal-200); }
  .gs-hero-body {
    font-size: 14px; font-weight: 300; color: rgba(255,255,255,.65);
    line-height: 1.85; max-width: 330px; margin-bottom: 2.5rem;
  }

  .gs-features { display: flex; flex-direction: column; gap: 10px; margin-bottom: 2.75rem; }
  .gs-feature { display: flex; align-items: center; gap: 13px; }
  .gs-feature-dot {
    width: 32px; height: 32px; border-radius: 9px;
    background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0;
  }
  .gs-feature-text { font-size: 13px; font-weight: 400; color: rgba(255,255,255,.75); }

  .gs-quote {
    background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12);
    border-left: 3px solid var(--teal-200);
    border-radius: 0 var(--radius-md) var(--radius-md) 0; padding: 1.1rem 1.4rem;
  }
  .gs-quote-text {
    font-family: 'Playfair Display', serif; font-style: italic;
    font-size: 13px; color: rgba(255,255,255,.8); line-height: 1.7; margin-bottom: 8px;
  }
  .gs-quote-author { font-size: 11px; font-weight: 500; letter-spacing: .5px; color: var(--teal-200); }

  /* Right form */
  .gs-right {
    display: flex; align-items: center; justify-content: center;
    padding: 2.5rem 2.5rem; background: var(--cream-50);
    min-height: 100vh; position: relative;
  }
  .gs-right::before {
    content: ''; position: absolute; bottom: 0; right: 0;
    width: 280px; height: 280px;
    background: radial-gradient(circle at 80% 80%, var(--cream-200) 0%, transparent 70%);
    pointer-events: none;
  }

  .gs-form-scroll { width: 100%; max-width: 420px; position: relative; z-index: 1; }

  /* Tabs */
  .gs-tabs {
    display: flex; background: var(--cream-200);
    border-radius: var(--radius-sm); padding: 4px;
    margin-bottom: 2.25rem; gap: 2px;
  }
  .gs-tab {
    flex: 1; border: none; background: transparent;
    padding: 9px 0; border-radius: 7px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    letter-spacing: .3px; color: var(--muted); cursor: pointer;
    transition: all .22s var(--ease);
  }
  .gs-tab.active {
    background: white; color: var(--teal-700);
    box-shadow: 0 1px 6px rgba(16,56,48,.12);
  }

  /* Typography */
  .gs-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 600;
    color: var(--warm-text); margin-bottom: 5px; line-height: 1.2;
  }
  .gs-subtitle { font-size: 13px; font-weight: 300; color: var(--muted); margin-bottom: 1.75rem; }

  /* Fields */
  .gs-field { margin-bottom: 1rem; }
  .gs-field-row { display: flex; gap: 12px; margin-bottom: 1rem; }
  .gs-field-row .gs-field { flex: 1; margin-bottom: 0; }

  .gs-label {
    display: block; font-size: 11.5px; font-weight: 500;
    letter-spacing: .9px; text-transform: uppercase; color: #5a7570; margin-bottom: 6px;
  }
  .gs-label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .gs-label-row .gs-label { margin-bottom: 0; }

  .gs-input-wrap { position: relative; }
  .gs-icon-left {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    color: var(--cream-400); pointer-events: none; display: flex;
  }
  .gs-icon-right {
    position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
    color: var(--cream-400); cursor: pointer; display: flex; transition: color .2s;
  }
  .gs-icon-right:hover { color: var(--teal-600); }

  .gs-input {
    width: 100%; padding: 11px 40px;
    border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    background: var(--input-bg);
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--warm-text);
    outline: none; transition: all .22s var(--ease); -webkit-appearance: none;
  }
  .gs-input:focus {
    border-color: var(--teal-400); background: white;
    box-shadow: 0 0 0 3.5px rgba(63,160,140,.1);
  }
  .gs-input::placeholder { color: #c2bdb5; }
  .gs-input:hover:not(:focus) { border-color: #c4bdb2; }

  .gs-forgot { font-size: 12px; font-weight: 500; color: var(--teal-600); text-decoration: none; transition: color .2s; }
  .gs-forgot:hover { color: var(--teal-800); }

  .gs-checkbox-row { display: flex; align-items: center; gap: 9px; margin-bottom: 1.35rem; }
  .gs-checkbox-row input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--teal-600); cursor: pointer; }
  .gs-checkbox-row label { font-size: 12.5px; color: var(--muted); cursor: pointer; line-height: 1.5; }

  .gs-strength-track { height: 3px; background: var(--cream-200); border-radius: 2px; margin-top: 8px; overflow: hidden; }
  .gs-strength-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, var(--teal-200), var(--teal-600)); transition: width .4s ease; }
  .gs-hint { font-size: 11.5px; color: var(--muted); margin-top: 5px; }

  /* Buttons */
  .gs-btn {
    width: 100%; padding: 13px; border: none;
    border-radius: var(--radius-sm); background: var(--teal-700);
    color: white; font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500; letter-spacing: .5px;
    cursor: pointer; transition: all .22s var(--ease);
  }
  .gs-btn:hover:not(:disabled) { background: var(--teal-800); }
  .gs-btn:active:not(:disabled) { transform: scale(.99); }
  .gs-btn:disabled { opacity: .55; cursor: not-allowed; }

  .gs-btn-outline {
    width: 100%; padding: 12px;
    border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    background: white; color: var(--warm-text);
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 400;
    cursor: pointer; transition: all .22s var(--ease); margin-top: 10px;
  }
  .gs-btn-outline:hover { background: var(--cream-100); border-color: #c4bdb2; }

  .gs-social-btn {
    width: 100%; padding: 12px;
    border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    background: white; display: flex; align-items: center; justify-content: center; gap: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 400;
    color: var(--warm-text); cursor: pointer; transition: all .22s var(--ease);
  }
  .gs-social-btn:hover { border-color: var(--teal-400); background: var(--cream-50); }

  .gs-divider { display: flex; align-items: center; gap: 12px; margin: 1.25rem 0; }
  .gs-divider hr { flex: 1; border: none; border-top: 1px solid var(--border); }
  .gs-divider-text { font-size: 11.5px; letter-spacing: 1px; text-transform: uppercase; color: var(--cream-400); white-space: nowrap; }

  .gs-footer { text-align: center; margin-top: 1.5rem; font-size: 13px; color: var(--muted); }
  .gs-link { color: var(--teal-600); text-decoration: none; font-weight: 500; }
  .gs-link:hover { color: var(--teal-800); text-decoration: underline; }

  .gs-alert { border-radius: var(--radius-sm); padding: 11px 14px; margin-bottom: 1.1rem; font-size: 13px; line-height: 1.55; }
  .gs-alert-error   { background: #fdf0ef; border: 1px solid #f0c4be; color: #7a2a20; }
  .gs-alert-success { background: #edf7f4; border: 1px solid #b0ddd0; color: #1a4f3e; }
  .gs-alert-info    { background: #edf3f7; border: 1px solid #b8d4e4; color: #1e3e4d; }

  .gs-confirm-icon {
    width: 68px; height: 68px; border-radius: 50%;
    background: linear-gradient(135deg, var(--teal-100), var(--teal-400));
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.25rem; font-size: 28px;
    box-shadow: 0 6px 28px rgba(31,107,94,.22);
  }
  .gs-confirm-title { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 600; color: var(--warm-text); text-align: center; margin-bottom: 10px; }
  .gs-confirm-body { font-size: 13px; font-weight: 300; color: var(--muted); text-align: center; line-height: 1.8; margin-bottom: 1.75rem; }

  /* Verify page */
  .gs-verify-root {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--cream-100); padding: 2rem; font-family: 'DM Sans', sans-serif;
  }
  .gs-verify-card {
    background: white; border-radius: var(--radius-lg); border: 1px solid var(--border);
    padding: 2.75rem 2rem; width: 100%; max-width: 400px;
    box-shadow: 0 4px 40px rgba(16,56,48,.07);
  }
  .gs-verify-logo { display: flex; align-items: center; gap: 9px; justify-content: center; margin-bottom: 2rem; }
  .gs-verify-logo-badge { width: 36px; height: 36px; border-radius: 10px; background: var(--teal-700); display: flex; align-items: center; justify-content: center; font-size: 17px; }
  .gs-verify-logo-name { font-family: 'Playfair Display', serif; font-size: 19px; font-weight: 600; color: var(--warm-text); }

  /* ─── Responsive ─── */
  @media (max-width: 960px) {
    .gs-root { grid-template-columns: 1fr; }
    .gs-left { min-height: auto; padding: 2rem 2rem 2.25rem; }
    .gs-logo { margin-bottom: 2rem; }
    .gs-hero-title { font-size: 28px; }
    .gs-hero-body { margin-bottom: 1.5rem; }
    .gs-features, .gs-quote { display: none; }
    .gs-right { min-height: auto; padding: 2rem 1.75rem 3rem; align-items: flex-start; }
  }
  @media (max-width: 500px) {
    .gs-left { padding: 1.5rem 1.25rem 1.75rem; }
    .gs-hero-title { font-size: 24px; }
    .gs-right { padding: 1.75rem 1.25rem 2.5rem; }
    .gs-field-row { flex-direction: column; gap: 0; }
    .gs-field-row .gs-field { margin-bottom: 1rem; }
    .gs-title { font-size: 24px; }
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
  User: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4"/>
      <path d="M5.5 21a8.38 8.38 0 0 1 13 0"/>
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
  Google: () => (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  ),
};

/* ─────────────────────────────────────────────
   Shared helpers
───────────────────────────────────────────── */
function Alert({ type = "error", children }) {
  return <div className={`gs-alert gs-alert-${type}`}>{children}</div>;
}

function getStrength(val) {
  let s = 0;
  if (val.length >= 8)          s++;
  if (/[A-Z]/.test(val))        s++;
  if (/[0-9]/.test(val))        s++;
  if (/[^A-Za-z0-9]/.test(val)) s++;
  return {
    width: ["0%","25%","50%","75%","100%"][s],
    label: ["","Weak — add uppercase & numbers","Fair — add a symbol","Good — almost there","Strong password"][s],
  };
}

async function redirectToGoogle() {
  window.location.href = "http://localhost:8000/api/auth/google/redirect";
}

function PwField({ placeholder, value, onChange, show, onToggle }) {
  return (
    <div className="gs-input-wrap">
      <span className="gs-icon-left"><Icon.Lock /></span>
      <input
        type={show ? "text" : "password"}
        className="gs-input"
        placeholder={placeholder}
        required
        value={value}
        onChange={onChange}
      />
      <span className="gs-icon-right" onClick={onToggle}>
        {show ? <Icon.EyeOff /> : <Icon.Eye />}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Left hero panel
───────────────────────────────────────────── */
function LeftPanel() {
  return (
    <div className="gs-left">
      <div className="gs-left-grid" />
      <div className="gs-left-orb1" />
      <div className="gs-left-orb2" />
      <div className="gs-logo">
        <div className="gs-logo-badge">✦</div>
        <span className="gs-logo-name">GlowSkin</span>
      </div>
      <div className="gs-hero">
        <div className="gs-pill">
          <span className="gs-pill-dot" />
          AI-Powered Skincare
        </div>
        <h1 className="gs-hero-title">
          Discover Your<br />
          Perfect <em>Glow</em>
        </h1>
        <p className="gs-hero-body">
          Join thousands who have transformed their skincare routine with
          personalized recommendations powered by advanced skin analysis.
        </p>
        <div className="gs-features">
          {[["✦","Personalized skincare routines"],["⚡","AI-powered skin analysis"],["◷","Track your skin progress"]].map(([icon, text]) => (
            <div className="gs-feature" key={text}>
              <div className="gs-feature-dot">{icon}</div>
              <span className="gs-feature-text">{text}</span>
            </div>
          ))}
        </div>
        <div className="gs-quote">
          <p className="gs-quote-text">"GlowSkin completely changed my skincare game. My skin has never looked better!"</p>
          <p className="gs-quote-author">— Sarah M., verified user</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Email Sent Screen
───────────────────────────────────────────── */
function EmailSentScreen({ email, onResend, onBackToLogin, loading }) {
  return (
    <div>
      <div className="gs-confirm-icon">✉️</div>
      <p className="gs-confirm-title">Check your inbox</p>
      <p className="gs-confirm-body">
        We sent a verification link to<br />
        <strong style={{ color: "#184f46" }}>{email}</strong><br />
        The link expires in 15 minutes.<br /><br />
        Didn't get it? Check your spam folder or resend below.
      </p>
      <button className="gs-btn" onClick={onResend} disabled={loading}>
        {loading ? "Sending…" : "Resend Verification Email"}
      </button>
      <button className="gs-btn-outline" onClick={onBackToLogin}>Back to Sign In</button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Login Form
───────────────────────────────────────────── */
function LoginForm({ onSwitch, onSwitchWithEmail }) {
  const navigate = useNavigate();
  const [showPw,        setShowPw]        = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [pendingEmail,  setPendingEmail]  = useState(null);
  const [alert,         setAlert]         = useState(null);
  const [form,          setForm]          = useState({ email: "", password: "", remember: false });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setAlert(null); setLoading(true);
    try {
      const { data: { data: { access_token, user } } } = await api.post("/auth/login", { email: form.email, password: form.password });
      localStorage.setItem("token", access_token);
      localStorage.setItem("user",  JSON.stringify(user));
      navigate("/analyzer");
    } catch (err) {
      const data = err.response?.data; const status = err.response?.status;
      if (status === 404 && data?.action === "register")
        setAlert({ type: "info", message: data.message, action: "register", email: data.email });
      else if (status === 403 && data?.action === "resend_verification") {
        setPendingEmail(data.email);
        setAlert({ type: "info", message: data.message, action: "resend" });
      } else
        setAlert({ type: "error", message: data?.message || "Login failed. Please try again." });
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (!pendingEmail) return;
    setResendLoading(true);
    try {
      await api.post("/auth/resend-verification", { email: pendingEmail });
      setAlert({ type: "success", message: "A new verification link has been sent to your email." });
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to resend." });
    } finally { setResendLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p className="gs-title">Welcome Back</p>
      <p className="gs-subtitle">Sign in to continue your skincare journey</p>

      {alert && (
        <Alert type={alert.type}>
          {alert.message}
          {alert.action === "register" && <> {" "}<a href="#" className="gs-link" onClick={(e) => { e.preventDefault(); onSwitchWithEmail(alert.email); }}>Sign up for free →</a></>}
          {alert.action === "resend" && <> {" "}<a href="#" className="gs-link" onClick={(e) => { e.preventDefault(); handleResend(); }}>{resendLoading ? "Sending…" : "Resend link →"}</a></>}
        </Alert>
      )}

      <div className="gs-field">
        <label className="gs-label">Email Address</label>
        <div className="gs-input-wrap">
          <span className="gs-icon-left"><Icon.Mail /></span>
          <input type="email" className="gs-input" placeholder="hello@example.com" required value={form.email} onChange={set("email")} />
        </div>
      </div>

      <div className="gs-field">
        <div className="gs-label-row">
          <label className="gs-label">Password</label>
          <a href="#" className="gs-forgot" onClick={(e) => { e.preventDefault(); navigate("/forgot-password"); }}>Forgot password?</a>
        </div>
        <PwField placeholder="Enter your password" value={form.password} onChange={set("password")} show={showPw} onToggle={() => setShowPw(v => !v)} />
      </div>

      <div className="gs-checkbox-row">
        <input type="checkbox" id="remember" checked={form.remember} onChange={(e) => setForm(f => ({ ...f, remember: e.target.checked }))} />
        <label htmlFor="remember">Remember me for 30 days</label>
      </div>

      <button type="submit" className="gs-btn" disabled={loading}>{loading ? "Signing in…" : "Sign In"}</button>

      <div className="gs-divider"><hr /><span className="gs-divider-text">or continue with</span><hr /></div>
     <a href="http://localhost:8000/api/auth/google/redirect" className="gs-social-btn"><Icon.Google /> Continue with Google</a>

      <p className="gs-footer">Don't have an account? <a href="#" className="gs-link" onClick={(e) => { e.preventDefault(); onSwitch(); }}>Sign up for free</a></p>
    </form>
  );
}

/* ─────────────────────────────────────────────
   Register Form
───────────────────────────────────────────── */
function RegisterForm({ onSwitch, initialEmail = "" }) {
  const [showPw,        setShowPw]        = useState(false);
  const [showConfirm,   setShowConfirm]   = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [registered,    setRegistered]    = useState(false);
  const [alert,         setAlert]         = useState(null);
  const [form,          setForm]          = useState({ first_name: "", last_name: "", email: initialEmail, password: "", password_confirmation: "", terms: false });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const strength = getStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault(); setAlert(null);
    if (form.password !== form.password_confirmation) return setAlert({ type: "error", message: "Passwords do not match." });
    if (!form.terms) return setAlert({ type: "error", message: "You must agree to the terms to continue." });
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      setRegistered(true);
    } catch (err) {
      const data = err.response?.data;
      setAlert({ type: "error", message: data?.errors ? Object.values(data.errors).flat().join(" ") : data?.message || "Registration failed." });
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await api.post("/auth/resend-verification", { email: form.email });
      setAlert({ type: "success", message: "A new verification link has been sent." });
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to resend." });
    } finally { setResendLoading(false); }
  };

  if (registered) return (
    <>{alert && <Alert type={alert.type}>{alert.message}</Alert>}
    <EmailSentScreen email={form.email} loading={resendLoading} onResend={handleResend} onBackToLogin={onSwitch} /></>
  );

  return (
    <form onSubmit={handleSubmit}>
      <p className="gs-title">Create Account</p>
      <p className="gs-subtitle">Join thousands on their skin journey</p>
      {alert && <Alert type={alert.type}>{alert.message}</Alert>}

      <div className="gs-field-row">
        <div className="gs-field">
          <label className="gs-label">First name</label>
          <div className="gs-input-wrap">
            <span className="gs-icon-left"><Icon.User /></span>
            <input type="text" className="gs-input" placeholder="Amara" required value={form.first_name} onChange={set("first_name")} />
          </div>
        </div>
        <div className="gs-field">
          <label className="gs-label">Last name</label>
          <div className="gs-input-wrap">
            <span className="gs-icon-left"><Icon.User /></span>
            <input type="text" className="gs-input" placeholder="Chen" required value={form.last_name} onChange={set("last_name")} />
          </div>
        </div>
      </div>

      <div className="gs-field">
        <label className="gs-label">Email Address</label>
        <div className="gs-input-wrap">
          <span className="gs-icon-left"><Icon.Mail /></span>
          <input type="email" className="gs-input" placeholder="you@example.com" required value={form.email} onChange={set("email")} />
        </div>
      </div>

      <div className="gs-field">
        <label className="gs-label">Password</label>
        <PwField placeholder="Create a strong password" value={form.password} onChange={set("password")} show={showPw} onToggle={() => setShowPw(v => !v)} />
        {form.password && (
          <><div className="gs-strength-track"><div className="gs-strength-fill" style={{ width: strength.width }} /></div>
          <p className="gs-hint">{strength.label}</p></>
        )}
      </div>

      <div className="gs-field">
        <label className="gs-label">Confirm Password</label>
        <PwField placeholder="Repeat your password" value={form.password_confirmation} onChange={set("password_confirmation")} show={showConfirm} onToggle={() => setShowConfirm(v => !v)} />
      </div>

      <div className="gs-checkbox-row" style={{ marginBottom: "1.35rem" }}>
        <input type="checkbox" id="terms" checked={form.terms} onChange={(e) => setForm(f => ({ ...f, terms: e.target.checked }))} />
        <label htmlFor="terms">I agree to the <a href="#" className="gs-link">Terms of Service</a> and <a href="#" className="gs-link">Privacy Policy</a></label>
      </div>

      <button type="submit" className="gs-btn" disabled={loading}>{loading ? "Creating account…" : "Create My Account"}</button>

      <div className="gs-divider"><hr /><span className="gs-divider-text">or sign up with</span><hr /></div>
      <button type="button" className="gs-social-btn" onClick={redirectToGoogle}><Icon.Google /> Continue with Google</button>

      <p className="gs-footer">Already have an account? <a href="#" className="gs-link" onClick={(e) => { e.preventDefault(); onSwitch(); }}>Sign in</a></p>
    </form>
  );
}

/* ─────────────────────────────────────────────
   Verify Email Page  (/verify/:token)
───────────────────────────────────────────── */
export function VerifyEmailPage() {
  const navigate  = useNavigate();
  const { token } = useParams();
  const [status,  setStatus]  = useState("loading");
  const [message, setMessage] = useState("");
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    if (!token) { setStatus("invalid"); setMessage("No verification token found."); return; }

    (async () => {
      try {
        const { data } = await api.get(`/auth/verify/${token}`);
        if (data.data?.access_token) {
          localStorage.setItem("token", data.data.access_token);
          localStorage.setItem("user",  JSON.stringify(data.data.user));
        }
        setStatus("success"); setMessage(data.message);
      } catch (err) {
        const data = err.response?.data; const status = err.response?.status;
        if (status === 410) {
          setStatus(data?.message?.includes("new one has been sent") ? "resent" : "expired");
          setMessage(data?.message || "Verification failed.");
        } else {
          setStatus("invalid");
          setMessage(data?.message || "Something went wrong. Please try again.");
        }
      }
    })();
  }, [token]);

  const cfg = {
    loading: { icon: "⏳", title: "Verifying your email…" },
    success: { icon: "✅", title: "Email verified!" },
    expired: { icon: "⛔", title: "Link expired" },
    resent:  { icon: "📧", title: "New link sent" },
    invalid: { icon: "❌", title: "Invalid link" },
  };

  return (
    <>
      <style>{styles}</style>
      <div className="gs-verify-root">
        <div className="gs-verify-card">
          <div className="gs-verify-logo">
            <div className="gs-verify-logo-badge">✦</div>
            <span className="gs-verify-logo-name">GlowSkin</span>
          </div>
          <div className="gs-confirm-icon">{cfg[status]?.icon}</div>
          <p className="gs-confirm-title">{cfg[status]?.title}</p>
          <p className="gs-confirm-body">{message || "Please wait…"}</p>
          {status === "success" && <button className="gs-btn" onClick={() => navigate("/analyzer")}>Go to Dashboard</button>}
          {(status === "expired" || status === "invalid") && <button className="gs-btn" onClick={() => navigate("/auth")}>Register Again</button>}
          {status === "resent" && <button className="gs-btn" onClick={() => navigate("/auth")}>Back to Sign In</button>}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Root export  (/auth)
───────────────────────────────────────────── */
export default function GlowAuth() {
  const [tab,          setTab]          = useState("login");
  const [prefillEmail, setPrefillEmail] = useState("");

  const switchToRegisterWithEmail = (email) => { setPrefillEmail(email); setTab("register"); };

  return (
    <>
      <style>{styles}</style>
      <div className="gs-root">
        <LeftPanel />
        <div className="gs-right">
          <div className="gs-form-scroll">
            <div className="gs-tabs">
              <button className={`gs-tab${tab === "login" ? " active" : ""}`} onClick={() => setTab("login")}>Sign In</button>
              <button className={`gs-tab${tab === "register" ? " active" : ""}`} onClick={() => setTab("register")}>Create Account</button>
            </div>
            {tab === "login"
              ? <LoginForm onSwitch={() => setTab("register")} onSwitchWithEmail={switchToRegisterWithEmail} />
              : <RegisterForm onSwitch={() => setTab("login")} initialEmail={prefillEmail} />}
          </div>
        </div>
      </div>
    </>
  );
}