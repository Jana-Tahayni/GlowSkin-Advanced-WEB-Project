



const conditionColors = {
  acne:      { bg: "#F0DDD8", color: "#C0614A" },
  dry:       { bg: "#EDE0D0", color: "#7A5C47" },
  sensitive: { bg: "#FAF0E0", color: "#9E7B62" },
  oily:      { bg: "#E8F0E8", color: "#2A5228" },
  combo:     { bg: "#E8E0F0", color: "#6B4A8A" },
};

const statusStyles = {
  pending:  { bg: "#EDCFC8", color: "#9A3D2A", dot: "#C0614A",  label: "Pending"  },
  reviewed: { bg: "#C8DBC6", color: "#2A5228", dot: "#3A7A38",  label: "Reviewed" },
  urgent:   { bg: "#FAF0E0", color: "#8A6A20", dot: "#E8B86D",  label: "Urgent" },
    rejected:   { bg: "#FAF0E0", color: "#bfd30d", dot: "#4b8ca5",  label: "Rejected" },
    
};

function CaseCard({ data, onReview }) {
  const cond = conditionColors[data.condition] || conditionColors.combo;
  const st   = statusStyles[data.status]       || statusStyles.pending;

  return (
    <div style={styles.card}>
      <div style={styles.imageWrap}>
        <img src={data.image} alt="skin case" style={styles.image} />
        <span style={{ ...styles.statusBadge, background: st.bg, color: st.color }}>
          <span style={{ ...styles.dot, background: st.dot }} />
          {st.label}
        </span>
      </div>

      <div style={styles.body}>
        <div style={styles.name}>{data.patientName || "Unknown Patient"}</div>
        <div style={styles.id}>{data.patientId}</div>
        <span style={{ ...styles.condTag, background: cond.bg, color: cond.color }}>
          {data.result}
        </span>
      </div>

      {data.confidence && (
        <div style={styles.confRow}>
          <span style={styles.confLabel}>AI Confidence</span>
          <div style={styles.confBar}>
            <div style={{ width: `${data.confidence}%`, height: "100%", background: data.confidence > 85 ? "#C0614A" : "#E8B86D", borderRadius: "3px" }} />
          </div>
          <span style={styles.confPct}>{data.confidence}%</span>
        </div>
      )}

      <button style={styles.button} onClick={() => onReview(data)}>
        Review Case →
      </button>
    </div>
  );
}

const styles = {
  card:        { background: "#fff", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", overflow: "hidden", width: "220px", transition: "transform 0.2s, box-shadow 0.2s" },
  imageWrap:   { position: "relative" },
  image:       { width: "100%", height: "140px", objectFit: "cover", display: "block" },
  statusBadge: { position: "absolute", top: "10px", right: "10px", display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 9px", borderRadius: "20px", fontSize: "11px", fontWeight: 500, backdropFilter: "blur(4px)" },
  dot:         { width: "5px", height: "5px", borderRadius: "50%" },
  body:        { padding: "14px 16px 10px" },
  name:        { fontSize: "13.5px", fontWeight: 500, color: "#2C1A0E", marginBottom: "2px" },
  id:          { fontSize: "11px", color: "#9E7B62", marginBottom: "8px" },
  condTag:     { display: "inline-block", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 500 },
  confRow:     { display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px" },
  confLabel:   { fontSize: "10px", color: "#9E7B62", whiteSpace: "nowrap" },
  confBar:     { flex: 1, height: "4px", background: "#F0E8DE", borderRadius: "3px", overflow: "hidden" },
  confPct:     { fontSize: "11px", color: "#7A5C47", fontWeight: 600 },
  button:      { display: "block", width: "calc(100% - 32px)", margin: "0 16px 16px", padding: "9px", background: "#C0614A", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 500, textAlign: "center" },
};

export default CaseCard;