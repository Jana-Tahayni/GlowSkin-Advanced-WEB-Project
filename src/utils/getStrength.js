export default function getStrength(val) {
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const widths = ["0%", "25%", "50%", "75%", "100%"];
  const labels = [
    "",
    "Weak password",
    "Fair password",
    "Good password",
    "Strong password"
  ];

  return {
    width: widths[score],
    label: score > 0 ? labels[score] : "Use 8+ characters with letters and numbers"
  };
}