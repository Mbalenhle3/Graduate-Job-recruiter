import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../components/common/AppUI";
import AuthFrame from "./AuthFrame";

export default function ForgotPasswordPage() {
  const [sent,setSent]=useState(false);
  return <AuthFrame title="Reset your password" copy="Recover access to your GraduateLink account."><form onSubmit={(event) => {event.preventDefault();setSent(true)}}><span></span><h2>Forgot password?</h2>{sent?<div className="success"><Icon name="check"/>Reset instructions were sent to your email.</div>:<><p>Enter the email connected to your account.</p><label>Email address<input type="email" required placeholder="name@example.co.za"/></label><button className="button primary">Send reset link</button></>}<small><Link to="/login">Return to sign in</Link></small></form></AuthFrame>;
}
