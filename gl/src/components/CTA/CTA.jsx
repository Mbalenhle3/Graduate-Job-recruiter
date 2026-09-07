import { FiArrowRight, FiUserPlus } from "react-icons/fi";
import "./CTA.css";

function CTA() {
  return (
    <section className="cta-section">
      <div className="cta-container">

        <div className="cta-icon">
          <FiUserPlus />
        </div>

        <div className="cta-content">
          <span className="cta-label">
            START YOUR CAREER JOURNEY
          </span>

          <h2>
            Ready to take the next step?
          </h2>

          <p>
            Create your GraduateLink SA profile and discover
            opportunities, career support and resources designed
            to help you become job-ready.
          </p>

          <div className="cta-buttons">

            <button className="cta-primary">
              Create Your Profile
              <FiArrowRight />
            </button>

            <button className="cta-secondary">
              Explore Opportunities
            </button>

          </div>
        </div>

      </div>
    </section>
  );
}

export default CTA;