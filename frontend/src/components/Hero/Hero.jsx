import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-container">

        {/* LEFT SIDE */}
        <div className="hero-content">

          <span className="hero-badge">
            GRADUATELINK SA
          </span>

          <h1>
            Your Future Starts
            <span>Here.</span>
          </h1>

          <p>
            A career platform designed to help students and
            graduates discover opportunities, build skills,
            and successfully transition from education to employment.
          </p>

          <div className="hero-buttons">

            <Link
              to="/jobs"
              className="hero-btn-primary"
            >
              Find Jobs
            </Link>

            <Link
              to="/profile"
              className="hero-btn-secondary"
            >
              Build Your Profile
            </Link>

          </div>

          <div className="hero-features">

            <div className="hero-feature">
              <strong>1,000+</strong>
              <span>Job Opportunities</span>
            </div>

            <div className="hero-feature">
              <strong>500+</strong>
              <span>Students</span>
            </div>

            <div className="hero-feature">
              <strong>100+</strong>
              <span>Employers</span>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="hero-image">

          <div className="hero-card">

            <div className="hero-card-top">
              <span>Career Opportunity</span>
              <span className="hero-card-dot"></span>
            </div>

            <div className="hero-card-icon">
              💼
            </div>

            <h3>
              Graduate Software Developer
            </h3>

            <p>
              Microsoft
            </p>

            <div className="hero-card-details">

              <span>
                📍 Johannesburg
              </span>

              <span>
                🎓 Graduate Programme
              </span>

            </div>

            <Link
              to="/jobs"
              className="hero-card-button"
            >
              Explore Opportunities
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;