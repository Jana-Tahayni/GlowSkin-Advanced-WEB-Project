import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

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
    --ease: cubic-bezier(.4,0,.2,1);
  }

  .gcb-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    background: var(--cream-100);
    position: relative;
    overflow: hidden;
  }

  /* Background grid */
  .gcb-bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(31,107,94,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(31,107,94,.04) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  /* Background orbs */
  .gcb-orb1 {
    position: absolute;
    width: 520px; height: 520px; border-radius: 50%;
    background: radial-gradient(circle at 40% 40%, rgba(63,160,140,.13) 0%, transparent 65%);
    top: -160px; right: -160px;
    pointer-events: none;
  }
  .gcb-orb2 {
    position: absolute;
    width: 380px; height: 380px; border-radius: 50%;
    background: radial-gradient(circle at 60% 60%, rgba(143,207,195,.1) 0%, transparent 65%);
    bottom: -100px; left: -100px;
    pointer-events: none;
  }
  .gcb-orb3 {
    position: absolute;
    width: 220px; height: 220px; border-radius: 50%;
    background: radial-gradient(circle, rgba(212,201,178,.25) 0%, transparent 70%);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  /* Card */
  .gcb-card {
    position: relative; z-index: 2;
    background: white;
    border: 1px solid rgba(212,201,178,.6);
    border-radius: 24px;
    padding: 3rem 2.75rem;
    width: 100%; max-width: 400px;
    box-shadow:
      0 4px 6px rgba(16,56,48,.04),
      0 12px 48px rgba(16,56,48,.08),
      0 1px 0 rgba(255,255,255,.8) inset;
    text-align: center;
    animation: gcb-fadeup .55s var(--ease) both;
  }

  @keyframes gcb-fadeup {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Logo */
  .gcb-logo {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    margin-bottom: 2.25rem;
    animation: gcb-fadeup .55s .08s var(--ease) both;
  }
  .gcb-logo-badge {
    width: 38px; height: 38px; border-radius: 11px;
    background: var(--teal-700);
    display: flex; align-items: center; justify-content: center;
    font-size: 17px;
    box-shadow: 0 4px 12px rgba(24,79,70,.3);
  }
  .gcb-logo-name {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 600;
    color: var(--warm-text); letter-spacing: .2px;
  }

  /* Spinner container */
  .gcb-spinner-wrap {
    width: 76px; height: 76px; margin: 0 auto 1.75rem;
    position: relative;
    animation: gcb-fadeup .5s .15s var(--ease) both;
  }

  /* Outer ring */
  .gcb-ring {
    position: absolute; inset: 0;
    border-radius: 50%;
    border: 2px solid var(--cream-200);
  }
  .gcb-ring-spin {
    position: absolute; inset: 0;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: var(--teal-400);
    border-right-color: var(--teal-200);
    animation: gcb-spin 1s linear infinite;
  }

  /* Inner badge */
  .gcb-inner-badge {
    position: absolute;
    inset: 10px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--teal-100), var(--teal-50));
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    box-shadow: 0 2px 10px rgba(31,107,94,.12);
  }

  @keyframes gcb-spin {
    to { transform: rotate(360deg); }
  }

  /* Dot pulse row */
  .gcb-dots {
    display: flex; align-items: center; justify-content: center; gap: 5px;
    margin-bottom: 1.75rem;
    animation: gcb-fadeup .5s .22s var(--ease) both;
  }
  .gcb-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--teal-400);
    animation: gcb-pulse 1.4s ease-in-out infinite;
  }
  .gcb-dot:nth-child(2) { animation-delay: .2s; }
  .gcb-dot:nth-child(3) { animation-delay: .4s; }

  @keyframes gcb-pulse {
    0%, 80%, 100% { transform: scale(.65); opacity: .35; }
    40%            { transform: scale(1);   opacity: 1; }
  }

  /* Text */
  .gcb-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 600;
    color: var(--warm-text); margin-bottom: 8px; line-height: 1.2;
    animation: gcb-fadeup .5s .28s var(--ease) both;
  }
  .gcb-subtitle {
    font-size: 13.5px; font-weight: 300;
    color: var(--muted); line-height: 1.7;
    animation: gcb-fadeup .5s .34s var(--ease) both;
  }

  /* Bottom pill */
  .gcb-pill {
    display: inline-flex; align-items: center; gap: 7px;
    margin-top: 1.75rem;
    background: var(--cream-100);
    border: 1px solid var(--cream-200);
    border-radius: 999px; padding: 6px 16px;
    font-size: 11px; font-weight: 500;
    letter-spacing: 1.2px; text-transform: uppercase;
    color: var(--muted);
    animation: gcb-fadeup .5s .4s var(--ease) both;
  }
  .gcb-pill-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--teal-400);
    animation: gcb-pulse 1.4s ease-in-out infinite;
  }

  /* Progress bar */
  .gcb-progress-wrap {
    height: 3px; background: var(--cream-200); border-radius: 2px;
    margin-top: 1.5rem; overflow: hidden;
    animation: gcb-fadeup .5s .45s var(--ease) both;
  }
  .gcb-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--teal-200), var(--teal-600));
    border-radius: 2px;
    animation: gcb-progress 2.4s var(--ease) forwards;
  }
  @keyframes gcb-progress {
    from { width: 0%; }
    to   { width: 85%; }
  }
