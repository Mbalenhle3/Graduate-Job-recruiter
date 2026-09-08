import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    applications: 0,
    underReview: 0,
  });

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadDashboardStats();
  }, []);

  async function loadDashboardStats() {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await axios.get(
        "http://localhost/server/api/admin_dashboard.php"
      );

      console.log(
        "Admin dashboard response:",
        response.data
      );

      if (response.data.success) {
        const statistics = response.data.statistics;

        setStats({
          users: Number(statistics?.total_users || 0),

          jobs: Number(statistics?.total_jobs || 0),

          applications: Number(
            statistics?.total_applications || 0
          ),

          underReview: Number(
            statistics?.applications_under_review || 0
          ),
        });
      } else {
        setErrorMessage(
          response.data.message ||
            "Unable to load dashboard statistics."
        );
      }
    } catch (error) {
      console.error(
        "Error loading admin dashboard:",
        error
      );

      if (error.response) {
        setErrorMessage(
          error.response.data?.message ||
            "Unable to load dashboard statistics."
        );
      } else {
        setErrorMessage(
          "Unable to connect to the PHP server. Make sure XAMPP Apache and MySQL are running."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-dashboard-page">

      {/* HEADER */}

      <section className="admin-dashboard-header">

        <div className="admin-dashboard-header-container">

          <span className="admin-dashboard-label">
            ADMINISTRATION
          </span>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Manage GraduateLink SA users, jobs,
            applications and career opportunities
            from one place.
          </p>

        </div>

      </section>


      {/* ERROR */}

      {errorMessage && (
        <div className="admin-container">

          <div className="admin-error-message">
            {errorMessage}
          </div>

        </div>
      )}


      {/* STATISTICS */}

      <section className="admin-stats-section">

        <div className="admin-container">

          <div className="admin-stats-grid">

            {/* USERS */}

            <div className="admin-stat-card">

              <div className="admin-stat-icon">
                👥
              </div>

              <div className="admin-stat-content">

                <span>
                  Total Users
                </span>

                <strong>
                  {loading ? "..." : stats.users}
                </strong>

              </div>

            </div>


            {/* JOBS */}

            <div className="admin-stat-card">

              <div className="admin-stat-icon">
                💼
              </div>

              <div className="admin-stat-content">

                <span>
                  Total Jobs
                </span>

                <strong>
                  {loading ? "..." : stats.jobs}
                </strong>

              </div>

            </div>


            {/* APPLICATIONS */}

            <div className="admin-stat-card">

              <div className="admin-stat-icon">
                📄
              </div>

              <div className="admin-stat-content">

                <span>
                  Applications
                </span>

                <strong>
                  {loading ? "..." : stats.applications}
                </strong>

              </div>

            </div>


            {/* UNDER REVIEW */}

            <div className="admin-stat-card">

              <div className="admin-stat-icon">
                🔍
              </div>

              <div className="admin-stat-content">

                <span>
                  Under Review
                </span>

                <strong>
                  {loading ? "..." : stats.underReview}
                </strong>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* MANAGEMENT */}

      <section className="admin-dashboard-content">

        <div className="admin-container">

          <div className="admin-section-header">

            <div>

              <span className="admin-section-label">
                MANAGEMENT
              </span>

              <h2>
                Administration Tools
              </h2>

              <p>
                Select an area you want to manage.
              </p>

            </div>

          </div>


          <div className="admin-management-grid">


            {/* USERS */}

            <div className="admin-management-card">

              <div className="admin-management-icon">
                👥
              </div>

              <h3>
                Manage Users
              </h3>

              <p>
                View registered students and manage
                their GraduateLink SA accounts.
              </p>

              <Link
                to="/admin/users"
                className="admin-management-button"
              >
                Manage Users →
              </Link>

            </div>


            {/* JOBS */}

            <div className="admin-management-card">

              <div className="admin-management-icon">
                💼
              </div>

              <h3>
                Manage Jobs
              </h3>

              <p>
                Add, edit and manage internship,
                graduate and employment opportunities.
              </p>

              <Link
                to="/admin/jobs"
                className="admin-management-button"
              >
                Manage Jobs →
              </Link>

            </div>


            {/* APPLICATIONS */}

            <div className="admin-management-card">

              <div className="admin-management-icon">
                📄
              </div>

              <h3>
                Manage Applications
              </h3>

              <p>
                Review student applications and update
                their application status.
              </p>

              <Link
                to="/admin/applications"
                className="admin-management-button"
              >
                View Applications →
              </Link>

            </div>


            {/* PROFILES */}

            <div className="admin-management-card">

              <div className="admin-management-icon">
                👤
              </div>

              <h3>
                Student Profiles
              </h3>

              <p>
                View student education, skills,
                qualifications and career interests.
              </p>

              <Link
                to="/admin/profiles"
                className="admin-management-button"
              >
                View Profiles →
              </Link>

            </div>

          </div>


          {/* RECENT ACTIVITY */}

          <div className="admin-section">

            <div className="admin-section-header">

              <div>

                <span className="admin-section-label">
                  ACTIVITY
                </span>

                <h2>
                  Recent Activity
                </h2>

              </div>

            </div>


            <div className="admin-empty-card">

              <div className="admin-empty-icon">
                📊
              </div>

              <h3>
                No recent activity
              </h3>

              <p>
                Recent user registrations, job postings
                and applications will appear here.
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default AdminDashboard;