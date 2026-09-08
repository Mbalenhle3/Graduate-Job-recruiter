import { Link } from "react-router-dom";
import "./CareerServices.css";

function CareerServices() {
  return (
    <section className="career-services">

      {/* =====================================================
          SECTION HEADER
      ===================================================== */}

      <div className="career-services-header">

        <span className="career-services-label">
          CAREER SUPPORT
        </span>

        <h2>
          Everything you need to become career ready
        </h2>

        <p>
          GraduateLink SA provides practical tools and support
          to help students and graduates move from education
          into meaningful employment.
        </p>

      </div>


      {/* =====================================================
          CAREER SERVICES
      ===================================================== */}

      <div className="career-services-grid">

        {/* ===================================================
            AI CAREER GUIDANCE
        =================================================== */}

        <div className="career-service-card">

          <div className="career-service-icon">
            🤖
          </div>

          <h3>
            AI Career Guidance
          </h3>

          <p>
            Get personalised career guidance based on your
            qualifications, skills, interests and career goals.
          </p>

          <Link to="/dashboard">
            Learn More →
          </Link>

        </div>


        {/* ===================================================
            CV BUILDER
        =================================================== */}

        <div className="career-service-card">

          <div className="career-service-icon">
            📄
          </div>

          <h3>
            Professional CV Builder
          </h3>

          <p>
            Create a professional CV that highlights your
            education, skills, projects, achievements and experience.
          </p>

          <Link to="/dashboard">
            Learn More →
          </Link>

        </div>


        {/* ===================================================
            INTERVIEW PREPARATION
        =================================================== */}

        <div className="career-service-card">

          <div className="career-service-icon">
            🎤
          </div>

          <h3>
            Interview Preparation
          </h3>

          <p>
            Prepare for interviews with practical questions,
            guidance and resources designed for graduate job seekers.
          </p>

          <Link to="/dashboard">
            Learn More →
          </Link>

        </div>


        {/* ===================================================
            SKILL DEVELOPMENT
        =================================================== */}

        <div className="career-service-card">

          <div className="career-service-icon">
            💻
          </div>

          <h3>
            Skill Development
          </h3>

          <p>
            Improve your employability through career courses
            covering digital skills, communication and workplace
            readiness.
          </p>

          <Link to="/dashboard">
            Learn More →
          </Link>

        </div>


        {/* ===================================================
            MENTORSHIP
        =================================================== */}

        <div className="career-service-card">

          <div className="career-service-icon">
            🤝
          </div>

          <h3>
            Mentorship & Networking
          </h3>

          <p>
            Connect with professionals, alumni and other graduates
            who can support your career development.
          </p>

          <Link to="/dashboard">
            Learn More →
          </Link>

        </div>


        {/* ===================================================
            APPLICATION TRACKING
        =================================================== */}

        <div className="career-service-card">

          <div className="career-service-icon">
            📊
          </div>

          <h3>
            Application Tracking
          </h3>

          <p>
            Keep track of your applications, deadlines and progress
            from one convenient dashboard.
          </p>

          <Link to="/dashboard">
            Learn More →
          </Link>

        </div>

      </div>

    </section>
  );
}

export default CareerServices;