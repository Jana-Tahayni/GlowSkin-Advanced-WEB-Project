import { useLocation, useNavigate } from "react-router-dom";

const typeColors = {
  Cleanser:    { bg: "#EDE0D0", color: "#7A5C47" },
  Moisturizer: { bg: "#E8F0E8", color: "#2A5228" },
  Sunscreen:   { bg: "#FAF0E0", color: "#9E7B62" },
  Serum:       { bg: "#F0DDD8", color: "#C0614A" },
  Treatment:   { bg: "#E8E0F0", color: "#6B4A8A" },
};

function RoutineDisplay() {
  const location = useLocation();
  const navigate = useNavigate();
  const routine  = location.state;

  if (!routine) {
    return (
      <div style={styles.empty}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
        <h2 style={styles.emptyTitle}>No Routine Selected</h2>
        <button style={styles.backBtn} onClick={() => navigate("/doctor/cases")}>← Back to Cases</button>
      </div>
    );
  }

  const morningSteps = routine.steps?.filter(s => s.time === "Morning" || s.time === "Both") ?? [];
  const nightSteps   = routine.steps?.filter(s => s.time === "Night"   || s.time === "Both") ?? [];

  return (
    <div>
      {/* TOP */}
      <div style={styles.topbar}>
        <div>
          <button style={styles.backLink} onClick={() => navigate(-1)}>← Back</button>
          <h1 style={styles.pageTitle}>Routine Display</h1>
          <p style={styles.pageSubtitle}>{routine.patient_name} — Routine #{routine.id}</p>
        </div>
        <button style={styles.printBtn} onClick={() => window.print()}>🖨 Print</button>
      </div>

      <div style={styles.grid}>
        {/* MORNING */}
        {morningSteps.length > 0 && (
          <Section title="Morning Routine" badge="AM" badgeStyle={styles.badgeAM} steps={morningSteps} />
        )}
        {/* NIGHT */}
        {nightSteps.length > 0 && (
          <Section title="Night Routine" badge="PM" badgeStyle={styles.badgePM} steps={nightSteps} />
        )}
        {/* ALL — لو كل الخطوات Both */}
        {morningSteps.length === 0 && nightSteps.length === 0 && routine.steps?.length > 0 && (
          <Section title="Full Routine" badge="AM/PM" badgeStyle={styles.badgeAM} steps={routine.steps} />
        )}
      </div>

      {/* TIPS */}
      <div style={styles.notesPanel}>
        <div style={styles.panelHeader}>
          <div style={styles.panelTitle}>Important Notes</div>
        </div>
        <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {[
            { icon: "⚠️", note: "Avoid mixing Retinol with AHA/BHA acids" },
            { icon: "💧", note: "Drink 8 glasses of water daily for skin health" },
            { icon: "🌙", note: "Always remove makeup before night routine" },
            { icon: "☀️", note: "Never skip SPF, even on cloudy days" },
            { icon: "🔄", note: "Take weekly photos to track progress" },
            { icon: "📱", note: "Follow up with your doctor in 4 weeks" },
          ].map((n, i) => (
            <div key={i} style={styles.noteItem}>
              <span style={{ fontSize: "16px" }}>{n.icon}</span>
              <span style={{ fontSize: "13px", color: "#7A5C47" }}>{n.note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({ title, badge, badgeStyle, steps }) {
  return (
    <div style={sStyles.panel}>
      <div style={sStyles.header}>
        <div style={sStyles.title}>{title}</div>
        <span style={{ ...sStyles.badge, ...badgeStyle }}>{badge}</span>
      </div>
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {steps.map((step, i) => {
          const tc = typeColors[step.product_type] || typeColors.Treatment;
          return (
            <div key={step.id || i} style={sStyles.step}>
              <div style={sStyles.stepNum}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "13.5px", fontWeight: 500, color: "#2C1A0E" }}>{step.product_name}</span>
                  <span style={{ ...sStyles.typeTag, background: tc.bg, color: tc.color }}>{step.product_type}</span>
                </div>
                {step.note && (
                  <div style={{ fontSize: "12px", color: "#9E7B62" }}>{step.note}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const sStyles = {
  panel:   { background: "#fff", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", overflow: "hidden" },
  header:  { padding: "18px 20px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F0E8DE" },
  title:   { fontFamily: "'Playfair Display', serif", fontSize: "17px", fontWeight: 500, color: "#2C1A0E" },
  badge:   { padding: "3px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 },
  step:    { display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px", background: "#FDFAF7", borderRadius: "10px" },
  stepNum: { width: "26px", height: "26px", borderRadius: "50%", background: "#C0614A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0, marginTop: "2px" },
  typeTag: { display: "inline-block", padding: "2px 8px", borderRadius: "10px", fontSize: "10.5px", fontWeight: 500 },
};

const styles = {
  topbar:      { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "28px" },
  backLink:    { background: "none", border: "none", color: "#9E7B62", fontSize: "13px", cursor: "pointer", padding: 0, marginBottom: "6px", fontFamily: "'DM Sans', sans-serif", display: "block" },
  pageTitle:   { fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 500, color: "#2C1A0E" },
  pageSubtitle:{ fontSize: "13px", color: "#9E7B62", marginTop: "2px" },
  printBtn:    { padding: "10px 22px", background: "#2C1A0E", color: "#EDE0D0", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", cursor: "pointer" },
  grid:        { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "22px", marginBottom: "22px" },
  notesPanel:  { background: "#fff", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", overflow: "hidden" },
  panelHeader: { padding: "18px 24px 14px", borderBottom: "1px solid #F0E8DE" },
  panelTitle:  { fontFamily: "'Playfair Display', serif", fontSize: "17px", fontWeight: 500, color: "#2C1A0E" },
  noteItem:    { display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 14px", background: "#FDFAF7", borderRadius: "var(--radius-sm)" },
  badgeAM:     { background: "#FAF0E0", color: "#9E7B62" },
  badgePM:     { background: "#EDE0D0", color: "#7A5C47" },
  empty:       { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", textAlign: "center" },
  emptyTitle:  { fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "#2C1A0E", marginBottom: "8px" },
  backBtn:     { padding: "10px 24px", background: "#C0614A", color: "#fff", border: "none", borderRadius: "24px", fontSize: "14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
};

export default RoutineDisplay;