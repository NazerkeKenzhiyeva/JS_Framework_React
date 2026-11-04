import { NavLink, Outlet } from "react-router-dom";

function navClass({ isActive }) {
  return isActive ? "active" : "";
}

export default function RootLayout() {
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

        <NavLink className="login-link" to="/login">LOGIN</NavLink>
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
