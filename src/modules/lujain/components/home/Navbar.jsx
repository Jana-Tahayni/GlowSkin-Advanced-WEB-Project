// import React, { useState, useEffect, useRef } from "react";
// import NotifPanel from "../notifications/NotifPanel";
// import AllNotificationsModal from "../notifications/AllNotificationsModal";

// // الصفحات اللي تحتاج login
// const PROTECTED_PAGES = ["analysis", "product", "payment"];

// export const NAV_LINKS = [
//   { id: "home",     label: "Home" },
//   { id: "analysis", label: "Skin Analysis" },
//   { id: "product",  label: "Product Analyzer" },
//   { id: "payment",  label: "Pricing" },
// ];

// export default function Navbar({ active, setPage, navigate, notifications = [], setNotifications, onMarkAsRead, onMarkAllRead, isLoggedIn }) {
//   const [showNotif,    setShowNotif]    = useState(false);
//   const [showAllNotif, setShowAllNotif] = useState(false);
//   const panelRef = useRef(null);
//   const bellRef  = useRef(null);
//   const unread   = notifications.filter(n => !n.read).length;

//   // قراءة الـ role من localStorage
//   const userRaw  = localStorage.getItem("user");
//   const userRole = userRaw ? JSON.parse(userRaw)?.role : null;
//   const isDoctor = isLoggedIn && userRole === "doctor";

//   useEffect(() => {
//     const handler = e => {
//       if (panelRef.current && !panelRef.current.contains(e.target) &&
//           bellRef.current  && !bellRef.current.contains(e.target))
//         setShowNotif(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     if (navigate) navigate("/auth");
//     else setPage("home");
//   };

//   const handleNavClick = (id) => {
//     // صفحة محمية والمستخدم مش logged in → احفظ الهدف وروح للـ login
//     if (PROTECTED_PAGES.includes(id) && !isLoggedIn) {
//       sessionStorage.setItem("redirectAfterLogin", id);
//       if (navigate) navigate("/auth");
//       return;
//     }
//     if (id === "doctor") {
//       if (navigate) navigate("/doctor");
//     } else {
//       setPage(id);
//     }
//   };

//   return (
//     <nav className="nav lujain-scope">
//       <div className="nav-inner">
//         <span className="logo" onClick={() => setPage("home")} style={{ cursor: "pointer" }}>
//           <span className="logo-dot" />
//           GlowSkin
//         </span>

//         <ul className="nav-links">
//           {/* الصفحات العادية */}
//           {NAV_LINKS.map(l => (
//             <li key={l.id}>
//               <button
//                 className={`nav-link ${active === l.id ? "active" : ""}`}
//                 onClick={() => handleNavClick(l.id)}
//               >{l.label}</button>
//             </li>
//           ))}

//           {/* Doctor Dashboard — يظهر بس للدكتور */}
//           {isDoctor && (
//             <li>
//               <button
//                 className="nav-link"
//                 onClick={() => navigate("/doctor")}
//               >Doctor Dashboard</button>
//             </li>
//           )}
//         </ul>

//         <div className="nav-actions">
//           {/* Bell — للمسجلين فقط */}
//           {isLoggedIn && (
//             <div style={{ position: "relative" }}>
//               <button ref={bellRef} className="notif-btn"
//                 onClick={() => setShowNotif(v => !v)} aria-label="Notifications">
//                 🔔
//                 {unread > 0 && <span className="notif-badge" />}
//               </button>
//               {showNotif && (
//                 <div ref={panelRef}>
//                   <NotifPanel
//                     notifications={notifications}
//                     onMarkAll={onMarkAllRead}
//                     onMarkAsRead={onMarkAsRead}
//                     onViewAll={() => { setShowAllNotif(true); setShowNotif(false); }}
//                   />
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Auth button */}
//           {isLoggedIn ? (
//             <button className="btn btn-outline" onClick={handleLogout}>Sign Out</button>
//           ) : (
//             <button className="btn btn-primary" onClick={() => navigate ? navigate("/auth") : setPage("auth")}>
//               Sign In
//             </button>
//           )}
//         </div>
//       </div>

