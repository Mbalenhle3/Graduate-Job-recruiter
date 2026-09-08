import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check all fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please complete all fields.");
      return;
    }

    // Check password length
    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    // Check passwords
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Send registration data to PHP backend
      const response = await axios.post(
        "http://localhost/server/api/register.php",
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
        }
      );

      console.log("Registration response:", response.data);

      if (response.data.success) {
        alert("Account created successfully!");

        // Go to login after successful registration
        navigate("/login");
      } else {
        alert(response.data.message || "Registration failed.");
      }

    } catch (error) {
      console.error("Registration error:", error);

      if (error.response) {
        alert(
          error.response.data?.message ||
          "Registration failed. Please try again."
        );
      } else {
        alert(
          "Unable to connect to the server. Make sure XAMPP Apache is running."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">

      <div className="register-container">

        <div className="register-card">

          {/* LOGO */}

          <Link
            to="/"
            className="register-logo"
          >
            GraduateLink<span>SA</span>
          </Link>

          {/* HEADING */}

          <div className="register-heading">

            <h1>
              Create Your Account
            </h1>

            <p>
              Join GraduateLink SA and start building your career.
            </p>

          </div>

          {/* FORM */}

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >

            {/* FIRST AND LAST NAME */}

            <div className="register-row">

              <div className="register-form-group">

                <label htmlFor="firstName">
                  First Name
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                />

              </div>

              <div className="register-form-group">

                <label htmlFor="lastName">
                  Last Name
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* EMAIL */}

            <div className="register-form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
              />

            </div>

            {/* PASSWORD */}

            <div className="register-form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />

              <small>
                Use at least 8 characters.
              </small>

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="register-form-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

            </div>

            {/* TERMS */}

            <div className="register-terms">

              <input
                id="terms"
                type="checkbox"
                required
              />

              <label htmlFor="terms">
                I agree to the GraduateLink SA Terms &
                Conditions and Privacy Policy.
              </label>

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          {/* LOGIN */}

          <div className="register-login">

            <p>
              Already have an account?
            </p>

            <Link to="/login">
              Login
            </Link>

          </div>

          {/* HOME */}

          <Link
            to="/"
            className="register-back-home"
          >
            ← Back to GraduateLink SA
          </Link>

        </div>

      </div>

    </main>
  );
}

export default Register;