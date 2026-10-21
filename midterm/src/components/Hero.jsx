export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="section-number">ISSUE 001 / PERSONAL ARCHIVE</p>
        <h1>Stories don’t end<br />at the credits.</h1>
        <p>A private index of films, series and the images that refuse to leave your head.</p>
        <a href="#collection">Open the index <span>↓</span></a>
      </div>
      <div className="hero-visual">
        <div className="hero-red-card" aria-hidden="true" />
        <img className="audience-photo" src="images/aftercredits/audience.jpg" alt="Cinema audience wearing 3D glasses" />
        <img className="ticket-photo" src="images/aftercredits/ticket.jpg" alt="Vintage cinema ticket" />
        <span className="image-caption">THE LIGHTS GO DOWN / THE MEMORY STAYS</span>
      </div>
      <div className="hero-meta"><span>ALMATY / 2026</span><span>FILMS + SERIES</span><span>POWERED BY TMDB</span></div>
    </section>
  );
}
