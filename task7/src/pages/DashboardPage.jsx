import { useState } from "react";
import { Link } from "react-router-dom";
import useSneakerList from "../hooks/useSneakerList.js";

function countBy(items, field) {
  // Build an object like { Available: 5, "Sold out": 3 }.
  return items.reduce((counts, item) => {
    const name = item[field] || "Not set";
    counts[name] = (counts[name] || 0) + 1;
    return counts;
  }, {});
}

export default function DashboardPage() {
  const [filter, setFilter] = useState("All");
  const { items, status: requestStatus, error: requestError, reload } =
    useSneakerList("?limit=100&sort=name");

  // All statistics below are calculated from API data, not hardcoded.
  const visibleItems = filter === "All"
    ? items
    : items.filter((item) => item.status === filter);
  const available = visibleItems.filter((item) => item.status === "Available").length;
  const soldOut = visibleItems.filter((item) => item.status === "Sold out").length;
  const averagePrice = visibleItems.length
    ? Math.round(visibleItems.reduce((sum, item) => sum + Number(item.price), 0) / visibleItems.length)
    : 0;
  const highest = visibleItems.reduce(
    (current, item) => !current || Number(item.price) > Number(current.price) ? item : current,
    null,
  );
  const statusBreakdown = Object.entries(countBy(visibleItems, "status"));
  const modelBreakdown = Object.entries(countBy(visibleItems, "silhouette"));

  return (
    <section className="dashboard-page page-section">
      <div className="page-heading split-heading">
        <div>
          <p className="eyebrow">STUDIO OVERVIEW</p>
          <h1>ARCHIVE <em>DATA.</em></h1>
        </div>
        <label className="dashboard-filter">
          Statistics filter
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option>All</option>
            <option>Available</option>
            <option>Sold out</option>
          </select>
        </label>
      </div>

      {requestStatus === "loading" && <div className="state-card">CALCULATING STUDIO DATA...</div>}

      {requestStatus === "error" && (
        <div className="state-card error-state">
          <p>{requestError}</p>
          <button className="button secondary" type="button" onClick={reload}>
            TRY AGAIN
          </button>
        </div>
      )}

      {requestStatus === "success" && (
        <>
          <div className="stats-grid">
            <article><span>Total pairs</span><strong>{visibleItems.length}</strong></article>
            <article><span>Available</span><strong>{available}</strong></article>
            <article><span>Sold out</span><strong>{soldOut}</strong></article>
            <article><span>Average price</span><strong>${averagePrice}</strong></article>
            <article className="wide-stat">
              <span>Highest priced pair</span>
              <strong>{highest ? `$${highest.price}` : "—"}</strong>
              {highest && <Link to={`/sneakers/${highest.id}`}>{highest.name} →</Link>}
            </article>
          </div>

          <div className="breakdown-grid">
            <article className="breakdown-card">
              <div className="breakdown-heading">
                <p className="eyebrow">BREAKDOWN 01</p>
                <h2>BY STATUS</h2>
              </div>
              {statusBreakdown.length === 0 && <p>No data for this filter.</p>}
              {statusBreakdown.map(([name, count]) => (
                <div className="breakdown-row" key={name}>
                  <span>{name}</span><strong>{count}</strong>
                </div>
              ))}
            </article>

            <article className="breakdown-card">
              <div className="breakdown-heading">
                <p className="eyebrow">BREAKDOWN 02</p>
                <h2>BY BASE MODEL</h2>
              </div>
              {modelBreakdown.length === 0 && <p>No data for this filter.</p>}
              {modelBreakdown.map(([name, count]) => (
                <div className="breakdown-row" key={name}>
                  <span>{name}</span><strong>{count}</strong>
                </div>
              ))}
            </article>
          </div>

          <div className="dashboard-links">
            <Link className="button primary" to="/sneakers">OPEN COLLECTION</Link>
            <Link className="text-link" to="/about">ABOUT THE STUDIO →</Link>
          </div>
        </>
      )}
    </section>
  );
}
