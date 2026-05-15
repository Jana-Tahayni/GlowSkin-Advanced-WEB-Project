import React, { useState } from "react";
import HeroSection from "./components/HeroSection/HeroSection";
import UploadPage from "./pages/UploadPage";
import HistoryPage from "./pages/HistoryPage";
import BeforeAfterPage from "./pages/BeforeAfterPage";
import "./pages/UploadPage.css";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("home");

  // ── [تغيير] نحفظ الـ analysis_id لما اليوزر يضغط Consult ──
  const [analysisId, setAnalysisId] = useState(null);

  // ── [تغيير] دالة الـ Consult تحفظ الـ id وتروح لصفحة لجين ──
  const handleConsult = (id) => {
    setAnalysisId(id);
    setPage("payment");
  };

  return (
    <div style={{ margin: 0, padding: 0, overflow: "hidden" }}>
      {page === "home" && (
        <>
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

      {/* ── [تغيير] صفحة لجين — بتوصلها الـ analysis_id ── */}
      {page === "payment" && (
        <div className="page-bg">
          <div className="wide-container">
            {/* لجين بتضيف هون الـ PaymentPage component تبعتها */}
            {/* <PaymentPage analysisId={analysisId} onBack={() => setPage("home")} /> */}
            <div style={{ padding: "100px", textAlign: "center" }}>
              <h2>Payment Page</h2>
              <p>Analysis ID: {analysisId}</p>
              <button onClick={() => setPage("home")}>Back to Home</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}