import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";


// ── لجين: Navbar, HomePage, PaymentPage, global CSS ──
import Navbar      from "./modules/lujain/components/home/Navbar";
import HomePage    from "./modules/lujain/pages/HomePage";
import PaymentPage from "./modules/lujain/pages/PaymentPage";
import "./modules/lujain/styles/global.css";  // ← الـ CSS الرئيسية للمشروع
import "./App.css";                            // ← ثاني، بعده مباشرة

// ── Jana: Skin Analysis pages ──
import HeroSection     from "./components/HeroSection/HeroSection";
import UploadPage      from "./pages/UploadPage";
import HistoryPage     from "./pages/HistoryPage";
import BeforeAfterPage from "./pages/BeforeAfterPage";
import "./pages/UploadPage.css";

// ── حلا: Product Analyzer ──
import ProductForm        from "./modules/product/components/ProductForm";
import ResultsCard        from "./modules/product/components/ResultsCard";
import ProductHistoryPage from "./modules/product/components/HistoryPage";
import heroVideo          from "./modules/product/assets/hero4.mp4";

// ── أفنان: Auth pages (router-based) ──
import GlowAuth, { VerifyEmailPage } from "./modules/auth/LoginForm";
import GoogleCallbackPage             from "./modules/auth/GoogleCallbackPage";
import ResetPasswordPage              from "./modules/auth/ResetPasswordPage";

// ─────────────────────────────────────────────
//  Product page hero styles (حلا)
// ─────────────────────────────────────────────
const productHeroStyles = `
  .product-page h1 {
    font-size: clamp(2.4rem, 4vw, 3.8rem) !important;
    letter-spacing: normal !important; margin: 0 0 1.2rem !important;
    font-family: 'Cormorant Garamond', serif !important; font-weight: 400 !important;
  }
  .product-page h2 {
    font-size: 1.9rem !important; letter-spacing: normal !important;
    margin: 0 0 1.8rem !important;
    font-family: 'Cormorant Garamond', serif !important; font-weight: 400 !important;
  }
  .product-page { text-align: left !important; font-family: 'Jost', sans-serif !important; font-size: 1rem !important; }
  .product-hero {
    padding: 0; position: relative; overflow: hidden;
    min-height: 92vh; display: flex; align-items: center; background: #F7F2EE;
  }
  .product-hero-inner {
    display: grid; grid-template-columns: 1.2fr 0.8fr;
    align-items: center; width: 100%; max-width: 1200px;
    margin: 0 auto; padding: 2rem 3rem; gap: 3rem;
  }
  .product-hero-text { display: flex; flex-direction: column; align-items: flex-start; text-align: left; }
  .product-hero-eyebrow { font-size: .75rem; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: #3D8C80; margin-bottom: 1.2rem; }
  .product-hero-title { font-family: 'Cormorant Garamond', serif !important; font-size: clamp(2.4rem, 4vw, 3.8rem) !important; line-height: 1.1; color: #3D2A1E; margin: 0 0 1.2rem !important; letter-spacing: normal !important; font-weight: 400 !important; }
  .product-hero-title em { font-style: italic; color: #2A6B62; }
  .product-hero-sub { font-size: 1rem; color: #8B6450; line-height: 1.75; margin-bottom: 2.2rem; max-width: 400px; }
  .product-hero-cta { display: inline-flex; align-items: center; justify-content: center; padding: .9rem 2.2rem; background: #3D8C80; color: #F7F2EE; border-radius: 10px; font-size: .85rem; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; text-decoration: none; border: none; cursor: pointer; transition: background .2s, transform .15s; min-width: 200px; }
  .product-hero-cta:hover { background: #2A6B62; transform: translateY(-2px); }
  .product-video-wrap { position: relative; border-radius: 24px; overflow: hidden; box-shadow: 0 12px 48px rgba(61,42,30,0.16); aspect-ratio: 4/5; max-height: 560px; }
  .product-video { width: 100%; height: 100%; object-fit: cover; display: block; }
  .product-video-overlay { position: absolute; inset: 0; background: linear-gradient(160deg, transparent 50%, rgba(61,42,30,.18) 100%); border-radius: 24px; }
  @media (max-width: 900px) {
    .product-hero-inner { grid-template-columns: 1fr; text-align: center; padding: 4rem 1.5rem; }
    .product-hero-text { align-items: center; order: 2; }
    .product-video-wrap { order: 1; max-height: 300px; aspect-ratio: 16/9; }
  }
`;

const getToken = () => localStorage.getItem("token") || "";

