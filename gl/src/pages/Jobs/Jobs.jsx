import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Jobs.css";


/* =========================================================
   JOB DATA
========================================================= */

const jobsData = [
  {
    id: 1,
    title: "Graduate Software Developer",
    company: "Microsoft",
    location: "Johannesburg, Gauteng",
    type: "Graduate Programme",
    category: "Software Development",
  },
  {
    id: 2,
    title: "Junior Software Engineer",
    company: "Amazon",
    location: "Cape Town, Western Cape",
    type: "Full Time",
    category: "Software Development",
  },
  {
    id: 3,
    title: "Data Analyst Graduate",
    company: "Standard Bank",
    location: "Johannesburg, Gauteng",
    type: "Graduate Programme",
    category: "Data & Analytics",
  },
  {
    id: 4,
    title: "IT Graduate",
    company: "Nedbank",
    location: "Sandton, Gauteng",
    type: "Graduate Programme",
    category: "Information Technology",
  },
  {
    id: 5,
    title: "Software Development Intern",
    company: "IBM",
    location: "Johannesburg, Gauteng",
    type: "Internship",
    category: "Software Development",
  },
  {
    id: 6,
    title: "Technology Graduate",
    company: "MTN",
    location: "Roodepoort, Gauteng",
    type: "Graduate Programme",
    category: "Information Technology",
  },
];


/* =========================================================
   JOBS COMPONENT
========================================================= */

