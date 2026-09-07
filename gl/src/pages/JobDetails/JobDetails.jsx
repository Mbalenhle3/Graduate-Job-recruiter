import { Link, useParams } from "react-router-dom";
import "./JobDetails.css";

const jobsData = [
  {
    id: 1,
    title: "Graduate Software Developer",
    company: "Microsoft",
    location: "Johannesburg, Gauteng",
    type: "Graduate Programme",
    category: "Software Development",
    description:
      "Join our graduate software development programme and work with experienced developers on real-world technology projects.",
    requirements: [
      "Degree or diploma in Computer Science, Information Technology or related field",
      "Basic knowledge of software development",
      "Understanding of programming concepts",
      "Good problem-solving skills",
      "Strong communication and teamwork skills",
    ],
  },
  {
    id: 2,
    title: "Junior Software Engineer",
    company: "Amazon",
    location: "Cape Town, Western Cape",
    type: "Full Time",
    category: "Software Development",
    description:
      "Work with a talented engineering team to develop scalable software solutions and contribute to technology projects.",
    requirements: [
      "Degree in Computer Science or related field",
      "Knowledge of programming",
      "Strong analytical and problem-solving skills",
      "Ability to work in a team",
      "Good communication skills",
    ],
  },
  {
    id: 3,
    title: "Data Analyst Graduate",
    company: "Standard Bank",
    location: "Johannesburg, Gauteng",
    type: "Graduate Programme",
    category: "Data & Analytics",
    description:
      "Join our graduate data analytics team and help transform data into meaningful insights that support business decisions.",
    requirements: [
      "Degree in Computer Science, Mathematics, Statistics or related field",
      "Knowledge of data analysis",
      "Basic SQL or programming knowledge",
      "Analytical thinking",
      "Strong attention to detail",
    ],
  },
  {
    id: 4,
    title: "IT Graduate",
    company: "Nedbank",
    location: "Sandton, Gauteng",
    type: "Graduate Programme",
    category: "Information Technology",
    description:
      "Develop your IT career while working with experienced technology professionals on projects across the organisation.",
    requirements: [
      "Degree or diploma in Information Technology or related field",
      "Basic understanding of IT systems",
      "Good problem-solving skills",
      "Strong communication skills",
      "Ability to learn quickly",
    ],
  },
  {
    id: 5,
    title: "Software Development Intern",
    company: "IBM",
    location: "Johannesburg, Gauteng",
    type: "Internship",
    category: "Software Development",
    description:
      "Gain practical software development experience while working with professional developers on technology projects.",
    requirements: [
      "Currently studying Computer Science or related qualification",
      "Programming knowledge",
      "Interest in software development",
      "Problem-solving skills",
      "Ability to work collaboratively",
    ],
  },
  {
    id: 6,
    title: "Technology Graduate",
    company: "MTN",
    location: "Roodepoort, Gauteng",
    type: "Graduate Programme",
    category: "Information Technology",
    description:
      "Start your technology career with an exciting graduate programme focused on innovation, digital solutions and telecommunications.",
    requirements: [
      "Degree in Computer Science, IT or related field",
      "Interest in technology",
      "Good analytical skills",
      "Strong communication skills",
      "Ability to work as part of a team",
    ],
  },
];

function JobDetails() {
  const { id } = useParams();

  const job = jobsData.find(
    (item) => item.id === Number(id)
  );

  if (!job) {
    return (
      <main className="job-details-page">
        <div className="job-details-container">
          <div className="job-not-found">
            <div className="job-not-found-icon">🔍</div>

            <h1>Job Not Found</h1>

            <p>
              Sorry, we couldn't find the job you are
              looking for.
            </p>

            <Link
              to="/jobs"
              className="back-to-jobs-button"
            >
              ← Back to Jobs
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="job-details-page">

      {/* BACK TO JOBS */}

      <div className="job-details-container">

        <Link
          to="/jobs"
          className="back-to-jobs"
        >
          ← Back to Jobs
        </Link>


        {/* JOB HEADER */}

        <section className="job-details-header">

          <div className="company-logo-large">
            {job.company.charAt(0)}
          </div>

          <div className="job-header-info">

            <span className="job-details-type">
              {job.type}
            </span>

            <h1>{job.title}</h1>

            <h2>{job.company}</h2>

            <div className="job-meta">

              <span>
                📍 {job.location}
              </span>

              <span>
                💼 {job.category}
              </span>

            </div>

          </div>

        </section>


        {/* MAIN CONTENT */}

        <div className="job-details-layout">

          {/* LEFT */}

          <div className="job-details-main">

            <section className="job-details-card">

              <h2>About the Opportunity</h2>

              <p>
                {job.description}
              </p>

            </section>


            <section className="job-details-card">

              <h2>Requirements</h2>

              <ul className="requirements-list">

                {job.requirements.map(
                  (requirement, index) => (
                    <li key={index}>
                      <span>✓</span>
                      {requirement}
                    </li>
                  )
                )}

              </ul>

            </section>


            <section className="job-details-card">

              <h2>What You Will Do</h2>

              <p>
                Work alongside experienced
                professionals, contribute to real-world
                projects and develop practical skills
                that will help you build a successful
                career.
              </p>

              <p>
                This opportunity is designed to give
                graduates and young professionals
                meaningful workplace experience.
              </p>

            </section>

          </div>


          {/* RIGHT */}

          <aside className="job-details-sidebar">

            <div className="apply-card">

              <h2>Interested in this opportunity?</h2>

              <p>
                Start your application today and take
                the next step in your career.
              </p>

              <Link
                to={`/apply/${job.id}`}
                className="apply-button"
              >
                Apply Now
              </Link>

              <button
                type="button"
                className="save-job-button"
                onClick={() => {
                  const saved =
                    JSON.parse(
                      localStorage.getItem(
                        "graduateLinkSavedJobs"
                      )
                    ) || [];

                  const alreadySaved =
                    saved.some(
                      (savedJob) =>
                        savedJob.id === job.id
                    );

                  if (!alreadySaved) {
                    localStorage.setItem(
                      "graduateLinkSavedJobs",
                      JSON.stringify([
                        ...saved,
                        job,
                      ])
                    );

                    alert("Job saved successfully!");
                  } else {
                    alert("This job is already saved.");
                  }
                }}
              >
                ♡ Save Job
              </button>

            </div>


            <div className="job-summary-card">

              <h2>Job Summary</h2>

              <div className="summary-item">
                <span>Company</span>
                <strong>{job.company}</strong>
              </div>

              <div className="summary-item">
                <span>Location</span>
                <strong>{job.location}</strong>
              </div>

              <div className="summary-item">
                <span>Job Type</span>
                <strong>{job.type}</strong>
              </div>

              <div className="summary-item">
                <span>Category</span>
                <strong>{job.category}</strong>
              </div>

            </div>

          </aside>

        </div>

      </div>

    </main>
  );
}

export default JobDetails;