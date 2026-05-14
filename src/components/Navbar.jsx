import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  if (
    location.pathname === "/auth" ||
    location.pathname.startsWith("/verify") ||
    location.pathname.startsWith("/auth/google")
  ) {
    return null;
  }

  return (
    <nav className="nav">
      <a
        className="nav-brand"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          navigate("/analyzer");
        }}
      >
        DermaSkin
      </a>

      <ul className="nav-links">
        <li>
          <a
            href="#"
            className={location.pathname === "/analyzer" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              navigate("/analyzer");
            }}
          >
            Product Analyzer
          </a>
        </li>
        <li>
          <a
            href="#"
            className={location.pathname === "/history" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              navigate("/history");
            }}
          >
            History
          </a>
        </li>
      </ul>

      {isLoggedIn && (
        <button onClick={handleLogout} className="nav-logout-btn">
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
