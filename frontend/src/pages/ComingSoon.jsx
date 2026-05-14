function ComingSoon({ label }) {
  return (
    <div className="coming-soon">
      <div className="coming-soon-icon">✦</div>
      <h2>{label}</h2>
      <p style={{ fontSize:"0.9rem" }}>This module is currently in development. Check back soon!</p>
    </div>
  );
}

export default ComingSoon;