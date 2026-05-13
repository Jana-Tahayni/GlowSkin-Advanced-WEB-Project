import { useState, useRef } from "react";
import {
  Sparkles, RotateCcw, Download, Share2,
  Droplets, Sun, Shield, Zap, Heart, AlertCircle,
  Star, Check, Copy
} from "lucide-react";
import "./ResultsPage.css";

const METRIC_ICONS = {
  hydration:   Droplets,
  texture:     Zap,
  brightness:  Sun,
  protection:  Shield,
  sensitivity: Heart,
};

function normalizeResults(raw) {
  if (!raw) return null;
  return {
    overallScore: raw.overall_score,
    skinType:     raw.skin_type,
    summary:      raw.summary,
    metrics:      (raw.metrics || []).map((m) => ({
      ...m,
      icon: METRIC_ICONS[m.id] || Zap,
    })),
    concerns: raw.concerns || [],
  };
}

const SEVERITY_STYLES = {
  mild:     { bg: "#fef0ea", color: "#c0644e", border: "#f5c9b3" },
  moderate: { bg: "#fff3cd", color: "#856404", border: "#ffc107" },
  high:     { bg: "#fde8e8", color: "#b91c1c", border: "#f87171" },
};

function ScoreRing({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="score-ring-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <defs>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0a090" />
            <stop offset="100%" stopColor="#b8c9a3" />
          </linearGradient>
        </defs>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#f5c9b3" strokeWidth="10" opacity="0.35" />
        <circle cx="70" cy="70" r={radius} fill="none" stroke="url(#ring-grad)" strokeWidth="10"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      <div className="score-ring-inner">
        <span className="score-number">{score}</span>
        <span className="score-label">/ 100</span>
      </div>
    </div>
  );
}

function MetricBar({ metric }) {
  const Icon = metric.icon;
  return (
    <div className="metric-row">
      <div className="metric-left">
        <span className="metric-icon-wrap" style={{ background: metric.color + "22" }}>
          <Icon size={14} style={{ color: metric.color }} />
        </span>
        <span className="metric-name">{metric.label}</span>
      </div>
      <div className="metric-bar-track">
        <div className="metric-bar-fill"
          style={{ width: `${metric.score}%`, background: `linear-gradient(90deg, ${metric.color}88, ${metric.color})` }} />
      </div>
      <span className="metric-score">{metric.score}</span>
    </div>
  );
}

export default function ResultsPage({ imageData, skinType, onReset, results: rawResults }) {
  const results = normalizeResults(rawResults);

  // ── [تغيير 1] state لحالة الأزرار ──────────────────
  const [copied, setCopied]     = useState(false); // عشان نعرض "Copied!" بعد النسخ
  const [shareOpen, setShareOpen] = useState(false); // عشان نفتح/نقفل الـ share menu
  const printRef = useRef();

  if (!results) return null;

  const scoreLabel =
    results.overallScore >= 85 ? "Excellent" :
    results.overallScore >= 70 ? "Good" :
    results.overallScore >= 55 ? "Fair" : "Needs Care";

  // ── [تغيير 2] دالة Save as PDF ──────────────────────
  // نفتح print dialog — المستخدم يختار "Save as PDF" من الطابعة
  const handleSavePDF = () => {
    window.print();
  };

  // ── [تغيير 3] دالة Copy Link ─────────────────────────
  // ننسخ نص ملخص النتائج للـ clipboard
  const handleCopyLink = async () => {
    const text = `🌿 GlowSkin Analysis Results
━━━━━━━━━━━━━━━━━━━━━
Overall Score: ${results.overallScore}/100 (${scoreLabel})
Skin Type: ${results.skinType}

Summary:
${results.summary}

Metrics:
${results.metrics.map(m => `• ${m.label}: ${m.score}/100`).join("\n")}

Concerns:
${results.concerns.map(c => `• ${c.tag} (${c.severity})`).join("\n")}
━━━━━━━━━━━━━━━━━━━━━
Analyzed by GlowSkin AI`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // ── [تغيير 4] دالة Share via WhatsApp ───────────────
  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `🌿 My GlowSkin Results\n` +
      `Score: ${results.overallScore}/100 (${scoreLabel})\n` +
      `Skin Type: ${results.skinType}\n\n` +
      `${results.summary}\n\n` +
      `Analyzed by GlowSkin AI 💚`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="results-root" ref={printRef}>

      {/* Hero score card */}
      <div className="results-hero-card">
        <div className="results-hero-left">
          <ScoreRing score={results.overallScore} />
          <div>
            <p className="score-badge">{scoreLabel}</p>
            <h2 className="results-headline">Your Skin Score</h2>
            <p className="results-skin-type">
              <Droplets size={14} style={{ verticalAlign: "middle", marginRight: "0.3rem" }} />
              {results.skinType} Skin
            </p>
          </div>
        </div>
        {imageData && (
          <div className="results-photo-wrap">
            <img src={imageData} alt="Analyzed skin" className="results-photo" />
            <span className="results-photo-badge">
              <Sparkles size={12} /> Analyzed
            </span>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="results-section">
        <p className="results-summary">{results.summary}</p>
      </div>

      {/* Metrics */}
      <div className="results-section">
        <h3 className="section-title">
          <Zap size={16} style={{ color: "#f0a090" }} /> Skin Metrics
        </h3>
        <div className="metrics-list">
          {results.metrics.map((m) => <MetricBar key={m.id} metric={m} />)}
        </div>
      </div>

      {/* Concerns */}
      <div className="results-section">
        <h3 className="section-title">
          <AlertCircle size={16} style={{ color: "#f0a090" }} /> Detected Concerns
        </h3>
        <div className="tags-wrap">
          {results.concerns.map((c) => {
            const s = SEVERITY_STYLES[c.severity] || SEVERITY_STYLES.mild;
            return (
              <span key={c.tag} className="concern-tag"
                style={{ background: s.bg, color: s.color, borderColor: s.border }}>
                {c.tag}
              </span>
            );
          })}
        </div>
      </div>

      {/* Consult */}
      <div className="results-section consult-section">
        <h3 className="section-title">
          <Star size={16} style={{ color: "#f0a090" }} /> Want Expert Advice?
        </h3>
        <p className="consult-text">
          Get personalised product recommendations and a detailed skin care routine from a certified dermatologist.
        </p>
        <button className="consult-btn">Consult a Specialist →</button>
      </div>

      {/* ── [تغيير 5] Actions مع Share menu ─────────── */}
      <div className="results-actions">
        <button className="action-btn primary" onClick={onReset}>
          <RotateCcw size={16} /> Analyze Again
        </button>

        {/* Save as PDF */}
        <button className="action-btn secondary" onClick={handleSavePDF}>
          <Download size={16} /> Save Report
        </button>

        {/* Share — يفتح dropdown */}
        <div className="share-wrap">
          <button className="action-btn secondary" onClick={() => setShareOpen(!shareOpen)}>
            <Share2 size={16} /> Share
          </button>

          {/* ── [تغيير 6] Share dropdown menu ────────── */}
          {shareOpen && (
            <div className="share-menu">
              {/* Copy text */}
              <button className="share-item" onClick={handleCopyLink}>
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? "Copied!" : "Copy Results"}
              </button>
              {/* WhatsApp */}
              <button className="share-item whatsapp" onClick={handleWhatsApp}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.525 5.845L.057 23.5l5.832-1.527A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.499-5.207-1.371l-.373-.221-3.864 1.013 1.03-3.764-.242-.386A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                Share on WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}