import { Link } from "react-router-dom";

export default function LoginPage() {
  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <section className="login-page page-section">
      <div className="login-card">
        <p className="eyebrow">STUDIO ACCESS</p>
        <h1>LOGIN</h1>
        <p className="muted">Authentication will be added in a future version.</p>

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" placeholder="artist@streetala.kz" required />
          </label>
          <label>
            Password
            <input type="password" placeholder="••••••••" required />
          </label>
          <button className="button primary" type="submit">CONTINUE</button>
        </form>

        <Link className="text-link" to="/">← BACK HOME</Link>
      </div>
    </section>
  );
}
