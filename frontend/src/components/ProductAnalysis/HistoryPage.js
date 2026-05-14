// src/components/HistoryPage.js
import CompatBadge from "./ProductAnalysis/CompatBadge";

// ── Mock data — replace with real API call ──
const MOCK_HISTORY = [
  { id: 1, product: "CeraVe Moisturizing Cream",       date: "Mar 26, 2025", skin: "Dry",         score: 91, compat: "High"   },
  { id: 2, product: "The Ordinary Niacinamide 10%",    date: "Mar 18, 2025", skin: "Oily",        score: 78, compat: "Medium" },
  { id: 3, product: "La Roche-Posay Toleriane",        date: "Mar 10, 2025", skin: "Sensitive",   score: 95, compat: "High"   },
  { id: 4, product: "Neutrogena Hydro Boost",          date: "Feb 28, 2025", skin: "Combination", score: 64, compat: "Low"    },
];

const HistoryPage = ({ onBack }) => (
  <div style={{ maxWidth: 760, margin: "0 auto", padding: "2.5rem 1.2rem" }}>

    <button className="btn-secondary" style={{ marginBottom: "1.6rem" }} onClick={onBack}>
      ← Back to Analyzer
    </button>

    <p className="section-label">Your Profile</p>
    <h2 className="section-title" style={{ fontSize: "2rem", marginBottom: "1.8rem" }}>
      Analysis History
    </h2>

    {/* Decorative image placeholder */}
    <div className="image-placeholder" style={{ height: 90, marginBottom: "2rem" }}>
      {/* Replace with history/skincare image */}
      <span style={{ fontSize: ".72rem", letterSpacing: ".1em" }}>History Visual</span>
    </div>

    {MOCK_HISTORY.length === 0 ? (
      <div className="empty-state">
        <div className="empty-state-icon">🧴</div>
        <div className="empty-state-title">No analyses yet</div>
        <p>Start by analyzing your first skincare product.</p>
      </div>
    ) : (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {MOCK_HISTORY.map((item) => (
          <div className="history-card fade-up" key={item.id}>
            <div className="history-thumb">🧴</div>
            <div className="history-info">
              <div className="history-product">{item.product}</div>
              <div className="history-meta">{item.date} · {item.skin} skin</div>
              <CompatBadge level={item.compat} />
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="history-score">{item.score}</div>
              <div style={{ fontSize: ".72rem", color: "var(--mid)", letterSpacing: ".06em" }}>score</div>
            </div>
          </div>
        ))}
      </div>
    )}

  </div>
);

export default HistoryPage;