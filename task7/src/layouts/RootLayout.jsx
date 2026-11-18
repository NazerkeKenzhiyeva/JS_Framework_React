import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import ConnectivityIndicator from "../components/ConnectivityIndicator.jsx";
import InstallAppButton from "../components/InstallAppButton.jsx";
import PwaUpdatePrompt from "../components/PwaUpdatePrompt.jsx";

function navClass({ isActive }) {
  return isActive ? "active" : "";
}

export default function RootLayout() {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <NavLink className="logo" to="/" aria-label="streetALA home" onClick={closeMenu}>
          street<span>ALA</span>
        </NavLink>

        <button
          className="menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "CLOSE" : "MENU"}
        </button>

        <nav id="main-navigation" className={`main-nav ${menuOpen ? "menu-open" : ""}`} aria-label="Main navigation">
          <NavLink className={navClass} to="/sneakers" onClick={closeMenu}>SNEAKERS</NavLink>
          <NavLink className={navClass} to="/dashboard" onClick={closeMenu}>DASHBOARD</NavLink>
          <NavLink className={navClass} to="/about" onClick={closeMenu}>ABOUT</NavLink>
        </nav>

        <div className={`auth-nav ${menuOpen ? "menu-open" : ""}`}>
          <InstallAppButton />
          {!loading && !user && (
            <>
              <NavLink className="login-link" to="/login" onClick={closeMenu}>LOGIN</NavLink>
              <NavLink className="login-link" to="/signup" onClick={closeMenu}>SIGN UP</NavLink>
            </>
          )}
          {!loading && user && (
            <>
              <NavLink className="login-link" to="/profile" onClick={closeMenu}>PROFILE</NavLink>
              <button className="nav-button" type="button" onClick={logout}>LOG OUT</button>
            </>
          )}
        </div>
      </header>

      <ConnectivityIndicator />
      <PwaUpdatePrompt />

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
