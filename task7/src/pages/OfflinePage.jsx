import { Link } from "react-router-dom";
import useOnlineStatus from "../hooks/useOnlineStatus.js";

export default function OfflinePage() {
  const online = useOnlineStatus();

  return (
    <section className="offline-page page-section">
      <div className="offline-card">
        <p className="eyebrow">CONNECTION STATUS · {online ? "ONLINE" : "OFFLINE"}</p>
        <h1>{online ? "BACK ONLINE." : "NO SIGNAL."}</h1>
        <p>{online ? "Your connection is available again. Return to the cached catalog or continue browsing." : "Previously visited pages and public sneaker data remain available from cache."}</p>
        <div className="hero-actions">
          <button className="button primary" type="button" onClick={() => window.location.reload()}>RETRY CONNECTION</button>
          <Link className="button secondary" to="/sneakers">OPEN CACHED CATALOG</Link>
        </div>
      </div>
    </section>
  );
}
