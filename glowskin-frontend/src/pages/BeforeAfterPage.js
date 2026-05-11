import React, { useState, useRef } from "react";
import {
  ArrowLeft, ArrowLeftRight, TrendingUp, TrendingDown,
  Minus, Droplets, Sun, Shield, Zap, Heart, ChevronDown
} from "lucide-react";
import "./BeforeAfterPage.css";

/* ── Mock scans (same shape as History) ── */
const MOCK_SCANS = [
  {
    id: 1, label: "Today — May 10",
    overallScore: 74, skinType: "Combination",
    concerns: ["T-zone oiliness", "Minor pores"],
    metrics: [
      { id: "hydration",   label: "Hydration",  score: 82, icon: Droplets, color: "#5ba4cf" },
      { id: "texture",     label: "Texture",    score: 68, icon: Zap,      color: "#b8c9a3" },
      { id: "brightness",  label: "Brightness", score: 71, icon: Sun,      color: "#f5c9b3" },
      { id: "protection",  label: "Protection", score: 60, icon: Shield,   color: "#c9a3b8" },
      { id: "sensitivity", label: "Sensitivity",score: 79, icon: Heart,    color: "#f0a090" },
    ],
  },
  {
    id: 2, label: "Apr 22",
    overallScore: 68, skinType: "Combination",
    concerns: ["T-zone oiliness", "Dryness", "Dullness"],
    metrics: [
      { id: "hydration",   label: "Hydration",  score: 74, icon: Droplets, color: "#5ba4cf" },
      { id: "texture",     label: "Texture",    score: 61, icon: Zap,      color: "#b8c9a3" },
      { id: "brightness",  label: "Brightness", score: 65, icon: Sun,      color: "#f5c9b3" },
      { id: "protection",  label: "Protection", score: 55, icon: Shield,   color: "#c9a3b8" },
      { id: "sensitivity", label: "Sensitivity",score: 80, icon: Heart,    color: "#f0a090" },
    ],
  },
  {
    id: 3, label: "Apr 1",
    overallScore: 61, skinType: "Dry",
    concerns: ["Severe dryness", "Redness", "Flakiness"],
    metrics: [
      { id: "hydration",   label: "Hydration",  score: 55, icon: Droplets, color: "#5ba4cf" },
      { id: "texture",     label: "Texture",    score: 58, icon: Zap,      color: "#b8c9a3" },
      { id: "brightness",  label: "Brightness", score: 60, icon: Sun,      color: "#f5c9b3" },
      { id: "protection",  label: "Protection", score: 50, icon: Shield,   color: "#c9a3b8" },
      { id: "sensitivity", label: "Sensitivity",score: 72, icon: Heart,    color: "#f0a090" },
    ],
  },
  {
    id: 4, label: "Mar 10",
    overallScore: 58, skinType: "Dry",
    concerns: ["Severe dryness", "Sensitivity", "Redness"],
    metrics: [
      { id: "hydration",   label: "Hydration",  score: 48, icon: Droplets, color: "#5ba4cf" },
      { id: "texture",     label: "Texture",    score: 55, icon: Zap,      color: "#b8c9a3" },
      { id: "brightness",  label: "Brightness", score: 57, icon: Sun,      color: "#f5c9b3" },
      { id: "protection",  label: "Protection", score: 48, icon: Shield,   color: "#c9a3b8" },
      { id: "sensitivity", label: "Sensitivity",score: 68, icon: Heart,    color: "#f0a090" },
    ],
  },
];

/* ── Helpers ── */
function scoreColor(score) {
  if (score >= 75) return "#b8c9a3";
  if (score >= 60) return "#f5c9b3";
  return "#f0a090";
}

function DiffBadge({ diff }) {
  if (diff === 0) return <span className="diff-badge flat"><Minus size={11} /> 0</span>;
  if (diff > 0)   return <span className="diff-badge up"><TrendingUp size={11} /> +{diff}</span>;
  return               <span className="diff-badge down"><TrendingDown size={11} /> {diff}</span>;
}

