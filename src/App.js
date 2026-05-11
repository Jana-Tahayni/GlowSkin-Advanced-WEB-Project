// src/App.js
import { useState } from "react";
import "./App.css";
import heroVideo from "./assets/hero2.mp4";

import Navbar        from "./components/Navbar";
import ProductForm   from "./components/ProductForm";
import ResultsCard   from "./components/ResultsCard";
import HistoryPage   from "./components/HistoryPage";
import HistoryDetail from "./components/HistoryDetail";

// ── مؤقت للاختبار — رح نشيله لما نربط الـ Login ──
const TOKEN = "3|Zi6fOpUhwpeF0X3TQxjz3gmKCOEBn98BmyADLgr6db6e56cb";

const authHeaders = {
  "Authorization": `Bearer ${TOKEN}`,
  "Accept":        "application/json",
};

export default function App() {
  const [page,       setPage]       = useState("analyzer");
  const [loading,    setLoading]    = useState(false);
  const [result,     setResult]     = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const handleAnalyze = async ({ productName, skinType, imgPreview, imgFile }) => {
    setResult(null);
    setLoading(true);

    try {
      if (imgFile) {
        const formData = new FormData();
        formData.append("image", imgFile);
        formData.append("skin_type", skinType);

        const res  = await fetch("/api/product/image", {
          method:  "POST",
          headers: authHeaders,   // ← بدون Content-Type مع FormData
          body:    formData,
        });
        const data = await res.json();
       setResult({
        productName:        data.product_name,
        imgPreview:         imgPreview,  
        effectivenessScore: data.effectiveness_score,
        safetyScore:        data.safety_score,
        compatibilityScore: Math.round((data.effectiveness_score + data.safety_score) / 2),  
        overallScore:       Math.round((data.effectiveness_score + data.safety_score) / 2),  
        compatibility:      data.compatibility,
        ingredients: data.key_ingredients ?? [],
        warnings:           data.warnings ?? [],
        verdict:            data.verdict,
      });

      } else {
        const res  = await fetch("/api/product", {
          method:  "POST",
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body:    JSON.stringify({ product_name: productName, skin_type: skinType }),
        });
        const data = await res.json();
        setResult({
          productName:        data.product_name,
          imgPreview:         imgPreview,  
          effectivenessScore: data.effectiveness_score,
          safetyScore:        data.safety_score,
          compatibilityScore: Math.round((data.effectiveness_score + data.safety_score) / 2),  
          overallScore:       Math.round((data.effectiveness_score + data.safety_score) / 2),  
          compatibility:      data.compatibility,
          ingredients:        data.key_ingredients ?? [],
          warnings:           data.warnings ?? [],
          verdict:            data.verdict,
        });
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => setResult(null);

  const handleSelectHistory = (id) => {
    setSelectedId(id);
    setPage("historyDetail");
  };

  return (
    <>
      <Navbar page={page} setPage={setPage} />

      {page === "history" && (
        <HistoryPage
          onBack={() => setPage("analyzer")}
          onSelect={handleSelectHistory}
          authHeaders={authHeaders}
        />
      )}

      {page === "historyDetail" && (
        <HistoryDetail
          id={selectedId}
          onBack={() => setPage("history")}
          authHeaders={authHeaders}
        />
      )}

      {page === "analyzer" && (
        <>
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
                <video src={heroVideo} autoPlay loop muted playsInline className="hero-video" />
                <div className="hero-video-overlay" />
              </div>
            </div>
          </section>

          <div style={{ maxWidth: 820, margin: "0 auto", padding: "2.5rem 1.2rem 5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
              <div id="analyzer-form">
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
      )}
    </>
  );
}