import { STATS, FEATURES, TESTIMONIALS } from "../data/consts";

function HeroCard() {
  return (
    <div className="hero-card">
      <div className="hc-head">
        <div className="hc-avatar">NR</div>
        <div>
          <div className="hc-name">Nour's Skin Report</div>
          <div className="hc-sub">Analyzed just now · Combination skin</div>
        </div>
      </div>
      <div className="hc-score-row">
        <span className="hc-label">Overall Skin Score</span>
        <span className="hc-score">78<sub>/100</sub></span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: "78%" }} />
      </div>
      <div className="hc-grid">
        <div className="hc-metric"><div className="hc-metric-val">82%</div><div className="hc-metric-label">Hydration</div></div>
        <div className="hc-metric"><div className="hc-metric-val">91%</div><div className="hc-metric-label">Accuracy</div></div>
        <div className="hc-metric"><div className="hc-metric-val">65%</div><div className="hc-metric-label">Brightness</div></div>
        <div className="hc-metric"><div className="hc-metric-val">74%</div><div className="hc-metric-label">Smoothness</div></div>
      </div>
      <div className="hc-tags">
        <span className="tag tag-warn">Mild Dehydration</span>
        <span className="tag tag-ok">Clear Pores</span>
        <span className="tag tag-nude">T-Zone Oiliness</span>
      </div>
    </div>
  );
}

function HomePage({ setPage }) {
  return (
    <>
      {/* Hero */}
      <div className="hero">
        <div>
          <div className="hero-eyebrow">✦ Precision Skincare</div>
          <h1>Master your <em>routine</em> with AI precision.</h1>
          <p>Upload a photo, unlock your skin's secrets. From ingredient safety to expert doctor reviews, we provide the clarity you need for radiant skin.</p>
          <div className="hero-ctas">
            <button className="btn btn-primary" onClick={() => setPage("analysis")}>Analyze My Skin — Free</button>
            <button className="btn btn-outline" onClick={() => setPage("payment")}>See Plans</button>
          </div>
        </div>
        <HeroCard />
      </div>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stats-inner">
          {STATS.map(s => (
            <div key={s.label}>
              <div className="stat-val">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="section">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2rem", alignItems:"start" }}>
          <div>
            <div className="section-eyebrow">Features</div>
            <h2 className="section-title">Everything your skin needs, in one place.</h2>
          </div>
          <div style={{ paddingTop:"2.5rem" }}>
            <p className="section-sub">From instant AI analysis to doctor-reviewed routines — GlowSkin covers every step of your skincare journey.</p>
          </div>
        </div>
        <div className="features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-card">
              <div className="feat-icon">{f.icon}</div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
              <span className={`feat-pill ${f.tag === "Free" ? "pill-free" : "pill-paid"}`}>{f.tag}</span>
            </div>
          ))}
        </div>
      </div>


      {/* Testimonials */}
      <div className="section">
        <div className="section-eyebrow">Testimonials</div>
        <h2 className="section-title">Loved by thousands of users.</h2>
        <div className="testi-grid">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="testi-card">
              <p className="testi-text">"{t.text}"</p>
              <div className="testi-author">
                <div className="t-avatar">{t.initials}</div>
                <div>
                  <div className="t-name">{t.name}</div>
                  <div className="t-role">Verified User</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="cta-band">
        <h2>Start your glow journey today.</h2>
        <p>Free AI analysis, no credit card required. Upgrade anytime for doctor-reviewed care.</p>
        <button className="btn btn-gold" style={{ fontSize:"0.9375rem", padding:"0.8rem 2.25rem" }}
          onClick={() => setPage("analysis")}>
          Analyze My Skin — It's Free
        </button>
      </div>
    </>
  );
}

export default HomePage;