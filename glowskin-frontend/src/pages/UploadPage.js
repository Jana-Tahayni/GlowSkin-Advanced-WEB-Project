import { useState } from "react";
import { ScanFace, Check, Clock } from "lucide-react";

import UploadZone from "../components/Upload/UploadZone";
import SkinTypeSelector from "../components/SkinType/SkinTypeSelector";
import AnalyzeButton from "../components/Analysis/AnalyzeButton";
import ProgressSteps from "../components/Progress/ProgressSteps";
import CameraModal from "../components/Camera/CameraModal";
import ResultsPage from "./ResultsPage";

import "./UploadPage.css";

const CHECKLIST = [
  { id: 1, label: "Image uploaded successfully",    defaultDone: true },
  { id: 2, label: "Detecting skin features...",     defaultDone: false, delay: 1500 },
  { id: 3, label: "Analyzing skin health...",       defaultDone: false, delay: 3000 },
  { id: 4, label: "Generating recommendations...", defaultDone: false, delay: 4500 },
];

export default function UploadPage({ onHistoryClick }) {
  const [step, setStep]                 = useState(1);
  const [imageData, setImageData]       = useState(null);
  const [skinType, setSkinType]         = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [doneItems, setDoneItems]       = useState(new Set([1]));

  const handleImageChange = (data) => setImageData(data);
  const handleCapture     = (data) => setImageData(data);

  const handleAnalyze = () => {
    setStep(2);
    setDoneItems(new Set([1]));

    CHECKLIST.filter((c) => !c.defaultDone).forEach((item) => {
      setTimeout(() => {
        setDoneItems((prev) => new Set([...prev, item.id]));
      }, item.delay);
    });

    // Transition to results after all checklist items finish
    setTimeout(() => setStep(3), 5500);
  };

  const handleReset = () => {
    setStep(1);
    setImageData(null);
    setSkinType(null);
    setDoneItems(new Set([1]));
  };

  return (
    <div className="page-bg">
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-icon-wrap">
            <ScanFace className="header-icon" />
          </div>
          <h1 className="page-title">Derma Skin Analyzer</h1>
          <p className="page-subtitle">AI-powered skin analysis for personalised care</p>
          <button className="history-nav-btn" onClick={onHistoryClick}>
            <Clock size={15} />
            View History
          </button>
        </div>

        {/* Progress */}
        <ProgressSteps currentStep={step} />

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
            <ResultsPage
              imageData={imageData}
              skinType={skinType}
              onReset={handleReset}
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
