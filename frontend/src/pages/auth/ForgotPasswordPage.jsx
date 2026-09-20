import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../components/common/AppUI";
import { getApiError } from "../../services/api";
import { requestPasswordReset } from "../../services/authService";
import AuthFrame from "./AuthFrame";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (requestError) {
      setError(getApiError(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthFrame title="Reset your password" copy="Recover access to your GraduateLink account.">
      <form onSubmit={submit}>
        <h2>Forgot password?</h2>
        {sent ? (
          <div className="success"><Icon name="check" />If that account exists, reset instructions have been sent to its email.</div>
        ) : (
          <>
            <p>Enter the email connected to your account.</p>
            {error && <div className="form-error">{error}</div>}
            <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" placeholder="name@example.co.za" /></label>
            <button className="button primary" disabled={submitting}>{submitting ? "Sending..." : "Send reset link"}</button>
          </>
        )}
        <small><Link to="/">Return to account selection</Link></small>
      </form>
    </AuthFrame>
  );
}
