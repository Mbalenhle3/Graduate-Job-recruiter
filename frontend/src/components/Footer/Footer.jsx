import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* BRAND */}

        <div className="footer-brand">

          <Link
            to="/"
            className="footer-logo"
          >
            GraduateLink<span>SA</span>
          </Link>

          <p>
            Helping students and graduates discover
            opportunities, build career-ready skills,
            and successfully transition into employment.
          </p>

        </div>

        {/* PLATFORM */}

        <div className="footer-column">

          <h3>
            Platform
          </h3>

          <Link to="/jobs">
            Find Jobs
          </Link>

          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/saved-jobs">
            Saved Jobs
          </Link>

          <Link to="/profile">
            My Profile
          </Link>

        </div>

        {/* CAREER */}

        <div className="footer-column">

          <h3>
            Career
          </h3>

          <a href="/#services">
            Career Services
          </a>

          <a href="/#how-it-works">
            How It Works
          </a>

          <Link to="/profile">
            Build Your CV
          </Link>

          <a href="/#services">
            Interview Preparation
          </a>

        </div>

        {/* COMPANY */}

        <div className="footer-column">

          <h3>
            Company
          </h3>

          <Link to="/about">
            About Us
          </Link>

          <Link to="/contact">
            Contact Us
          </Link>

          <a href="#">
            Privacy Policy
          </a>

          <a href="#">
            Terms & Conditions
          </a>

        </div>

      </div>

      {/* BOTTOM */}

      <div className="footer-bottom">

        <div className="footer-bottom-container">

          <p>
            © 2026 GraduateLink SA. All rights reserved.
          </p>

          <p>
            Built for the next generation of South African talent.
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;