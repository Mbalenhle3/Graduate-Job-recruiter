import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROLE_HOME } from "../../data/mockData";
import AuthFrame from "./AuthFrame";

export default function SignInPage({ onSignIn }) {
  const [role,setRole]=useState("seeker");
  const navigate=useNavigate();
  function submit(event) { event.preventDefault(); onSignIn(role); navigate(ROLE_HOME[role]); }
  return <AuthFrame title="Welcome to GraduateLink SA" copy="Sign in before accessing opportunities or role tools."><form onSubmit={submit}><span></span><h2>Continue to your account</h2><p></p><label>Email address<input type="email" required placeholder="name@example.co.za"/></label><label>Password<input type="password" minLength="8" required placeholder="At least 8 characters"/></label><label>Account role<select value={role} onChange={(event) => setRole(event.target.value)}><option value="seeker">Job Seeker</option><option value="employer">Employer</option><option value="admin">Administrator</option></select></label><button className="button primary">Sign in</button><Link className="forgot-link" to="/forgot-password">Forgot password?</Link><small>Do not have an account? <Link to="/register">Create account</Link></small></form></AuthFrame>;
}