// ─────────────────────────────────────────────
//  Main App Shell — page-state navigation
// ─────────────────────────────────────────────
function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();

  // ── Page state ──
  const [page, setPage] = useState("home");

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  // ── Auth state ──
  const isLoggedIn = !!localStorage.getItem("token");

  // ── Notifications (لجين) ──
  const [notifications,    setNotifications]    = useState([]);
  const [currentAnalysisId, setCurrentAnalysisId] = useState(null);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get("http://localhost:8000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formatted = res.data.map(n => ({
        id:      n.id,
        type:    n.data.type,
        icon:    n.data.type === "payment_success" ? "◈" : "✦",
        title:   n.data.type === "payment_success" ? "Payment Confirmed" : "Routine Ready!",
        message: n.data.message,
        time:    formatDistanceToNow(new Date(n.created_at), { addSuffix: true }),
        read:    n.read_at !== null,
      }));
      setNotifications(formatted);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post("http://localhost:8000/api/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) { console.error(err); }
  };

  const markAsRead = async (id, isRead) => {
    if (isRead) return;
    try {
      await axios.post(`http://localhost:8000/api/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) { console.error(err); }
  };

  const addNotification = (notif) => setNotifications(prev => [notif, ...prev]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // ── Jana: analysis complete → go to payment ──
  const handleConsult = (id) => {
    setCurrentAnalysisId(id);
    setPage("payment");
  };

  // ── حلا: Product Analyzer state ──
  const [productLoading, setProductLoading] = useState(false);
  const [productResult,  setProductResult]  = useState(null);
  const [productSubPage, setProductSubPage] = useState("analyzer");

  const handleProductAnalyze = async ({ productName, skinType, imgPreview, imgFile }) => {
    setProductResult(null);
    setProductLoading(true);
    const authHeaders = { Authorization: `Bearer ${getToken()}`, Accept: "application/json" };
    try {
      if (imgFile) {
        const formData = new FormData();
        formData.append("image", imgFile);
        formData.append("skin_type", skinType);
        const res  = await fetch("/api/product/image", { method: "POST", headers: authHeaders, body: formData });
        const data = await res.json();
        setProductResult({
          productName: data.product_name, imgPreview,
          effectivenessScore: data.effectiveness_score, safetyScore: data.safety_score,
          compatibilityScore: Math.round((data.effectiveness_score + data.safety_score) / 2),
          overallScore: Math.round((data.effectiveness_score + data.safety_score) / 2),
          compatibility: data.compatibility, ingredients: data.key_ingredients ?? [],
          warnings: data.warnings ?? [], verdict: data.verdict,
        });
      } else {
        const res  = await fetch("/api/product", {
          method: "POST",
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body: JSON.stringify({ product_name: productName, skin_type: skinType }),
        });
        const data = await res.json();
        setProductResult({
          productName: data.product_name, imgPreview: null,
          effectivenessScore: data.effectiveness_score, safetyScore: data.safety_score,
          compatibilityScore: Math.round((data.effectiveness_score + data.safety_score) / 2),
          overallScore: Math.round((data.effectiveness_score + data.safety_score) / 2),
          compatibility: data.compatibility, ingredients: data.key_ingredients ?? [],
          warnings: data.warnings ?? [], verdict: data.verdict,
        });
      }
    } catch (err) { console.error(err); }
    finally { setProductLoading(false); }
  };

  return (
    <div className="app-container">

      {/* ── Navbar تبع لجين — الـ navbar الرئيسية ── */}
      <Navbar
        active={page}
        setPage={setPage}
        navigate={navigate}
        notifications={notifications}
        setNotifications={setNotifications}
        onMarkAsRead={markAsRead}
        onMarkAllRead={markAllAsRead}
        isLoggedIn={isLoggedIn}
      />

      <main>

        {/* ── لجين: Home Page ── */}
        {page === "home" && <HomePage setPage={setPage} />}

        {/* ── لجين: Payment / Pricing ── */}
        {page === "payment" && (
          <PaymentPage
            setPage={setPage}
            analysisId={currentAnalysisId}
            refreshNotifs={fetchNotifications}
            addNotification={addNotification}
          />
        )}

        {/* ── Jana: Skin Analysis ── */}
        {page === "analysis" && (
          <>
            <HeroSection />
            <UploadPage
              onHistoryClick={() => setPage("analysis-history")}
              onCompareClick={() => setPage("analysis-compare")}
              onConsult={handleConsult}
            />
          </>
        )}

        {page === "analysis-history" && (
          <div className="page-bg"><div className="wide-container">
            <HistoryPage onBack={() => setPage("analysis")} onCompare={() => setPage("analysis-compare")} />
          </div></div>
        )}

        {page === "analysis-compare" && (
          <div className="page-bg"><div className="wide-container">
            <BeforeAfterPage onBack={() => setPage("analysis-history")} />
          </div></div>
        )}

        {/* ── حلا: Product Analyzer ── */}
        {page === "product" && (
          <div className="product-page">
            <style>{productHeroStyles}</style>
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
                      <p className="product-hero-eyebrow">AI-Powered · Ingredient Intelligence</p>
                      <h1 className="product-hero-title">Analyze Your<br /><em>Skincare Product</em></h1>
                      <p className="product-hero-sub">
                        Paste a product name or upload an ingredient label. Our AI matches it
                        to your skin profile and surfaces what truly matters — in seconds.
                      </p>
                      <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
                        <a href="#analyzer-form" className="product-hero-cta">✦ Start Analyzing</a>
                        <button className="product-hero-cta" onClick={() => setProductSubPage("history")}>🕐 History</button>
                      </div>
                    </div>
                    <div className="product-video-wrap">
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
                        <button className="btn btn-outline" style={{ marginTop: "1rem", width: "100%" }}
                          onClick={() => setProductResult(null)}>↺ New Analysis</button>
                      )}
                    </div>
                    {productResult && <ResultsCard result={productResult} />}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

      </main>

    </div>
  );
}

// ─────────────────────────────────────────────
//  Root — BrowserRouter يلف كل شي
// ─────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── أفنان: Auth Routes ── */}
        <Route path="/auth"                  element={<GlowAuth />} />
        <Route path="/auth/google/callback"  element={<GoogleCallbackPage />} />
        <Route path="/forgot-password"       element={<ResetPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify/:token"         element={<VerifyEmailPage />} />

        {/* ── كل باقي الصفحات ── */}
        <Route path="/*" element={<AppShell />} />
      </Routes>
    </BrowserRouter>
  );
}