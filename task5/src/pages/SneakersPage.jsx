import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SneakerCard from "../components/SneakerCard.jsx";
import SneakerForm from "../components/SneakerForm.jsx";
import useSneakerList from "../hooks/useSneakerList.js";
import { createItem } from "../services/service.js";

function getErrorMessage(error) {
  return error instanceof Error ? error.message : "Something went wrong";
}

export default function SneakersPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  // Filter values come from the URL, so Back and Forward keep them.
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const model = searchParams.get("model") || "";
  const sort = searchParams.get("sort") || "name";
  const page = searchParams.get("page") || "1";
  const queryString = new URLSearchParams({ search, status, model, sort, page, limit: "4" }).toString();
  const {
    items,
    models,
    page: currentPage,
    total,
    totalPages,
    status: requestStatus,
    error: requestError,
    reload,
  } = useSneakerList(`?${queryString}`);

  function updateParam(name, value) {
    // Copy the current URL parameters before changing one value.
    const next = new URLSearchParams(searchParams);
    if (value) next.set(name, value);
    else next.delete(name);
    // A new filter should always start from the first page.
    if (name !== "page") next.set("page", "1");
    setSearchParams(next);
  }

  function clearFilters() {
    setSearchParams({ sort: "name", page: "1" });
  }

  async function addSneaker(values) {
    if (busy) return;
    setBusy(true);
    setNotice("");
    try {
      // The service creates the item and returns it with a new ID.
      const created = await createItem({ ...values, price: Number(values.price) });
      setShowForm(false);
      navigate(`/sneakers/${created.id}`);
    } catch (error) {
      setNotice(`Could not add pair: ${getErrorMessage(error)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="catalog-page page-section">
      <div className="page-heading split-heading">
        <div>
          <p className="eyebrow">CUSTOM COLLECTION</p>
          <h1>OUR <em>PAIRS.</em></h1>
        </div>
        <button className="button primary" type="button" onClick={() => setShowForm(true)}>
          + ADD PAIR
        </button>
      </div>

      <div className="filter-panel">
        <label className="search-field">
          Search
          <input
            type="search"
            value={search}
            placeholder="Name, artist or description"
            onChange={(event) => updateParam("search", event.target.value)}
          />
        </label>

        <label>
          Availability
          <select value={status} onChange={(event) => updateParam("status", event.target.value)}>
            <option value="">All statuses</option>
            <option value="Available">Available</option>
            <option value="Sold out">Sold out</option>
          </select>
        </label>

        <label>
          Base model
          <select value={model} onChange={(event) => updateParam("model", event.target.value)}>
            <option value="">All models</option>
            {models.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </label>

        <label>
          Sort by
          <select value={sort} onChange={(event) => updateParam("sort", event.target.value)}>
            <option value="name">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
            <option value="price">Price low to high</option>
            <option value="price-desc">Price high to low</option>
          </select>
        </label>

        <button className="clear-button" type="button" onClick={clearFilters}>CLEAR</button>
      </div>

      {notice && <p className="notice" role="status">{notice}</p>}

      <div className="results-line">
        <p>{total} {total === 1 ? "PAIR" : "PAIRS"}</p>
        <button
          className="text-button"
          type="button"
          disabled={requestStatus === "loading"}
          onClick={reload}
        >
          ↻ RELOAD
        </button>
      </div>

      {requestStatus === "loading" && <div className="state-card">LOADING THE ARCHIVE...</div>}

      {requestStatus === "error" && (
        <div className="state-card error-state">
          <p>{requestError}</p>
          <button className="button secondary" type="button" onClick={reload}>
            TRY AGAIN
          </button>
        </div>
      )}

      {requestStatus === "success" && items.length === 0 && (
        <div className="state-card">
          <p>NO PAIRS MATCH THESE FILTERS.</p>
          <button className="button secondary" type="button" onClick={clearFilters}>CLEAR FILTERS</button>
        </div>
      )}

      {requestStatus === "success" && items.length > 0 && (
        <div className="sneaker-grid">
          {items.map((item) => <SneakerCard key={item.id} sneaker={item} />)}
        </div>
      )}

      {requestStatus === "success" && totalPages > 1 && (
        <nav className="pagination" aria-label="Catalog pages">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => updateParam("page", String(currentPage - 1))}
          >
            ← PREVIOUS
          </button>
          <span>PAGE {currentPage} / {totalPages}</span>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => updateParam("page", String(currentPage + 1))}
          >
            NEXT →
          </button>
        </nav>
      )}

      {showForm && (
        <SneakerForm
          sneaker={null}
          busy={busy}
          onCancel={() => setShowForm(false)}
          onSave={addSneaker}
        />
      )}
    </section>
  );
}
