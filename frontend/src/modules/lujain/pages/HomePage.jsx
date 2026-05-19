import { TESTIMONIALS } from "../data/testimonials";
import { STATS, FEATURES } from "../data/data";
import Footer from "../components/home/Footer";
import { FAQ_DATA } from "../data/FAQ";
import "./HomePage.css";
import HomeStatsSection from '../components/home/Stats';

function HeroVisual() {
  return (
    <div className="hero-visual">
      <div className="scanner-container">
        <img src="/images/hero.jpg" alt="AI Scan" className="main-scan-img" />
        <div className="scan-line"></div>
        <div className="analysis-tag tag-1">✦ Personalized Routine</div>
        <div className="analysis-tag tag-2">✦ Smooth Texture</div>
        <div className="analysis-tag tag-3">✦ Doctor Review</div>
      </div>
    </div>
  );
}

function HomePage({ setPage, navigate }) {
  const isLoggedIn = !!localStorage.getItem("token");

  // إذا مش logged in → احفظ الصفحة المطلوبة وروح للـ login
  const handleProtectedNav = (targetPage) => {
    if (!isLoggedIn) {
      sessionStorage.setItem("redirectAfterLogin", targetPage);
      if (navigate) navigate("/auth");
    } else {
      setPage(targetPage);
    }
  };

  return (
    <div className="lujain-scope lujain-page">
    <>
      {/* Hero */}
      <div className="hero">
        <div>
          <div className="hero-eyebrow">✦ Precision Skincare</div>
          <h1>Master your <em>routine</em> with AI precision.</h1>
          <p>Upload a photo, unlock your skin's secrets. From ingredient safety to expert doctor reviews, we provide the clarity you need for radiant skin.</p>
          <div className="hero-ctas">
            <button className="btn btn-primary" onClick={() => handleProtectedNav("analysis")}>
              Analyze My Skin — Free
            </button>
            <button className="btn btn-outline" onClick={() => handleProtectedNav("payment")}>
              See Plans
            </button>
          </div>
        </div>
        <HeroVisual />
      </div>

      {/* Stats */}
      <HomeStatsSection />

      {/* Features */}
      <div className="section">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
          <div>
            <div className="section-eyebrow">Features</div>
            <h2 className="section-title">Everything your skin needs, in one place.</h2>
          </div>
          <div style={{ paddingTop: "2.5rem" }}>
            <p className="section-sub">From instant AI analysis to doctor-reviewed routines — GlowSkin covers every step of your skincare journey.</p>
          </div>
        </div>
        <div className="features-grid">
          {FEATURES.map(f => (
            <div
              key={f.title}
              className="feature-card"
              onClick={() => handleProtectedNav(f.page)}
              style={{ cursor: "pointer" }}
            >
              <div className="feat-icon">{f.icon}</div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
              <span className={`feat-pill ${f.tag === "Free" ? "pill-free" : "pill-paid"}`}>{f.tag}</span>
            </div>
          ))}
        </div>
      </div>



      {/* FAQ */}
      <div id="faq-section" className="section faq-section">
        <div className="section-eyebrow">Support</div>
        <h2 className="section-title">Common Questions</h2>
        <div className="faq-list">
          {FAQ_DATA.map((item, index) => (
            <details key={index} className="faq-item">
              <summary>{item.question}</summary>
              <div className="faq-answer">{item.answer}</div>
            </details>
          ))}
        </div>
      </div>

      <Footer setPage={setPage} />
    </>
    </div>
  );
}

export default HomePage;