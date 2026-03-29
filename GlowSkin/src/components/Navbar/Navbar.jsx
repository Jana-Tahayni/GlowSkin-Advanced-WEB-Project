import { useState } from "react";
import { User, Menu, X } from "lucide-react";
import "./Navbar.css";
import logo from "../../assets/logo.jpg";

const NAV_LINKS = [
  { label: "Skin Analysis",    href: "#analyzer" },
  { label: "Product Analysis", href: "#products" },
  { label: "Routine Care",     href: "#routine"  },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive]     = useState("Skin Analysis");

  return (
    <header className="navbar">
      {/* ── Logo (right) ── */}
      <a href="/" className="navbar__logo">
  <img src={logo} alt="GlowSkin" className="navbar__logo-img" />
  GlowSkin
</a>

      {/* ── Nav links (center) ── */}
      <nav className={`navbar__links ${menuOpen ? "open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={`navbar__link ${active === link.label ? "active" : ""}`}
            onClick={() => { setActive(link.label); setMenuOpen(false); }}
          >
            {link.label}
            {active === link.label && <span className="navbar__link-dot" />}
          </a>
        ))}
      </nav>

      {/* ── Login icon (left) ── */}
      <div className="navbar__actions">
        <button className="navbar__login" aria-label="Login">
          <User size={18} strokeWidth={1.8} />
          <span>Login</span>
        </button>

        {/* Mobile hamburger */}
        <button
          className="navbar__hamburger"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}