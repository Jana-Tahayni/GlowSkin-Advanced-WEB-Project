export const NAV_LINKS = [
  { id: "home",     label: "Home" },
  { id: "analysis", label: "Skin Analysis" },
  { id: "products", label: "Product Analyzer" },
  { id: "routine",  label: "My Routine" },
  { id: "payment",  label: "Upgrade" },
  { id: "doctor",   label: "Doctors" },
];

export const INITIAL_NOTIFICATIONS = [
  { id: 1, type: "routine",  icon: "✦", title: "Routine Ready!", message: "Dr. Layla Hassan approved your custom morning & evening routine.", time: "2 min ago",  read: false },
  { id: 2, type: "analysis", icon: "◎", title: "Analysis Complete", message: "Your skin score is 78/100. Combination skin detected.", time: "1 hour ago", read: false },
  { id: 3, type: "payment",  icon: "◈", title: "Payment Confirmed", message: "Doctor review confirmed. Invoice sent to your email.", time: "Yesterday",  read: true },
  { id: 4, type: "doctor",   icon: "◉", title: "Doctor Assigned", message: "Dr. Sara Al-Amin will review your analysis within 24h.", time: "2 days ago", read: true },
];

export const STATS = [
  { value: "5K+", label: "Skin Analyses" },
  { value: "88%",  label: "AI Accuracy" },
  { value: "70+", label: "Dermatologists" },
  { value: "4.3★", label: "User Rating" },
];

export const FEATURES = [
  { icon: "◉", title: "AI Skin Analysis",    desc: "Upload a photo and receive a detailed report — skin type, health score, moisture level, and targeted concerns — in seconds.", tag: "Free" },
  { icon: "⬡", title: "Ingredient Checker",  desc: "Paste any product's ingredients. Instantly see safety scores, compatibility with your skin type, and ingredient-by-ingredient breakdown.", tag: "Free" },
  { icon: "✦", title: "Custom Routine",       desc: "A licensed dermatologist builds your personalized AM & PM routine, product list, and follow-up schedule based on your analysis.", tag: "Paid" },
  { icon: "◈", title: "Doctor Review",        desc: "Your AI results are reviewed and refined by a real specialist. Get confident, medically-informed skincare guidance you can trust.", tag: "Paid" },
];

export const TESTIMONIALS = [
  { name: "Nour Al-Rashid", initials: "NR", text: "GlowSkin helped me understand why my previous routine was breaking me out. The doctor review was worth every penny — I finally have clear skin." },
  { name: "Maya Khalil",    initials: "MK", text: "The AI analysis was shockingly accurate about my oily T-zone. My custom routine arrived within a day and actually works." },
  { name: "Lina Haddad",    initials: "LH", text: "As someone with sensitive skin, I've tried everything. GlowSkin's personalized approach changed my entire relationship with skincare." },
];

export const PLANS = [
  {
    id: "free", name: "Free Plan", price: 0, period: "free for everyday", badge: null, accent: false,
    features: ["AI Skin Analysis (unlimited)", "Product Ingredient Checker", "Full Analysis History", "Skin Score & Metrics", "Basic Product Recommendations"],
    missing: ["Doctor Review", "Custom Routine", "Priority Support"],
    cta: "Get Started Free",
  },
  {
    id: "paid", name: "Premium Plan", price: 29, period: "per month", badge: "Full Access", accent: true,
    features: ["Everything in Free", "Licensed Dermatologist Review", "Personalized Morning Routine", "Personalized Evening Routine", "Specific Product Recommendations", "Follow-up Appointment", "Priority Support"],
    missing: [],
    cta: "Start My Glow Journey",
  },
];

const ROUTINE_STEPS = {
  morning: [
    { order: "01", name: "Gentle Cleanser",       product: "La Roche-Posay Toleriane",       time: "60 sec",   tip: "Use lukewarm water. Massage gently in circular motions." },
    { order: "02", name: "Hydrating Toner",        product: "Pyunkang Yul Essence Toner",     time: "30 sec",   tip: "Pat gently onto skin — do not rub. Apply while skin is slightly damp." },
    { order: "03", name: "Vitamin C Serum",        product: "Paula's Choice C15 Super Booster", time: "Absorb",  tip: "Apply 2–3 drops. Wait 60 seconds before layering." },
    { order: "04", name: "Oil-Free Moisturizer",   product: "Neutrogena Hydro Boost",         time: "Absorb",   tip: "Focus on cheeks and forehead. Lighter application on T-zone." },
    { order: "05", name: "SPF 50 Sunscreen",       product: "Altruist SPF 50+",               time: "Last step", tip: "Apply generously 15 min before going outside. Non-negotiable." },
  ],
  evening: [
    { order: "01", name: "Oil Cleanser",           product: "DHC Deep Cleansing Oil",         time: "90 sec",   tip: "Massage over dry skin to dissolve makeup and SPF fully." },
    { order: "02", name: "Foaming Cleanser",       product: "CeraVe Foaming Cleanser",        time: "60 sec",   tip: "Second cleanse to remove remaining residue. Rinse thoroughly." },
    { order: "03", name: "Exfoliating Toner",      product: "COSRX AHA/BHA Clarifying",       time: "Wait 5 min", tip: "Use only 3×/week. Skip on days you use Retinol." },
    { order: "04", name: "Retinol Serum",          product: "The Ordinary Retinol 0.2%",      time: "Absorb",   tip: "Use 2×/week to start. Always follow with moisturizer." },
    { order: "05", name: "Rich Night Cream",       product: "Kiehl's Ultra Facial Cream",     time: "Overnight", tip: "Apply generously. Let skin absorb for 10 min before pillow." },
  ],
};
