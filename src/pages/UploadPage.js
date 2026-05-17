import { useState } from "react";
import { ScanFace, Check, Clock } from "lucide-react";

import UploadZone from "../components/Upload/UploadZone";
import SkinTypeSelector from "../components/SkinType/SkinTypeSelector";
import AnalyzeButton from "../components/Analysis/AnalyzeButton";
import ProgressSteps from "../components/Progress/ProgressSteps";
import CameraModal from "../components/Camera/CameraModal";
import ResultsPage from "./ResultsPage";

import "./UploadPage.css";

// ── [تغيير 1] عنوان الباك ──────────────────────────────
// بدل ما نكتب العنوان في كل مكان، نحطه هنا مرة وحدة
const API_URL = "http://127.0.0.1:8000/api";

// ── [تغيير 2] شيلنا الـ delay من الـ CHECKLIST ──────────
// لأنه هلق الـ animation مرتبط بالـ API مش بـ setTimeout وهمي
const CHECKLIST = [
  { id: 1, label: "Image uploaded successfully" },
  { id: 2, label: "Detecting skin features..."  },
  { id: 3, label: "Analyzing skin health..."    },
  { id: 4, label: "Preparing your results..."   },
];

export default function UploadPage({ onHistoryClick, onConsult }) {
  const [step, setStep]                 = useState(1);
  const [imageData, setImageData]       = useState(null);
  const [skinType, setSkinType]         = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [doneItems, setDoneItems]       = useState(new Set([1]));

  // ── [تغيير 3] أضفنا state جديدة ──────────────────────
  // results: تخزن النتائج الجاية من الـ API
  // error:   تخزن رسالة الخطأ إذا فشل الـ API
  const [results, setResults] = useState(null);
  const [error, setError]     = useState(null);

  const handleImageChange = (data) => setImageData(data);
  const handleCapture     = (data) => setImageData(data);

  // ── [تغيير 4] handleAnalyze صار async ────────────────
  // لأنه هلق بيتصل بالـ API وينتظر الرد
  const handleAnalyze = async () => {
    setStep(2);
    setDoneItems(new Set([1]));
    setError(null);

    try {
      // نحرّك الـ checklist animation أثناء انتظار الـ API
      setTimeout(() => setDoneItems((prev) => new Set([...prev, 2])), 1000);
      setTimeout(() => setDoneItems((prev) => new Set([...prev, 3])), 2500);

      // ── [تغيير 5] نستخرج الـ base64 من الصورة ────────
      // الصورة من الـ UploadZone جاية بشكل "data:image/jpeg;base64,ABC123..."
      // الـ API يحتاج بس الجزء بعد الفاصلة "ABC123..."
      const base64Image = imageData.includes(",")
        ? imageData.split(",")[1]
        : imageData;

      // ── [تغيير 6] نرسل الصورة للـ API ────────────────
      // بدل setTimeout وهمي، هلق نرسل للباك الحقيقي
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ image: base64Image }),
      });

      const data = await response.json();

      // إذا الـ API رجع error نرميه
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Analysis failed");
      }

      // ── [تغيير 7] نحفظ النتائج ───────────────────────
      setResults(data.data);

      // نكمل الـ checklist وننتقل للنتائج
      setTimeout(() => setDoneItems((prev) => new Set([...prev, 4])), 500);
      setTimeout(() => setStep(3), 1200);

    } catch (err) {
      // ── [تغيير 8] نعرض الخطأ ─────────────────────────
      // إذا فشل الـ API نرجع لـ step 1 ونعرض رسالة خطأ
      setError(err.message || "Something went wrong. Please try again.");
      setStep(1);
    }
  };

  const handleReset = () => {
    setStep(1);
    setImageData(null);
    setSkinType(null);
    setDoneItems(new Set([1]));
    // ── [تغيير 9] نمسح النتائج والخطأ عند الرجوع ───────
    setResults(null);
    setError(null);
  };
 

  return (
    <div id="analyzer" className="page-bg">
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-icon-wrap">
            <ScanFace className="header-icon" />
          </div>
          <h1 className="page-title">Glow Skin Analyzer</h1>
          <p className="page-subtitle">AI-powered skin analysis for personalised care</p>
          <button className="history-nav-btn" onClick={onHistoryClick}>
            <Clock size={15} />
            View History
          </button>
        </div>

        {/* Progress */}
        <ProgressSteps currentStep={step} />

        {/* ── [تغيير 10] Error banner ─────────────────── */}
        {error && (
          <div className="error-banner">
            ⚠️ {error}
          </div>
        )}

        {/* Card */}
        <div className="glass-card">

          {step === 1 && (
            <div className="step-form">
              <UploadZone
                onImageChange={handleImageChange}
                onCameraOpen={() => setIsCameraOpen(true)}
              />
              <SkinTypeSelector onChange={setSkinType} />
              <AnalyzeButton disabled={!imageData} onClick={handleAnalyze} />
            </div>
          )}

          {step === 2 && (
            <div className="analyzing-view">
              <div className="analyzing-spinner-wrap">
                <div className="analyzing-pulse-ring" />
                <div className="analyzing-inner">
                  <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg className="spinner-svg" viewBox="0 0 50 50">
                      <defs>
                        <linearGradient id="spinner-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#b8c9a3" />
                          <stop offset="100%" stopColor="#b8c9a3" />
                        </linearGradient>
                      </defs>
                      <circle cx="25" cy="25" r="20" fill="none" stroke="#e9d5ff" strokeWidth="4" />
                      <circle cx="25" cy="25" r="20" fill="none" stroke="url(#spinner-grad)" strokeWidth="4" strokeLinecap="round" strokeDasharray="80 126" />
                    </svg>
                    <ScanFace className="spinner-face-icon" style={{ position: "absolute" }} />
                  </div>
                </div>
              </div>

              <h2 className="analyzing-title">Analyzing Your Skin...</h2>
              <p className="analyzing-subtitle">Our AI is examining your skin characteristics</p>

              <div className="progress-checklist">
                {CHECKLIST.map((item) => {
                  const done = doneItems.has(item.id);
                  return (
                    <div key={item.id} className={`progress-item ${done ? "done" : ""}`}>
                      <div className="progress-item-dot">
                        {done ? <Check size={14} color="white" /> : <div className="dot-inner" />}
                      </div>
                      <span className="progress-item-text">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            // ── [تغيير 11] نمرر النتائج الحقيقية لـ ResultsPage
            <ResultsPage
              imageData={imageData}
              skinType={skinType}
              results={results}
              onReset={handleReset}
              onConsult={onConsult}
            />
          )}
        </div>
      </div>

      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCapture}
      />
    </div>
  );
}