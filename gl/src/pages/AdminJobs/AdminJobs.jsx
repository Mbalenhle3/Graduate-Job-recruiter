import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./AdminJobs.css";

function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await axios.get(
        "http://localhost/server/api/jobs.php"
      );

      console.log("Admin jobs response:", response.data);

      if (response.data.success) {
        setJobs(response.data.jobs || []);
      } else {
        setErrorMessage(
          response.data.message || "Unable to load jobs."
        );
      }
    } catch (error) {
      console.error("Error loading jobs:", error);

      if (error.response) {
        setErrorMessage(
          error.response.data?.message ||
            "Unable to load jobs."
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
    <main className="admin-jobs-page">

      {/* HEADER */}
      <section className="admin-jobs-header">

        <div className="admin-jobs-header-container">

          <Link
            to="/admin"
            className="admin-jobs-back-link"
          >
            ← Back to Admin Dashboard
          </Link>

          <span className="admin-jobs-label">
            ADMINISTRATION
          </span>

          <h1>
            Manage Jobs
          </h1>

          <p>
            Add, edit and manage GraduateLink SA
            internship, graduate and employment
            opportunities.
          </p>

        </div>

      </section>


      {/* JOBS CONTENT */}
      <section className="admin-jobs-content">

        <div className="admin-jobs-container">

          {/* TOP BAR */}
          <div className="admin-jobs-topbar">

            <div>
              <h2>
                Job Opportunities
              </h2>

              <p>
                {loading
                  ? "Loading jobs..."
                  : `${jobs.length} job${
                      jobs.length === 1 ? "" : "s"
                    } available`}
              </p>
            </div>

            <Link
              to="/admin/jobs/add"
              className="admin-jobs-add-button"
            >
              + Add New Job
            </Link>

          </div>


          {/* ERROR MESSAGE */}
          {errorMessage && (
            <div className="admin-jobs-error">
              {errorMessage}
            </div>
          )}


          {/* LOADING */}
          {loading ? (

            <div className="admin-jobs-empty">

              <div className="admin-jobs-empty-icon">
                ⏳
              </div>

              <h3>
                Loading jobs...
              </h3>

              <p>
                Please wait while we load the jobs
                from the database.
              </p>

            </div>

          ) : jobs.length === 0 ? (

            /* NO JOBS */
            <div className="admin-jobs-empty">

              <div className="admin-jobs-empty-icon">
                💼
              </div>

              <h3>
                No jobs found
              </h3>

              <p>
                There are currently no job opportunities
                in the database.
              </p>

              <Link
                to="/admin/jobs/add"
                className="admin-jobs-add-button"
              >
                + Add Your First Job
              </Link>

            </div>

          ) : (

            /* JOB LIST */
            <div className="admin-jobs-list">

              {jobs.map((job) => (

                <div
                  className="admin-job-card"
                  key={job.id}
                >

                  {/* COMPANY LOGO */}
                  <div className="admin-job-logo">
                    {job.company
                      ? job.company.charAt(0).toUpperCase()
                      : "J"}
                  </div>


                  {/* JOB INFORMATION */}
                  <div className="admin-job-info">

                    <div className="admin-job-title-row">

                      <div>

                        <h3>
                          {job.title}
                        </h3>

                        <h4>
                          {job.company}
                        </h4>

                      </div>

                      <span className="admin-job-type">
                        {job.type}
                      </span>

                    </div>


                    {/* JOB META */}
                    <div className="admin-job-meta">

                      <span>
                        📍 {job.location}
                      </span>

                      <span>
                        💰{" "}
                        {job.salary ||
                          "Salary not specified"}
                      </span>

                      <span>
                        📅 Deadline:{" "}
                        {job.deadline ||
                          "Not specified"}
                      </span>

                    </div>


                    {/* DESCRIPTION */}
                    <p className="admin-job-description">
                      {job.description}
                    </p>


                    {/* ACTIONS */}
                    <div className="admin-job-actions">

                      <button
                        type="button"
                        className="admin-job-edit-button"
                        onClick={() =>
                          alert(
                            `Edit job: ${job.title}`
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="admin-job-delete-button"
                        onClick={() =>
                          alert(
                            `Delete job: ${job.title}`
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </section>

    </main>
  );
}

export default AdminJobs;