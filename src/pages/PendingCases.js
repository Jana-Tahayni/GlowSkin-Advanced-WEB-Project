import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
const allCases = [
  { id: 1, image: "https://via.placeholder.com/150", result: "Acne — Grade II",   condition: "acne",      status: "pending",  date: "23 Apr", patientName: "Sara Al-Ahmad", patientId: "#C-2024", confidence: 89 },
  { id: 2, image: "https://via.placeholder.com/150", result: "Rosacea — Mild",    condition: "sensitive", status: "urgent",   date: "21 Apr", patientName: "Rania Nasser",  patientId: "#C-2022", confidence: 76 },
  { id: 3, image: "https://via.placeholder.com/150", result: "Combo + Oily T-Zone", condition: "combo",   status: "pending",  date: "19 Apr", patientName: "Lina Mansour",  patientId: "#C-2020", confidence: 92 },
  { id: 4, image: "https://via.placeholder.com/150", result: "Eczema — Mild",     condition: "sensitive", status: "urgent",   date: "18 Apr", patientName: "Omar Zaki",      patientId: "#C-2019", confidence: 82 },
  { id: 5, image: "https://via.placeholder.com/150", result: "Dry Patches",       condition: "dry",       status: "pending",  date: "17 Apr", patientName: "Dana Haddad",    patientId: "#C-2018", confidence: 88 },
];

const conditionColors = {
  acne:      { bg: "#F0DDD8", color: "#C0614A" },
  dry:       { bg: "#EDE0D0", color: "#7A5C47" },
  sensitive: { bg: "#FAF0E0", color: "#9E7B62" },
  oily:      { bg: "#E8F0E8", color: "#2A5228" },
  combo:     { bg: "#E8E0F0", color: "#6B4A8A" },
};

const statusStyles = {
  pending: { bg: "#EDCFC8", color: "#9A3D2A", dot: "#C0614A", label: "Pending" },
  urgent:  { bg: "#FAF0E0", color: "#8A6A20", dot: "#E8B86D", label: "Urgent"  },
};

const avatarColors = [
  { bg: "#F0DDD8", color: "#C0614A" },
  { bg: "#FAF0E0", color: "#9E7B62" },
  { bg: "#F0D8E8", color: "#8B3A6A" },
  { bg: "#E0EAF0", color: "#3A6A8B" },
  { bg: "#EDE0D0", color: "#7A5C47" },
];

function PendingCases() {
  const navigate = useNavigate();
const [cases, setCases] = useState([]);
const [filter, setFilter] = useState("All");
useEffect(() => {
  fetch("http://127.0.0.1:8000/api/cases")
    .then(res => res.json())
    .then(data => {
      console.log("API cases:", data);
      setCases(data.data || data);
    })
    .catch(err => console.log("ERROR:", err));
}, []);
const displayed = filter === "Urgent"
  ? cases.filter(c => c.status === "urgent")
  : cases;

  const urgentCount = cases.filter(
  c => c.status?.toLowerCase().trim() === "urgent"
).length;
  return (
    <div>
      {/* TOP */}
      <div style={styles.topbar}>
        <div>
          <h1 style={styles.pageTitle}>Pending Cases</h1>
          <p style={styles.pageSubtitle}>{displayed.length} cases awaiting review</p>
        </div>
        <div style={styles.filters}>
          {["All", "Urgent"].map(f => (
            <button
              key={f}
              style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
              onClick={() => setFilter(f)}
            >
             {f === "Urgent" ? `Urgent (${urgentCount})` : `All (${cases.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div style={styles.panel}>
        <div style={styles.panelHeader}>
          <div style={styles.panelTitle}>Cases Queue</div>
          <span style={styles.panelAction}>Filter ↓</span>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              {["Patient", "Image", "AI Result", "Confidence", "Status", "Action"].map((h, i) => (
                <th key={i} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(displayed) && displayed.map((c, i) =>  {
              const av = avatarColors[i % avatarColors.length];
              const initials = c.patientName.split(" ").map(w => w[0]).join("").slice(0, 2);
              const cond = conditionColors[c.condition] || conditionColors.combo;
              const st = statusStyles[c.status?.toLowerCase().trim()] || statusStyles.pending;
              return (
                <tr key={c.id}>
                  <td style={styles.td}>
                    <div style={styles.caseUser}>
                      <div style={{ ...styles.userAvatar, background: av.bg, color: av.color }}>{initials}</div>
                      <div>
                        <div style={styles.userName}>{c.patientName}</div>
                        <div style={styles.userId}>{c.date}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.imageThumb}>🧴</div>
                  </td>
                  <td style={styles.td}>
                    <span style={{ ...styles.tag, background: cond.bg, color: cond.color }}>{c.result}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={styles.confBar}>
                        <div style={{ width: `${c.confidence}%`, height: "100%", background: c.confidence > 85 ? "#C0614A" : "#E8B86D", borderRadius: "3px" }} />
                      </div>
                      <span style={{ fontSize: "12px", color: "#7A5C47" }}>{c.confidence}%</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={{ ...styles.statusBadge, background: st.bg, color: st.color }}>
                      <span style={{ ...styles.statusDot, background: st.dot }} />
                      {st.label}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.reviewBtn} onClick={() => navigate("/review", { state: c })}>
                      Review →
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  topbar:       { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" },
  pageTitle:    { fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 500, color: "#2C1A0E" },
  pageSubtitle: { fontSize: "13px", color: "#9E7B62", marginTop: "2px" },
  filters:      { display: "flex", gap: "8px" },
  filterBtn:    { padding: "8px 20px", borderRadius: "24px", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 500, background: "#EDE0D0", color: "#7A5C47" },
  filterActive: { background: "#C0614A", color: "#fff" },
  panel:        { background: "#fff", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", overflow: "hidden" },
  panelHeader:  { padding: "20px 24px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F0E8DE" },
  panelTitle:   { fontFamily: "'Playfair Display', serif", fontSize: "17px", fontWeight: 500, color: "#2C1A0E" },
  panelAction:  { fontSize: "12px", color: "#C0614A", cursor: "pointer", fontWeight: 500 },
  table:        { width: "100%", borderCollapse: "collapse" },
  th:           { padding: "10px 20px", fontSize: "10.5px", color: "#9E7B62", textTransform: "uppercase", letterSpacing: "1px", textAlign: "left", fontWeight: 500, background: "#FDFAF7" },
  td:           { padding: "13px 20px", fontSize: "13.5px", color: "#2C1A0E", borderTop: "1px solid #F5EDE0" },
  caseUser:     { display: "flex", alignItems: "center", gap: "10px" },
  userAvatar:   { width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 600, flexShrink: 0 },
  userName:     { fontSize: "13px", fontWeight: 500, color: "#2C1A0E" },
  userId:       { fontSize: "11px", color: "#9E7B62" },
  imageThumb:   { width: "44px", height: "44px", borderRadius: "10px", background: "#F0DDD8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" },
  tag:          { display: "inline-block", padding: "3px 10px", borderRadius: "20px", fontSize: "11.5px", fontWeight: 500 },
  confBar:      { width: "60px", height: "5px", background: "#F0E8DE", borderRadius: "3px", overflow: "hidden" },
  statusBadge:  { display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "20px", fontSize: "11.5px", fontWeight: 500 },
  statusDot:    { width: "6px", height: "6px", borderRadius: "50%" },
  reviewBtn:    { padding: "6px 16px", background: "#C0614A", color: "#fff", border: "none", borderRadius: "20px", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 },
};

export default PendingCases;