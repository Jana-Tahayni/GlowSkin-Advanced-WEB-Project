import React, { useState, useEffect } from "react";
import {
  Clock, TrendingUp, TrendingDown, Minus,
  ChevronDown, ChevronUp, Droplets, Sun,
  Shield, Zap, Heart, ArrowLeft, Trash2, ArrowLeftRight
} from "lucide-react";
import "./HistoryPage.css";

const API_URL = "http://127.0.0.1:8000/api";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem('token')}`
});

function normalizeEntry(raw) {
  return {
    id:           raw.id,
    date:         raw.created_at,
    label:        new Date(raw.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    overallScore: raw.overall_score,
    skinType:     raw.skin_type,
    concerns:     (raw.concerns || []).map(c => c.tag || c),
    metrics:      raw.metrics || [],
  };
}

function scoreColor(score) {
  if (score >= 80) return "#5AADA0";
  if (score >= 65) return "#C8B8A2";
  return "#D4907E";
}

function Trend({ current, previous }) {
  if (!previous) return null;
  const diff = current - previous;
  if (diff > 0) return <span className="trend up"><TrendingUp size={13} />{`+${diff}`}</span>;
  if (diff < 0) return <span className="trend down"><TrendingDown size={13} />{diff}</span>;
  return <span className="trend flat"><Minus size={13} />0</span>;
}

function MiniRing({ score }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = scoreColor(score);
  return (
    <div className="mini-ring-wrap">
      <svg width="68" height="68" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={r} fill="none" stroke="#DDD0C0" strokeWidth="5" opacity="0.5" />
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

function TimelineCard({ entry, prevEntry, index, onDelete }) {
  const [expanded, setExpanded] = useState(index === 0);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/analyses/${entry.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.success) onDelete(entry.id);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className={`timeline-card ${index === 0 ? "latest" : ""}`}>
      <div className="timeline-dot-col">
        <div className={`timeline-dot ${index === 0 ? "dot-active" : ""}`} />
        <div className="timeline-line" />
      </div>

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
              <button className="tl-action-btn danger" onClick={handleDelete}>
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreChart({ history }) {
  const max = 100;
  const reversed = [...history].reverse();
  return (
    <div className="chart-wrap">
      <div className="chart-bars">
        {reversed.map((entry) => (
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

export default function HistoryPage({ onBack, onCompare }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${API_URL}/analyses`, {
          headers: getAuthHeaders(),
        });
        const data = await response.json();

        if (data.success) {
          setHistory(data.data.map(normalizeEntry));
        } else {
          setError("Failed to load history.");
        }
      } catch (err) {
        setError("Failed to load history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = (id) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  if (loading) {
    return (
      <div className="history-root">
        <div className="history-header">
          <button className="back-btn" onClick={onBack}><ArrowLeft size={18} /></button>
          <div style={{flex:1}}>
            <h1 className="history-title">Skin History</h1>
            <p className="history-subtitle">Loading...</p>
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "3rem", color: "#8B6450" }}>
          Loading your analyses...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-root">
        <div className="history-header">
          <button className="back-btn" onClick={onBack}><ArrowLeft size={18} /></button>
          <h1 className="history-title">Skin History</h1>
        </div>
        <div style={{ textAlign: "center", padding: "3rem", color: "#B8685A" }}>
          {error}
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="history-root">
        <div className="history-header">
          <button className="back-btn" onClick={onBack}><ArrowLeft size={18} /></button>
          <h1 className="history-title">Skin History</h1>
        </div>
        <div style={{ textAlign: "center", padding: "3rem", color: "#8B6450" }}>
          No analyses yet. Upload a photo to get started!
        </div>
      </div>
    );
  }

  const latest      = history[0];
  const oldest      = history[history.length - 1];
  const improvement = latest.overallScore - oldest.overallScore;

  return (
    <div className="history-root">

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

      <div className="summary-strip">
        <div className="summary-item">
          <span className="summary-value">{latest.overallScore}</span>
          <span className="summary-label">Current Score</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="summary-value" style={{ color: improvement >= 0 ? "#3D8C80" : "#D4907E" }}>
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

      <div className="section-card">
        <div className="section-title">
          <TrendingUp size={15} style={{ color: "#3D8C80" }} />
          Score Over Time
        </div>
        <ScoreChart history={history} />
      </div>

      <div className="section-card">
        <div className="section-title">
          <Clock size={15} style={{ color: "#3D8C80" }} />
          Analysis Timeline
        </div>
        <div className="timeline">
          {history.map((entry, i) => (
            <TimelineCard
              key={entry.id}
              entry={entry}
              prevEntry={history[i + 1] || null}
              index={i}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

    </div>
  );
}