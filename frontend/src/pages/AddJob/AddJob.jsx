import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddJob.css";

function AddJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    description: "",
    requirements: "",
    salary: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (
      !formData.title ||
      !formData.company ||
      !formData.location ||
      !formData.type ||
      !formData.description ||
      !formData.requirements
    ) {
      setErrorMessage(
        "Please complete all required fields."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost/server/api/jobs.php",
        formData
      );

      console.log("Add job response:", response.data);

      if (response.data.success) {
        setSuccessMessage(
          "Job added successfully."
        );

        setFormData({
          title: "",
          company: "",
          location: "",
          type: "",
          description: "",
          requirements: "",
          salary: "",
          deadline: "",
        });

        setTimeout(() => {
          navigate("/admin/jobs");
        }, 1000);
      } else {
        setErrorMessage(
          response.data.message ||
            "Unable to add job."
        );
      }
    } catch (error) {
      console.error("Error adding job:", error);

      if (error.response) {
        setErrorMessage(
          error.response.data?.message ||
            "Unable to add job."
        );
      } else {
        setErrorMessage(
          "Unable to connect to the PHP server. Make sure XAMPP Apache and MySQL are running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="add-job-page">

      {/* HEADER */}
      <section className="add-job-header">

        <div className="add-job-header-container">

          <Link
            to="/admin/jobs"
            className="add-job-back-link"
          >
            ← Back to Manage Jobs
          </Link>

          <span className="add-job-label">
            ADMINISTRATION
          </span>

          <h1>
            Add New Job
          </h1>

          <p>
            Create a new internship, graduate
            programme or employment opportunity
            for GraduateLink SA users.
          </p>

        </div>

      </section>


      {/* FORM */}
      <section className="add-job-content">

        <div className="add-job-container">

          <form
            className="add-job-form"
            onSubmit={handleSubmit}
          >

            {/* ERROR */}
            {errorMessage && (
              <div className="add-job-error">
                {errorMessage}
              </div>
            )}

            {/* SUCCESS */}
            {successMessage && (
              <div className="add-job-success">
                {successMessage}
              </div>
            )}


            {/* TITLE */}
            <div className="add-job-form-group">

              <label htmlFor="title">
                Job Title <span>*</span>
              </label>

              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Graduate Software Developer"
              />

            </div>


            {/* COMPANY */}
            <div className="add-job-form-group">

              <label htmlFor="company">
                Company <span>*</span>
              </label>

              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Microsoft"
              />

            </div>


            {/* LOCATION + TYPE */}
            <div className="add-job-form-row">

              <div className="add-job-form-group">

                <label htmlFor="location">
                  Location <span>*</span>
                </label>

                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Johannesburg, Gauteng"
                />

              </div>


              <div className="add-job-form-group">

                <label htmlFor="type">
                  Job Type <span>*</span>
                </label>

                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="">
                    Select job type
                  </option>

                  <option value="Internship">
                    Internship
                  </option>

                  <option value="Graduate Programme">
                    Graduate Programme
                  </option>

                  <option value="Full-Time">
                    Full-Time
                  </option>

                  <option value="Part-Time">
                    Part-Time
                  </option>

                  <option value="Contract">
                    Contract
                  </option>

                </select>

              </div>

            </div>


            {/* SALARY + DEADLINE */}
            <div className="add-job-form-row">

              <div className="add-job-form-group">

                <label htmlFor="salary">
                  Salary
                </label>

                <input
                  type="text"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. R20,000 - R30,000"
                />

              </div>


              <div className="add-job-form-group">

                <label htmlFor="deadline">
                  Application Deadline
                </label>

                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                />

              </div>

            </div>


            {/* DESCRIPTION */}
            <div className="add-job-form-group">

              <label htmlFor="description">
                Job Description <span>*</span>
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the job opportunity..."
              />

            </div>


            {/* REQUIREMENTS */}
            <div className="add-job-form-group">

              <label htmlFor="requirements">
                Requirements <span>*</span>
              </label>

              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="List the qualifications, skills and requirements..."
              />

            </div>


            {/* BUTTONS */}
            <div className="add-job-actions">

              <button
                type="button"
                className="add-job-cancel-button"
                onClick={() =>
                  navigate("/admin/jobs")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="add-job-submit-button"
                disabled={loading}
              >
                {loading
                  ? "Adding Job..."
                  : "Add Job"}
              </button>

            </div>

          </form>

        </div>

      </section>

    </main>
  );
}

export default AddJob;