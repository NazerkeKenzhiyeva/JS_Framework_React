import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">CUSTOM SNEAKERS / ALMATY</p>
          <h1>YOUR PAIR.<br /><em>YOUR STORY.</em></h1>
          <p className="hero-text">
            Familiar silhouettes customized with care. Every streetALA pair is
            painted by hand and made only once.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/sneakers">VIEW COLLECTION</Link>
            <Link className="button secondary" to="/about">OUR STUDIO</Link>
          </div>
        </div>

        <div className="hero-collage" aria-label="streetALA studio photographs">
          <img className="hero-main-image" src="/images/custom-wall.jpg" alt="Collection of hand-painted sneakers" />
          <img className="hero-small-image" src="/images/studio-process.jpg" alt="Artist painting custom sneakers" />
        </div>
      </section>

      <section className="home-links">
        <div>
          <p className="eyebrow">EXPLORE STREETALA</p>
          <h2>FROM BLANK PAIR<br />TO ONE OF ONE.</h2>
        </div>
        <div className="home-link-list">
          <Link to="/sneakers"><span>01</span> Browse custom pairs <b>→</b></Link>
          <Link to="/dashboard"><span>02</span> View studio statistics <b>→</b></Link>
          <Link to="/about"><span>03</span> Learn about the process <b>→</b></Link>
        </div>
      </section>
    </>
  );
}
