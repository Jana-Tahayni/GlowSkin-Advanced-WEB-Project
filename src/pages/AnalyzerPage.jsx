import { useState } from "react";
import heroVideo from "../assets/hero2.mp4";
import ProductForm from "../components/ProductForm";
import ResultsCard from "../components/ResultsCard";

const MOCK_RESULT = {
  productName:        "CeraVe Moisturizing Cream",
  compatibility:      "High",
  compatibilityScore:  92,
  effectivenessScore:  88,
  safetyScore:         95,
  overallScore:        91,
  verdict:
    "This moisturizing cream is an excellent match for your skin profile. " +
    "Its ceramide-rich formula reinforces the skin barrier, making it especially " +
    "beneficial for dry and sensitive skin types. We recommend incorporating it " +
    "into your evening routine.",
  ingredients: [
    { name: "Ceramides",       desc: "Restores the skin's natural barrier", status: "good"    },
    { name: "Hyaluronic Acid", desc: "Deep hydration & plumping effect",    status: "good"    },
    { name: "Niacinamide",     desc: "Brightening & pore-minimizing",       status: "good"    },
    { name: "Petrolatum",      desc: "Occlusive sealant for moisture",      status: "good"    },
    { name: "Fragrance",       desc: "May irritate sensitive skin",         status: "warning" },
    { name: "Dimethicone",     desc: "Silicone-based smoothing agent",      status: "good"    },
  ],
  warnings: [
    "Contains fragrance — patch test recommended for reactive skin.",
    "Petrolatum may feel heavy for oily or combination skin types.",
  ],
};

export default function AnalyzerPage() {
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);

  const handleAnalyze = async ({ productName }) => {
    setResult(null);
    setLoading(true);
    // TODO: replace with real API call
    await new Promise((r) => setTimeout(r, 2200));
    setResult({ ...MOCK_RESULT, productName: productName || "Uploaded Product" });
    setLoading(false);
  };

  const handleReset = () => setResult(null);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <p className="hero-eyebrow fade-up">AI-Powered · Ingredient Intelligence</p>
            <h1 className="hero-title fade-up delay-1">
              Analyze Your<br /><em>Skincare Product</em>
            </h1>
            <p className="hero-sub fade-up delay-2">
              Paste a product name or upload an ingredient label.
              Our AI matches it to your skin profile and surfaces
              what truly matters — in seconds.
            </p>
            <a href="#analyzer-form" className="hero-cta fade-up delay-3">
              ✦ Start Analyzing
            </a>
          </div>

          <div className="hero-video-wrap fade-up delay-2">
            <video
              src={heroVideo}
              autoPlay loop muted playsInline
              className="hero-video"
            />
            <div className="hero-video-overlay" />
          </div>
        </div>
      </section>

      {/* Form + Results */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "2.5rem 1.2rem 5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
          <div>
            <ProductForm onAnalyze={handleAnalyze} loading={loading} />
            {result && (
              <button
                className="btn-secondary"
                style={{ marginTop: "1rem", width: "100%" }}
                onClick={handleReset}
              >
                ↺ New Analysis
              </button>
            )}
          </div>

          {result && <ResultsCard result={result} />}
        </div>
      </div>
    </>
  );
}