function Jobs() {

  const [search, setSearch] = useState("");

  const [location, setLocation] =
    useState("All Locations");

  const [jobType, setJobType] =
    useState("All Types");

  const [category, setCategory] =
    useState("All Categories");


  /* =======================================================
     SAVED JOBS
  ======================================================= */

  const [savedJobs, setSavedJobs] = useState(() => {

    try {

      const saved =
        localStorage.getItem("graduateLinkSavedJobs");

      return saved
        ? JSON.parse(saved)
        : [];

    } catch (error) {

      console.error(
        "Unable to load saved jobs:",
        error
      );

      return [];

    }

  });


  /* =======================================================
     SAVE / REMOVE JOB
  ======================================================= */

  function toggleSaveJob(job) {

    setSavedJobs((currentSavedJobs) => {

      const alreadySaved =
        currentSavedJobs.some(
          (savedJob) => savedJob.id === job.id
        );


      let updatedJobs;


      if (alreadySaved) {

        updatedJobs =
          currentSavedJobs.filter(
            (savedJob) =>
              savedJob.id !== job.id
          );

      } else {

        updatedJobs = [
          ...currentSavedJobs,
          job,
        ];

      }


      localStorage.setItem(
        "graduateLinkSavedJobs",
        JSON.stringify(updatedJobs)
      );


      return updatedJobs;

    });

  }


  /* =======================================================
     CHECK IF JOB IS SAVED
  ======================================================= */

  function isJobSaved(jobId) {

    return savedJobs.some(
      (job) => job.id === jobId
    );

  }


  /* =======================================================
     FILTER JOBS
  ======================================================= */

  const filteredJobs = useMemo(() => {

    return jobsData.filter((job) => {

      const searchText =
        search.toLowerCase().trim();


      const matchesSearch =
        searchText === "" ||
        job.title
          .toLowerCase()
          .includes(searchText) ||
        job.company
          .toLowerCase()
          .includes(searchText) ||
        job.category
          .toLowerCase()
          .includes(searchText);


      const matchesLocation =
        location === "All Locations" ||
        job.location.includes(location);


      const matchesType =
        jobType === "All Types" ||
        job.type === jobType;


      const matchesCategory =
        category === "All Categories" ||
        job.category === category;


      return (
        matchesSearch &&
        matchesLocation &&
        matchesType &&
        matchesCategory
      );

    });

  }, [
    search,
    location,
    jobType,
    category,
  ]);


  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  function clearFilters() {

    setSearch("");

    setLocation("All Locations");

    setJobType("All Types");

    setCategory("All Categories");

  }


  /* =======================================================
     PAGE
  ======================================================= */

  return (

    <main className="jobs-page">


      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="jobs-header">

        <div className="jobs-header-content">

          <span className="jobs-label">
            GRADUATELINK SA
          </span>

          <h1>
            Find Your Next Opportunity
          </h1>

          <p>
            Discover internships, graduate programmes,
            entry-level jobs and career opportunities
            from leading employers.
          </p>

        </div>

      </section>


      {/* =================================================
          SEARCH
      ================================================= */}

      <section className="jobs-search-section">

        <div className="jobs-search-container">

          <div className="search-box">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search jobs, companies or skills..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>

        </div>

      </section>


      {/* =================================================
          JOB CONTENT
      ================================================= */}

      <section className="jobs-content">

        <div className="jobs-container">


          {/* =================================================
              FILTERS
          ================================================= */}

          <aside className="jobs-filters">

            <div className="filters-header">

              <h2>
                Filters
              </h2>

              <button
                type="button"
                className="clear-filters-btn"
                onClick={clearFilters}
              >
                Clear
              </button>

            </div>


            {/* LOCATION */}

            <div className="filter-group">

              <label htmlFor="location">
                Location
              </label>

              <select
                id="location"
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
              >

                <option>
                  All Locations
                </option>

                <option value="Johannesburg">
                  Johannesburg
                </option>

                <option value="Cape Town">
                  Cape Town
                </option>

                <option value="Sandton">
                  Sandton
                </option>

                <option value="Roodepoort">
                  Roodepoort
                </option>

              </select>

            </div>


            {/* JOB TYPE */}

            <div className="filter-group">

              <label htmlFor="jobType">
                Job Type
              </label>

              <select
                id="jobType"
                value={jobType}
                onChange={(event) =>
                  setJobType(event.target.value)
                }
              >

                <option>
                  All Types
                </option>

                <option>
                  Graduate Programme
                </option>

                <option>
                  Internship
                </option>

                <option>
                  Full Time
                </option>

              </select>

            </div>


            {/* CATEGORY */}

            <div className="filter-group">

              <label htmlFor="category">
                Category
              </label>

              <select
                id="category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
              >

                <option>
                  All Categories
                </option>

                <option>
                  Software Development
                </option>

                <option>
                  Data & Analytics
                </option>

                <option>
                  Information Technology
                </option>

              </select>

            </div>


            {/* SAVED JOBS SUMMARY */}

            <div className="saved-jobs-summary">

              <div className="saved-summary-icon">
                ❤️
              </div>

              <div>

                <strong>
                  {savedJobs.length}
                </strong>

                <span>
                  Saved Jobs
                </span>

              </div>

            </div>

          </aside>


          {/* =================================================
              JOB RESULTS
          ================================================= */}

          <div className="jobs-results">


            <div className="jobs-results-header">

              <div>

                <h2>
                  Available Jobs
                </h2>

                <p>

                  {filteredJobs.length}

                  {" "}

                  {filteredJobs.length === 1
                    ? "job"
                    : "jobs"}

                  {" "}
                  found

                </p>

              </div>


              {/* SAVED JOBS LINK */}

              <div className="saved-jobs-count">

                ❤️ {savedJobs.length} Saved

              </div>

            </div>


            {/* =================================================
                JOB LIST
            ================================================= */}

            {filteredJobs.length > 0 ? (

              <div className="jobs-list">

                {filteredJobs.map((job) => (

                  <article
                    className="job-card"
                    key={job.id}
                  >


                    {/* LOGO */}

                    <div className="job-card-logo">
                      {job.company.charAt(0)}
                    </div>


                    {/* CONTENT */}

                    <div className="job-card-content">

                      <div className="job-card-top">

                        <span className="job-card-type">
                          {job.type}
                        </span>

                      </div>


                      <h3>
                        {job.title}
                      </h3>


                      <h4>
                        {job.company}
                      </h4>


                      <p className="job-card-location">
                        📍 {job.location}
                      </p>


                      <span className="job-card-category">
                        {job.category}
                      </span>

                    </div>


                    {/* ACTIONS */}

                    <div className="job-card-action">


                      {/* SAVE BUTTON */}

                      <button
                        type="button"
                        className={`save-job-btn ${
                          isJobSaved(job.id)
                            ? "saved"
                            : ""
                        }`}
                        onClick={() =>
                          toggleSaveJob(job)
                        }
                        aria-label={
                          isJobSaved(job.id)
                            ? "Remove saved job"
                            : "Save job"
                        }
                      >

                        {isJobSaved(job.id)
                          ? "❤️ Saved"
                          : "♡ Save"}

                      </button>


                      {/* VIEW JOB */}

                      <Link
                        to={`/jobs/${job.id}`}
                        className="view-job-btn"
                      >
                        View Job
                      </Link>

                    </div>

                  </article>

                ))}

              </div>

            ) : (

              /* =================================================
                 NO JOBS
              ================================================= */

              <div className="no-jobs">

                <div className="no-jobs-icon">
                  🔍
                </div>

                <h3>
                  No Jobs Found
                </h3>

                <p>
                  We couldn't find any jobs matching
                  your current filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>

              </div>

            )}

          </div>

        </div>

      </section>

    </main>

  );

}


export default Jobs;