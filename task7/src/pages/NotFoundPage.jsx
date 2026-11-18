import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="not-found page-section">
      <p className="huge-number">404</p>
      <p className="eyebrow">PAGE NOT FOUND</p>
      <h1>THIS PAIR LEFT<br />THE ARCHIVE.</h1>
      <Link className="button primary" to="/">BACK TO HOME</Link>
    </section>
  );
}
