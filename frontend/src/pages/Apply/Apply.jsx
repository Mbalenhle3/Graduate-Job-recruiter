import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./Apply.css";

const jobs = {
  1: {
    title: "Graduate Software Developer",
    company: "Microsoft",
    location: "Johannesburg, Gauteng",
    type: "Graduate Programme",
  },

  2: {
    title: "Junior Software Engineer",
    company: "Amazon",
    location: "Cape Town, Western Cape",
    type: "Full Time",
  },

  3: {
    title: "Data Analyst Graduate",
    company: "Standard Bank",
    location: "Johannesburg, Gauteng",
    type: "Graduate Programme",
  },

  4: {
    title: "IT Graduate",
    company: "Nedbank",
    location: "Sandton, Gauteng",
    type: "Graduate Programme",
  },

  5: {
    title: "Software Development Intern",
    company: "IBM",
    location: "Johannesburg, Gauteng",
    type: "Internship",
  },

  6: {
    title: "Technology Graduate",
    company: "MTN",
    location: "Roodepoort, Gauteng",
    type: "Graduate Programme",
  },
};

function Apply() {
  const { id } = useParams();

  const job = jobs[id];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    education: "",
    coverLetter: "",
  });

  const [cv, setCv] = useState(null);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleCvChange(event) {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      setCv(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(selectedFile.type)) {
      setErrorMessage(
        "Please upload your CV as a PDF, DOC or DOCX file."
      );

      event.target.value = "";
      setCv(null);

      return;
    }

    if (selectedFile.size > maxSize) {
      setErrorMessage(
        "Your CV must be smaller than 5MB."
      );

      event.target.value = "";
      setCv(null);

      return;
    }

    setErrorMessage("");
    setCv(selectedFile);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setErrorMessage("");

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setErrorMessage(
        "You must be logged in before submitting an application."
      );

      return;
    }

    let user;

    try {
      user = JSON.parse(storedUser);
    } catch (error) {
      console.error(
        "Unable to read logged-in user:",
        error
      );

      setErrorMessage(
        "Your login information is invalid. Please log in again."
      );

      return;
    }

    const userId =
      user.id ||
      user.user_id ||
      user.userId;

    if (!userId) {
      setErrorMessage(
        "Your user ID could not be found. Please log in again."
      );

      return;
    }

    if (!job) {
      setErrorMessage(
        "The selected job could not be found."
      );

      return;
    }

    if (!cv) {
      setErrorMessage(
        "Please upload your CV before submitting your application."
      );

      return;
    }

    setLoading(true);

    const applicationData = new FormData();

    applicationData.append(
      "user_id",
      Number(userId)
    );

    applicationData.append(
      "job_id",
      Number(id)
    );

    applicationData.append(
      "job_title",
      job.title
    );

    applicationData.append(
      "company",
      job.company
    );

    applicationData.append(
      "location",
      job.location
    );

    applicationData.append(
      "job_type",
      job.type
    );

    applicationData.append(
      "first_name",
      formData.firstName
    );

    applicationData.append(
      "last_name",
      formData.lastName
    );

    applicationData.append(
      "email",
      formData.email
    );

    applicationData.append(
      "phone",
      formData.phone
    );

    applicationData.append(
      "education",
      formData.education
    );

    applicationData.append(
      "cover_letter",
      formData.coverLetter
    );

    applicationData.append(
      "cv",
      cv
    );

    console.log(
      "Sending application with CV:",
      cv.name
    );

    try {
      const response = await axios.post(
        "http://localhost/server/api/application.php",
        applicationData
      );

      console.log(
        "Application PHP response:",
        response.data
      );

      if (response.data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(
          response.data.message ||
            "Application could not be submitted."
        );
      }
    } catch (error) {
      console.error(
        "Application submission error:",
        error
      );

      if (error.response) {
        console.error(
          "PHP error response:",
          error.response.data
        );

        setErrorMessage(
          error.response.data?.message ||
            "The server rejected the application."
        );
      } else {
        setErrorMessage(
          "Unable to connect to the PHP server. Make sure Apache and MySQL are running in XAMPP."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  if (!job) {
    return (
      <main className="apply-page">

        <div className="apply-container">

          <div className="apply-not-found">

            <h1>
              Job Not Found
            </h1>

            <p>
              We could not find the job you are trying to
              apply for.
            </p>

            <Link
              to="/jobs"
              className="apply-primary-button"
            >
              Back to Jobs
            </Link>

          </div>

        </div>

      </main>
    );
  }

  if (submitted) {
    return (
      <main className="apply-page">

        <div className="apply-container">

          <div className="application-success">

            <div className="success-icon">
              ✓
            </div>

            <span className="apply-label">
              APPLICATION SUBMITTED
            </span>

            <h1>
              Application submitted successfully!
            </h1>

            <p>
              Your application for{" "}
              <strong>{job.title}</strong> at{" "}
              <strong>{job.company}</strong> has been
              submitted successfully.
            </p>

            <div className="success-actions">

              <Link
                to="/dashboard"
                className="apply-primary-button"
              >
                Go to Dashboard
              </Link>

              <Link
                to="/jobs"
                className="apply-secondary-button"
              >
                Find More Jobs
              </Link>

            </div>

          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="apply-page">

      <div className="apply-container">

        <Link
          to={`/jobs/${id}`}
          className="apply-back-link"
        >
          ← Back to Job Details
        </Link>

        <section className="apply-header">

          <span className="apply-label">
            JOB APPLICATION
          </span>

          <h1>
            Apply for this opportunity
          </h1>

          <p>
            Complete the form below to submit your
            application.
          </p>

        </section>

        <section className="application-job-card">

          <div className="application-company-logo">
            {job.company.charAt(0)}
          </div>

          <div className="application-job-info">

            <span>
              {job.type}
            </span>

            <h2>
              {job.title}
            </h2>

            <h3>
              {job.company}
            </h3>

            <p>
              📍 {job.location}
            </p>

          </div>

        </section>

        <form
          className="application-form"
          onSubmit={handleSubmit}
        >

          {/* =========================
              01 PERSONAL INFORMATION
          ========================= */}

          <section className="application-section">

            <div className="application-section-heading">

              <span className="section-number">
                01
              </span>

              <div>

                <h2>
                  Personal Information
                </h2>

                <p>
                  Tell the employer a little about yourself.
                </p>

              </div>

            </div>

            <div className="application-form-grid">

              <div className="application-field">

                <label htmlFor="firstName">
                  First Name
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="application-field">

                <label htmlFor="lastName">
                  Last Name
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="application-field">

                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="application-field">

                <label htmlFor="phone">
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="e.g. 066 123 4567"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

          </section>


          {/* =========================
              02 EDUCATION
          ========================= */}

          <section className="application-section">

            <div className="application-section-heading">

              <span className="section-number">
                02
              </span>

              <div>

                <h2>
                  Education
                </h2>

                <p>
                  Provide your most recent qualification.
                </p>

              </div>

            </div>

            <div className="application-field">

              <label htmlFor="education">
                Qualification / Field of Study
              </label>

              <input
                id="education"
                name="education"
                type="text"
                placeholder="e.g. BSc Computer Science"
                value={formData.education}
                onChange={handleChange}
                required
              />

            </div>

          </section>


          {/* =========================
              03 CV
          ========================= */}

          <section className="application-section">

            <div className="application-section-heading">

              <span className="section-number">
                03
              </span>

              <div>

                <h2>
                  CV / Resume
                </h2>

                <p>
                  Upload your CV for this application.
                </p>

              </div>

            </div>

            <div className="application-field">

              <label htmlFor="cv">
                Upload CV
              </label>

              <input
                id="cv"
                name="cv"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleCvChange}
                required
              />

              <span className="field-hint">
                PDF, DOC or DOCX files only. Maximum file
                size: 5MB.
              </span>

              {cv && (
                <div className="selected-cv">
                  ✓ {cv.name}
                </div>
              )}

            </div>

          </section>


          {/* =========================
              04 COVER LETTER
          ========================= */}

          <section className="application-section">

            <div className="application-section-heading">

              <span className="section-number">
                04
              </span>

              <div>

                <h2>
                  Cover Letter
                </h2>

                <p>
                  Explain why you are a good fit for this
                  opportunity.
                </p>

              </div>

            </div>

            <div className="application-field">

              <label htmlFor="coverLetter">
                Why should we consider you?
              </label>

              <textarea
                id="coverLetter"
                name="coverLetter"
                rows="8"
                placeholder="Write a short cover letter explaining your skills, experience and interest in this position..."
                value={formData.coverLetter}
                onChange={handleChange}
                required
              />

              <span className="field-hint">
                Keep your cover letter clear and relevant
                to the position.
              </span>

            </div>

          </section>


          {/* ERROR */}

          {errorMessage && (
            <div className="application-error">
              {errorMessage}
            </div>
          )}


          {/* SUBMIT */}

          <section className="application-submit">

            <div>

              <h3>
                Ready to apply?
              </h3>

              <p>
                Review your information before submitting
                your application.
              </p>

            </div>

            <button
              type="submit"
              className="application-submit-button"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit Application"}
            </button>

          </section>

        </form>

      </div>

    </main>
  );
}

export default Apply;
