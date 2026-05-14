import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, ArrowLeftRight, TrendingUp, TrendingDown,
  Minus, Droplets, Sun, Shield, Zap, Heart, ChevronDown
} from "lucide-react";
import "./BeforeAfterPage.css";

const API_URL = "http://127.0.0.1:8000/api";

// ── [تغيير 1] نفس الـ helper تبع HistoryPage ──
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem('token')}`
});

function normalizeEntry(raw) {
  return {
    id:           raw.id,
    label:        new Date(raw.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    overallScore: raw.overall_score,
    skinType:     raw.skin_type,
    concerns:     (raw.concerns || []).map(c => c.tag || c),
    metrics:      raw.metrics || [],
  };
}

function scoreColor(score) {
  if (score >= 75) return "#5AADA0";
  if (score >= 60) return "#C8B8A2";
  return "#D4907E";
}

function DiffBadge({ diff }) {
  if (diff === 0) return <span className="diff-badge flat"><Minus size={11} /> 0</span>;
  if (diff > 0)   return <span className="diff-badge up"><TrendingUp size={11} /> +{diff}</span>;
  return               <span className="diff-badge down"><TrendingDown size={11} /> {diff}</span>;
}

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

function ScoreCard({ scan, side }) {
  const color = scoreColor(scan.overallScore);
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (scan.overallScore / 100) * circ;

  return (
    <div className={`score-card ${side}`}>
      <div className="score-card-ring-wrap">
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={r} fill="none" stroke="#DDD0C0" strokeWidth="6" opacity="0.4" />
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

function MetricCompareRow({ metricId, before, after }) {
  const bMetric = before.metrics.find(m => m.id === metricId);
  const aMetric = after.metrics.find(m => m.id === metricId);
  if (!bMetric || !aMetric) return null;
  const diff = aMetric.score - bMetric.score;

  return (
    <div className="compare-row">
      <div className="compare-row-header">
        <span className="compare-metric-name">{aMetric.label}</span>
        <DiffBadge diff={diff} />
      </div>
      <div className="compare-bars">
        <div className="bar-group">
          <span className="bar-side-label">Before</span>
          <div className="bar-track">
            <div className="bar-fill before-fill" style={{ width: `${bMetric.score}%`, background: bMetric.color + "88" }} />
          </div>
          <span className="bar-score">{bMetric.score}</span>
        </div>
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

export default function BeforeAfterPage({ onBack }) {
  const [scans, setScans]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [beforeScan, setBeforeScan] = useState(null);
  const [afterScan,  setAfterScan]  = useState(null);

  // ── [تغيير 2] أضفنا الـ token للـ fetch ──
  useEffect(() => {
    const fetchScans = async () => {
      try {
        const response = await fetch(`${API_URL}/analyses`, {
          headers: getAuthHeaders(),
        });
        const data = await response.json();

        if (data.success && data.data.length >= 2) {
          const normalized = data.data.map(normalizeEntry);
          setScans(normalized);
          setAfterScan(normalized[0]);
          setBeforeScan(normalized[normalized.length - 1]);
        } else if (data.data && data.data.length < 2) {
          setError("You need at least 2 analyses to compare.");
        } else {
          setError("Failed to load analyses.");
        }
      } catch (err) {
        setError("Failed to load analyses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchScans();
  }, []);

  if (loading) {
    return (
      <div className="ba-root">
        <div className="ba-header">
          <button className="back-btn" onClick={onBack}><ArrowLeft size={18} /></button>
          <div><h1 className="ba-title">Before / After</h1></div>
        </div>
        <div style={{ textAlign: "center", padding: "3rem", color: "#8B6450" }}>
          Loading analyses...
        </div>
      </div>
    );
  }

  if (error || !beforeScan || !afterScan) {
    return (
      <div className="ba-root">
        <div className="ba-header">
          <button className="back-btn" onClick={onBack}><ArrowLeft size={18} /></button>
          <div><h1 className="ba-title">Before / After</h1></div>
        </div>
        <div style={{ textAlign: "center", padding: "3rem", color: "#B8685A" }}>
          {error || "Not enough data to compare."}
        </div>
      </div>
    );
  }

  const scoreDiff        = afterScan.overallScore - beforeScan.overallScore;
  const metricIds        = ["hydration", "texture", "brightness", "protection", "sensitivity"];
  const resolvedConcerns = beforeScan.concerns.filter(c => !afterScan.concerns.includes(c));
  const newConcerns      = afterScan.concerns.filter(c => !beforeScan.concerns.includes(c));

  return (
    <div className="ba-root">

      <div className="ba-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="ba-title">Before / After</h1>
          <p className="ba-subtitle">Compare two skin analyses</p>
        </div>
      </div>

      <div className="selectors-row">
        <ScanDropdown
          label="Before"
          selected={beforeScan}
          options={scans.filter(s => s.id !== afterScan.id)}
          onChange={setBeforeScan}
        />
        <div className="swap-icon"><ArrowLeftRight size={18} /></div>
        <ScanDropdown
          label="After"
          selected={afterScan}
          options={scans.filter(s => s.id !== beforeScan.id)}
          onChange={setAfterScan}
        />
      </div>

      <div className="scores-hero">
        <ScoreCard scan={beforeScan} side="before" />
        <div className="scores-divider">
          <DiffBadge diff={scoreDiff} />
          <span className="scores-divider-label">Overall</span>
        </div>
        <ScoreCard scan={afterScan} side="after" />
      </div>

      <div className="section-card">
        <div className="section-title">
          <Zap size={15} style={{ color: "#3D8C80" }} />
          Metric Comparison
        </div>
        <div className="compare-list">
          {metricIds.map(id => (
            <MetricCompareRow key={id} metricId={id} before={beforeScan} after={afterScan} />
          ))}
        </div>
      </div>

      <div className="section-card">
        <div className="section-title">
          <TrendingUp size={15} style={{ color: "#3D8C80" }} />
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