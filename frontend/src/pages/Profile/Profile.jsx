import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [profileData, setProfileData] = useState({
    phone: "",
    location: "",
    university: "",
    qualification: "",
    graduationYear: "",
    bio: "",
    skills: "",
    careerInterest: "",
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // BACKEND URL
  // =========================================================

  const API_URL = "http://localhost/server/api/profile.php";


  // =========================================================
  // LOAD USER AND PROFILE FROM DATABASE
  // =========================================================

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      setUser(parsedUser);

      // Get profile from PHP/MySQL
      loadProfile(parsedUser.id);

    } catch (error) {
      console.error("Unable to load user:", error);

      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);


  // =========================================================
  // LOAD PROFILE
  // =========================================================

  const loadProfile = async (userId) => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}?user_id=${userId}`
      );

      console.log("Profile response:", response.data);

      if (response.data.success) {

        const databaseUser = response.data.user;

        setUser(databaseUser);

        setProfileData({
          phone: databaseUser.phone || "",
          location: databaseUser.location || "",
          university: databaseUser.university || "",
          qualification: databaseUser.qualification || "",
          graduationYear: databaseUser.graduation_year || "",
          bio: databaseUser.bio || "",
          skills: databaseUser.skills || "",
          careerInterest: databaseUser.career_interest || "",
        });

        // Keep updated user in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify(databaseUser)
        );

      } else {

        setError(
          response.data.message ||
          "Unable to load profile."
        );
      }

    } catch (error) {

      console.error("Profile loading error:", error);

      setError(
        "Unable to connect to the PHP backend."
      );

    } finally {

      setLoading(false);
    }
  };


  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfileData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setSaved(false);
    setError("");
  };


  // =========================================================
  // SAVE PROFILE TO DATABASE
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      setError("User information is missing.");
      return;
    }

    try {

      setSaving(true);
      setSaved(false);
      setError("");

      const dataToSend = {
        user_id: user.id,

        phone: profileData.phone,
        location: profileData.location,
        university: profileData.university,
        qualification: profileData.qualification,
        graduationYear: profileData.graduationYear,
        bio: profileData.bio,
        skills: profileData.skills,
        careerInterest: profileData.careerInterest,
      };


      console.log("Sending profile:", dataToSend);


      const response = await axios.post(
        API_URL,
        dataToSend
      );


      console.log("Save response:", response.data);


      if (response.data.success) {

        setSaved(true);

        // Update user with database response
        if (response.data.user) {

          setUser(response.data.user);

          localStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
          );
        }

        alert("Profile updated successfully!");

      } else {

        setError(
          response.data.message ||
          "Profile update failed."
        );
      }

    } catch (error) {

      console.error("Profile save error:", error);

      if (error.response) {

        console.error(
          "Server response:",
          error.response.data
        );

        setError(
          error.response.data.message ||
          "The server returned an error."
        );

      } else {

        setError(
          "Unable to connect to the PHP backend."
        );
      }

    } finally {

      setSaving(false);
    }
  };


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };


  // =========================================================
  // WAIT FOR PROFILE
  // =========================================================

  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-loading">
          Loading your profile...
        </div>
      </main>
    );
  }


  // =========================================================
  // USER NOT FOUND
  // =========================================================

  if (!user) {
    return null;
  }


  // =========================================================
  // USER INITIALS
  // =========================================================

  const firstInitial =
    user.first_name?.charAt(0).toUpperCase() || "";

  const lastInitial =
    user.last_name?.charAt(0).toUpperCase() || "";

  const initials = `${firstInitial}${lastInitial}`;


  // =========================================================
  // PROFILE COMPLETION
  // =========================================================

  const fields = [
    profileData.phone,
    profileData.location,
    profileData.university,
    profileData.qualification,
    profileData.graduationYear,
    profileData.bio,
    profileData.skills,
    profileData.careerInterest,
  ];

  const completedFields = fields.filter(
    (field) => field.trim() !== ""
  ).length;

  const profileCompletion = Math.round(
    (completedFields / fields.length) * 100
  );


  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="profile-page">

      {/* =====================================================
          PROFILE HEADER
      ===================================================== */}

      <section className="profile-header">

        <div className="profile-header-content">

          <div className="profile-header-left">

            <span className="profile-label">
              MY PROFILE
            </span>

            <h1>
              {user.first_name} {user.last_name}
            </h1>

            <p>
              Manage your personal information, education,
              skills and career interests.
            </p>

          </div>


          <div className="profile-header-actions">

            <Link
              to="/dashboard"
              className="profile-dashboard-btn"
            >
              ← Dashboard
            </Link>

            <button
              type="button"
              className="profile-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          PROFILE CONTENT
      ===================================================== */}

      <section className="profile-content">

        <div className="profile-container">


          {/* =================================================
              ERROR MESSAGE
          ================================================= */}

          {error && (
            <div className="profile-error">
              {error}
            </div>
          )}


          {/* =================================================
              PROFILE SUMMARY
          ================================================= */}

          <div className="profile-summary-card">

            <div className="profile-summary-avatar">
              {initials}
            </div>


            <div className="profile-summary-info">

              <h2>
                {user.first_name} {user.last_name}
              </h2>

              <p>
                {user.email}
              </p>

              <span className="profile-role">
                {user.role || "Student"}
              </span>

            </div>


            <div className="profile-completion">

              <span>
                Profile Completion
              </span>

              <strong>
                {profileCompletion}%
              </strong>

              <div className="profile-progress-bar">

                <div
                  className="profile-progress-fill"
                  style={{
                    width: `${profileCompletion}%`,
                  }}
                ></div>

              </div>

            </div>

          </div>


          {/* =================================================
              PROFILE FORM
          ================================================= */}

          <form
            className="profile-form"
            onSubmit={handleSubmit}
          >


            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <div className="profile-section">

              <div className="profile-section-heading">

                <span>
                  PERSONAL INFORMATION
                </span>

                <h2>
                  About You
                </h2>

                <p>
                  Add your contact information and a short
                  introduction about yourself.
                </p>

              </div>


              <div className="profile-form-grid">


                {/* FIRST NAME */}

                <div className="profile-form-group">

                  <label>
                    First Name
                  </label>

                  <input
                    type="text"
                    value={user.first_name || ""}
                    disabled
                  />

                  <small>
                    Your registered first name.
                  </small>

                </div>


                {/* LAST NAME */}

                <div className="profile-form-group">

                  <label>
                    Last Name
                  </label>

                  <input
                    type="text"
                    value={user.last_name || ""}
                    disabled
                  />

                  <small>
                    Your registered last name.
                  </small>

                </div>


                {/* EMAIL */}

                <div className="profile-form-group">

                  <label>
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={user.email || ""}
                    disabled
                  />

                  <small>
                    Your registered email address.
                  </small>

                </div>


                {/* PHONE */}

                <div className="profile-form-group">

                  <label htmlFor="phone">
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="e.g. 083 123 4567"
                    value={profileData.phone}
                    onChange={handleChange}
                  />

                </div>


                {/* LOCATION */}

                <div className="profile-form-group">

                  <label htmlFor="location">
                    Location
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g. Durban, KwaZulu-Natal"
                    value={profileData.location}
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* BIO */}

              <div className="profile-form-group">

                <label htmlFor="bio">
                  About Me
                </label>

                <textarea
                  id="bio"
                  name="bio"
                  rows="5"
                  placeholder="Tell employers a little about yourself..."
                  value={profileData.bio}
                  onChange={handleChange}
                ></textarea>

              </div>

            </div>


            {/* =================================================
                EDUCATION
            ================================================= */}

            <div className="profile-section">

              <div className="profile-section-heading">

                <span>
                  EDUCATION
                </span>

                <h2>
                  Education
                </h2>

                <p>
                  Add your university, qualification and
                  expected graduation year.
                </p>

              </div>


              <div className="profile-form-grid">


                {/* UNIVERSITY */}

                <div className="profile-form-group">

                  <label htmlFor="university">
                    University / Institution
                  </label>

                  <input
                    id="university"
                    name="university"
                    type="text"
                    placeholder="e.g. University of Zululand"
                    value={profileData.university}
                    onChange={handleChange}
                  />

                </div>


                {/* QUALIFICATION */}

                <div className="profile-form-group">

                  <label htmlFor="qualification">
                    Qualification
                  </label>

                  <input
                    id="qualification"
                    name="qualification"
                    type="text"
                    placeholder="e.g. BSc Computer Science"
                    value={profileData.qualification}
                    onChange={handleChange}
                  />

                </div>


                {/* GRADUATION YEAR */}

                <div className="profile-form-group">

                  <label htmlFor="graduationYear">
                    Graduation Year
                  </label>

                  <select
                    id="graduationYear"
                    name="graduationYear"
                    value={profileData.graduationYear}
                    onChange={handleChange}
                  >

                    <option value="">
                      Select year
                    </option>

                    <option value="2026">
                      2026
                    </option>

                    <option value="2027">
                      2027
                    </option>

                    <option value="2028">
                      2028
                    </option>

                    <option value="2029">
                      2029
                    </option>

                    <option value="2030">
                      2030
                    </option>

                  </select>

                </div>

              </div>

            </div>


            {/* =================================================
                SKILLS
            ================================================= */}

            <div className="profile-section">

              <div className="profile-section-heading">

                <span>
                  SKILLS
                </span>

                <h2>
                  Your Skills
                </h2>

                <p>
                  Add the technical and professional skills
                  you have developed.
                </p>

              </div>


              <div className="profile-form-group">

                <label htmlFor="skills">
                  Skills
                </label>

                <textarea
                  id="skills"
                  name="skills"
                  rows="4"
                  placeholder="e.g. HTML, CSS, JavaScript, React, Python, SQL"
                  value={profileData.skills}
                  onChange={handleChange}
                ></textarea>

                <small>
                  Separate your skills with commas.
                </small>

              </div>

            </div>


            {/* =================================================
                CAREER INTEREST
            ================================================= */}

            <div className="profile-section">

              <div className="profile-section-heading">

                <span>
                  CAREER
                </span>

                <h2>
                  Career Interests
                </h2>

                <p>
                  Tell us what type of opportunities you are
                  interested in.
                </p>

              </div>


              <div className="profile-form-group">

                <label htmlFor="careerInterest">
                  Career Interest
                </label>

                <select
                  id="careerInterest"
                  name="careerInterest"
                  value={profileData.careerInterest}
                  onChange={handleChange}
                >

                  <option value="">
                    Select your career interest
                  </option>

                  <option value="Software Development">
                    Software Development
                  </option>

                  <option value="Frontend Development">
                    Frontend Development
                  </option>

                  <option value="Backend Development">
                    Backend Development
                  </option>

                  <option value="Data Science">
                    Data Science
                  </option>

                  <option value="Artificial Intelligence">
                    Artificial Intelligence
                  </option>

                  <option value="Cybersecurity">
                    Cybersecurity
                  </option>

                  <option value="Database Administration">
                    Database Administration
                  </option>

                  <option value="IT Support">
                    IT Support
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

            </div>


            {/* =================================================
                SAVE
            ================================================= */}

            <div className="profile-save-area">

              {saved && (
                <span className="profile-saved-message">
                  ✓ Profile saved successfully
                </span>
              )}

              <button
                type="submit"
                className="profile-save-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>

            </div>

          </form>

        </div>

      </section>

    </main>
  );
}

export default Profile;