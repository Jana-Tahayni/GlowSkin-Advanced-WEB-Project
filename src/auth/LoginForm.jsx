import { useState } from "react";
import api from "../api";
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Jost:wght@300;400;500&display=swap');

  .glow-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    background: linear-gradient(160deg, #FAF0EB 0%, #F2E4DA 50%, #EDD8CE 100%);
    position: relative;
    overflow: hidden;
  }
  .glow-wrapper::before {
    content: '';
    position: absolute;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(232,180,168,0.25) 0%, transparent 70%);
    top: -100px; right: -100px;
    pointer-events: none;
  }
  .glow-wrapper::after {
    content: '';
    position: absolute;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(200,137,110,0.14) 0%, transparent 70%);
    bottom: -80px; left: -80px;
    pointer-events: none;
  }
  .glow-brand { text-align: center; margin-bottom: 1.75rem; position: relative; z-index: 2; }
  .glow-brand-icon {
    width: 56px; height: 56px;
    background: linear-gradient(135deg, #E8B4A8 0%, #C8896E 100%);
    border-radius: 50%;
    margin: 0 auto 0.7rem;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 24px rgba(200,137,110,0.38);
  }
  .glow-brand-icon svg { width: 28px; height: 28px; fill: white; }
  .glow-brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px; font-weight: 600;
    color: #8B4D3A;
    letter-spacing: 4px; text-transform: uppercase;
    margin: 0;
  }
  .glow-brand-tagline {
    font-family: 'Jost', sans-serif;
    font-size: 11px; font-weight: 300;
    color: #9C7B72;
    letter-spacing: 2px; text-transform: uppercase;
    margin: 0;
  }
  .glow-card {
    background: rgba(255,255,255,0.80);
    backdrop-filter: blur(18px);
    border-radius: 22px;
    border: 1px solid rgba(232,180,168,0.38);
    padding: 2.25rem 2.25rem 2rem;
    width: 100%; max-width: 430px;
    position: relative; z-index: 2;
    box-shadow: 0 8px 48px rgba(139,77,58,0.09);
  }
  .glow-tabs {
    display: flex;
    background: #F2EAE4;
    border-radius: 11px;
    padding: 4px;
    margin-bottom: 1.85rem;
  }
  .glow-tab {
    flex: 1; border: none; background: transparent;
    padding: 9px 0;
    border-radius: 9px;
    font-family: 'Jost', sans-serif;
    font-size: 13px; font-weight: 500;
    letter-spacing: 0.5px;
    color: #9C7B72;
    cursor: pointer;
    transition: all 0.25s ease;
  }
  .glow-tab.active {
    background: white;
    color: #8B4D3A;
    box-shadow: 0 2px 10px rgba(139,77,58,0.13);
  }
  .glow-label {
    font-family: 'Jost', sans-serif;
    font-size: 11px; font-weight: 500;
    letter-spacing: 1px; text-transform: uppercase;
    color: #9C7B72;
    display: block;
    margin-bottom: 5px;
  }
  .glow-input {
    width: 100%;
    border: 1px solid rgba(200,137,110,0.28);
    border-radius: 11px;
    padding: 10px 40px 10px 14px;
    font-family: 'Jost', sans-serif;
    font-size: 14px;
    color: #3D1F14;
    background: rgba(250,246,243,0.65);
    transition: all 0.2s;
    outline: none;
  }
  .glow-input:focus {
    border-color: #C8896E;
    box-shadow: 0 0 0 3px rgba(200,137,110,0.13);
    background: white;
  }
  .glow-input::placeholder { color: rgba(156,123,114,0.5); }
  .glow-input-wrap { position: relative; }
  .glow-input-icon {
    position: absolute; right: 12px; top: 50%;
    transform: translateY(-50%);
    color: #E8B4A8; font-size: 13px;
    cursor: pointer; user-select: none;
  }
  .glow-btn {
    width: 100%; padding: 12px;
    border: none; border-radius: 11px;
    background: linear-gradient(135deg, #C8896E 0%, #8B4D3A 100%);
    color: white;
    font-family: 'Jost', sans-serif;
    font-size: 13px; font-weight: 500;
    letter-spacing: 1.5px; text-transform: uppercase;
    cursor: pointer;
    transition: all 0.25s;
    box-shadow: 0 4px 18px rgba(139,77,58,0.3);
    margin-top: 4px;
  }
  .glow-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 28px rgba(139,77,58,0.4);
  }
  .glow-btn:active { transform: translateY(0); }
  .glow-divider {
    display: flex; align-items: center; gap: 10px;
    margin: 1.2rem 0;
  }
  .glow-divider-line {
    flex: 1; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(200,137,110,0.22), transparent);
  }
  .glow-divider-text {
    font-family: 'Jost', sans-serif;
    font-size: 11px; font-weight: 300;
    letter-spacing: 1px; text-transform: uppercase;
    color: #9C7B72; margin: 0;
  }
  .glow-social {
    display: flex; align-items: center; justify-content: center; gap: 9px;
    width: 100%; padding: 11px;
    border: 1px solid rgba(200,137,110,0.26);
    border-radius: 11px;
    background: white;
    color: #3D1F14;
    font-family: 'Jost', sans-serif;
    font-size: 13px; font-weight: 400;
    cursor: pointer;
    transition: all 0.2s;
  }
  .glow-social:hover { border-color: #C8896E; background: #FAF6F3; }
  .glow-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 23px; font-weight: 500;
    color: #8B4D3A; margin: 0 0 3px;
  }
  .glow-section-sub {
    font-family: 'Jost', sans-serif;
    font-size: 12px; color: #9C7B72; font-weight: 300;
    margin-bottom: 1.5rem;
  }
  .glow-link { color: #C8896E; text-decoration: none; }
  .glow-link:hover { color: #8B4D3A; }
  .glow-strength-bar {
    height: 3px; border-radius: 2px;
    background: #F2EAE4; margin-top: 6px; overflow: hidden;
  }
  .glow-strength-fill {
    height: 100%; border-radius: 2px;
    background: linear-gradient(90deg, #E8B4A8, #C8896E);
    transition: width 0.4s ease;
  }
  .glow-hint {
    font-family: 'Jost', sans-serif;
    font-size: 11px; color: #9C7B72;
    margin-top: 4px; padding-left: 2px;
  }
  .glow-footer {
    text-align: center; margin-top: 1.25rem; margin-bottom: 0;
    font-family: 'Jost', sans-serif;
    font-size: 12px; color: #9C7B72;
  }
`;

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function DropIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C9.5 5 7 8 7 11a5 5 0 0010 0c0-3-2.5-6-5-9zM9 17.5C9 19.4 10.3 21 12 21s3-1.6 3-3.5c0-1.5-1-3-3-4-2 1-3 2.5-3 4z"/>
    </svg>
  );
}

function getStrength(val) {
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const widths = ["0%", "25%", "50%", "75%", "100%"];
  const labels = ["", "Weak password", "Fair password", "Good password", "Strong password"];
  return { width: widths[score], label: score > 0 ? labels[score] : "Use 8+ characters with letters and numbers" };
}

function LoginForm({ onSwitch }) {
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", remember: false });

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await api.post('/auth/login', {
      email: form.email,
      password: form.password
    });
    
    // Save the token (assuming Laravel returns { access_token: "..." })
    localStorage.setItem('token', response.data.access_token);
    alert("Login Successful!");
    
    // Redirect user or update app state here
  } catch (error) {
    alert(error.response?.data?.message || "Login failed");
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <p className="glow-section-title">Welcome back</p>
      <p className="glow-section-sub">Your glow journey continues</p>

      <div className="mb-3">
        <label className="glow-label">Email address</label>
        <div className="glow-input-wrap">
          <input
            type="email" className="glow-input"
            placeholder="you@example.com" required
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <span className="glow-input-icon">✦</span>
        </div>
      </div>

      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <label className="glow-label">Password</label>
          <a href="#" className="glow-link" style={{ fontSize: 11 }}>Forgot password?</a>
        </div>
        <div className="glow-input-wrap">
          <input
            id="login-pw" type={showPw ? "text" : "password"}
            className="glow-input" placeholder="••••••••" required
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <span className="glow-input-icon" onClick={() => setShowPw(!showPw)}>
            {showPw ? "🙈" : "👁"}
          </span>
        </div>
      </div>

      <div className="form-check mb-3">
        <input
          type="checkbox" className="form-check-input" id="remember"
          checked={form.remember}
          onChange={e => setForm({ ...form, remember: e.target.checked })}
        />
        <label className="form-check-label" htmlFor="remember" style={{ fontSize: 12, color: "#9C7B72" }}>
          Remember me for 30 days
        </label>
      </div>

      <button type="submit" className="glow-btn">Sign In</button>

      <div className="glow-divider">
        <div className="glow-divider-line" />
        <p className="glow-divider-text">or continue with</p>
        <div className="glow-divider-line" />
      </div>

      <button type="button" className="glow-social">
        <GoogleIcon /> Continue with Google
      </button>

      <p className="glow-footer">
        Don't have an account?{" "}
        <a href="#" className="glow-link" onClick={e => { e.preventDefault(); onSwitch(); }}>
          Create one
        </a>
      </p>
    </form>
  );
}

function RegisterForm({ onSwitch }) {
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    password: "", confirm: "", terms: false
  });

  const strength = getStrength(form.password);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (form.password !== form.confirm) return alert("Passwords do not match.");

  try {
    const response = await api.post('/auth/register', {
      name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      password: form.password,
      password_confirmation: form.confirm // Laravel usually expects this
    });

    alert("Registration Successful! Please Login.");
    onSwitch(); // Switch to login tab
  } catch (error) {
    alert(error.response?.data?.message || "Registration failed");
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <p className="glow-section-title">Start glowing</p>
      <p className="glow-section-sub">Join thousands on their skin journey</p>

      <div className="row g-3 mb-3">
        <div className="col-6">
          <label className="glow-label">First name</label>
          <input type="text" className="glow-input" placeholder="Amara" required
            value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
        </div>
        <div className="col-6">
          <label className="glow-label">Last name</label>
          <input type="text" className="glow-input" placeholder="Chen" required
            value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
        </div>
      </div>

      <div className="mb-3">
        <label className="glow-label">Email address</label>
        <div className="glow-input-wrap">
          <input type="email" className="glow-input" placeholder="you@example.com" required
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <span className="glow-input-icon">✦</span>
        </div>
      </div>

      <div className="mb-3">
        <label className="glow-label">Password</label>
        <div className="glow-input-wrap">
          <input type={showPw ? "text" : "password"} className="glow-input"
            placeholder="••••••••" required
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          <span className="glow-input-icon" onClick={() => setShowPw(!showPw)}>
            {showPw ? "🙈" : "👁"}
          </span>
        </div>
        <div className="glow-strength-bar">
          <div className="glow-strength-fill" style={{ width: strength.width }} />
        </div>
        <p className="glow-hint">{strength.label}</p>
      </div>

      <div className="mb-3">
        <label className="glow-label">Confirm password</label>
        <div className="glow-input-wrap">
          <input type={showConfirm ? "text" : "password"} className="glow-input"
            placeholder="••••••••" required
            value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
          <span className="glow-input-icon" onClick={() => setShowConfirm(!showConfirm)}>
            {showConfirm ? "🙈" : "👁"}
          </span>
        </div>
      </div>

      <div className="form-check mb-3">
        <input type="checkbox" className="form-check-input" id="terms"
          checked={form.terms} onChange={e => setForm({ ...form, terms: e.target.checked })} />
        <label className="form-check-label" htmlFor="terms" style={{ fontSize: 12, color: "#9C7B72" }}>
          I agree to the <a href="#" className="glow-link">Terms of Service</a> and{" "}
          <a href="#" className="glow-link">Privacy Policy</a>
        </label>
      </div>

      <button type="submit" className="glow-btn">Create My Account</button>

      <div className="glow-divider">
        <div className="glow-divider-line" />
        <p className="glow-divider-text">or sign up with</p>
        <div className="glow-divider-line" />
      </div>

      <button 
  type="button" 
  className="glow-social"
  onClick={() => window.location.href = 'http://127.0.0.1:8000/api/auth/google'}
>
  <GoogleIcon /> Continue with Google
</button>

      <p className="glow-footer">
        Already have an account?{" "}
        <a href="#" className="glow-link" onClick={e => { e.preventDefault(); onSwitch(); }}>
          Sign in
        </a>
      </p>
    </form>
  );
}

export default function GlowAuth() {
  const [tab, setTab] = useState("login");

  return (
    <>
      <style>{styles}</style>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <div className="glow-wrapper">
        <div className="glow-brand">
          <div className="glow-brand-icon">
            <DropIcon />
          </div>
          <p className="glow-brand-name">Glow</p>
          <p className="glow-brand-tagline">Radiant skin, naturally</p>
        </div>

        <div className="glow-card">
          <div className="glow-tabs">
            <button
              className={`glow-tab${tab === "login" ? " active" : ""}`}
              onClick={() => setTab("login")}
            >
              Sign In
            </button>
            <button
              className={`glow-tab${tab === "register" ? " active" : ""}`}
              onClick={() => setTab("register")}
            >
              Create Account
            </button>
          </div>

          {tab === "login" ? (
            <LoginForm onSwitch={() => setTab("register")} />
          ) : (
            <RegisterForm onSwitch={() => setTab("login")} />
          )}
        </div>
      </div>
    </>
  );
}