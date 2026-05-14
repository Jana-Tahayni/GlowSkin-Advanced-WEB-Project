const CompatBadge = ({ level }) => {
  const cls =
    level === "High"   ? "badge-high"   :
    level === "Medium" ? "badge-medium" :
                         "badge-low";

  const icon =
    level === "High"   ? "✓" :
    level === "Medium" ? "~" : "!";

  return (
    <span className={`badge ${cls}`}>
      <span>{icon}</span> {level} Compatibility
    </span>
  );
};
export default CompatBadge;