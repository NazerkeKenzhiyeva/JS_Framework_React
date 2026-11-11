import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <section className="about-page page-section">
      <div className="page-heading">
        <p className="eyebrow">ABOUT THE PROJECT</p>
        <h1>SMALL STUDIO.<br /><em>LOUD PAIRS.</em></h1>
      </div>

      <div className="about-grid">
        <img src="/images/studio-process.jpg" alt="streetALA customization process" />
        <div className="about-copy">
          <h2>Made by hand in Almaty</h2>
          <p>
            streetALA is a fictional custom sneaker studio created as a React
            routing project. The archive brings together one-of-one concepts
            based on familiar everyday silhouettes.
          </p>
          <p>
            Each pair is cleaned, prepared, painted and sealed by hand. Small
            variations are part of the process, so no two finished pairs are identical.
          </p>
          <ol className="process-list">
            <li><span>01</span> Prepare the base pair</li>
            <li><span>02</span> Sketch and paint the artwork</li>
            <li><span>03</span> Seal, photograph and archive</li>
          </ol>
          <Link className="button primary" to="/sneakers">SEE THE ARCHIVE</Link>
        </div>
      </div>
    </section>
  );
}
