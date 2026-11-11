import { NavLink, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

function navClass({ isActive }) {
  return isActive ? "active" : "";
}

export default function RootLayout() {
  const { user, loading, logout } = useAuth();

  return (
    <div className="site-shell">
      <header className="site-header">
        <NavLink className="logo" to="/" aria-label="streetALA home">
          street<span>ALA</span>
        </NavLink>

        <nav className="main-nav" aria-label="Main navigation">
          <NavLink className={navClass} to="/sneakers">SNEAKERS</NavLink>
          <NavLink className={navClass} to="/dashboard">DASHBOARD</NavLink>
          <NavLink className={navClass} to="/about">ABOUT</NavLink>
        </nav>

        <div className="auth-nav">
          {!loading && !user && (
            <>
              <NavLink className="login-link" to="/login">LOGIN</NavLink>
              <NavLink className="login-link" to="/signup">SIGN UP</NavLink>
            </>
          )}
          {!loading && user && (
            <>
              <NavLink className="login-link" to="/profile">PROFILE</NavLink>
              <button className="nav-button" type="button" onClick={logout}>LOG OUT</button>
            </>
          )}
        </div>
      </header>

      <main className="page-content">
        {/* React Router renders the current child page here. */}
        <Outlet />
      </main>

      <footer className="site-footer">
        <span>streetALA © 2026</span>
        <span>CUSTOM SNEAKERS · ALMATY</span>
      </footer>
    </div>
  );
}
