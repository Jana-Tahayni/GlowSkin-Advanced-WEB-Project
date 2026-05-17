/**
 * DevNav — شريط تنقل مؤقت للتطوير فقط
 * احذفيه لما تخلصي من الدمج
 */

const devNavStyles = `
  .dev-nav {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    z-index: 9999; display: flex; align-items: center; gap: 6px;
    background: rgba(22, 22, 22, 0.93); backdrop-filter: blur(14px);
    border: 1px solid rgba(255,255,255,0.08); border-radius: 999px;
    padding: 7px 10px; box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    font-family: 'DM Sans', system-ui, sans-serif; flex-wrap: wrap;
    max-width: 95vw; justify-content: center;
  }
  .dev-nav-label {
    font-size: 9px; font-weight: 700; letter-spacing: 1.5px;
    text-transform: uppercase; color: rgba(255,255,255,0.3);
    padding-right: 8px; border-right: 1px solid rgba(255,255,255,0.1);
    margin-right: 2px; white-space: nowrap;
  }
  .dev-nav-btn {
    border: none; border-radius: 999px; padding: 6px 13px;
    font-size: 11px; font-weight: 500; cursor: pointer;
    transition: all 0.18s ease; white-space: nowrap;
    background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.6);
  }
  .dev-nav-btn:hover { background: rgba(255,255,255,0.14); color: white; transform: translateY(-1px); }
  .dev-nav-btn.active { color: white; transform: translateY(-1px); }
  /* كل بنت إلها لون */
  .dev-nav-btn.lujain.active  { background: #1E5048; }
  .dev-nav-btn.jana.active    { background: #3D8C80; }
  .dev-nav-btn.hala.active    { background: #8B6450; }
  .dev-nav-btn.afnan.active   { background: #184f46; }
  .dev-nav-btn.lujain:hover   { background: rgba(30,80,72,0.5); }
  .dev-nav-btn.jana:hover     { background: rgba(61,140,128,0.4); }
  .dev-nav-btn.hala:hover     { background: rgba(139,100,80,0.4); }
  .dev-nav-btn.afnan:hover    { background: rgba(24,79,70,0.4); }
  .dev-nav-divider { width: 1px; height: 18px; background: rgba(255,255,255,0.1); margin: 0 1px; flex-shrink: 0; }
`;

export default function DevNav({ page, setPage, navigate }) {
  return (
    <>
      <style>{devNavStyles}</style>
      <nav className="dev-nav">
        <span className="dev-nav-label">🛠 Dev</span>

        {/* لجين */}
        <button className={`dev-nav-btn lujain ${page === "home" ? "active" : ""}`}
          onClick={() => setPage("home")}>لجين — Home</button>
        <button className={`dev-nav-btn lujain ${page === "payment" ? "active" : ""}`}
          onClick={() => setPage("payment")}>لجين — Pricing</button>

        <div className="dev-nav-divider" />

        {/* Jana */}
        <button className={`dev-nav-btn jana ${page === "analysis" ? "active" : ""}`}
          onClick={() => setPage("analysis")}>Jana — Analysis</button>
        <button className={`dev-nav-btn jana ${page === "analysis-history" ? "active" : ""}`}
          onClick={() => setPage("analysis-history")}>Jana — History</button>
        <button className={`dev-nav-btn jana ${page === "analysis-compare" ? "active" : ""}`}
          onClick={() => setPage("analysis-compare")}>Jana — Compare</button>

        <div className="dev-nav-divider" />

        {/* حلا */}
        <button className={`dev-nav-btn hala ${page === "product" ? "active" : ""}`}
          onClick={() => setPage("product")}>حلا — Product</button>

        <div className="dev-nav-divider" />

        {/* أفنان */}
        <button className="dev-nav-btn afnan" onClick={() => navigate("/auth")}>أفنان — Auth</button>
        <button className="dev-nav-btn afnan" onClick={() => navigate("/forgot-password")}>أفنان — Reset</button>
      </nav>
    </>
  );
}
