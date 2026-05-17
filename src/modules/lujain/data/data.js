export const NAV_LINKS = [
  { id: "home",     label: "Home" },
  { id: "analysis", label: "Skin Analysis" },
  { id: "products", label: "Product Analyzer" },
  { id: "routine",  label: "My Routine" },
  { id: "payment",  label: "Pricing" },
  // { id: "doctor",   label: "Doctors" },
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
  { icon: "🔍", title: "AI Skin Analysis",    desc: "Upload a photo and receive a detailed report — skin type, health score, moisture level — in seconds.", tag: "Free", page: "analysis"},
  { icon: "🧪", title: "Ingredient Checker",  desc: "Paste any product's ingredients. Instantly see safety scores, compatibility with your skin type, and ingredient-by-ingredient breakdown.", tag: "Free" , page: "product-analyzer"},
  { icon: "📅", title: "Custom Routine",       desc: "A licensed dermatologist builds your personalized AM & PM routine, product list, and follow-up schedule based on your analysis.", tag: "Paid", page: "payment"},
  { icon: "👨‍⚕️", title: "Doctor Review",        desc: "Your AI results are reviewed and refined by a real specialist. Get confident, medically-informed skincare guidance you can trust.", tag: "Paid", page: "payment" },
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

