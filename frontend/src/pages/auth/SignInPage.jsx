import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ROLE_HOME } from "../../data/mockData";
import { getApiError } from "../../services/api";
import AuthFrame from "./AuthFrame";

const roleNames = { job_seeker: "Job Seeker", employer: "Employer", admin: "Administrator" };

export default function SignInPage({ expectedRole }) {
  const { signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const user = await signIn({ email, password });
      if (expectedRole && user.role !== expectedRole) {
        signOut();
        setError(`This is the ${roleNames[expectedRole]} sign-in page. Please use the correct account area.`);
        return;
      }
      navigate(ROLE_HOME[user.role] || "/", { replace: true });
    } catch (requestError) {
      setError(getApiError(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthFrame title={`${roleNames[expectedRole] || "Account"} sign in`} copy="Sign in to access the tools for your selected account area.">
      <form onSubmit={submit}>
        <h2>Continue to your account</h2>
        <p>Your account role is detected automatically.</p>
        {error && <div className="form-error">{error}</div>}
        <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" placeholder="name@example.co.za" /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" placeholder="Enter your password" /></label>
        <button className="button primary" disabled={submitting}>{submitting ? "Signing in..." : "Sign in"}</button>
        <Link className="forgot-link" to="/forgot-password">Forgot password?</Link>
        {expectedRole !== "admin" && <small>Do not have an account? <Link to={`/auth/${expectedRole === "employer" ? "employer" : "job-seeker"}/signup`}>Create account</Link></small>}
        <small><Link to="/">Go back to home page</Link></small>
      </form>
    </AuthFrame>
  );
}
