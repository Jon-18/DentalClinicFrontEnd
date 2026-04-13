import { useState } from "react";
import '../style/components/navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <a href="/">
          <img src="assets/Logo.jpg" alt="Dental Clinic Logo" />
          <h2>Sibonga Dental Clinic</h2>
        </a>
      </div>

      <div
        className={`burger ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><a href="/">Home</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#about-us">About</a></li>
        <li><a href="#contact-us-page">Contact</a></li>
        <li><a href="/login" className="btn-login">Login</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
