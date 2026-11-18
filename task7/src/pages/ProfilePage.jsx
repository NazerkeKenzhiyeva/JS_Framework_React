import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

export default function ProfilePage() {
  const { user, logout, error } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      // AuthContext displays the error.
    }
  }

  return (
    <section className="profile-page page-section">
      <div className="profile-card">
        <p className="eyebrow">PROTECTED ROUTE</p>
        <h1>YOUR PROFILE</h1>
        <dl className="profile-data">
          <div><dt>Email</dt><dd>{user?.email}</dd></div>
          <div><dt>Firebase UID</dt><dd>{user?.uid}</dd></div>
        </dl>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="button primary" type="button" onClick={handleLogout}>LOG OUT</button>
      </div>
    </section>
  );
}
