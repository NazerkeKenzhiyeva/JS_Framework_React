import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

export default function SignupPage() {
  const { user, signup, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [validation, setValidation] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/profile" replace />;

  function changeField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setValidation("");
    clearError();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (form.password.length < 6) {
      setValidation("Password must contain at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setValidation("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      await signup(form.email, form.password);
      navigate("/profile", { replace: true });
    } catch {
      // AuthContext already provides the error message.
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="login-page page-section">
      <div className="login-card">
        <p className="eyebrow">NEW STUDIO ACCOUNT</p>
        <h1>SIGN UP</h1>
        <p className="muted">Create an account to open your private profile.</p>
        <form onSubmit={handleSubmit}>
          <label>Email<input name="email" type="email" value={form.email} onChange={changeField} required /></label>
          <label>Password<input name="password" type="password" value={form.password} onChange={changeField} minLength="6" required /></label>
          <label>Confirm password<input name="confirmPassword" type="password" value={form.confirmPassword} onChange={changeField} minLength="6" required /></label>
          {(validation || error) && <p className="auth-error" role="alert">{validation || error}</p>}
          <button className="button primary" type="submit" disabled={busy}>{busy ? "CREATING..." : "CREATE ACCOUNT"}</button>
        </form>
        <Link className="text-link" to="/login">ALREADY HAVE AN ACCOUNT?</Link>
      </div>
    </section>
  );
}
