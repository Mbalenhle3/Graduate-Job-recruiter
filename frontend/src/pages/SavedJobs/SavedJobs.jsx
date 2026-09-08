import { Link } from "react-router-dom";
import "./SavedJobs.css";

function SavedJobs() {
  const savedJobs = [
    {
      id: 1,
      company: "Microsoft",
      title: "Graduate Software Developer",
      location: "Johannesburg, Gauteng",
      type: "Graduate Programme",
      category: "Software Development",
      logo: "M",
    },
    {
      id: 2,
      company: "Amazon",
      title: "Junior Software Engineer",
      location: "Cape Town, Western Cape",
      type: "Full Time",
      category: "Software Engineering",
      logo: "A",
    },
    {
      id: 3,
      company: "Standard Bank",
      title: "Data Analyst Graduate",
      location: "Johannesburg, Gauteng",
      type: "Graduate Programme",
      category: "Data Analytics",
      logo: "S",
    },
  ];

  return (
    <main className="saved-jobs-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="saved-jobs-header">

        <div className="saved-jobs-header-content">

          <span className="saved-jobs-label">
            MY CAREER
          </span>

          <h1>
            Saved Jobs
          </h1>

          <p>
            Keep track of opportunities you are interested in
            and come back to them when you are ready to apply.
          </p>

        </div>

      </section>

      {/* =================================================
          CONTENT
      ================================================= */}

      <section className="saved-jobs-content">

        <div className="saved-jobs-container">

          {/* =================================================
              TOP BAR
          ================================================= */}

          <div className="saved-jobs-top">

            <div>
              <h2>
                Your Saved Jobs
              </h2>

              <p>
                {savedJobs.length} opportunities saved
              </p>
            </div>

            <Link
              to="/jobs"
              className="find-more-jobs-btn"
            >
              Find More Jobs
            </Link>

          </div>

          {/* =================================================
              SAVED JOBS
          ================================================= */}

          <div className="saved-jobs-list">

            {savedJobs.map((job) => (
              <article
                className="saved-job-card"
                key={job.id}
              >

                {/* Logo */}

                <div className="saved-job-logo">
                  {job.logo}
                </div>

                {/* Job Information */}

                <div className="saved-job-info">

                  <span className="saved-job-type">
                    {job.type}
                  </span>

                  <h3>
                    {job.title}
                  </h3>

                  <h4>
                    {job.company}
                  </h4>

                  <p>
                    📍 {job.location}
                  </p>

                  <span className="saved-job-category">
                    {job.category}
                  </span>

                </div>

                {/* Actions */}

                <div className="saved-job-actions">

                  <Link
                    to={`/jobs/${job.id}`}
                    className="saved-view-btn"
                  >
                    View Job
                  </Link>

                  <button
                    type="button"
                    className="remove-saved-btn"
                  >
                    Remove
                  </button>

                </div>

              </article>
            ))}

          </div>

        </div>

      </section>

    </main>
  );
}

export default SavedJobs;