`;

export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("connecting"); // connecting → verifying → redirecting

  useEffect(() => {
    // Animate through phases for a polished feel
    const t1 = setTimeout(() => setPhase("verifying"),   800);
    const t2 = setTimeout(() => setPhase("redirecting"), 1600);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get("token");
    const error  = params.get("error");
    const email  = params.get("email");

    console.log("Google callback params:", { token, error, email }); // debug

    if (token) {
      localStorage.setItem("token", token);
      const t = setTimeout(() => navigate("/analyzer", { replace: true }), 1800);
      return () => clearTimeout(t);
    }

    if (error === "pending_verification") {
      const t = setTimeout(() => navigate(`/auth?error=pending&email=${email}`, { replace: true }), 1800);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => navigate("/auth?error=google_failed", { replace: true }), 1800);
    return () => clearTimeout(t);
  }, [navigate]);

  const phaseText = {
    connecting:   { title: "Connecting to Google",  sub: "Establishing a secure connection…" },
    verifying:    { title: "Verifying your account", sub: "Checking your credentials safely…"  },
    redirecting:  { title: "Almost there",           sub: "Preparing your skin dashboard…"     },
  };

  const { title, sub } = phaseText[phase];

  return (
    <>
      <style>{styles}</style>
      <div className="gcb-root">
        <div className="gcb-bg-grid" />
        <div className="gcb-orb1" />
        <div className="gcb-orb2" />
        <div className="gcb-orb3" />

        <div className="gcb-card">
          {/* Logo */}
          <div className="gcb-logo">
            <div className="gcb-logo-badge">✦</div>
            <span className="gcb-logo-name">GlowSkin</span>
          </div>

          {/* Spinner */}
          <div className="gcb-spinner-wrap">
            <div className="gcb-ring" />
            <div className="gcb-ring-spin" />
            <div className="gcb-inner-badge">✨</div>
          </div>

          {/* Dot pulse */}
          <div className="gcb-dots">
            <div className="gcb-dot" />
            <div className="gcb-dot" />
            <div className="gcb-dot" />
          </div>

          {/* Text */}
          <p className="gcb-title" key={title}>{title}</p>
          <p className="gcb-subtitle" key={sub}>{sub}</p>

          {/* Status pill */}
          <div className="gcb-pill">
            <span className="gcb-pill-dot" />
            Secure sign-in
          </div>

          {/* Progress bar */}
          <div className="gcb-progress-wrap">
            <div className="gcb-progress-fill" />
          </div>
        </div>
      </div>
    </>
  );
}