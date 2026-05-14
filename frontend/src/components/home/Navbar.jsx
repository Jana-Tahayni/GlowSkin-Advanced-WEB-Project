import React, { useState, useEffect, useRef } from "react";
import { NAV_LINKS } from "../../data/data";
import NotifPanel from "../notifications/NotifPanel";
import AllNotificationsModal from "../notifications/AllNotificationsModal";

export default function Navbar({ active, setPage, notifications, setNotifications, onMarkAsRead, onMarkAllRead }) {
  const [showNotif, setShowNotif] = useState(false);
  const [showAllNotif, setShowAllNotif] = useState(false);
  const panelRef = useRef(null);
  const bellRef  = useRef(null);
  const unread   = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handler = e => {
      if (panelRef.current && !panelRef.current.contains(e.target) &&
          bellRef.current  && !bellRef.current.contains(e.target))
        setShowNotif(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="nav">
      <div className="nav-inner">
        <span className="logo" onClick={() => setPage('home')} style={{cursor:'pointer'}}>
          <span className="logo-dot" />
          GlowSkin
        </span>
        <ul className="nav-links">
          {NAV_LINKS.map(l => (
            <li key={l.id}>
              <button className={`nav-link ${active === l.id ? "active" : ""}`}
                onClick={() => setPage(l.id)}>{l.label}</button>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
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
                  onViewAll={() => setShowAllNotif(true)}
                />
                
              </div>
            )}
          </div>
          <button className="btn btn-primary">Sign In</button>
        </div>
      </div>
      {showAllNotif && (
  <AllNotificationsModal
    notifications={notifications}
    onClose={() => setShowAllNotif(false)}
    
  />
)}
    </nav>
  );
}