import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { casesApi, routinesApi } from "../services/api";

const typeColors = {
  Cleanser:    { bg: "#EDE0D0", color: "#7A5C47" },
  Moisturizer: { bg: "#E8F0E8", color: "#2A5228" },
  Sunscreen:   { bg: "#FAF0E0", color: "#9E7B62" },
  Serum:       { bg: "#F0DDD8", color: "#C0614A" },
  Treatment:   { bg: "#E8E0F0", color: "#6B4A8A" },
};

const conditionColors = {
  acne:      { bg: "#F0DDD8", color: "#C0614A" },
  dry:       { bg: "#EDE0D0", color: "#7A5C47" },
  sensitive: { bg: "#FAF0E0", color: "#9E7B62" },
  oily:      { bg: "#E8F0E8", color: "#2A5228" },
  combo:     { bg: "#E8E0F0", color: "#6B4A8A" },
};

function CaseReview() {
  const location = useLocation();
  const navigate = useNavigate();
  const caseData = location.state;

  const [notes, setNotes]           = useState(caseData?.doctorNotes || "");
  const [approved, setApproved]     = useState(null);
  const [showModal, setShowModal]   = useState(false);
  const [routines, setRoutines]     = useState([]);
  const [loadingRoutines, setLoadingRoutines] = useState(false);

  // Routine Builder state
  const [steps, setSteps]       = useState([]);
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("Cleanser");
  const [productTime, setProductTime] = useState("Morning");
  const [productNote, setProductNote] = useState("");
  const [savingRoutine, setSavingRoutine] = useState(false);
  const [routineSaved, setRoutineSaved]   = useState(false);

  // جلب الروتينات الموجودة للمريض
  useEffect(() => {
    if (!caseData?.id) return;
    setLoadingRoutines(true);
    routinesApi.getAll({ case_id: caseData.id })
      .then(res => {
        setRoutines(res.data);
        setLoadingRoutines(false);
      })
      .catch(() => setLoadingRoutines(false));
  }, [caseData?.id]);

  if (!caseData) {
    return (
      <div style={styles.empty}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
        <h2 style={styles.emptyTitle}>No Case Selected</h2>
        <p style={styles.emptyText}>Go to Pending Cases and select a case to review.</p>
        <button style={styles.backBtn} onClick={() => navigate("/doctor/cases")}>← Go to Cases</button>
      </div>
    );
  }

  const initials = caseData.patientName?.split(" ").map(w => w[0]).join("").slice(0, 2) ?? "??";
  const cond = conditionColors[caseData.condition] || conditionColors.combo;

  // ── إضافة خطوة للروتين ─────────────────────────
  const addStep = () => {
    if (!productName.trim()) return;
    setSteps([...steps, {
      tempId:       Date.now(),
      product_name: productName,
      product_type: productType,
      time:         productTime,
      note:         productNote,
    }]);
    setProductName("");
    setProductNote("");
  };

  const removeStep = (tempId) => setSteps(steps.filter(s => s.tempId !== tempId));

  // ── حفظ الروتين للـ API ─────────────────────────
  const saveRoutine = async () => {
    if (steps.length === 0) return;
    setSavingRoutine(true);
    try {
      await routinesApi.create({
        case_id:      caseData.id,
        patient_name: caseData.patientName,
        time:         "Both",
        steps:        steps.map(s => ({
          product_name: s.product_name,
          product_type: s.product_type,
          time:         s.time,
          note:         s.note,
        })),
      });
      // جلب الروتينات من جديد
      const res = await routinesApi.getAll({ case_id: caseData.id });
      setRoutines(res.data);
      setSteps([]);
      setShowModal(false);
      setRoutineSaved(true);
      setTimeout(() => setRoutineSaved(false), 3000);
    } catch (e) {
      alert("حصل خطأ أثناء الحفظ");
    }
    setSavingRoutine(false);
  };

  // ── Approve / Reject ────────────────────────────
 const handleReject = async () => {
  try {
    const res = await casesApi.reject(caseData.id);

    console.log("REJECTED:", res);

    setApproved(false);

    setTimeout(() => {
      navigate("/doctor/cases");
    }, 1500);

  } catch (err) {
    console.log("REJECT ERROR:", err);
    alert("Failed to reject case");
  }
};
const handleApprove = async () => {
  try {
    const res = await casesApi.approve(caseData.id);

    console.log("APPROVED:", res);

    setApproved(true);

    setTimeout(() => {
      navigate("/doctor/cases");
    }, 1500);

  } catch (err) {
    console.log("APPROVE ERROR:", err);
    alert("Failed to approve case");
  }
};


  // ── حذف روتين ───────────────────────────────────
  const deleteRoutine = async (id) => {
    await routinesApi.delete(id);
    setRoutines(routines.filter(r => r.id !== id));
  };

  return (
    <div>
      {/* TOP */}
      <div style={styles.topbar}>
        <div>
          <button style={styles.backLink} onClick={() => navigate("/doctor/cases")}>← Back to Cases</button>
          <h1 style={styles.pageTitle}>Case Review</h1>
          <p style={styles.pageSubtitle}>{caseData.patientId} — {caseData.patientName}</p>
        </div>
        <button style={styles.buildBtn} onClick={() => setShowModal(true)}>
          + Build Routine
        </button>
      </div>

      
      

      {routineSaved && (
        <div style={{ ...styles.banner, background: "#C8DBC6", color: "#2A5228" }}>
          ✓ Routine saved successfully!
        </div>
      )}

      <div style={styles.grid}>
        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* PATIENT CARD */}
          <div style={styles.panel}>
            <div style={{ padding: "24px", textAlign: "center" }}>
              <div style={styles.imageArea}>🧴</div>
              <div style={styles.patientName}>{caseData.patientName}</div>
              <div style={styles.patientMeta}>{caseData.patientId} · {caseData.date}</div>
            </div>
            <div style={styles.analysisBox}>
              <div style={styles.analysisLabel}>AI Analysis</div>
              <div style={styles.analysisRow}>
                <span style={styles.analysisKey}>Condition</span>
                <span style={{ ...styles.tag, background: cond.bg, color: cond.color }}>{caseData.result}</span>
              </div>
              <div style={styles.analysisRow}>
                <span style={styles.analysisKey}>Confidence</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#C0614A" }}>{caseData.confidence}%</span>
              </div>
              <div style={styles.analysisRow}>
                <span style={styles.analysisKey}>Status</span>
                <span style={{ fontSize: "13px", fontWeight: 500, color: "#2C1A0E", textTransform: "capitalize" }}>{caseData.status}</span>
              </div>
            </div>
          </div>

          {/* SAVED ROUTINES */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <div style={styles.panelTitle}>Patient Routines</div>
              <span style={styles.routineCount}>{routines.length} routine{routines.length !== 1 ? "s" : ""}</span>
            </div>
            {loadingRoutines ? (
              <div style={styles.emptyRoutine}>جاري التحميل...</div>
            ) : routines.length === 0 ? (
              <div style={styles.emptyRoutine}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>📋</div>
                <div style={{ fontSize: "13px", color: "#9E7B62" }}>No routines yet</div>
                <button style={styles.buildBtnSm} onClick={() => setShowModal(true)}>+ Build First Routine</button>
              </div>
            ) : (
              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {routines.map(routine => (
                  <div key={routine.id} style={styles.routineCard}>
                    <div style={styles.routineCardHeader}>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#2C1A0E" }}>
                        Routine #{routine.id}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button
                          style={styles.viewBtn}
                          onClick={() => navigate("/routine/display", { state: routine })}
                        >
                          View
                        </button>
                        <button style={styles.deleteBtn} onClick={() => deleteRoutine(routine.id)}>✕</button>
                      </div>
                    </div>
                    {routine.steps?.slice(0, 3).map((step, i) => {
                      const tc = typeColors[step.product_type] || typeColors.Treatment;
                      return (
                        <div key={i} style={styles.miniStep}>
                          <div style={styles.miniStepNum}>{i + 1}</div>
                          <span style={{ fontSize: "12.5px", color: "#2C1A0E", flex: 1 }}>{step.product_name}</span>
                          <span style={{ ...styles.typeTag, background: tc.bg, color: tc.color }}>{step.product_type}</span>
                        </div>
                      );
                    })}
                    {routine.steps?.length > 3 && (
                      <div style={{ fontSize: "11px", color: "#9E7B62", textAlign: "center", marginTop: "4px" }}>
                        +{routine.steps.length - 3} more steps
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* DOCTOR NOTES */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <div style={styles.panelTitle}>Doctor's Notes</div>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                style={styles.textarea}
                placeholder="Add your clinical notes and treatment recommendations..."
              />
              <button
                style={styles.saveNotesBtn}
                onClick={async () => {
                  await casesApi.update(caseData.id, { doctor_notes: notes });
                  alert("Notes saved!");
                }}
              >
                Save Notes
              </button>
            </div>
          </div>

          {/* DECISION */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <div style={styles.panelTitle}>Decision</div>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: "13px", color: "#9E7B62", marginBottom: "14px" }}>
                Review the case and AI analysis, then approve or reject.
              </p>
              <div style={{ display: "flex", gap: "12px" }}>
                <button style={styles.approveBtn} onClick={handleApprove}>✓ Approve Case</button>
                <button style={styles.rejectBtn} onClick={handleReject}>✕ Reject</button>
              </div>
            </div>
          </div>

          {/* PATIENT INFO */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <div style={styles.panelTitle}>Patient Info</div>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                <div style={styles.bigAvatar}>{initials}</div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 500, color: "#2C1A0E" }}>{caseData.patientName}</div>
                  <div style={{ fontSize: "12px", color: "#9E7B62" }}>{caseData.patientId}</div>
                </div>
              </div>
              {[
                { label: "Submitted",  val: caseData.date || "—" },
                { label: "Condition",  val: caseData.result },
                { label: "AI Score",   val: `${caseData.confidence}%` },
                { label: "Routines",   val: `${routines.length} built` },
              ].map((r, i) => (
                <div key={i} style={styles.infoRow}>
                  <span style={styles.infoKey}>{r.label}</span>
                  <span style={styles.infoVal}>{r.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ ROUTINE BUILDER MODAL ═══ */}
      {showModal && (
        <div style={styles.overlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <div>
                <div style={styles.modalTitle}>Build Routine</div>
                <div style={styles.modalSub}>for {caseData.patientName}</div>
              </div>
              <button style={styles.closeBtn} onClick={() => setShowModal(false)}>✕</button>
            </div>

            {/* Add Step Form */}
            <div style={styles.modalForm}>
              <div style={{ flex: 2 }}>
                <label style={styles.fieldLabel}>Product Name</label>
                <input
                  style={styles.input}
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  placeholder="e.g. CeraVe Cleanser"
                  onKeyDown={e => e.key === "Enter" && addStep()}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.fieldLabel}>Type</label>
                <select style={styles.select} value={productType} onChange={e => setProductType(e.target.value)}>
                  {Object.keys(typeColors).map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.fieldLabel}>Time</label>
                <select style={styles.select} value={productTime} onChange={e => setProductTime(e.target.value)}>
                  <option>Morning</option>
                  <option>Night</option>
                  <option>Both</option>
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button style={styles.addBtn} onClick={addStep}>+ Add</button>
              </div>
            </div>

            <div style={{ padding: "0 24px 12px" }}>
              <label style={styles.fieldLabel}>Note (optional)</label>
              <input
                style={styles.input}
                value={productNote}
                onChange={e => setProductNote(e.target.value)}
                placeholder="e.g. Apply on damp skin"
              />
            </div>

            {/* Steps List */}
            <div style={styles.stepsList}>
              {steps.length === 0 ? (
                <div style={styles.emptySteps}>أضف منتجات للروتين 👆</div>
              ) : (
                steps.map((step, i) => {
                  const tc = typeColors[step.product_type] || typeColors.Treatment;
                  return (
                    <div key={step.tempId} style={styles.stepItem}>
                      <div style={styles.stepNum}>{i + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: 500, color: "#2C1A0E" }}>{step.product_name}</div>
                        <div style={{ display: "flex", gap: "6px", marginTop: "3px" }}>
                          <span style={{ ...styles.typeTag, background: tc.bg, color: tc.color }}>{step.product_type}</span>
                          <span style={{ ...styles.typeTag, background: "#EDE0D0", color: "#7A5C47" }}>{step.time}</span>
                        </div>
                        {step.note && <div style={{ fontSize: "11px", color: "#9E7B62", marginTop: "3px" }}>{step.note}</div>}
                      </div>
                      <button style={styles.removeBtn} onClick={() => removeStep(step.tempId)}>✕</button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div style={styles.modalFooter}>
              <span style={{ fontSize: "13px", color: "#9E7B62" }}>{steps.length} step{steps.length !== 1 ? "s" : ""} added</span>
              <div style={{ display: "flex", gap: "10px" }}>
                <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button
                  style={{ ...styles.saveBtn, opacity: steps.length === 0 ? 0.5 : 1 }}
                  onClick={saveRoutine}
                  disabled={steps.length === 0 || savingRoutine}
                >
                  {savingRoutine ? "Saving..." : "Save Routine"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  topbar:          { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" },
  backLink:        { background: "none", border: "none", color: "#9E7B62", fontSize: "13px", cursor: "pointer", padding: 0, marginBottom: "6px", fontFamily: "'DM Sans', sans-serif", display: "block" },
  pageTitle:       { fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 500, color: "#2C1A0E" },
  pageSubtitle:    { fontSize: "13px", color: "#9E7B62", marginTop: "2px" },
  buildBtn:        { padding: "10px 22px", background: "#2C1A0E", color: "#EDE0D0", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 500, cursor: "pointer" },
  buildBtnSm:      { marginTop: "10px", padding: "7px 16px", background: "#C0614A", color: "#fff", border: "none", borderRadius: "20px", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", cursor: "pointer" },
  banner:          { padding: "12px 20px", borderRadius: "var(--radius-sm)", fontSize: "14px", fontWeight: 500, marginBottom: "20px" },
  grid:            { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "22px" },
  panel:           { background: "#fff", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", overflow: "hidden" },
  panelHeader:     { padding: "18px 24px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F0E8DE" },
  panelTitle:      { fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 500, color: "#2C1A0E" },
  routineCount:    { fontSize: "12px", color: "#9E7B62", background: "#F5EDE0", padding: "3px 10px", borderRadius: "20px" },
  imageArea:       { width: "100%", height: "180px", background: "linear-gradient(135deg,#F0DDD8,#D9BFAA)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "60px", marginBottom: "16px" },
  patientName:     { fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 500, color: "#2C1A0E", marginBottom: "4px" },
  patientMeta:     { fontSize: "12px", color: "#9E7B62" },
  analysisBox:     { margin: "0 24px 20px", padding: "16px", background: "#FDFAF7", borderRadius: "var(--radius-sm)" },
  analysisLabel:   { fontSize: "11px", color: "#9E7B62", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px", fontWeight: 500 },
  analysisRow:     { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  analysisKey:     { fontSize: "13px", color: "#7A5C47" },
  tag:             { display: "inline-block", padding: "3px 10px", borderRadius: "20px", fontSize: "11.5px", fontWeight: 500 },
  emptyRoutine:    { padding: "30px", textAlign: "center", color: "#9E7B62" },
  routineCard:     { background: "#FDFAF7", borderRadius: "var(--radius-sm)", padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px" },
  routineCardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" },
  viewBtn:         { padding: "4px 12px", background: "#EDE0D0", color: "#7A5C47", border: "none", borderRadius: "20px", fontSize: "11px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  deleteBtn:       { background: "none", border: "none", cursor: "pointer", color: "#C4A98E", fontSize: "13px", padding: "2px 6px" },
  miniStep:        { display: "flex", alignItems: "center", gap: "8px" },
  miniStepNum:     { width: "20px", height: "20px", borderRadius: "50%", background: "#C0614A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, flexShrink: 0 },
  typeTag:         { display: "inline-block", padding: "2px 8px", borderRadius: "10px", fontSize: "10.5px", fontWeight: 500 },
  textarea:        { width: "100%", height: "140px", border: "1.5px solid #D9BFAA", borderRadius: "var(--radius-sm)", padding: "12px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#2C1A0E", background: "#FDFAF7", resize: "none", outline: "none", lineHeight: 1.6 },
  saveNotesBtn:    { marginTop: "10px", padding: "8px 20px", background: "#EDE0D0", color: "#7A5C47", border: "none", borderRadius: "20px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", cursor: "pointer" },
  approveBtn:      { flex: 1, padding: "12px", background: "#C0614A", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 500, cursor: "pointer" },
  rejectBtn:       { flex: 1, padding: "12px", background: "transparent", color: "#C0614A", border: "1.5px solid #C0614A", borderRadius: "var(--radius-sm)", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", cursor: "pointer" },
  bigAvatar:       { width: "44px", height: "44px", borderRadius: "50%", background: "#F0DDD8", color: "#C0614A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 600 },
  infoRow:         { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F5EDE0" },
  infoKey:         { fontSize: "13px", color: "#9E7B62" },
  infoVal:         { fontSize: "13px", fontWeight: 500, color: "#2C1A0E" },
  empty:           { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", textAlign: "center" },
  emptyTitle:      { fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "#2C1A0E", marginBottom: "8px" },
  emptyText:       { fontSize: "14px", color: "#9E7B62", marginBottom: "20px" },
  backBtn:         { padding: "10px 24px", background: "#C0614A", color: "#fff", border: "none", borderRadius: "24px", fontSize: "14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  // MODAL
  overlay:         { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(44,26,14,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" },
  modal:           { background: "#fff", borderRadius: "var(--radius)", width: "620px", maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "var(--shadow-lg)" },
  modalHeader:     { padding: "22px 24px 18px", borderBottom: "1px solid #F0E8DE", display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  modalTitle:      { fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 500, color: "#2C1A0E" },
  modalSub:        { fontSize: "13px", color: "#9E7B62", marginTop: "2px" },
  closeBtn:        { background: "none", border: "none", fontSize: "18px", color: "#9E7B62", cursor: "pointer", padding: "0 4px" },
  modalForm:       { padding: "18px 24px 12px", display: "flex", gap: "10px", alignItems: "flex-end", borderBottom: "1px solid #F5EDE0" },
  fieldLabel:      { display: "block", fontSize: "11px", color: "#9E7B62", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", fontWeight: 500 },
  input:           { width: "100%", padding: "9px 14px", border: "1.5px solid #D9BFAA", borderRadius: "var(--radius-sm)", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", background: "#FDFAF7", outline: "none", color: "#2C1A0E" },
  select:          { width: "100%", padding: "9px 14px", border: "1.5px solid #D9BFAA", borderRadius: "var(--radius-sm)", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", background: "#FDFAF7", color: "#2C1A0E" },
  addBtn:          { padding: "9px 18px", background: "#C0614A", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" },
  stepsList:       { flex: 1, overflowY: "auto", padding: "14px 24px", display: "flex", flexDirection: "column", gap: "8px", minHeight: "120px", maxHeight: "280px" },
  emptySteps:      { textAlign: "center", color: "#9E7B62", fontSize: "13px", padding: "20px 0" },
  stepItem:        { display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 12px", background: "#FDFAF7", borderRadius: "10px" },
  stepNum:         { width: "24px", height: "24px", borderRadius: "50%", background: "#C0614A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, flexShrink: 0, marginTop: "2px" },
  removeBtn:       { background: "none", border: "none", cursor: "pointer", color: "#C4A98E", fontSize: "14px", padding: "2px 6px", flexShrink: 0 },
  modalFooter:     { padding: "16px 24px", borderTop: "1px solid #F0E8DE", display: "flex", justifyContent: "space-between", alignItems: "center" },
  cancelBtn:       { padding: "9px 20px", background: "#F5EDE0", color: "#7A5C47", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", cursor: "pointer" },
  saveBtn:         { padding: "9px 24px", background: "#2C1A0E", color: "#EDE0D0", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 500, cursor: "pointer" },
};

export default CaseReview;