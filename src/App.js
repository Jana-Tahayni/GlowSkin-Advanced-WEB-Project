import { useState } from "react";
import "./modules/product/Product.css";

import heroVideo from "./modules/product/assets/hero4.mp4";
import ProductForm from "./modules/product/components/ProductForm";
import ResultsCard from "./modules/product/components/ResultsCard";
import HistoryPage from "./modules/product/components/HistoryPage";
const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIwMTllMmIzOC0yN2JkLTczMDYtYWFlYS0yYWJiZTA3NTBmMDUiLCJqdGkiOiIwN2MyMTkwODJlZjlkZmFiYWNiN2Q5OTFiOTdiYjk5NzkyOGYwNDRiZjJjNDdiZTQ0ZTU4M2Y5NjZiYzU3N2EzZGFmNjVjYzIxNWI1YzI5MiIsImlhdCI6MTc3ODg0MTU3OC4wODYzMjIsIm5iZiI6MTc3ODg0MTU3OC4wODYzMjYsImV4cCI6MTgxMDM3NzU3OC4wMzMwODIsInN1YiI6IjEiLCJzY29wZXMiOltdfQ.w0O1Frr-DnD-A-A8imEBY2qTYl55Rn20ovcFtW1YkvK9iZkpZNzQr5jR9buKwFp6hbdIgYcYdnrqzKB99j_n407C7J4KgCHKaaCOf_kqBPw2Y2j8pi9oLGuKaDGHa86gI6NxIjLJU7gx4waRBosv_XOP06BazOzeFKero9eK0gSwvuinsMeKwDPDLoGlwroBacTQ3RXQr43e8kVMWN6bjNEN1EXGQu7gcQWFjHPAjLGVEyV4OODZSuwjqSv4JclNxtU5ir52Khgbep6F0oTEwsrBFC0RlHGwddierkp-KuFrf6DYku4wQ6l9QKxci4e2L7hMA2CVQUPQFzZ0beJ6eFbIAB0mbjTccrQ9vl_oJI061AsNDtE2So5WJyo-YFTYFPhkUzkQ6Ndj2XJ_gGYxMVlJujO1nzvuYfVSS4NYV0qECxJXwXMsCC4y_w1RMPMBLKP-yeXbdcXSlGgJB7aIN6dhHyIO7j42Fe32JxaSGdszQtvhmISw8smkjpda1mjarFm-kyYTF1Ka4FEk88RFU66H2nBbtadGC1LcQGqaYPQBwecQzWiegxPCC2h9WBkyDNIjAC_P95EJZPFYIJFnsYb7rN28Uzrgrt2vezqsV5adcxNNHZAnePi7bsrR4Er40LnAC8upUwo1GCSB48cIOwjSO3xue_pUNutNm2OMLNg";

const authHeaders = {
  "Authorization": `Bearer ${TOKEN}`,
  "Accept":        "application/json",
};

export default function App() {
  const [page,    setPage]    = useState("analyzer");
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);

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
          headers: authHeaders,
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
          ingredients:        data.key_ingredients ?? [],
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
      setLoading(false);
    }
  };

  const handleReset = () => setResult(null);

  return (
    <>
    
      {page === "history" && (
        <HistoryPage
          onBack={() => setPage("analyzer")}
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
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap",flexDirection:  "column",  }}>
                <a href="#analyzer-form" className="hero-cta fade-up delay-3" style={{ minWidth: "200px" }}>
                  ✦ Start Analyzing
                </a>
                <button
                      className="hero-cta fade-up delay-3"
                      onClick={() => setPage("history")}
                      style={{
                        border:    "none",
                        cursor:    "pointer",
                        minWidth:  "200px",
                      }}
                    >
                      🕐 History
                    </button>
              </div>
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