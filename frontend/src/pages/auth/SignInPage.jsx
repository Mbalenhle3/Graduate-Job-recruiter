import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ROLE_HOME } from "../../data/mockData";
import { getApiError } from "../../services/api";
import AuthFrame from "./AuthFrame";

export default function SignInPage() {
  const { signIn } = useAuth();
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
      navigate(ROLE_HOME[user.role] || "/login", { replace: true });
    } catch (requestError) {
      setError(getApiError(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthFrame title="Welcome to GraduateLink SA" copy="Sign in before accessing opportunities or role tools.">
      <form onSubmit={submit}>
        <span>SECURE SIGN IN</span>
        <h2>Continue to your account</h2>
        <p>Your account role is detected automatically.</p>
        {error && <div className="form-error">{error}</div>}
        <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" placeholder="name@example.co.za" /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" placeholder="Enter your password" /></label>
        <button className="button primary" disabled={submitting}>{submitting ? "Signing in..." : "Sign in"}</button>
        <Link className="forgot-link" to="/forgot-password">Forgot password?</Link>
        <small>Do not have an account? <Link to="/register">Create account</Link></small>
      </form>
    </AuthFrame>
  );
}
