import { Link } from "react-router-dom";
import "./FeaturedJobs.css";

const featuredJobs = [
  {
    id: 1,
    title: "Graduate Software Developer",
    company: "Microsoft",
    location: "Johannesburg, Gauteng",
    type: "Graduate Programme",
  },
  {
    id: 2,
    title: "Junior Software Engineer",
    company: "Amazon",
    location: "Cape Town, Western Cape",
    type: "Full Time",
  },
  {
    id: 3,
    title: "Data Analyst Graduate",
    company: "Standard Bank",
    location: "Johannesburg, Gauteng",
    type: "Graduate Programme",
  },
];

function FeaturedJobs() {
  return (
    <section className="featured-jobs">

      <div className="featured-jobs-container">

        {/* Section Header */}

        <div className="featured-jobs-header">

          <div>
            <span className="section-label">
              CAREER OPPORTUNITIES
            </span>

            <h2>
              Featured Jobs
            </h2>

            <p>
              Explore opportunities from leading companies
              looking for talented graduates and students.
            </p>
          </div>

          <Link
            to="/jobs"
            className="view-all-jobs"
          >
            View All Jobs →
          </Link>

        </div>

        {/* Job Cards */}

        <div className="featured-jobs-grid">

          {featuredJobs.map((job) => (

            <article
              className="featured-job-card"
              key={job.id}
            >

              <div className="featured-job-top">

                <div className="featured-company-logo">
                  {job.company.charAt(0)}
                </div>

                <span className="featured-job-type">
                  {job.type}
                </span>

              </div>

              <h3>
                {job.title}
              </h3>

              <h4>
                {job.company}
              </h4>

              <p className="featured-location">
                📍 {job.location}
              </p>

              <Link
                to={`/jobs/${job.id}`}
                className="featured-view-job"
              >
                View Job
              </Link>

            </article>

          ))}

        </div>

      </div>

    </section>
  );
}

export default FeaturedJobs;