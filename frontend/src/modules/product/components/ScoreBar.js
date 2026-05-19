// src/components/ScoreBar.js
import { useState, useEffect } from "react";
import "../Product.css"


const ScoreBar = ({ label, value, delay = 0 }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 300 + delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return (
    <div className="score-bar-wrap">
      <div className="score-bar-label">
        <span className="score-bar-name">{label}</span>
        <span className="score-bar-val">{value}%</span>
      </div>
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
};

export default ScoreBar;