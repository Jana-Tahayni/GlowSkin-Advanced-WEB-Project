import CompatBadge from "./CompatBadge";
import ScoreBar    from "./ScoreBar";
import skincareImg from "../assets/skincare.jpg"; 
import verdict from "../assets/verdict.jpg"; 
import "../Product.css"


const ResultsCard = ({ result }) => (
  
  <div className="fade-up">

   
    <div className="card" style={{ marginBottom: "1.4rem" }}>
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "1rem", marginBottom: "1.6rem",
        }}
      >
        <div>
          <p className="section-label">Analysis Results</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.7rem", color: "var(--darkest)" }}>
            {result.productName}
          </h2>
        </div>
        <CompatBadge level={result.compatibility} />
      </div>

        {result.imgPreview && (
    <div style={{ marginBottom: "1.6rem" }}>
      <img
        src={result.imgPreview}
        alt="Product"
        style={{
          width: 200,
          height: 200,
          objectFit: "cover",
          borderRadius: "var(--radius)",
          border: "1px solid var(--accent)",
        }}
      />
    </div>
  )}

        <ScoreBar label="Effectiveness Score"    value={result.effectivenessScore} delay={0}   />
        <ScoreBar label="Safety Score"           value={result.safetyScore}        delay={150} />
        <ScoreBar label="Overall Compatibility"  value={result.compatibilityScore} delay={300} />
      </div>

    {/* ── Ingredients ── */}
    <div className="card delay-1 fade-up" style={{ marginBottom: "1.4rem" }}>
      <p className="section-label">Ingredient Breakdown</p>
      <h3 className="section-title" style={{ fontSize: "1.4rem" }}>What's Inside</h3>

      <div className="ingredient-grid">
        {result.ingredients.map((ing, i) => (
          <div className="ingredient-card" key={i}>
            <div className="ingredient-name">{ing.name}</div>
            <div className="ingredient-desc">{ing.desc}</div>
            <span
              className={`ingredient-status ${
                ing.status === "good" ? "status-good" : "status-warning"
              }`}
            >
              {ing.status === "good" ? "✓ Beneficial" : "⚠ Caution"}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* ── Warnings ── */}
    {result.warnings.length > 0 && (
      <div className="warning-box delay-2 fade-up" style={{ marginBottom: "1.4rem" }}>
        <div className="warning-box-title">⚠ Skin Warnings</div>
        {result.warnings.map((w, i) => (
          <div className="warning-item" key={i}>{w}</div>
        ))}
      </div>
    )}

    <div
        className="delay-3 fade-up"
        style={{
            backgroundImage: `
            linear-gradient(rgba(244, 237, 221, 0.45), rgba(209, 185, 168, 0.50)),
            url(${verdict})
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "var(--radius)",
            padding: "3rem",
            border: "1px solid var(--accent)",
            textAlign: "center",
        }}
        >
        <div className="verdict-score">{result.overallScore}</div>
        <div className="verdict-label">Overall Score</div>
        <p className="verdict-text">{result.verdict}</p>

        <div
            style={{
            display: "flex", gap: "1rem", justifyContent: "center",
            marginTop: "1.8rem", flexWrap: "wrap",
            }}
        >
            <button className="btn-secondary">Save to History</button>
            <button className="btn-secondary">Share Results</button>
        </div>
    </div>
        
</div>
    
    );

    export default ResultsCard;