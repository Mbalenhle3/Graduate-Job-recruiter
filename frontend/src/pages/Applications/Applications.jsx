import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Applications.css";

function Applications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const API_URL =
    "http://localhost/server/api/application.php";

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    setLoading(true);
    setErrorMessage("");

    try {
      // Get logged-in user
      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        navigate("/login");
        return;
      }

      let user;

      try {
        user = JSON.parse(savedUser);
      } catch (error) {
        console.error(
          "Unable to read user information:",
          error
        );

        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      // Get user ID
      const userId =
        user.id ||
        user.user_id ||
        user.userId;

      if (!userId) {
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      console.log(
        "Loading applications for user:",
        userId
      );

      // Get applications from PHP / MySQL
      const response = await axios.get(API_URL, {
        params: {
          user_id: userId,
        },
      });

      console.log(
        "Applications response:",
        response.data
      );

      if (response.data.success) {
        setApplications(
          response.data.applications || []
        );
      } else {
        setErrorMessage(
          response.data.message ||
            "Unable to load applications."
        );

        setApplications([]);
      }

    } catch (error) {
      console.error(
        "Error loading applications:",
        error
      );

      if (error.response) {
        setErrorMessage(
          error.response.data?.message ||
            "Unable to load applications."
        );
      } else {
        setErrorMessage(
          "Unable to connect to the server. Make sure XAMPP Apache and MySQL are running."
        );
      }

      setApplications([]);

    } finally {
      setLoading(false);
    }
  }

  function getStatusClass(status) {
    const value = status
      ? status.toLowerCase()
      : "submitted";

    if (value === "submitted") {
      return "status-submitted";
    }

    if (
      value === "under review" ||
      value === "review"
    ) {
      return "status-review";
    }

    if (value === "shortlisted") {
      return "status-shortlisted";
    }

    if (value === "rejected") {
      return "status-rejected";
    }

    return "status-submitted";
  }

  function formatDate(date) {
    if (!date) {
      return "Recently";
    }

    try {
      const formattedDate =
        new Date(date).toLocaleDateString(
          "en-ZA",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        );

      return formattedDate;
    } catch (error) {
      return "Recently";
    }
  }

  if (loading) {
    return (
      <main className="applications-page">

        <section className="applications-header">

          <div className="applications-header-container">

            <span className="applications-label">
              MY APPLICATIONS
            </span>

            <h1>
              Track Your Applications
            </h1>

            <p>
              Keep track of your job applications,
              application status and career progress
              in one place.
            </p>

          </div>

        </section>

        <section className="applications-content">

          <div className="applications-container">

            <div className="applications-empty">

              <div className="applications-empty-icon">
                📋
              </div>

              <h2>
                Loading applications...
              </h2>

              <p>
                Please wait while we load your
                applications.
              </p>

            </div>

          </div>

        </section>

      </main>
    );
  }

  return (
    <main className="applications-page">

      {/* HEADER */}

      <section className="applications-header">

        <div className="applications-header-container">

          <span className="applications-label">
            MY APPLICATIONS
          </span>

          <h1>
            Track Your Applications
          </h1>

          <p>
            Keep track of your job applications,
            application status and career progress
            in one place.
          </p>

        </div>

      </section>


      {/* CONTENT */}

      <section className="applications-content">

        <div className="applications-container">

          {/* TOP BAR */}

          <div className="applications-topbar">

            <div>

              <h2>
                Application History
              </h2>

              <p>
                {applications.length}{" "}
                {applications.length === 1
                  ? "application"
                  : "applications"}{" "}
                submitted
              </p>

            </div>

            <Link
              to="/jobs"
              className="applications-primary-button"
            >
              Find More Jobs
            </Link>

          </div>


          {/* ERROR MESSAGE */}

          {errorMessage && (
            <div
              style={{
                marginBottom: "24px",
                padding: "15px 18px",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "10px",
                color: "#b91c1c",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              {errorMessage}
            </div>
          )}


          {/* EMPTY STATE */}

          {!errorMessage &&
          applications.length === 0 ? (

            <div className="applications-empty">

              <div className="applications-empty-icon">
                📋
              </div>

              <h2>
                No applications yet
              </h2>

              <p>
                You haven't applied for any jobs yet.
                Start exploring opportunities and submit
                your first application.
              </p>

              <Link
                to="/jobs"
                className="applications-primary-button"
              >
                Browse Jobs
              </Link>

            </div>

          ) : applications.length > 0 ? (

            <div className="applications-list">

              {applications.map(
                (application, index) => {

                  const jobId =
                    application.job_id ||
                    application.jobId;

                  const jobTitle =
                    application.job_title ||
                    application.title ||
                    "Job Application";

                  const company =
                    application.company ||
                    "GraduateLink SA";

                  const location =
                    application.location ||
                    "South Africa";

                  const jobType =
                    application.job_type ||
                    application.type ||
                    "Graduate Opportunity";

                  const status =
                    application.status ||
                    "Submitted";

                  const applicationDate =
                    application.created_at ||
                    application.date;

                  return (
                    <article
                      className="application-item"
                      key={
                        application.id ||
                        `${jobId}-${index}`
                      }
                    >

                      {/* COMPANY LOGO */}

                      <div className="application-logo">
                        {company.charAt(0)}
                      </div>


                      {/* INFORMATION */}

                      <div className="application-info">

                        <div className="application-title-row">

                          <div>

                            <h3>
                              {jobTitle}
                            </h3>

                            <h4>
                              {company}
                            </h4>

                          </div>

                          <span
                            className={`application-status ${getStatusClass(
                              status
                            )}`}
                          >
                            {status}
                          </span>

                        </div>


                        {/* APPLICATION DETAILS */}

                        <div className="application-meta">

                          <span>
                            📍 {location}
                          </span>

                          <span>
                            📅{" "}
                            {formatDate(
                              applicationDate
                            )}
                          </span>

                          <span>
                            💼 {jobType}
                          </span>

                        </div>


                        {/* ACTIONS */}

                        <div className="application-actions">

                          {jobId ? (
                            <Link
                              to={`/jobs/${jobId}`}
                              className="application-view-button"
                            >
                              View Job
                            </Link>
                          ) : (
                            <Link
                              to="/jobs"
                              className="application-view-button"
                            >
                              Find Similar Jobs
                            </Link>
                          )}

                        </div>

                      </div>

                    </article>
                  );
                }
              )}

            </div>

          ) : null}

        </div>

      </section>

    </main>
  );
}

export default Applications;