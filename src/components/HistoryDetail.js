// src/components/HistoryDetail.js
import { useState, useEffect } from "react";
import ResultsCard from "./ResultsCard";

const HistoryDetail = ({ id, onBack }) => {
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res  = await fetch(`/api/products/history/${id}`);

        if (!res.ok) {
          setError("Record not found.");
          return;
        }

        const data = await res.json();
        setResult({
          productName:        data.product_name,
          effectivenessScore: data.effectiveness_score,
          safetyScore:        data.safety_score,
          compatibilityScore: data.compatibility_score ?? 0,
          overallScore:       data.overall_score ?? 0,
          compatibility:      data.compatibility,
          ingredients:        data.key_ingredients,
          warnings:           data.warnings,
          verdict:            data.verdict,
        });
      } catch (err) {
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "2.5rem 1.2rem 5rem" }}>

      <button className="btn-secondary" style={{ marginBottom: "1.6rem" }} onClick={onBack}>
        ← Back to History
      </button>

      {loading && (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--mid)" }}>
          Loading...
        </div>
      )}

      {error && (
        <div className="warning-box">
          <div className="warning-box-title">⚠ {error}</div>
        </div>
      )}

      {result && <ResultsCard result={result} />}

    </div>
  );
};

export default HistoryDetail;