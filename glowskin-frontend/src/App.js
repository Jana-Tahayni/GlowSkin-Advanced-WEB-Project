import React, { useState } from "react";
import HeroSection from "./components/HeroSection/HeroSection";
import UploadPage from "./pages/UploadPage";
import HistoryPage from "./pages/HistoryPage";
import BeforeAfterPage from "./pages/BeforeAfterPage";
import "./pages/UploadPage.css";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div style={{ margin: 0, padding: 0, overflow: "hidden" }}>
      {page === "home" && (
        <>
          <HeroSection />
          <UploadPage
            onHistoryClick={() => setPage("history")}
            onCompareClick={() => setPage("compare")}
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
    </div>
  );
}
