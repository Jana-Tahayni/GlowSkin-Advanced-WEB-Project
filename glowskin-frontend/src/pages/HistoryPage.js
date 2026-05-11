import React, { useState } from "react";
import {
  Clock, TrendingUp, TrendingDown, Minus,
  ChevronDown, ChevronUp, Droplets, Sun,
  Shield, Zap, Heart, ArrowLeft, Trash2, ArrowLeftRight
} from "lucide-react";
import "./HistoryPage.css";

/* ── Mock history data ── */
const MOCK_HISTORY = [
  {
    id: 1,
    date: "2025-05-10",
    label: "Today",
    overallScore: 74,
    skinType: "Combination",
    thumbnail: null,
    concerns: ["T-zone oiliness", "Minor pores"],
    metrics: [
      { id: "hydration",   label: "Hydration",  score: 82, color: "#5ba4cf" },
      { id: "texture",     label: "Texture",    score: 68, color: "#b8c9a3" },
      { id: "brightness",  label: "Brightness", score: 71, color: "#f5c9b3" },
      { id: "protection",  label: "Protection", score: 60, color: "#c9a3b8" },
      { id: "sensitivity", label: "Sensitivity",score: 79, color: "#f0a090" },
    ],
  },
  {
    id: 2,
    date: "2025-04-22",
    label: "Apr 22",
    overallScore: 68,
    skinType: "Combination",
    thumbnail: null,
    concerns: ["T-zone oiliness", "Dryness", "Dullness"],
    metrics: [
      { id: "hydration",   label: "Hydration",  score: 74, color: "#5ba4cf" },
      { id: "texture",     label: "Texture",    score: 61, color: "#b8c9a3" },
      { id: "brightness",  label: "Brightness", score: 65, color: "#f5c9b3" },
      { id: "protection",  label: "Protection", score: 55, color: "#c9a3b8" },
      { id: "sensitivity", label: "Sensitivity",score: 80, color: "#f0a090" },
    ],
  },
  {
    id: 3,
    date: "2025-04-01",
    label: "Apr 1",
    overallScore: 61,
    skinType: "Dry",
    thumbnail: null,
    concerns: ["Severe dryness", "Redness", "Flakiness"],
    metrics: [
      { id: "hydration",   label: "Hydration",  score: 55, color: "#5ba4cf" },
      { id: "texture",     label: "Texture",    score: 58, color: "#b8c9a3" },
      { id: "brightness",  label: "Brightness", score: 60, color: "#f5c9b3" },
      { id: "protection",  label: "Protection", score: 50, color: "#c9a3b8" },
      { id: "sensitivity", label: "Sensitivity",score: 72, color: "#f0a090" },
    ],
  },
  {
    id: 4,
    date: "2025-03-10",
    label: "Mar 10",
    overallScore: 58,
    skinType: "Dry",
    thumbnail: null,
    concerns: ["Severe dryness", "Sensitivity", "Redness"],
    metrics: [
      { id: "hydration",   label: "Hydration",  score: 48, color: "#5ba4cf" },
      { id: "texture",     label: "Texture",    score: 55, color: "#b8c9a3" },
      { id: "brightness",  label: "Brightness", score: 57, color: "#f5c9b3" },
      { id: "protection",  label: "Protection", score: 48, color: "#c9a3b8" },
      { id: "sensitivity", label: "Sensitivity",score: 68, color: "#f0a090" },
    ],
  },
];

/* ── Score colour helper ── */
function scoreColor(score) {
  if (score >= 80) return "#b8c9a3";
  if (score >= 65) return "#f5c9b3";
  return "#f0a090";
}

/* ── Trend icon ── */
function Trend({ current, previous }) {
  if (!previous) return null;
  const diff = current - previous;
  if (diff > 0) return <span className="trend up"><TrendingUp size={13} />{diff > 0 ? `+${diff}` : diff}</span>;
  if (diff < 0) return <span className="trend down"><TrendingDown size={13} />{diff}</span>;
  return <span className="trend flat"><Minus size={13} />0</span>;
}

/* ── Mini score ring ── */
function MiniRing({ score }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = scoreColor(score);
  return (
    <div className="mini-ring-wrap">
      <svg width="68" height="68" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={r} fill="none" stroke="#f5c9b3" strokeWidth="5" opacity="0.35" />
        <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 26 26)" />
      </svg>
      <span className="mini-ring-score">{score}</span>
    </div>
  );
}

