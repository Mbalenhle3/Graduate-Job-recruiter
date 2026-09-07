import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check fields
    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // Send login information to PHP backend
      const response = await axios.post(
        "http://localhost/server/api/login.php",
        {
          email: email,
          password: password,
        }
      );

      console.log("Login response:", response.data);

      // Login successful
      if (response.data.success) {
        alert("Login successful!");

        // Save logged-in user information
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        // Go to dashboard
        navigate("/dashboard");
      } else {
        alert(
          response.data.message ||
          "Invalid email or password."
        );
      }

    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        alert(
          error.response.data?.message ||
          "Login failed. Please try again."
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
    <main className="login-page">

      {/* =================================================
          LOGIN CARD
      ================================================= */}

      <div className="login-container">

        <div className="login-card">

          {/* LOGO */}

          <Link
            to="/"
            className="login-logo"
          >
            GraduateLink<span>SA</span>
          </Link>

          {/* TITLE */}

          <div className="login-heading">

            <h1>
              Welcome Back
            </h1>

            <p>
              Login to continue your career journey.
            </p>

          </div>

          {/* FORM */}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}

            <div className="login-form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>

            {/* PASSWORD */}

            <div className="login-form-group">

              <div className="password-label">

                <label htmlFor="password">
                  Password
                </label>

                <a href="#">
                  Forgot Password?
                </a>

              </div>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

            </div>

            {/* REMEMBER ME */}

            <div className="remember-me">

              <input
                id="remember"
                type="checkbox"
              />

              <label htmlFor="remember">
                Remember me
              </label>

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* REGISTER */}

          <div className="login-register">

            <p>
              Don't have an account?
            </p>

            <Link to="/register">
              Create an account
            </Link>

          </div>

          {/* BACK HOME */}

          <Link
            to="/"
            className="back-home"
          >
            ← Back to GraduateLink SA
          </Link>

        </div>

      </div>

    </main>
  );
}

export default Login;