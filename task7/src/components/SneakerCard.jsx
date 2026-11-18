import { Link } from "react-router-dom";

export default function SneakerCard({ sneaker }) {
  return (
    <article className="sneaker-card">
      <Link className="card-image" to={`/sneakers/${sneaker.id}`}>
        <img src={sneaker.image || "/images/graffiti-high.jpg"} alt={sneaker.name} />
      </Link>

      <div className="card-body">
        <div className="card-topline">
          <span className={`status-pill ${sneaker.status === "Available" ? "available" : "sold-out"}`}>
            {sneaker.status}
          </span>
          <strong>${sneaker.price}</strong>
        </div>
        <h2>{sneaker.name}</h2>
        <p>{sneaker.silhouette}</p>
        <Link className="text-link" to={`/sneakers/${sneaker.id}`}>VIEW PAIR →</Link>
      </div>
    </article>
  );
}
