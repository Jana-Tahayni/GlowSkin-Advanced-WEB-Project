// src/components/HistoryDetail.js
import { useState, useEffect } from "react";
import ResultsCard from "./ResultsCard";

const HistoryDetail = ({ id, onBack, authHeaders }) => {  
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/products/history/${id}`, {
          headers: authHeaders,   
        });

        if (!res.ok) {
          setError("Record not found.");
          return;
        }

        const data = await res.json();
            setResult({
        productName:        data.product_name,
        imgPreview:         data.image_path
                              ? `/storage/${data.image_path}`
                              : null,                          
        effectivenessScore: data.effectiveness_score,
        safetyScore:        data.safety_score,
        compatibilityScore: Math.round((data.effectiveness_score + data.safety_score) / 2),
        overallScore:       Math.round((data.effectiveness_score + data.safety_score) / 2),
        compatibility:      data.compatibility,
        ingredients:        (data.key_ingredients ?? []).map(ing =>
          typeof ing === "string"
            ? { name: ing, desc: "", status: "good" }
            : ing
        ),
        warnings:           data.warnings ?? [],
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