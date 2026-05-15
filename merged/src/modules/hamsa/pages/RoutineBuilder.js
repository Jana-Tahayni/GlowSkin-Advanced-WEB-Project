import { useState } from "react";

const defaultRoutine = [
  { id: 1, name: "Gentle Cleanser",    type: "Cleanser",    time: "Morning", checked: true  },
  { id: 2, name: "Niacinamide Serum",  type: "Serum",       time: "Morning", checked: true  },
  { id: 3, name: "SPF 50 Sunscreen",   type: "Sunscreen",   time: "Morning", checked: false },
  { id: 4, name: "Oil Cleanser",       type: "Cleanser",    time: "Night",   checked: true  },
  { id: 5, name: "Retinol 0.5%",       type: "Treatment",   time: "Night",   checked: false },
  { id: 6, name: "Heavy Moisturizer",  type: "Moisturizer", time: "Night",   checked: true  },
];

const typeColors = {
  Cleanser:    { bg: "#EDE0D0", color: "#7A5C47" },
  Moisturizer: { bg: "#E8F0E8", color: "#2A5228" },
  Sunscreen:   { bg: "#FAF0E0", color: "#9E7B62" },
  Serum:       { bg: "#F0DDD8", color: "#C0614A" },
  Treatment:   { bg: "#E8E0F0", color: "#6B4A8A" },
};