//       {showAllNotif && (
//         <AllNotificationsModal
//           notifications={notifications}
//           setNotifications={setNotifications}
//           onClose={() => setShowAllNotif(false)}
//         />
//       )}
//     </nav>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import NotifPanel from "../notifications/NotifPanel";
import AllNotificationsModal from "../notifications/AllNotificationsModal";

const PROTECTED_PAGES = ["analysis", "product", "payment"];

export const NAV_LINKS = [
  { id: "home",     label: "Home" },
  { id: "analysis", label: "Skin Analysis" },
  { id: "product",  label: "Product Analyzer" },
  { id: "payment",  label: "Pricing" },
];

const navStyles = `
  .gn-nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(247,242,238,0.97);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(61,140,128,0.13);
    padding: 0 1.5rem;
  }
  .gn-inner {
    max-width: 1160px; margin: 0 auto;
    height: 66px; display: flex; align-items: center; justify-content: space-between;
  }
  .gn-logo {
    display: flex; align-items: center; gap: .55rem;
    cursor: pointer; border: none; background: none; padding: 0;
  }
  .gn-logo-orb {
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg,#5AADA0,#1E5048);
    display: flex; align-items: center; justify-content: center;
    color: #F7F2EE; transition: transform .25s ease;
  }
  .gn-logo:hover .gn-logo-orb { transform: scale(1.08) rotate(-6deg); }
  .gn-logo-orb svg { width: 15px; height: 15px; }
  .gn-logo-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem; font-weight: 500;
    color: #1E5048; letter-spacing: .02em;
  }
  .gn-logo-text em { font-style: italic; color: #5AADA0; }
  
  /* القائمة لنسخة الكمبيوتر */
  .gn-links {
    display: flex; align-items: center; gap: .2rem;
    list-style: none; margin: 0; padding: 0;
  }
  .gn-link {
    position: relative; padding: .45rem 1rem; border-radius: 50px;
    border: none; background: none;
    font-family: 'Jost', sans-serif; font-size: 1rem;
    font-weight: 400; color: #8B6450; cursor: pointer;
    white-space: nowrap; transition: color .18s, background .18s;
  }
  .gn-link:hover { color: #1E5048; background: rgba(168,212,204,0.18); }
  .gn-link--active { color: #3D8C80; font-weight: 500; }
  .gn-link-pip {
    display: block; position: absolute; bottom: 4px;
    left: 50%; transform: translateX(-50%);
    width: 16px; height: 2px; border-radius: 2px; background: #5AADA0;
  }
  
  .gn-actions { display: flex; align-items: center; gap: .6rem; }
  .gn-panel-wrap { position: absolute; top: calc(100% + 10px); right: 0; z-index: 200; }
  
  /* زر الهامبرغر للموبايل */
  .gn-menu-toggle {
    display: none; background: none; border: none; cursor: pointer;
    padding: .5rem; color: #1E5048;
  }

  /* تصميم متجاوب للموبايل */
  @media (max-width: 868px) {
    .gn-links {
      position: fixed; top: 66px; left: 0; right: 0;
      background: rgba(247,242,238,0.98);
      flex-direction: column; gap: 1rem; padding: 2rem 0;
      border-bottom: 1px solid rgba(61,140,128,0.13);
      transform: translateY(-150%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 99; box-shadow: 0 10px 30px rgba(30, 80, 72, 0.05);
    }
    .gn-links.is-open { transform: translateY(0); }
    .gn-menu-toggle { display: block; }
    .gn-actions .btn { display: none; } /* إخفاء الأزرار الكبيرة في الموبايل والاعتماد على القائمة الجانبية */
    .gn-mobile-auth { display: block !important; margin-top: 1rem; width: 80%; }
  }
  .gn-mobile-auth { display: none; }
`;

