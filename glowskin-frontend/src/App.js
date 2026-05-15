import React, { useState } from "react";
import HeroSection from "./components/HeroSection/HeroSection";
import UploadPage from "./pages/UploadPage";
import HistoryPage from "./pages/HistoryPage";
import BeforeAfterPage from "./pages/BeforeAfterPage";

// ── [تغيير] إضافة صفحة حلا (Product Analyzer) ──
import ProductForm from "./modules/product/components/ProductForm";
import ResultsCard from "./modules/product/components/ResultsCard";
import ProductHistoryPage from "./modules/product/components/HistoryPage";
import heroVideo from "./modules/product/assets/hero4.mp4";

import "./pages/UploadPage.css";
import "./App.css";

const getToken = () => localStorage.getItem("token") || "";

// ── CSS لصفحة حلا — محمية من تأثير على بقية الصفحات ──
const productHeroStyles = `
  .product-hero {
    padding: 0;
    position: relative;
    overflow: hidden;
    min-height: 92vh;
    display: flex;
    align-items: center;
    background: #F7F2EE;
  }
  .product-hero-inner {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 3rem;
    gap: 3rem;
  }
  .product-hero-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }
  .product-hero-eyebrow {
    font-size: .75rem; font-weight: 600; letter-spacing: .2em;
    text-transform: uppercase; color: #3D8C80;
    margin-bottom: 1.2rem;
  }
  .product-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.4rem, 4vw, 3.8rem);
    line-height: 1.1; color: #3D2A1E;
    margin-bottom: 1.2rem;
  }
  .product-hero-title em { font-style: italic; color: #2A6B62; }
  .product-hero-sub {
    font-size: 1rem; color: #8B6450;
    line-height: 1.75; margin-bottom: 2.2rem;
    max-width: 400px;
  }
  .product-hero-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: .9rem 2.2rem;
    background: #3D8C80;
    color: #F7F2EE;
    border-radius: 10px;
    font-size: .85rem; font-weight: 500;
    letter-spacing: .12em; text-transform: uppercase;
    text-decoration: none;
    border: none; cursor: pointer;
    transition: background .2s, transform .15s;
    min-width: 200px;
  }
  .product-hero-cta:hover { background: #2A6B62; transform: translateY(-2px); }
  .product-hero-cta.back { background: #8B6450; }
  .product-video-wrap {
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 12px 48px rgba(61,42,30,0.16);
    aspect-ratio: 4/5;
    max-height: 560px;
  }
  .product-video {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
  }
  .product-video-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(160deg, transparent 50%, rgba(61,42,30,.18) 100%);
    border-radius: 24px;
  }
  @media (max-width: 900px) {
    .product-hero-inner {
      grid-template-columns: 1fr;
      text-align: center;
      padding: 4rem 1.5rem;
    }
    .product-hero-text { align-items: center; order: 2; }
    .product-video-wrap { order: 1; max-height: 300px; aspect-ratio: 16/9; }
  }
`;

