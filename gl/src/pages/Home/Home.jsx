import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const categories = [
    {
      icon: "💻",
      title: "Technology",
      jobs: "245 Opportunities",
    },
    {
      icon: "📊",
      title: "Business & Finance",
      jobs: "186 Opportunities",
    },
    {
      icon: "⚙️",
      title: "Engineering",
      jobs: "152 Opportunities",
    },
    {
      icon: "🧪",
      title: "Science",
      jobs: "98 Opportunities",
    },
    {
      icon: "🏥",
      title: "Healthcare",
      jobs: "127 Opportunities",
    },
    {
      icon: "📢",
      title: "Marketing",
      jobs: "114 Opportunities",
    },
  ];

  const opportunities = [
    {
      company: "Microsoft",
      logo: "M",
      title: "Software Engineering Graduate",
      location: "Johannesburg, Gauteng",
      type: "Graduate Programme",
      closing: "Closing in 12 days",
    },
    {
      company: "Standard Bank",
      logo: "S",
      title: "Technology Graduate Programme",
      location: "Johannesburg, Gauteng",
      type: "Graduate Programme",
      closing: "Closing in 8 days",
    },
    {
      company: "Amazon",
      logo: "A",
      title: "Cloud Support Associate",
      location: "Cape Town, Western Cape",
      type: "Entry Level",
      closing: "Closing in 18 days",
    },
  ];

  return (
    <main className="home-page">

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-container">

          <div className="hero-text">

            <div className="hero-tag">
              <span>🇿🇦</span>
              Built for South African Students & Graduates
            </div>

            <h1>
              Your Career Starts
              <span> Here.</span>
            </h1>

            <p>
              Discover internships, graduate programmes and entry-level
              opportunities designed to help you move from university
              into the world of work.
            </p>

            <div className="hero-actions">
              <Link to="/jobs" className="primary-button">
                Explore Opportunities
                <span>→</span>
              </Link>

              <Link to="/register" className="outline-button">
                Create Free Profile
              </Link>
            </div>

            <div className="hero-trust">
              <div className="avatars">
                <span>👨🏾</span>
                <span>👩🏾</span>
                <span>👨🏽</span>
                <span>👩🏽</span>
              </div>

              <div>
                <strong>10,000+</strong>
                <small>Students building their future</small>
              </div>
            </div>

          </div>

          {/* HERO VISUAL */}
          <div className="hero-visual">

            <div className="floating-card top-card">
              <div className="floating-icon">✓</div>
              <div>
                <strong>Application Submitted</strong>
                <span>Software Developer</span>
              </div>
            </div>

            <div className="dashboard-preview">

              <div className="preview-header">
                <div>
                  <small>Good morning 👋</small>
                  <h3>Find your next opportunity</h3>
                </div>

                <div className="preview-avatar">
                  LN
                </div>
              </div>

              <div className="preview-search">
                <span>🔍</span>
                <span>Search jobs, skills or companies...</span>
              </div>

              <div className="preview-job">
                <div className="company-logo microsoft">
                  M
                </div>

                <div className="preview-job-info">
                  <strong>Graduate Software Developer</strong>
                  <span>Microsoft · Johannesburg</span>
                </div>

                <span className="bookmark">♡</span>
              </div>

              <div className="preview-job">
                <div className="company-logo standard">
                  S
                </div>

                <div className="preview-job-info">
                  <strong>Technology Graduate</strong>
                  <span>Standard Bank · Gauteng</span>
                </div>

                <span className="bookmark">♡</span>
              </div>

              <div className="preview-job">
                <div className="company-logo amazon">
                  A
                </div>

                <div className="preview-job-info">
                  <strong>Cloud Support Associate</strong>
                  <span>Amazon · Cape Town</span>
                </div>

                <span className="bookmark">♡</span>
              </div>

            </div>

            <div className="floating-card bottom-card">
              <div className="success-circle">
                ✓
              </div>

              <div>
                <strong>Profile 85% Complete</strong>
                <span>You're almost there!</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* STATISTICS */}
      <section className="stats-section">

        <div className="stats-container">

          <div className="stat">
            <strong>5,000+</strong>
            <span>Opportunities</span>
          </div>

          <div className="stat">
            <strong>500+</strong>
            <span>Partner Companies</span>
          </div>

          <div className="stat">
            <strong>10,000+</strong>
            <span>Students & Graduates</span>
          </div>

          <div className="stat">
            <strong>95%</strong>
            <span>Verified Opportunities</span>
          </div>

        </div>

      </section>

      {/* CATEGORIES */}
      <section className="categories-section">

        <div className="section-container">

          <div className="section-heading">

            <div>
              <span className="section-label">
                EXPLORE CAREERS
              </span>

              <h2>
                Find opportunities in your field
              </h2>
            </div>

            <Link to="/jobs" className="view-all">
              View all opportunities →
            </Link>

          </div>

          <div className="category-grid">

            {categories.map((category, index) => (
              <Link
                to="/jobs"
                className="category-card"
                key={index}
              >

                <div className="category-icon">
                  {category.icon}
                </div>

                <div>
                  <h3>{category.title}</h3>
                  <p>{category.jobs}</p>
                </div>

                <span className="category-arrow">
                  →
                </span>

              </Link>
            ))}

          </div>

        </div>

      </section>

      {/* FEATURED OPPORTUNITIES */}
      <section className="opportunities-section">

        <div className="section-container">

          <div className="section-heading">

            <div>
              <span className="section-label">
                FEATURED OPPORTUNITIES
              </span>

              <h2>
                Start your career with leading companies
              </h2>

              <p>
                Discover opportunities from companies looking
                for the next generation of South African talent.
              </p>
            </div>

            <Link to="/jobs" className="view-all">
              Browse all jobs →
            </Link>

          </div>

          <div className="opportunities-grid">

            {opportunities.map((job, index) => (
              <div className="opportunity-card" key={index}>

                <div className="opportunity-top">

                  <div className="large-company-logo">
                    {job.logo}
                  </div>

                  <button className="save-job">
                    ♡
                  </button>

                </div>

                <span className="job-type">
                  {job.type}
                </span>

                <h3>{job.title}</h3>

                <p className="company-name">
                  {job.company}
                </p>

                <p className="job-location">
                  📍 {job.location}
                </p>

                <div className="job-footer">

                  <span className="closing">
                    {job.closing}
                  </span>

                  <Link to={`/jobs/${index + 1}`}>
                    View Job →
                  </Link>

                </div>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* CAREER SUPPORT */}
      <section className="support-section">

        <div className="support-container">

          <div className="support-content">

            <span className="section-label">
              CAREER SUPPORT
            </span>

            <h2>
              More than just a job board.
            </h2>

            <p>
              GraduateLink SA helps you prepare for your career,
              not just find a job. Build your profile, improve
              your skills and get guidance throughout your journey.
            </p>

            <div className="support-list">

              <div>
                <span>✓</span>
                <p>Professional CV and profile support</p>
              </div>

              <div>
                <span>✓</span>
                <p>Interview preparation and career guidance</p>
              </div>

              <div>
                <span>✓</span>
                <p>Personalised opportunity recommendations</p>
              </div>

              <div>
                <span>✓</span>
                <p>Application tracking and reminders</p>
              </div>

            </div>

            <Link to="/register" className="primary-button">
              Build Your Career Profile →
            </Link>

          </div>

          <div className="support-visual">

            <div className="support-main-card">

              <div className="career-header">
                <span>Your Career Progress</span>
                <strong>85%</strong>
              </div>

              <div className="progress-bar">
                <div></div>
              </div>

              <div className="career-items">

                <div>
                  <span className="check">✓</span>
                  <span>Complete your profile</span>
                  <strong>Done</strong>
                </div>

                <div>
                  <span className="check">✓</span>
                  <span>Upload your CV</span>
                  <strong>Done</strong>
                </div>

                <div>
                  <span className="pending">○</span>
                  <span>Complete career assessment</span>
                  <strong>Next</strong>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="final-cta">

        <div>

          <span>YOUR FUTURE STARTS TODAY</span>

          <h2>
            Ready to take the next step?
          </h2>

          <p>
            Join thousands of South African students and graduates
            building their careers with GraduateLink SA.
          </p>

          <div className="cta-buttons">

            <Link to="/register" className="cta-primary">
              Create Your Free Profile
            </Link>

            <Link to="/jobs" className="cta-secondary">
              Explore Opportunities
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;