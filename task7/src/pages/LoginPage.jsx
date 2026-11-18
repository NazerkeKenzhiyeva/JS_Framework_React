import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

export default function LoginPage() {
  const { user, login, googleLogin, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const destination = location.state?.from || "/profile";

  if (user) return <Navigate to="/profile" replace />;

  function changeField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    clearError();
  }

  async function runLogin(action) {
    setBusy(true);
    try {
      await action();
      navigate(destination, { replace: true });
    } catch {
      // AuthContext already stores a readable error message.
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    runLogin(() => login(form.email, form.password));
  }

  return (
    <section className="login-page page-section">
      <div className="login-card">
        <p className="eyebrow">STUDIO ACCESS</p>
        <h1>LOGIN</h1>
        <p className="muted">Sign in to open your private profile.</p>
        <form onSubmit={handleSubmit}>
          <label>Email<input name="email" type="email" value={form.email} onChange={changeField} required /></label>
          <label>Password<input name="password" type="password" value={form.password} onChange={changeField} required /></label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="button primary" type="submit" disabled={busy}>{busy ? "SIGNING IN..." : "CONTINUE"}</button>
          <button className="button secondary" type="button" disabled={busy} onClick={() => runLogin(googleLogin)}>CONTINUE WITH GOOGLE</button>
        </form>
        <Link className="text-link" to="/signup">CREATE AN ACCOUNT</Link>
      </div>
    </section>
  );
}
