import "./HeroSection.css";

// 🌿 Replace these with your actual assets:
import modelPhoto from "../../assets/model.png";
//import leafLeft from "../../assets/leaf-left.png";
// import leafRight from "../../assets/leaf-right.png";

export default function HeroSection() {
  return (
    <div className="hero-wrapper">   
    <section className="hero">
      {/* ── Background blob ── */}
      <div className="hero__blob" aria-hidden="true" />

      {/* ── Floating icons (right edge) ── */}
      <aside className="hero__icons" aria-hidden="true">
        <span className="hero__icon-pill">🪷</span>
        <span className="hero__icon-pill">💧</span>
        <span className="hero__icon-pill">⏱</span>
      </aside>

      {/* ── Left: copy ── */}
      <div className="hero__copy">
        <h1 className="hero__headline">
          Rejuvenate<br />
          Your Skin,<br />
          <em>Refresh Your</em><br />
          Confidence
        </h1>

        <p className="hero__body">
          Upload a photo and receive a personalised skin report —
          analysing texture, tone, hydration and more in seconds.
        </p>

        <a href="#analyzer" className="hero__cta">
          Analyse Now
        </a>

      </div>

      {/* ── Centre: model photo ── */}
      <div className="hero__photo-wrap">
        {/*
          Replace the src below with your actual model image:
          <img src={modelPhoto} alt="Model with healthy skin" className="hero__photo" />
        */}
        <div className="hero__photo-placeholder">
         <img src={modelPhoto} alt="Model with healthy skin" className="hero__photo" />
        </div>
        </div>
    </section>
    </div>
  );
}