/* ── Scan selector dropdown ── */
function ScanDropdown({ label, selected, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  return (
    <div className="scan-dropdown" ref={ref}>
      <button className="scan-dropdown-btn" onClick={() => setOpen(!open)}>
        <span className="scan-dropdown-tag">{label}</span>
        <span className="scan-dropdown-value">{selected.label}</span>
        <ChevronDown size={14} className={open ? "rotated" : ""} />
      </button>
      {open && (
        <div className="scan-dropdown-menu">
          {options.map(opt => (
            <button
              key={opt.id}
              className={`scan-dropdown-item ${selected.id === opt.id ? "active" : ""}`}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              <span className="scan-item-label">{opt.label}</span>
              <span className="scan-item-score" style={{ color: scoreColor(opt.overallScore) }}>
                {opt.overallScore}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Score arc card ── */
function ScoreCard({ scan, side }) {
  const color = scoreColor(scan.overallScore);
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (scan.overallScore / 100) * circ;

  return (
    <div className={`score-card ${side}`}>
      <div className="score-card-ring-wrap">
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={r} fill="none" stroke="#f5c9b3" strokeWidth="6" opacity="0.3" />
          <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            transform="rotate(-90 36 36)" />
        </svg>
        <div className="score-card-num">{scan.overallScore}</div>
      </div>
      <p className="score-card-skin">{scan.skinType}</p>
    </div>
  );
}

/* ── Metric comparison row ── */
function MetricCompareRow({ metricId, before, after }) {
  const bMetric = before.metrics.find(m => m.id === metricId);
  const aMetric = after.metrics.find(m => m.id === metricId);
  const diff = aMetric.score - bMetric.score;

  return (
    <div className="compare-row">
      <div className="compare-row-header">
        <span className="compare-metric-name">{aMetric.label}</span>
        <DiffBadge diff={diff} />
      </div>
      <div className="compare-bars">
        {/* Before bar */}
        <div className="bar-group">
          <span className="bar-side-label">Before</span>
          <div className="bar-track">
            <div className="bar-fill before-fill" style={{ width: `${bMetric.score}%`, background: bMetric.color + "88" }} />
          </div>
          <span className="bar-score">{bMetric.score}</span>
        </div>
        {/* After bar */}
        <div className="bar-group">
          <span className="bar-side-label">After</span>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${aMetric.score}%`, background: aMetric.color }} />
          </div>
          <span className="bar-score">{aMetric.score}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function BeforeAfterPage({ onBack }) {
  const [beforeScan, setBeforeScan] = useState(MOCK_SCANS[3]); // oldest
  const [afterScan,  setAfterScan]  = useState(MOCK_SCANS[0]); // latest

  const scoreDiff    = afterScan.overallScore - beforeScan.overallScore;
  const metricIds    = ["hydration", "texture", "brightness", "protection", "sensitivity"];

  // concerns: gained vs resolved
  const resolvedConcerns = beforeScan.concerns.filter(c => !afterScan.concerns.includes(c));
  const newConcerns      = afterScan.concerns.filter(c => !beforeScan.concerns.includes(c));

  return (
    <div className="ba-root">

      {/* Header */}
      <div className="ba-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="ba-title">Before / After</h1>
          <p className="ba-subtitle">Compare two skin analyses</p>
        </div>
      </div>

      {/* Scan selectors */}
      <div className="selectors-row">
        <ScanDropdown
          label="Before"
          selected={beforeScan}
          options={MOCK_SCANS.filter(s => s.id !== afterScan.id)}
          onChange={setBeforeScan}
        />
        <div className="swap-icon"><ArrowLeftRight size={18} /></div>
        <ScanDropdown
          label="After"
          selected={afterScan}
          options={MOCK_SCANS.filter(s => s.id !== beforeScan.id)}
          onChange={setAfterScan}
        />
      </div>

      {/* Score comparison hero */}
      <div className="scores-hero">
        <ScoreCard scan={beforeScan} side="before" />
        <div className="scores-divider">
          <DiffBadge diff={scoreDiff} />
          <span className="scores-divider-label">Overall</span>
        </div>
        <ScoreCard scan={afterScan} side="after" />
      </div>

      {/* Metric bars */}
      <div className="section-card">
        <div className="section-title">
          <Zap size={15} style={{ color: "#f0a090" }} />
          Metric Comparison
        </div>
        <div className="compare-list">
          {metricIds.map(id => (
            <MetricCompareRow key={id} metricId={id} before={beforeScan} after={afterScan} />
          ))}
        </div>
      </div>

      {/* Concerns delta */}
      <div className="section-card">
        <div className="section-title">
          <TrendingUp size={15} style={{ color: "#f0a090" }} />
          Skin Changes
        </div>
        <div className="concerns-delta">
          {resolvedConcerns.length > 0 && (
            <div className="delta-group">
              <span className="delta-label resolved">✓ Resolved</span>
              <div className="delta-tags">
                {resolvedConcerns.map(c => (
                  <span key={c} className="delta-tag resolved">{c}</span>
                ))}
              </div>
            </div>
          )}
          {newConcerns.length > 0 && (
            <div className="delta-group">
              <span className="delta-label new">↑ New concerns</span>
              <div className="delta-tags">
                {newConcerns.map(c => (
                  <span key={c} className="delta-tag new">{c}</span>
                ))}
              </div>
            </div>
          )}
          {resolvedConcerns.length === 0 && newConcerns.length === 0 && (
            <p className="no-changes">No change in concerns between these two scans.</p>
          )}
        </div>
      </div>

    </div>
  );
}
