const CompatBadge = ({ level }) => {
   const normalized =
    level === "good"    ? "High"   :
    level === "neutral" ? "Medium" :
    level === "bad"     ? "Low"    :
    level;  

  const cls =
    normalized === "High"   ? "badge-high"   :
    normalized === "Medium" ? "badge-medium" :
                              "badge-low";

  const icon =
    normalized === "High"   ? "✓" :
    normalized === "Medium" ? "~" : "!";

  return (
    <span className={`badge ${cls}`}>
      <span>{icon}</span> {normalized} Compatibility
    </span>
  );
};

export default CompatBadge;