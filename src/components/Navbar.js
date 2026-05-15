import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const navItems = [
    {
      to: "/",
      label: "Dashboard",
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
    },
    {
      to: "/cases",
      label: "Pending Cases",
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 12h6M9 16h6M9 8h6M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" />
        </svg>
      ),
    },
    {
      to: "/review",
      label: "Case Review",
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4-4" />
        </svg>
      ),
    },
   
  ];

  return (
    <div style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <h2 style={styles.logoTitle}>skincare</h2>
        <p style={styles.logoSub}>Skin Analysis Pro</p>
      </div>

      {/* Nav */}
      <nav style={styles.nav}>
        <p style={styles.sectionLabel}>Main</p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
                textDecoration: "none",
              }}
            >
              {isActive && <div style={styles.activeLine} />}
              <span style={{ opacity: 0.85 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.adminBadge}>
          <div style={styles.avatar}>DA</div>
          <div>
            <p style={styles.adminName}>Dr. Ahmad</p>
            <span style={styles.adminRole}>Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "230px",
    background: "#2C1A0E",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    zIndex: 100,
  },
  logo: {
    padding: "28px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  logoTitle: {
    fontFamily: "'Playfair Display', serif",
    color: "#EDE0D0",
    fontSize: "18px",
    fontWeight: 600,
    letterSpacing: "0.5px",
  },
  logoSub: {
    color: "#9E7B62",
    fontSize: "11px",
    marginTop: "3px",
    letterSpacing: "1.2px",
    textTransform: "uppercase",
  },
  nav: {
    padding: "20px 0",
    flex: 1,
  },
  sectionLabel: {
    padding: "0 24px",
    marginBottom: "4px",
    fontSize: "10px",
    color: "#7A5C47",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    fontWeight: 500,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    padding: "10px 24px",
    cursor: "pointer",
    color: "#9E7B62",
    fontSize: "13.5px",
    position: "relative",
    transition: "all 0.2s",
  },
  navItemActive: {
    color: "#EDE0D0",
    background: "rgba(192,97,74,0.18)",
  },
  activeLine: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "3px",
    background: "#C0614A",
    borderRadius: "0 3px 3px 0",
  },
  footer: {
    padding: "20px 24px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
  adminBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#C0614A,#9E7B62)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 600,
    color: "#F5EDE0",
  },
  adminName: {
    fontSize: "13px",
    color: "#EDE0D0",
    fontWeight: 500,
  },
  adminRole: {
    fontSize: "11px",
    color: "#7A5C47",
  },
};

export default Navbar;