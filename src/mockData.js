export const MOCK_RESULT = {
  productName: "CeraVe Moisturizing Cream",
  compatibility: "High",
  compatibilityScore: 92,
  effectivenessScore: 88,
  safetyScore: 95,
  overallScore: 91,
  verdict:
    "This moisturizing cream is an excellent match for your skin profile. Its ceramide-rich formula reinforces the skin barrier, making it especially beneficial for dry and sensitive skin types. We recommend incorporating it into your evening routine.",
  ingredients: [
    { name: "Ceramides", desc: "Restores the skin's natural barrier", status: "good" },
    { name: "Hyaluronic Acid", desc: "Deep hydration & plumping effect", status: "good" },
    { name: "Niacinamide", desc: "Brightening & pore-minimizing", status: "good" },
    { name: "Petrolatum", desc: "Occlusive sealant for moisture", status: "good" },
    { name: "Fragrance", desc: "May irritate sensitive skin", status: "warning" },
    { name: "Dimethicone", desc: "Silicone-based smoothing agent", status: "good" },
  ],
  warnings: [
    "Contains fragrance — patch test recommended for reactive skin.",
    "Petrolatum may feel heavy for oily or combination skin types.",
  ],
};
 
export const MOCK_HISTORY = [
  { id: 1, product: "CeraVe Moisturizing Cream", date: "Mar 26, 2025", skin: "Dry", score: 91, compat: "High" },
  { id: 2, product: "The Ordinary Niacinamide 10%", date: "Mar 18, 2025", skin: "Oily", score: 78, compat: "Medium" },
  { id: 3, product: "La Roche-Posay Toleriane", date: "Mar 10, 2025", skin: "Sensitive", score: 95, compat: "High" },
  { id: 4, product: "Neutrogena Hydro Boost", date: "Feb 28, 2025", skin: "Combination", score: 64, compat: "Low" },
];