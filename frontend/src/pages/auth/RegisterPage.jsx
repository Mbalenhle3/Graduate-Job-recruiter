import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Icon } from "../../components/common/AppUI";
import useAuth from "../../hooks/useAuth";
import { getApiError } from "../../services/api";
import AuthFrame from "./AuthFrame";


export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("job_seeker");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const user = await signUp({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        password,
        role,
      });

      if (user.role === "job_seeker") {
        navigate(
          "/job-seeker/profile",
          { replace: true }
        );
      } else {
        navigate(
          "/employer/profile",
          { replace: true }
        );
      }
    } catch (requestError) {
      setError(getApiError(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthFrame
      title="Create your GraduateLink account"
      copy={
        "Register as a Job Seeker or Employer. " +
        "Administrator accounts are created internally."
      }
    >
      <form onSubmit={submit}>
        <span>CREATE ACCOUNT</span>

        <h2>Start your profile</h2>

        <p>
          Enter your personal information. You will
          complete your career or organisation profile next.
        </p>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <label>
          Account type

          <select
            value={role}
            onChange={(event) =>
              setRole(event.target.value)
            }
          >
            <option value="job_seeker">
              Job Seeker
            </option>

            <option value="employer">
              Employer
            </option>
          </select>
        </label>

        <label>
          First name

          <input
            type="text"
            value={firstName}
            onChange={(event) =>
              setFirstName(event.target.value)
            }
            minLength="2"
            maxLength="100"
            required
            autoComplete="given-name"
            placeholder="Enter your first name"
          />
        </label>

        <label>
          Last name

          <input
            type="text"
            value={lastName}
            onChange={(event) =>
              setLastName(event.target.value)
            }
            minLength="2"
            maxLength="100"
            required
            autoComplete="family-name"
            placeholder="Enter your surname"
          />
        </label>

        <label>
          Email address

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
            autoComplete="email"
            placeholder="name@example.co.za"
          />
        </label>

        <label>
          Password

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            minLength="8"
            maxLength="128"
            required
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
        </label>

        <label>
          Confirm password

          <input
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            minLength="8"
            maxLength="128"
            required
            autoComplete="new-password"
            placeholder="Repeat your password"
          />
        </label>

        {role === "employer" && (
          <div className="auth-note">
            <Icon name="shield" />

            <span>
              After signup, complete your organisation
              profile. Your organisation must be verified
              before publishing opportunities.
            </span>
          </div>
        )}

        <button
          className="button primary"
          disabled={submitting}
        >
          {submitting
            ? "Creating account..."
            : "Create account"}
        </button>

        <small>
          Already registered?{" "}
          <Link to="/login">
            Sign in
          </Link>
        </small>
      </form>
    </AuthFrame>
  );
}