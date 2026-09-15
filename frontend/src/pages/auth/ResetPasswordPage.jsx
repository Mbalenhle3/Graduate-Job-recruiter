import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Icon } from "../../components/common/AppUI";
import { getApiError } from "../../services/api";
import { resetPassword } from "../../services/authService";
import AuthFrame from "./AuthFrame";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link does not contain a token.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await resetPassword(token, password);
      setComplete(true);
    } catch (requestError) {
      setError(getApiError(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthFrame title="Choose a new password" copy="Use a strong password that you do not use elsewhere.">
      <form onSubmit={submit}>
        <span>NEW PASSWORD</span>
        <h2>Reset your password</h2>
        {complete ? (
          <>
            <div className="success"><Icon name="check" />Your password was updated successfully.</div>
            <Link className="button primary" to="/login">Continue to sign in</Link>
          </>
        ) : (
          <>
            {!token && <div className="form-error">The reset link is missing or incomplete. Request a new link.</div>}
            {error && <div className="form-error">{error}</div>}
            <label>New password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength="8" maxLength="128" required autoComplete="new-password" placeholder="At least 8 characters" /></label>
            <label>Confirm new password<input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength="8" maxLength="128" required autoComplete="new-password" placeholder="Repeat your password" /></label>
            <button className="button primary" disabled={submitting || !token}>{submitting ? "Updating..." : "Update password"}</button>
            <small><Link to="/forgot-password">Request another reset link</Link></small>
          </>
        )}
      </form>
    </AuthFrame>
  );
}
