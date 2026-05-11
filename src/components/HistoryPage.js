// src/components/HistoryPage.js
import { useState, useEffect } from "react";
import CompatBadge from "./CompatBadge";

const HistoryPage = ({ onBack, onSelect, authHeaders }) => {  
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("");

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filter) params.append("compatibility", filter);

      const res  = await fetch(`/api/products/history?${params}`, {
        headers: authHeaders,   
      });
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, [filter]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await fetch(`/api/products/history/${id}`, {
        method:  "DELETE",
        headers: authHeaders,   
      });
      setHistory(history.filter(item => item.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "2.5rem 1.2rem" }}>

      <button className="btn-secondary" style={{ marginBottom: "1.6rem" }} onClick={onBack}>
        ← Back to Analyzer
      </button>

      <p className="section-label">Your Profile</p>
      <h2 className="section-title" style={{ fontSize: "2rem", marginBottom: "1.6rem" }}>
        Analysis History
      </h2>

      <div className="image-placeholder" style={{ height: 450, marginBottom: "1.6rem" }}>
        <img
          src="https://i.pinimg.com/1200x/b5/d1/f5/b5d1f5dc846c127de60f3b3316567607.jpg"
          alt="History Visual"
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
        />
      </div>

       <div style={{ display: "flex", gap: "1rem", marginBottom: "1.4rem" }}>
        <input
          className="input-field"
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchHistory()}
        />
        <select
          className="input-field"
          style={{ maxWidth: 160 }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="good">High</option>     
          <option value="neutral">Medium</option>  
          <option value="bad">Low</option>        
        </select>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--mid)" }}>
          Loading...
        </div>
      )}

      {!loading && history.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🧴</div>
          <div className="empty-state-title">No analyses yet</div>
          <p>Start by analyzing your first skincare product.</p>
        </div>
      )}

      {!loading && history.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {history.map((item) => (
            <div
              className="history-card fade-up"
              key={item.id}
              onClick={() => onSelect(item.id)}  
            >
              <div className="history-thumb">🧴</div>
              <div className="history-info">
                <div className="history-product">{item.product_name}</div>
                <div className="history-meta">
                  {formatDate(item.created_at)} · {item.compatibility}
                </div>
                <CompatBadge level={item.compatibility} />
              </div>
              <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: ".5rem" }}>
                <div className="history-score">
                  {Math.round((item.effectiveness_score + item.safety_score) / 2)}
                </div>
                <div style={{ fontSize: ".72rem", color: "var(--mid)", letterSpacing: ".06em" }}>score</div>
                <button
                  className="btn-secondary"
                  style={{ fontSize: ".72rem", padding: ".3rem .8rem", color: "#9B3A2E", borderColor: "#9B3A2E" }}
                  onClick={(e) => handleDelete(e, item.id)}  
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default HistoryPage;
//بضل عنا تكمل شرح لكود ال history وتشرح شو غيرنا بال productform , imageuplode , app.js 