export default function App() {
  const [page, setPage]             = useState("home");
  const [analysisId, setAnalysisId] = useState(null);

  const [productLoading, setProductLoading] = useState(false);
  const [productResult,  setProductResult]  = useState(null);
  const [productSubPage, setProductSubPage] = useState("analyzer");

  const handleConsult = (id) => {
    setAnalysisId(id);
    setPage("payment");
  };

  const handleProductAnalyze = async ({ productName, skinType, imgPreview, imgFile }) => {
    setProductResult(null);
    setProductLoading(true);

    const authHeaders = {
      Authorization: `Bearer ${getToken()}`,
      Accept: "application/json",
    };

    try {
      if (imgFile) {
        const formData = new FormData();
        formData.append("image", imgFile);
        formData.append("skin_type", skinType);

        const res  = await fetch("/api/product/image", {
          method: "POST",
          headers: authHeaders,
          body: formData,
        });
        const data = await res.json();
        setProductResult({
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
      } else {
        const res  = await fetch("/api/product", {
          method: "POST",
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body: JSON.stringify({ product_name: productName, skin_type: skinType }),
        });
        const data = await res.json();
        setProductResult({
          productName:        data.product_name,
          imgPreview:         null,
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
      setProductLoading(false);
    }
  };

  return (
    <div style={{ margin: 0, padding: 0, overflow: "hidden" }}>

      {/* ── Inject product page CSS only once ── */}
      <style>{productHeroStyles}</style>

      {/* ── صفحة Jana (Skin Analysis) ── */}
      {page === "home" && (
        <>
          {/* زر مؤقت لصفحة حلا — رح يتشال لما الNavbar يندمج */}
          <button
            onClick={() => setPage("product")}
            style={{
              position: "fixed", bottom: "20px", right: "20px",
              zIndex: 9999, background: "#3D8C80", color: "white",
              border: "none", borderRadius: "10px",
              padding: "10px 20px", cursor: "pointer", fontSize: "14px"
            }}
          >
            🧴 Product Analyzer
          </button>

          <HeroSection />
          <UploadPage
            onHistoryClick={() => setPage("history")}
            onCompareClick={() => setPage("compare")}
            onConsult={handleConsult}
          />
        </>
      )}

      {page === "history" && (
        <div className="page-bg">
          <div className="wide-container">
            <HistoryPage
              onBack={() => setPage("home")}
              onCompare={() => setPage("compare")}
            />
          </div>
        </div>
      )}

      {page === "compare" && (
        <div className="page-bg">
          <div className="wide-container">
            <BeforeAfterPage onBack={() => setPage("history")} />
          </div>
        </div>
      )}

      {/* ── صفحة لجين (Payment) placeholder ── */}
      {page === "payment" && (
        <div className="page-bg">
          <div className="wide-container">
            <div style={{ padding: "100px", textAlign: "center" }}>
              <h2>Payment Page</h2>
              <p>Analysis ID: {analysisId}</p>
              <button onClick={() => setPage("home")}>Back to Home</button>
            </div>
          </div>
        </div>
      )}

      {/* ── صفحة حلا (Product Analyzer) ── */}
      {page === "product" && (
        <>
          {productSubPage === "history" ? (
            <ProductHistoryPage
              onBack={() => setProductSubPage("analyzer")}
              authHeaders={{ Authorization: `Bearer ${getToken()}`, Accept: "application/json" }}
            />
          ) : (
            <>
              <section className="product-hero">
                <div className="product-hero-inner">
                  <div className="product-hero-text">
                    <p className="product-hero-eyebrow fade-up">AI-Powered · Ingredient Intelligence</p>
                    <h1 className="product-hero-title fade-up">
                      Analyze Your<br /><em>Skincare Product</em>
                    </h1>
                    <p className="product-hero-sub fade-up">
                      Paste a product name or upload an ingredient label.
                      Our AI matches it to your skin profile and surfaces
                      what truly matters — in seconds.
                    </p>
                    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
                      <a href="#analyzer-form" className="product-hero-cta">
                        ✦ Start Analyzing
                      </a>
                      <button className="product-hero-cta" onClick={() => setProductSubPage("history")}>
                        🕐 History
                      </button>
                      <button className="product-hero-cta back" onClick={() => setPage("home")}>
                        ← Back to Home
                      </button>
                    </div>
                  </div>

                  {/* ── فيديو حلا ── */}
                  <div className="product-video-wrap fade-up">
                    <video src={heroVideo} autoPlay loop muted playsInline className="product-video" />
                    <div className="product-video-overlay" />
                  </div>
                </div>
              </section>

              <div style={{ maxWidth: 820, margin: "0 auto", padding: "2.5rem 1.2rem 5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
                  <div id="analyzer-form">
                    <ProductForm onAnalyze={handleProductAnalyze} loading={productLoading} />
                    {productResult && (
                      <button
                        className="btn-secondary"
                        style={{ marginTop: "1rem", width: "100%" }}
                        onClick={() => setProductResult(null)}
                      >
                        ↺ New Analysis
                      </button>
                    )}
                  </div>
                  {productResult && <ResultsCard result={productResult} />}
                </div>
              </div>
            </>
          )}
        </>
      )}

    </div>
  );
}