function RoutineBuilder() {
  const [routine, setRoutine] = useState(defaultRoutine);
  const [name, setName]       = useState("");
  const [type, setType]       = useState("Cleanser");
  const [time, setTime]       = useState("Morning");
  const [filter, setFilter]   = useState("All");
  const [productInput, setProductInput] = useState("");
  const [productResult, setProductResult] = useState(null);

  const addStep = () => {
    if (!name.trim()) return;
    setRoutine([...routine, { id: Date.now(), name, type, time, checked: false }]);
    setName("");
  };

  const deleteStep = (id) => setRoutine(routine.filter(r => r.id !== id));

  const toggleCheck = (id) =>
    setRoutine(routine.map(r => r.id === id ? { ...r, checked: !r.checked } : r));

  const filtered = filter === "All" ? routine : routine.filter(r => r.time === filter);
  const morning  = filtered.filter(r => r.time === "Morning");
  const night    = filtered.filter(r => r.time === "Night");

  const checkProduct = () => {
    if (!productInput.trim()) return;
    setProductResult({
      ok: true,
      name: productInput,
      reason: "This product is generally suitable for your skin type. Check for any active ingredients that may conflict with your current routine.",
    });
  };

  return (
    <div>
      {/* TOP */}
      <div style={styles.topbar}>
        <div>
          <h1 style={styles.pageTitle}>Routine Builder</h1>
          <p style={styles.pageSubtitle}>Build and manage skincare routines</p>
        </div>
        <div style={styles.filters}>
          {["All", "Morning", "Night"].map(f => (
            <button
              key={f}
              style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.mainGrid}>
        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* MORNING */}
          {(filter === "All" || filter === "Morning") && morning.length > 0 && (
            <RoutineSection title="Morning Routine" badge="AM" badgeStyle={styles.badgeAM} steps={morning} onDelete={deleteStep} onToggle={toggleCheck} />
          )}
          {/* NIGHT */}
          {(filter === "All" || filter === "Night") && night.length > 0 && (
            <RoutineSection title="Night Routine" badge="PM" badgeStyle={styles.badgePM} steps={night} onDelete={deleteStep} onToggle={toggleCheck} />
          )}

          {/* ADD FORM */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <div style={styles.panelTitle}>Add New Step</div>
            </div>
            <div style={styles.formRow}>
              <div style={{ flex: 2 }}>
                <label style={styles.fieldLabel}>Product Name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. CeraVe Cleanser"
                  style={styles.input}
                  onKeyDown={e => e.key === "Enter" && addStep()}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.fieldLabel}>Type</label>
                <select value={type} onChange={e => setType(e.target.value)} style={styles.select}>
                  {Object.keys(typeColors).map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.fieldLabel}>Time</label>
                <select value={time} onChange={e => setTime(e.target.value)} style={styles.select}>
                  <option>Morning</option>
                  <option>Night</option>
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button style={styles.addBtn} onClick={addStep}>+ Add</button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — PRODUCT CHECK */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div style={styles.panelTitle}>Product Check</div>
          </div>
          <div style={{ padding: "20px" }}>
            <div style={styles.uploadArea}>
              <div style={{ fontSize: "28px", marginBottom: "6px" }}>📸</div>
              <div style={{ fontSize: "12px", color: "#9E7B62" }}>Upload product photo</div>
              <div style={{ fontSize: "11px", color: "#C4A98E", marginTop: "4px" }}>coming soon</div>
            </div>

            <div style={{ fontSize: "12px", color: "#9E7B62", textAlign: "center", margin: "14px 0 10px" }}>
              Or enter product name
            </div>
            <input
              style={styles.input}
              placeholder="e.g. The Ordinary Niacinamide"
              value={productInput}
              onChange={e => { setProductInput(e.target.value); setProductResult(null); }}
            />
            <button style={styles.checkBtn} onClick={checkProduct}>Check Compatibility</button>

            {productResult && (
              <div style={{ ...styles.resultBox, background: productResult.ok ? "#C8DBC6" : "#F0DDD8" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: productResult.ok ? "#2A5228" : "#9A3D2A", marginBottom: "4px" }}>
                  {productResult.ok ? "Suitable for your skin" : "Not recommended"}
                </div>
                <div style={{ fontSize: "12px", color: productResult.ok ? "#3A7A38" : "#C0614A", lineHeight: 1.5 }}>
                  {productResult.reason}
                </div>
              </div>
            )}

            {/* TIPS */}
            <div style={styles.tipsBox}>
              <div style={styles.analysisLabel}>Quick Tips</div>
              {[
                "Always patch test new products",
                "Apply thinnest to thickest consistency",
                "Sunscreen is the last step in AM",
                "Don't mix Retinol with AHA/BHA",
              ].map((tip, i) => (
                <div key={i} style={styles.tipItem}>
                  <span style={styles.tipDot} />
                  <span style={{ fontSize: "12px", color: "#7A5C47" }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoutineSection({ title, badge, badgeStyle, steps, onDelete, onToggle }) {
  return (
    <div style={sStyles.panel}>
      <div style={sStyles.header}>
        <div style={sStyles.title}>{title}</div>
        <span style={{ ...sStyles.badge, ...badgeStyle }}>{badge}</span>
      </div>
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {steps.map((step, i) => {
          const tc = typeColors[step.type] || typeColors.Treatment;
          return (
            <div key={step.id} style={sStyles.step}>
              <div style={sStyles.stepNum}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: 500, color: "#2C1A0E" }}>{step.name}</div>
                <span style={{ ...sStyles.typeTag, background: tc.bg, color: tc.color }}>{step.type}</span>
              </div>
              <div
                style={{ ...sStyles.check, background: step.checked ? "#C8DBC6" : "#F0E8DE", cursor: "pointer" }}
                onClick={() => onToggle(step.id)}
              >
                {step.checked ? "✓" : ""}
              </div>
              <button style={sStyles.deleteBtn} onClick={() => onDelete(step.id)}>✕</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const typeColors2 = typeColors;

const sStyles = {
  panel:     { background: "#fff", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", overflow: "hidden" },
  header:    { padding: "18px 20px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F0E8DE" },
  title:     { fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 500, color: "#2C1A0E" },
  badge:     { padding: "3px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 },
  step:      { display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: "#FDFAF7", borderRadius: "10px" },
  stepNum:   { width: "24px", height: "24px", borderRadius: "50%", background: "#C0614A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, flexShrink: 0 },
  typeTag:   { display: "inline-block", padding: "2px 8px", borderRadius: "10px", fontSize: "10.5px", fontWeight: 500, marginTop: "3px" },
  check:     { width: "22px", height: "22px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#2A5228", fontWeight: 700, flexShrink: 0 },
  deleteBtn: { background: "none", border: "none", cursor: "pointer", color: "#C4A98E", fontSize: "13px", padding: "2px 6px", flexShrink: 0 },
};

const styles = {
  topbar:       { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" },
  pageTitle:    { fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 500, color: "#2C1A0E" },
  pageSubtitle: { fontSize: "13px", color: "#9E7B62", marginTop: "2px" },
  filters:      { display: "flex", gap: "8px" },
  filterBtn:    { padding: "8px 20px", borderRadius: "24px", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 500, background: "#EDE0D0", color: "#7A5C47" },
  filterActive: { background: "#C0614A", color: "#fff" },
  mainGrid:     { display: "grid", gridTemplateColumns: "1fr 320px", gap: "22px" },
  panel:        { background: "#fff", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", overflow: "hidden" },
  panelHeader:  { padding: "18px 24px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F0E8DE" },
  panelTitle:   { fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 500, color: "#2C1A0E" },
  formRow:      { padding: "20px 24px", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" },
  fieldLabel:   { display: "block", fontSize: "11px", color: "#9E7B62", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", fontWeight: 500 },
  input:        { width: "100%", padding: "10px 14px", border: "1.5px solid #D9BFAA", borderRadius: "var(--radius-sm)", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", background: "#FDFAF7", outline: "none", color: "#2C1A0E" },
  select:       { width: "100%", padding: "10px 14px", border: "1.5px solid #D9BFAA", borderRadius: "var(--radius-sm)", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", background: "#FDFAF7", color: "#2C1A0E" },
  addBtn:       { padding: "10px 22px", background: "#C0614A", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" },
  uploadArea:   { width: "100%", height: "120px", background: "linear-gradient(135deg,#F0DDD8,#EDE0D0)", borderRadius: "var(--radius-sm)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "2px dashed #D9BFAA" },
  checkBtn:     { width: "100%", marginTop: "10px", padding: "11px", background: "#2C1A0E", color: "#EDE0D0", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", cursor: "pointer" },
  resultBox:    { marginTop: "14px", padding: "14px", borderRadius: "var(--radius-sm)" },
  tipsBox:      { marginTop: "20px", padding: "14px", background: "#FDFAF7", borderRadius: "var(--radius-sm)" },
  analysisLabel:{ fontSize: "11px", color: "#9E7B62", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px", fontWeight: 500 },
  tipItem:      { display: "flex", alignItems: "center", gap: "8px", marginBottom: "7px" },
  tipDot:       { width: "5px", height: "5px", borderRadius: "50%", background: "#C0614A", flexShrink: 0 },
  badgeAM:      { background: "#FAF0E0", color: "#9E7B62" },
  badgePM:      { background: "#EDE0D0", color: "#7A5C47" },
};

export default RoutineBuilder;