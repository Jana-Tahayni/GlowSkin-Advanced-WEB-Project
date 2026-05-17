import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { casesApi } from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
const [search, setSearch] = useState("");
  const [stats, setStats]     = useState(null);
  const [cases, setCases]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // ── جلب البيانات من الـ API ──────────────────────────
  useEffect(() => {
    Promise.all([
      casesApi.getStats(),
      casesApi.getAll(),
    ])
      .then(([statsRes, casesRes]) => {
        setStats(statsRes.data);
        setCases(casesRes.data.slice(0, 5)); // آخر 5 حالات
        setLoading(false);
      })
      .catch(() => {
        setError("تعذّر الاتصال بالسيرفر — تأكد إن Laravel شغال");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={styles.centered}>
        <div style={styles.spinner} />
        <p style={{ color: "#9E7B62", marginTop: "16px" }}>جاري تحميل البيانات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.centered}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚠️</div>
        <p style={{ color: "#C0614A", fontSize: "15px" }}>{error}</p>
      </div>
    );
  }

  // ── بيانات الكاردات من الـ API ─────────────────────
  const statCards = [
    {
      label: "Total Cases",
      value: stats?.total ?? 0,
      sub: "All time",
      subColor: "#C0614A",
      icon: "🧴",
    },
    {
      label: "Pending",
      value: stats?.pending ?? 0,
      sub: `${stats?.urgent ?? 0} urgent`,
      subColor: "#E8B86D",
      icon: "⏳",
    },
    {
      label: "Reviewed",
      value: cases.filter(
  c => ["reviewed", "rejected"].includes(c.status)
).length,
      sub: `${stats?.total ? Math.round((stats.reviewed / stats.total) * 100) : 0}% completion`,
      subColor: "#3A7A38",
      icon: "✅",
    },
    {
      label: "AI Accuracy",
      value: `${stats?.accuracy ?? 0}%`,
      sub: "Model v2.3",
      subColor: "#9E7B62",
      icon: "📊",
    },
  ];

  // ── رسم الـ Donut من بيانات الـ API ───────────────
  const byCondition = stats?.byCondition ?? {};
  const total = stats?.total || 1;
  const circumference = 252;

  const donutSegments = [
    { label: "Acne",      key: "acne",      color: "#C0614A" },
    { label: "Dry",       key: "dry",       color: "#D9BFAA" },
    { label: "Sensitive", key: "sensitive", color: "#9E7B62" },
    { label: "Oily",      key: "oily",      color: "#C8DBC6" },
    { label: "Combo",     key: "combo",     color: "#EDE0D0" },
  ].map(s => ({
    ...s,
    count: byCondition[s.key] ?? 0,
    pct: Math.round(((byCondition[s.key] ?? 0) / total) * 100),
    dash: ((byCondition[s.key] ?? 0) / total) * circumference,
  }));

  const conditionColors = {
    acne:      { bg: "#F0DDD8", color: "#C0614A" },
    dry:       { bg: "#EDE0D0", color: "#7A5C47" },
    sensitive: { bg: "#FAF0E0", color: "#9E7B62" },
    oily:      { bg: "#E8F0E8", color: "#2A5228" },
    combo:     { bg: "#E8E0F0", color: "#6B4A8A" },
  };

  const statusStyles = {
    pending:  { bg: "#EDCFC8", color: "#9A3D2A", dot: "#C0614A", label: "Pending"  },
    reviewed: { bg: "#C8DBC6", color: "#2A5228", dot: "#3A7A38", label: "Reviewed" },
    urgent:   { bg: "#FAF0E0", color: "#8A6A20", dot: "#E8B86D", label: "Urgent"   },
    rejected: {
  bg: "#F0DDD8",
  color: "#9A3D2A",
  dot: "#C0614A",
  label: "Rejected"
},
  };

  const avatarColors = [
    { bg: "#F0DDD8", color: "#C0614A" },
    { bg: "#E8F0E8", color: "#2A5228" },
    { bg: "#FAF0E0", color: "#9E7B62" },
    { bg: "#EDE0D0", color: "#7A5C47" },
    { bg: "#F0D8E8", color: "#8B3A6A" },
  ];
const displayed = cases.filter((c) =>
  c.patientName.toLowerCase().includes(search.toLowerCase())
);
  return (
    <div>
      {/* TOP BAR */}
      <div style={styles.topbar}>
        <div>
          <h1 style={styles.pageTitle}>Dashboard</h1>
          <p style={styles.pageSubtitle}>
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            })}
          </p>
        </div>
        <div style={styles.searchBar}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9E7B62" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>
          </svg>
          <input
  style={styles.searchInput}
  placeholder="Search cases..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={styles.statsGrid}>
        {statCards.map((card, i) => (
          <div key={i} style={styles.statCard}>
            <div style={styles.statIcon}>{card.icon}</div>
            <div style={styles.statLabel}>{card.label}</div>
            <div style={styles.statValue}>{card.value}</div>
            <div style={{ ...styles.statSub, color: card.subColor }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* CONTENT GRID */}
      <div style={styles.contentGrid}>

        {/* CASES TABLE */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div style={styles.panelTitle}>Recent Cases</div>
            <span style={styles.panelAction} onClick={() => navigate("/doctor/cases")}>
              View all →
            </span>
          </div>

          {cases.length === 0 ? (
            <div style={styles.emptyTable}>لا توجد حالات بعد</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  {["Patient", "Condition", "Status", "Date", ""].map((h, i) => (
                    <th key={i} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayed.map((c, i) => {
                  const av       = avatarColors[i % avatarColors.length];
                  const initials = c.patientName?.split(" ").map(w => w[0]).join("").slice(0, 2) ?? "??";
                  const cond     = conditionColors[c.condition] || conditionColors.combo;
                  const st       = statusStyles[c.status]       || statusStyles.pending;
                  return (
                    <tr key={c.id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.caseUser}>
                          <div style={{ ...styles.userAvatar, background: av.bg, color: av.color }}>
                            {initials}
                          </div>
                          <div>
                            <div style={styles.userName}>{c.patientName}</div>
                            <div style={styles.userId}>{c.patientId}</div>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.tag, background: cond.bg, color: cond.color }}>
                          {c.result}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.statusBadge, background: st.bg, color: st.color }}>
                          <span style={{ ...styles.statusDot, background: st.dot }} />
                          {st.label}
                        </span>
                      </td>
                      <td style={{ ...styles.td, fontSize: "12px", color: "#9E7B62" }}>{c.date}</td>
                      <td style={styles.td}>
                        <button
                          style={styles.reviewBtn}
                          onClick={() => navigate("/doctor/review", { state: c })}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div style={styles.rightCol}>

          {/* DONUT CHART */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <div style={styles.panelTitle}>Skin Types</div>
            </div>
            <div style={{ padding: "20px 24px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <svg width="110" height="110" viewBox="0 0 110 110">
                  <circle cx="55" cy="55" r="40" fill="none" stroke="#F0E8DE" strokeWidth="18"/>
                  {(() => {
                    let offset = 0;
                    return donutSegments.map((seg, i) => {
                      const el = (
                        <circle
                          key={i} cx="55" cy="55" r="40" fill="none"
                          stroke={seg.color} strokeWidth="18"
                          strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
                          strokeDashoffset={-offset}
                          transform="rotate(-90 55 55)"
                        />
                      );
                      offset += seg.dash;
                      return el;
                    });
                  })()}
                  <text x="55" y="51" textAnchor="middle" fontSize="15" fontWeight="600" fill="#2C1A0E" fontFamily="Playfair Display,serif">
                    {stats?.total ?? 0}
                  </text>
                  <text x="55" y="63" textAnchor="middle" fontSize="9" fill="#9E7B62" fontFamily="DM Sans,sans-serif">
                    cases
                  </text>
                </svg>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                  {donutSegments.map((seg, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: seg.color, flexShrink: 0 }} />
                      <span style={{ fontSize: "12px", color: "#7A5C47", flex: 1 }}>{seg.label}</span>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#2C1A0E" }}>{seg.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ACTIVITY — بيانات من آخر الحالات */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <div style={styles.panelTitle}>Recent Activity</div>
            </div>
            <div>
              {cases.slice(0, 4).map((c, i) => (
                <div key={i} style={styles.activityItem}>
                  <div style={{
                    ...styles.activityDot,
                    background: c.status === "reviewed" ? "#3A7A38" : c.status === "urgent" ? "#E8B86D" : "#C0614A"
                  }} />
                  <div>
                    <div style={{ fontSize: "12.5px", color: "#2C1A0E" }}>
                      {c.status === "reviewed" ? "Reviewed" : "New case"} — {c.patientName}
                    </div>
                    <div style={{ fontSize: "11px", color: "#9E7B62", marginTop: "2px" }}>{c.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM MINI STATS */}
      <div style={styles.bottomGrid}>
        {[
          { label: "Pending Cases",  value: stats?.pending  ?? 0, fill: `${stats?.total ? (stats.pending  / stats.total) * 100 : 0}%`, fillColor: "#C0614A" },
          { label: "Reviewed Cases", value: stats?.reviewed ?? 0, fill: `${stats?.total ? (stats.reviewed / stats.total) * 100 : 0}%`, fillColor: "#3A7A38" },
          { label: "Urgent Cases",   value: stats?.urgent   ?? 0, fill: `${stats?.total ? (stats.urgent   / stats.total) * 100 : 0}%`, fillColor: "#E8B86D" },
        
        ].map((m, i) => (
          <div key={i} style={styles.miniStat}>
            <div style={styles.miniLabel}>{m.label}</div>
            <div style={styles.miniValue}>{m.value}</div>
            <div style={styles.miniBar}>
              <div style={{ width: m.fill, height: "100%", background: m.fillColor, borderRadius: "2px" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  centered:     { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh" },
  spinner:      { width: "36px", height: "36px", border: "3px solid #EDE0D0", borderTop: "3px solid #C0614A", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  topbar:       { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" },
  pageTitle:    { fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 500, color: "#2C1A0E" },
  pageSubtitle: { fontSize: "13px", color: "#9E7B62", marginTop: "2px" },
  searchBar:    { display: "flex", alignItems: "center", gap: "8px", background: "#EDE0D0", borderRadius: "24px", padding: "7px 16px", boxShadow: "var(--shadow)" },
  searchInput:  { border: "none", background: "transparent", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#2C1A0E", outline: "none", width: "150px" },
  statsGrid:    { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "18px", marginBottom: "28px" },
  statCard:     { background: "#fff", borderRadius: "var(--radius)", padding: "22px 22px 18px", boxShadow: "var(--shadow)", position: "relative", overflow: "hidden" },
  statIcon:     { position: "absolute", top: "18px", right: "18px", width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", background: "#F0DDD8" },
  statLabel:    { fontSize: "11px", color: "#9E7B62", textTransform: "uppercase", letterSpacing: "1.2px", fontWeight: 500, marginBottom: "10px" },
  statValue:    { fontFamily: "'Playfair Display', serif", fontSize: "34px", fontWeight: 600, color: "#2C1A0E", lineHeight: 1 },
  statSub:      { fontSize: "11.5px", marginTop: "8px" },
  contentGrid:  { display: "grid", gridTemplateColumns: "1fr 340px", gap: "22px", marginBottom: "22px" },
  panel:        { background: "#fff", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", overflow: "hidden" },
  panelHeader:  { padding: "20px 24px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F0E8DE" },
  panelTitle:   { fontFamily: "'Playfair Display', serif", fontSize: "17px", fontWeight: 500, color: "#2C1A0E" },
  panelAction:  { fontSize: "12px", color: "#C0614A", cursor: "pointer", fontWeight: 500 },
  emptyTable:   { padding: "40px", textAlign: "center", color: "#9E7B62", fontSize: "14px" },
  table:        { width: "100%", borderCollapse: "collapse" },
  th:           { padding: "10px 20px", fontSize: "10.5px", color: "#9E7B62", textTransform: "uppercase", letterSpacing: "1px", textAlign: "left", fontWeight: 500, background: "#FDFAF7" },
  td:           { padding: "13px 20px", fontSize: "13.5px", color: "#2C1A0E", borderTop: "1px solid #F5EDE0" },
  tr:           {},
  caseUser:     { display: "flex", alignItems: "center", gap: "10px" },
  userAvatar:   { width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 600, flexShrink: 0 },
  userName:     { fontSize: "13px", fontWeight: 500, color: "#2C1A0E" },
  userId:       { fontSize: "11px", color: "#9E7B62" },
  tag:          { display: "inline-block", padding: "3px 10px", borderRadius: "20px", fontSize: "11.5px", fontWeight: 500 },
  statusBadge:  { display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "20px", fontSize: "11.5px", fontWeight: 500 },
  statusDot:    { width: "6px", height: "6px", borderRadius: "50%" },
  reviewBtn:    { padding: "5px 14px", background: "transparent", border: "1px solid #D9BFAA", borderRadius: "20px", fontSize: "12px", color: "#7A5C47", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  rightCol:     { display: "flex", flexDirection: "column", gap: "22px" },
  activityItem: { display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 20px" },
  activityDot:  { width: "8px", height: "8px", borderRadius: "50%", marginTop: "5px", flexShrink: 0 },
  bottomGrid:   { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "18px" },
  miniStat:     { background: "#fff", borderRadius: "var(--radius)", padding: "20px 22px", boxShadow: "var(--shadow)" },
  miniLabel:    { fontSize: "11px", color: "#9E7B62", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" },
  miniValue:    { fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 500, color: "#2C1A0E" },
  miniBar:      { height: "4px", background: "#F0E8DE", borderRadius: "2px", marginTop: "10px", overflow: "hidden" },
};

export default Dashboard;