import React, { useState, useEffect, useRef } from "react";
import NotifPanel from "../notifications/NotifPanel";
import AllNotificationsModal from "../notifications/AllNotificationsModal";

// الصفحات اللي تحتاج login
const PROTECTED_PAGES = ["analysis", "product", "payment"];

export const NAV_LINKS = [
  { id: "home",     label: "Home" },
  { id: "analysis", label: "Skin Analysis" },
  { id: "product",  label: "Product Analyzer" },
  { id: "payment",  label: "Pricing" },
];

export default function Navbar({ active, setPage, navigate, notifications = [], setNotifications, onMarkAsRead, onMarkAllRead, isLoggedIn }) {
  const [showNotif,    setShowNotif]    = useState(false);
  const [showAllNotif, setShowAllNotif] = useState(false);
  const panelRef = useRef(null);
  const bellRef  = useRef(null);
  const unread   = notifications.filter(n => !n.read).length;

  // قراءة الـ role من localStorage
  const userRaw  = localStorage.getItem("user");
  const userRole = userRaw ? JSON.parse(userRaw)?.role : null;
  const isDoctor = isLoggedIn && userRole === "doctor";

  useEffect(() => {
    const handler = e => {
      if (panelRef.current && !panelRef.current.contains(e.target) &&
          bellRef.current  && !bellRef.current.contains(e.target))
        setShowNotif(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (navigate) navigate("/auth");
    else setPage("home");
  };

  const handleNavClick = (id) => {
    // صفحة محمية والمستخدم مش logged in → احفظ الهدف وروح للـ login
    if (PROTECTED_PAGES.includes(id) && !isLoggedIn) {
      sessionStorage.setItem("redirectAfterLogin", id);
      if (navigate) navigate("/auth");
      return;
    }
    if (id === "doctor") {
      if (navigate) navigate("/doctor");
    } else {
      setPage(id);
    }
  };

  return (
    <nav className="nav lujain-scope">
      <div className="nav-inner">
        <span className="logo" onClick={() => setPage("home")} style={{ cursor: "pointer" }}>
          <span className="logo-dot" />
          GlowSkin
        </span>

        <ul className="nav-links">
          {/* الصفحات العادية */}
          {NAV_LINKS.map(l => (
            <li key={l.id}>
              <button
                className={`nav-link ${active === l.id ? "active" : ""}`}
                onClick={() => handleNavClick(l.id)}
              >{l.label}</button>
            </li>
          ))}

          {/* Doctor Dashboard — يظهر بس للدكتور */}
          {isDoctor && (
            <li>
              <button
                className="nav-link"
                onClick={() => navigate("/doctor")}
              >Doctor Dashboard</button>
            </li>
          )}
        </ul>

        <div className="nav-actions">
          {/* Bell — للمسجلين فقط */}
          {isLoggedIn && (
            <div style={{ position: "relative" }}>
              <button ref={bellRef} className="notif-btn"
                onClick={() => setShowNotif(v => !v)} aria-label="Notifications">
                🔔
                {unread > 0 && <span className="notif-badge" />}
              </button>
              {showNotif && (
                <div ref={panelRef}>
                  <NotifPanel
                    notifications={notifications}
                    onMarkAll={onMarkAllRead}
                    onMarkAsRead={onMarkAsRead}
                    onViewAll={() => { setShowAllNotif(true); setShowNotif(false); }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Auth button */}
          {isLoggedIn ? (
            <button className="btn btn-outline" onClick={handleLogout}>Sign Out</button>
          ) : (
            <button className="btn btn-primary" onClick={() => navigate ? navigate("/auth") : setPage("auth")}>
              Sign In
            </button>
          )}
        </div>
      </div>

      {showAllNotif && (
        <AllNotificationsModal
          notifications={notifications}
          setNotifications={setNotifications}
          onClose={() => setShowAllNotif(false)}
        />
      )}
    </nav>
  );
}