/* ── Timeline card ── */
function TimelineCard({ entry, prevEntry, index }) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div className={`timeline-card ${index === 0 ? "latest" : ""}`}>
      {/* connector dot */}
      <div className="timeline-dot-col">
        <div className={`timeline-dot ${index === 0 ? "dot-active" : ""}`} />
        <div className="timeline-line" />
      </div>

      {/* card body */}
      <div className="timeline-body">
        <div className="timeline-header" onClick={() => setExpanded(!expanded)}>
          <div className="timeline-header-left">
            <MiniRing score={entry.overallScore} />
            <div>
              <div className="timeline-date-row">
                <span className="timeline-label">{entry.label}</span>
                {index === 0 && <span className="latest-badge">Latest</span>}
                <Trend current={entry.overallScore} previous={prevEntry?.overallScore} />
              </div>
              <span className="timeline-skin-type">{entry.skinType} Skin</span>
              <div className="timeline-tags">
                {entry.concerns.slice(0, 2).map(c => (
                  <span key={c} className="mini-tag">{c}</span>
                ))}
                {entry.concerns.length > 2 && (
                  <span className="mini-tag muted">+{entry.concerns.length - 2}</span>
                )}
              </div>
            </div>
          </div>
          <button className="expand-btn">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {expanded && (
          <div className="timeline-details">
            <div className="metrics-grid">
              {entry.metrics.map(m => (
                <div key={m.id} className="metric-mini">
                  <span className="metric-mini-label">{m.label}</span>
                  <div className="metric-mini-track">
                    <div className="metric-mini-fill" style={{ width: `${m.score}%`, background: m.color }} />
                  </div>
                  <span className="metric-mini-score" style={{ color: m.color }}>{m.score}</span>
                </div>
              ))}
            </div>
            <div className="timeline-actions">
              <button className="tl-action-btn">View Full Report</button>
              <button className="tl-action-btn danger"><Trash2 size={13} /> Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Progress chart (simple bar chart) ── */
function ScoreChart({ history }) {
  const max = 100;
  const reversed = [...history].reverse();
  return (
    <div className="chart-wrap">
      <div className="chart-bars">
        {reversed.map((entry, i) => (
          <div key={entry.id} className="chart-bar-col">
            <span className="chart-score-label">{entry.overallScore}</span>
            <div className="chart-bar-track">
              <div
                className="chart-bar-fill"
                style={{
                  height: `${(entry.overallScore / max) * 100}%`,
                  background: scoreColor(entry.overallScore),
                }}
              />
            </div>
            <span className="chart-date-label">{entry.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main ── */
export default function HistoryPage({ onBack, onCompare }) {
  const [history] = useState(MOCK_HISTORY);

  const latest  = history[0];
  const oldest  = history[history.length - 1];
  const improvement = latest.overallScore - oldest.overallScore;

  return (
    <div className="history-root">

      {/* Header */}
      <div className="history-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={18} />
        </button>
        <div style={{flex:1}}>
          <h1 className="history-title">Skin History</h1>
          <p className="history-subtitle">{history.length} analyses recorded</p>
        </div>
        <button className="compare-nav-btn" onClick={onCompare}>
          <ArrowLeftRight size={15} />
          Compare
        </button>
      </div>

      {/* Summary strip */}
      <div className="summary-strip">
        <div className="summary-item">
          <span className="summary-value">{latest.overallScore}</span>
          <span className="summary-label">Current Score</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="summary-value" style={{ color: improvement >= 0 ? "#b8c9a3" : "#f0a090" }}>
            {improvement >= 0 ? `+${improvement}` : improvement}
          </span>
          <span className="summary-label">Overall Progress</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="summary-value">{history.length}</span>
          <span className="summary-label">Total Scans</span>
        </div>
      </div>

      {/* Score chart */}
      <div className="section-card">
        <div className="section-title">
          <TrendingUp size={15} style={{ color: "#f0a090" }} />
          Score Over Time
        </div>
        <ScoreChart history={history} />
      </div>

      {/* Timeline */}
      <div className="section-card">
        <div className="section-title">
          <Clock size={15} style={{ color: "#f0a090" }} />
          Analysis Timeline
        </div>
        <div className="timeline">
          {history.map((entry, i) => (
            <TimelineCard
              key={entry.id}
              entry={entry}
              prevEntry={history[i + 1] || null}
              index={i}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
