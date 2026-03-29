import { Sparkles, ShieldCheck } from "lucide-react";
import "./AnalyzeButton.css";

export default function AnalyzeButton({ disabled, onClick, label = "Analyze Your Skin" }) {
  return (
    <div className="analyze-section">
      <button
        className="analyze-btn"
        disabled={disabled}
        onClick={onClick}
      >
        <Sparkles size={20} />
        <span>{label}</span>
      </button>
      <p className="analyze-privacy">
        <ShieldCheck size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "0.25rem" }} />
        Your photo is analyzed securely and never stored
      </p>
    </div>
  );
}