export default function Navbar({
  active, setPage, navigate,
  notifications = [], setNotifications,
  onMarkAsRead, onMarkAllRead, isLoggedIn,
}) {
  const [showNotif, setShowNotif] = useState(false);
  const [showAllNotif, setShowAllNotif] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const panelRef = useRef(null);
  const bellRef  = useRef(null);
  const unread   = notifications.filter(n => !n.read).length;

  const userRaw      = localStorage.getItem("user");
  const userRole     = userRaw ? JSON.parse(userRaw)?.role : null;
  const isDoctor     = isLoggedIn && userRole === "doctor";

  useEffect(() => {
    const handler = e => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        bellRef.current  && !bellRef.current.contains(e.target)
      ) setShowNotif(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    setIsMenuOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (navigate) navigate("/auth");
    else setPage("home");
  };

  const handleNavClick = (id) => {
    setIsMenuOpen(false);
    if (PROTECTED_PAGES.includes(id) && !isLoggedIn) {
      sessionStorage.setItem("redirectAfterLogin", id);
      if (navigate) navigate("/auth");
      return;
    }
    id === "doctor" ? navigate("/doctor") : setPage(id);
  };

  return (
    <div className="lujain-scope">
      <style>{navStyles}</style>

      <nav className="gn-nav">
        <div className="gn-inner">
          
          {/* زر القائمة للموبايل يسار اللوجو أو يمنه حسب الاتجاه */}
          <button className="gn-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              {isMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round"/>
              )}
            </svg>
          </button>

          {/* اللوجو */}
          <button className="gn-logo" onClick={() => setPage("home")}>
            <span className="gn-logo-orb">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 4c-3.5 0-6 2.8-6 5.8C6 14.5 12 20 12 20s6-5.5 6-10.2C18 6.8 15.5 4 12 4z"/>
                <circle cx="12" cy="10" r="2.2"/>
              </svg>
            </span>
            <span className="gn-logo-text">Glow<em>Skin</em></span>
          </button>

          {/* الروابط (تتحول لقائمة منسدلة في الموبايل) */}
          <ul className={`gn-links ${isMenuOpen ? "is-open" : ""}`}>
            {NAV_LINKS.map(l => (
              <li key={l.id}>
                <button
                  className={`gn-link ${active === l.id ? "gn-link--active" : ""}`}
                  onClick={() => handleNavClick(l.id)}
                >
                  {l.label}
                  {active === l.id && <span className="gn-link-pip" />}
                </button>
              </li>
            ))}
            {isDoctor && (
              <li>
                <button className="gn-link" onClick={() => handleNavClick("doctor")}>
                  Doctor Dashboard
                </button>
              </li>
            )}
            
            {/* أزرار تسجيل الدخول داخل قائمة الموبايل */}
            <li className="gn-mobile-auth">
              {isLoggedIn ? (
                <button className="btn btn-outline" style={{width: '100%'}} onClick={handleLogout}>Sign Out</button>
              ) : (
                <button className="btn btn-primary" style={{width: '100%'}} onClick={() => handleNavClick("auth")}>Sign In</button>
              )}
            </li>
          </ul>

          {/* الأزرار الثابتة (الجرس والحساب) */}
          <div className="gn-actions">
            {isLoggedIn && (
              <div style={{ position: "relative" }}>
                <button
                  ref={bellRef}
                  className="notif-btn"
                  onClick={() => setShowNotif(v => !v)}
                  aria-label="Notifications"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="#8B6450"
                    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 01-3.46 0"/>
                  </svg>
                  {unread > 0 && <span className="notif-badge" />}
                </button>

                {showNotif && (
                  <div ref={panelRef} className="gn-panel-wrap">
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

            {/* تظهر فقط على الشاشات الكبيرة */}
            {isLoggedIn ? (
              <button className="btn btn-outline" onClick={handleLogout}>Sign Out</button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => navigate ? navigate("/auth") : setPage("auth")}
              >
                Sign In
              </button>
            )}
          </div>

        </div>
      </nav>

      {showAllNotif && (
        <AllNotificationsModal
          notifications={notifications}
          setNotifications={setNotifications}
          onClose={() => setShowAllNotif(false)}
        />
      )}
    </div>
  );
}