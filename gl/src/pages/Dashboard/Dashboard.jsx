import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(0);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(true);

  const PROFILE_API =
    "http://localhost/server/api/profile.php";

  const APPLICATION_API =
    "http://localhost/server/api/application.php";

  /*
  ============================================================
  LOAD LOGGED-IN USER
  ============================================================
  */

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      const userId =
        parsedUser.id ||
        parsedUser.user_id ||
        parsedUser.userId;

      if (!userId) {
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setUser({
        ...parsedUser,
        id: userId,
      });
    } catch (error) {
      console.error(
        "Unable to load user:",
        error
      );

      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  /*
  ============================================================
  LOAD PROFILE FROM PHP / MYSQL
  ============================================================
  */

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const loadProfile = async () => {
      try {
        setLoadingProfile(true);

        const response = await axios.get(
          PROFILE_API,
          {
            params: {
              user_id: user.id,
            },
          }
        );

        console.log(
          "Profile response:",
          response.data
        );

        if (response.data.success) {
          const backendUser =
            response.data.user;

          setUser(backendUser);

          localStorage.setItem(
            "user",
            JSON.stringify(backendUser)
          );

          const fields = [
            backendUser.phone,
            backendUser.location,
            backendUser.university,
            backendUser.qualification,
            backendUser.graduation_year,
            backendUser.bio,
            backendUser.skills,
            backendUser.career_interest,
          ];

          const completedFields =
            fields.filter(
              (field) =>
                field !== null &&
                field !== undefined &&
                String(field).trim() !== ""
            ).length;

          const completion = Math.round(
            (completedFields /
              fields.length) *
              100
          );

          setProfileCompletion(
            completion
          );
        } else {
          console.error(
            "Unable to load profile:",
            response.data.message
          );
        }
      } catch (error) {
        console.error(
          "Error loading profile:",
          error
        );
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [user?.id]);

  /*
  ============================================================
  LOAD APPLICATIONS FROM PHP / MYSQL
  ============================================================
  */

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const loadApplications = async () => {
      try {
        setLoadingApplications(true);

        const response = await axios.get(
          APPLICATION_API,
          {
            params: {
              user_id: user.id,
            },
          }
        );

        console.log(
          "Applications from PHP:",
          response.data
        );

        if (response.data.success) {
          setApplications(
            response.data.applications || []
          );
        } else {
          console.error(
            "Unable to load applications:",
            response.data.message
          );

          setApplications([]);
        }
      } catch (error) {
        console.error(
          "Error loading applications:",
          error
        );

        setApplications([]);
      } finally {
        setLoadingApplications(false);
      }
    };

    loadApplications();
  }, [user?.id]);

  /*
  ============================================================
  LOAD SAVED JOBS
  ============================================================
  */

  useEffect(() => {
    const loadSavedJobs = () => {
      try {
        const saved =
          localStorage.getItem(
            "graduateLinkSavedJobs"
          );

        setSavedJobs(
          saved
            ? JSON.parse(saved)
            : []
        );
      } catch (error) {
        console.error(
          "Unable to load saved jobs:",
          error
        );

        setSavedJobs([]);
      }
    };

    loadSavedJobs();

    window.addEventListener(
      "storage",
      loadSavedJobs
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadSavedJobs
      );
    };
  }, []);

  /*
  ============================================================
  LOGOUT
  ============================================================
  */

  const handleLogout = () => {
    localStorage.removeItem("user");

    navigate("/login");
  };

  /*
  ============================================================
  WAIT FOR USER
  ============================================================
  */

  if (!user) {
    return null;
  }

  /*
  ============================================================
  USER INITIALS
  ============================================================
  */

  const firstInitial =
    user.first_name
      ?.charAt(0)
      .toUpperCase() || "";

  const lastInitial =
    user.last_name
      ?.charAt(0)
      .toUpperCase() || "";

  const userInitials =
    `${firstInitial}${lastInitial}`;

  /*
  ============================================================
  DASHBOARD
  ============================================================
  */

  return (
    <main className="dashboard-page">

      {/* =====================================================
          DASHBOARD HEADER
      ===================================================== */}

      <section className="dashboard-header">

        <div className="dashboard-header-content">

          <span className="dashboard-label">
            STUDENT DASHBOARD
          </span>

          <h1>
            Welcome back,{" "}
            {user.first_name}! 👋
          </h1>

          <p>
            Manage your career journey,
            applications and professional
            profile from one place.
          </p>

          <div className="dashboard-header-actions">

            <Link
              to="/jobs"
              className="dashboard-primary-btn"
            >
              Find Jobs
            </Link>

            <button
              type="button"
              className="dashboard-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          DASHBOARD STATISTICS
      ===================================================== */}

      <section className="dashboard-stats-section">

        <div className="dashboard-container">

          <div className="dashboard-stats">

            {/* APPLICATIONS */}

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon">
                📄
              </div>

              <div className="dashboard-stat-content">

                <span>
                  Applications
                </span>

                <strong>
                  {loadingApplications
                    ? "..."
                    : applications.length}
                </strong>

              </div>

            </div>


            {/* SAVED JOBS */}

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon">
                ❤️
              </div>

              <div className="dashboard-stat-content">

                <span>
                  Saved Jobs
                </span>

                <strong>
                  {savedJobs.length}
                </strong>

              </div>

            </div>


            {/* INTERVIEWS */}

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon">
                🎤
              </div>

              <div className="dashboard-stat-content">

                <span>
                  Interviews
                </span>

                <strong>
                  0
                </strong>

              </div>

            </div>


            {/* PROFILE COMPLETION */}

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon">
                📊
              </div>

              <div className="dashboard-stat-content">

                <span>
                  Profile Completion
                </span>

                <strong>
                  {loadingProfile
                    ? "..."
                    : `${profileCompletion}%`}
                </strong>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          DASHBOARD CONTENT
      ===================================================== */}

      <section className="dashboard-content">

        <div className="dashboard-container">


          {/* =================================================
              PROFILE
          ================================================= */}

          <div className="dashboard-section">

            <div className="dashboard-section-header">

              <div>

                <span className="section-label">
                  PROFILE
                </span>

                <h2>
                  My Profile
                </h2>

              </div>

              <Link
                to="/profile"
                className="dashboard-secondary-btn"
              >
                Edit Profile
              </Link>

            </div>


            <div className="profile-card">

              <div className="profile-avatar">
                {userInitials}
              </div>


              <div className="profile-info">

                <h3>
                  {user.first_name}{" "}
                  {user.last_name}
                </h3>

                <p className="profile-email">
                  {user.email}
                </p>

                <p>
                  Add your education,
                  skills, projects and
                  career interests to
                  improve your job matches.
                </p>


                <div className="profile-progress">

                  <div className="profile-progress-header">

                    <span>
                      Profile Completion
                    </span>

                    <strong>
                      {loadingProfile
                        ? "..."
                        : `${profileCompletion}%`}
                    </strong>

                  </div>


                  <div className="progress-bar">

                    <div
                      className="progress-bar-fill"
                      style={{
                        width:
                          `${profileCompletion}%`,
                      }}
                    ></div>

                  </div>

                </div>


                <Link
                  to="/profile"
                  className="dashboard-primary-btn"
                >
                  {profileCompletion ===
                  100
                    ? "View My Profile"
                    : "Complete My Profile"}
                </Link>

              </div>

            </div>

          </div>


          {/* =================================================
              APPLICATIONS FROM MYSQL
          ================================================= */}

          <div className="dashboard-section">

            <div className="dashboard-section-header">

              <div>

                <span className="section-label">
                  APPLICATIONS
                </span>

                <h2>
                  Recent Applications
                </h2>

              </div>

              <Link
                to="/applications"
                className="dashboard-secondary-btn"
              >
                View All
              </Link>

            </div>


            {/* LOADING */}

            {loadingApplications ? (

              <div className="empty-dashboard-card">

                <div className="empty-dashboard-icon">
                  📄
                </div>

                <h3>
                  Loading applications...
                </h3>

                <p>
                  Please wait while we
                  load your applications.
                </p>

              </div>

            ) : applications.length ===
              0 ? (

              /* EMPTY */

              <div className="empty-dashboard-card">

                <div className="empty-dashboard-icon">
                  📋
                </div>

                <h3>
                  No applications yet
                </h3>

                <p>
                  Start applying for jobs
                  and your applications
                  will appear here.
                </p>

                <Link
                  to="/jobs"
                  className="dashboard-primary-btn"
                >
                  Browse Jobs
                </Link>

              </div>

            ) : (

              /* APPLICATION LIST */

              <div className="dashboard-job-list">

                {applications
                  .slice(0, 3)
                  .map(
                    (
                      application,
                      index
                    ) => {

                      const jobId =
                        application.job_id;

                      const jobTitle =
                        application.job_title ||
                        "Job Application";

                      const company =
                        application.company ||
                        "GraduateLink SA";

                      const location =
                        application.location ||
                        "South Africa";

                      const status =
                        application.status ||
                        "Submitted";

                      return (
                        <div
                          className="dashboard-job-item"
                          key={
                            application.id ||
                            index
                          }
                        >

                          {/* COMPANY LOGO */}

                          <div className="dashboard-job-logo">

                            {company
                              .charAt(0)
                              .toUpperCase()}

                          </div>


                          {/* JOB INFORMATION */}

                          <div className="dashboard-job-info">

                            <h3>
                              {jobTitle}
                            </h3>

                            <p>
                              {company}
                            </p>

                            <span>
                              📍 {location}
                            </span>

                          </div>


                          {/* STATUS */}

                          <div className="dashboard-application-status">

                            {status}

                          </div>


                          {/* VIEW JOB */}

                          {jobId && (
                            <Link
                              to={`/jobs/${jobId}`}
                              className="dashboard-view-btn"
                            >
                              View
                            </Link>
                          )}

                        </div>
                      );
                    }
                  )}

              </div>

            )}

          </div>


          {/* =================================================
              SAVED JOBS
          ================================================= */}

          <div className="dashboard-section">

            <div className="dashboard-section-header">

              <div>

                <span className="section-label">
                  SAVED
                </span>

                <h2>
                  Saved Jobs
                </h2>

              </div>

              <Link
                to="/jobs"
                className="dashboard-secondary-btn"
              >
                Browse Jobs
              </Link>

            </div>


            {savedJobs.length === 0 ? (

              <div className="empty-dashboard-card">

                <div className="empty-dashboard-icon">
                  ❤️
                </div>

                <h3>
                  No saved jobs
                </h3>

                <p>
                  Save interesting jobs
                  so you can easily come
                  back and apply later.
                </p>

                <Link
                  to="/jobs"
                  className="dashboard-primary-btn"
                >
                  Find Jobs
                </Link>

              </div>

            ) : (

              <div className="dashboard-job-list">

                {savedJobs
                  .slice(0, 3)
                  .map((job) => (

                    <div
                      className="dashboard-job-item"
                      key={job.id}
                    >

                      <div className="dashboard-job-logo">

                        {job.company
                          ? job.company
                              .charAt(0)
                              .toUpperCase()
                          : "G"}

                      </div>


                      <div className="dashboard-job-info">

                        <h3>
                          {job.title}
                        </h3>

                        <p>
                          {job.company}
                        </p>

                        {job.location && (
                          <span>
                            📍{" "}
                            {job.location}
                          </span>
                        )}

                      </div>


                      <Link
                        to={`/jobs/${job.id}`}
                        className="dashboard-view-btn"
                      >
                        View
                      </Link>

                    </div>

                  ))}

              </div>

            )}

          </div>


          {/* =================================================
              CAREER SUPPORT
          ================================================= */}

          <div className="dashboard-section">

            <div className="dashboard-section-header">

              <div>

                <span className="section-label">
                  CAREER SUPPORT
                </span>

                <h2>
                  Career Recommendations
                </h2>

              </div>

              <Link
                to="/career-services"
                className="dashboard-secondary-btn"
              >
                View Services
              </Link>

            </div>


            <div className="recommendations-grid">

              {/* CV */}

              <div className="recommendation-card">

                <div className="recommendation-icon">
                  📄
                </div>

                <h3>
                  Complete your CV
                </h3>

                <p>
                  Create a professional
                  CV to improve your
                  chances of getting
                  noticed by employers.
                </p>

                <Link
                  to="/career-services"
                >
                  Learn More →
                </Link>

              </div>


              {/* INTERVIEWS */}

              <div className="recommendation-card">

                <div className="recommendation-icon">
                  🎤
                </div>

                <h3>
                  Prepare for interviews
                </h3>

                <p>
                  Practise common
                  graduate interview
                  questions and improve
                  your confidence.
                </p>

                <Link
                  to="/career-services"
                >
                  Learn More →
                </Link>

              </div>


              {/* SKILLS */}

              <div className="recommendation-card">

                <div className="recommendation-icon">
                  💻
                </div>

                <h3>
                  Develop your skills
                </h3>

                <p>
                  Explore practical
                  courses designed to
                  improve your
                  employability.
                </p>

                <Link
                  to="/career-services"
                >
                  Learn More →
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Dashboard;