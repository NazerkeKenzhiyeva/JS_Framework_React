import { useEffect, useState } from "react";
import {
  createItem,
  deleteItem,
  getItem,
  getItemsList,
  updateItem,
} from "./api/fakeApi.js";
import SneakerForm from "./components/SneakerForm.jsx";

function errorMessage(error) {
  return error instanceof Error ? error.message : "Something went wrong";
}

function show(value) {
  return value || "Not set";
}

export default function App() {
  // Collection state
  const [items, setItems] = useState([]);
  const [listStatus, setListStatus] = useState("loading");
  const [listError, setListError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // Selected sneaker state
  const [selectedId, setSelectedId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailStatus, setDetailStatus] = useState("idle");
  const [detailError, setDetailError] = useState("");

  // Form and action state
  const [formMode, setFormMode] = useState(null);
  const [mutation, setMutation] = useState(null);
  const [notice, setNotice] = useState("");

  // Load the collection on mount and whenever Reload changes reloadKey.
  useEffect(() => {
    let active = true;

    async function loadItems() {
      setListStatus("loading");
      setListError("");
      try {
        const result = await getItemsList("?limit=100");
        if (!active) return;
        setItems(result.data);
        setListStatus("success");
      } catch (error) {
        if (!active) return;
        setListError(errorMessage(error));
        setListStatus("error");
      }
    }

    loadItems();
    return () => {
      // Ignore a response if this Effect has already been cleaned up.
      active = false;
    };
  }, [reloadKey]);

  // Load details every time the user selects another sneaker.
  useEffect(() => {
    let active = true;

    if (selectedId === null) {
      return () => {
        active = false;
      };
    }

    async function loadDetails() {
      try {
        const item = await getItem(selectedId);
        if (!active) return;
        setSelectedItem(item);
        setDetailStatus("success");
      } catch (error) {
        if (!active) return;
        setDetailError(errorMessage(error));
        setDetailStatus("error");
      }
    }

    loadDetails();
    return () => {
      // This prevents an older request from replacing newer details.
      active = false;
    };
  }, [selectedId, reloadKey]);

  function reload() {
    setNotice("");
    if (selectedId !== null) {
      setSelectedItem(null);
      setDetailStatus("loading");
      setDetailError("");
    }
    setReloadKey((value) => value + 1);
  }

  function selectItem(id) {
    setSelectedId(id);
    setSelectedItem(null);
    setDetailStatus("loading");
    setDetailError("");
  }

  async function saveItem(values) {
    if (mutation) return;
    const targetId = formMode === "edit" ? selectedItem.id : null;
    const normalized = { ...values, price: Number(values.price) };
    setMutation(targetId || "create");
    setNotice("");

    try {
      if (targetId) {
        const updated = await updateItem(targetId, normalized);
        setSelectedItem(updated);
        setNotice("Custom pair updated.");
      } else {
        const created = await createItem({
          name: normalized.name,
          description: normalized.description,
        });
        await updateItem(created.id, normalized);
        setSelectedId(created.id);
        setSelectedItem(null);
        setDetailStatus("loading");
        setDetailError("");
        setNotice("New custom pair added to the drop.");
      }
      setFormMode(null);
      setReloadKey((value) => value + 1);
    } catch (error) {
      setNotice(`Could not save: ${errorMessage(error)}`);
    } finally {
      setMutation(null);
    }
  }

  async function removeItem() {
    if (!selectedItem || mutation) return;
    // Capture the ID before await to avoid a stale selectedItem value.
    const targetId = selectedItem.id;
    if (!window.confirm(`Delete "${selectedItem.name}"?`)) return;

    setMutation(targetId);
    setNotice("");
    try {
      await deleteItem(targetId);
      setSelectedId(null);
      setSelectedItem(null);
      setDetailStatus("idle");
      setDetailError("");
      setNotice("Pair removed from the collection.");
      setReloadKey((value) => value + 1);
    } catch (error) {
      setNotice(`Could not delete: ${errorMessage(error)}`);
    } finally {
      setMutation(null);
    }
  }

  async function toggleAvailability() {
    if (!selectedItem || mutation) return;
    // Capture action data once and disable other actions until it finishes.
    const targetId = selectedItem.id;
    const nextStatus = selectedItem.status === "Available" ? "Sold out" : "Available";
    setMutation(targetId);
    setNotice("");

    try {
      const updated = await updateItem(targetId, { status: nextStatus });
      setSelectedItem((current) =>
        current?.id === targetId ? updated : current,
      );
      setNotice(`Availability changed to ${nextStatus.toLowerCase()}.`);
      setReloadKey((value) => value + 1);
    } catch (error) {
      setNotice(`Could not update status: ${errorMessage(error)}`);
    } finally {
      setMutation(null);
    }
  }

  const isBusy = mutation !== null;

  return (
    <main>
      <nav className="nav-shell">
        <a className="logo" href="#top" aria-label="streetALA home">street<span>ALA</span></a>
        <div className="nav-links" aria-label="Main navigation">
          <a href="#drop">COLLECTION</a>
          <a href="#studio">STUDIO</a>
          <a href="#customs">CUSTOMS</a>
        </div>
        <button className="nav-cta" type="button" onClick={() => setFormMode("create")} disabled={isBusy}>
          + ADD PAIR
        </button>
      </nav>

      <header className="hero" id="top">
        <div className="hero-copy">
          <p className="micro-label">CUSTOM SNEAKERS / ALMATY</p>
          <h1>YOUR PAIR.<br /><em>YOUR STORY.</em></h1>
          <p className="hero-text">Familiar silhouettes, customized with care. Every pair is painted by hand and made only once.</p>
          <a className="sticker-button" href="#drop">VIEW COLLECTION <span>↓</span></a>
        </div>
        <div className="hero-art">
          <div className="photo-frame main-photo">
            <img src="images/custom-wall.jpg" alt="Collection of hand-painted custom sneakers" />
          </div>
          <div className="photo-frame studio-photo">
            <img src="images/studio-process.jpg" alt="Artist painting a custom sneaker" />
          </div>
        </div>
      </header>

      <section className="catalog" id="drop">
        <div className="section-title">
          <div>
            <p className="micro-label">CUSTOM COLLECTION</p>
            <h2>OUR <span>PAIRS</span></h2>
          </div>
          <p>Select a pair to see its base model, sizes and custom details.</p>
        </div>

        {notice && <div className="notice" role="status">{notice}</div>}

        <div className="shop-grid" id="customs">
          <section className="product-list" aria-labelledby="products-heading">
            <div className="list-topline">
              <h3 id="products-heading">COLLECTION</h3>
              <button className="reload-button" type="button" onClick={reload} disabled={listStatus === "loading" || isBusy}>
                {listStatus === "loading" ? "LOADING..." : "↻ RELOAD"}
              </button>
            </div>

            {listStatus === "loading" && <div className="state-card">LOADING THE DROP...</div>}
            {listStatus === "error" && (
              <div className="state-card error-state">
                <p>{listError}</p>
                <button type="button" onClick={reload}>TRY AGAIN</button>
              </div>
            )}
            {listStatus === "success" && items.length === 0 && (
              <div className="state-card">THE ARCHIVE IS EMPTY. ADD A NEW PAIR.</div>
            )}
            {listStatus === "success" && items.length > 0 && (
              <div className="cards">
                {items.map((item, index) => (
                  <button
                    className={`product-card ${selectedId === item.id ? "selected" : ""}`}
                    type="button"
                    key={item.id}
                    onClick={() => selectItem(item.id)}
                    disabled={isBusy}
                  >
                    <span className="card-number">0{index + 1}</span>
                    <span className="card-image"><img src={item.image || "images/graffiti-high.jpg"} alt="" /></span>
                    <span className="card-copy">
                      <strong>{item.name}</strong>
                      <small>{show(item.silhouette)}</small>
                    </span>
                    <span className="card-meta">
                      <b>${show(item.price)}</b>
                      <i className={item.status === "Available" ? "available" : "sold-out"}>{show(item.status)}</i>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="product-detail" aria-labelledby="details-heading">
            {selectedId === null && (
              <div className="empty-detail">
                <span>↖</span>
                <h3 id="details-heading">PICK YOUR PAIR</h3>
                <p>Every product card is loaded separately with a simulated network delay.</p>
              </div>
            )}
            {selectedId !== null && detailStatus === "loading" && <div className="state-card">LOADING WORKSHOP CARD...</div>}
            {selectedId !== null && detailStatus === "error" && (
              <div className="state-card error-state">
                <p>{detailError}</p>
                <button type="button" onClick={reload}>TRY AGAIN</button>
              </div>
            )}
            {detailStatus === "success" && selectedItem && (
              <article>
                <div className="detail-visual">
                <span className="edition-tag">ONE OF ONE</span>
                  <img src={selectedItem.image || "images/graffiti-high.jpg"} alt={selectedItem.name} />
                  <span className="price-sticker">${show(selectedItem.price)}</span>
                </div>
                <div className="detail-copy">
                  <div className="detail-title">
                    <div>
                      <p className="micro-label">CUSTOM NO. {String(selectedItem.id).padStart(3, "0")}</p>
                      <h3 id="details-heading">{selectedItem.name}</h3>
                    </div>
                    <span className={selectedItem.status === "Available" ? "status-chip available" : "status-chip sold-out"}>{show(selectedItem.status)}</span>
                  </div>
                  <p className="description">{selectedItem.description}</p>
                  <dl className="spec-grid">
                    <div><dt>Base model</dt><dd>{show(selectedItem.silhouette)}</dd></div>
                    <div><dt>Palette</dt><dd>{show(selectedItem.palette)}</dd></div>
                    <div><dt>Sizes</dt><dd>{show(selectedItem.sizes)}</dd></div>
                    <div><dt>Artist</dt><dd>{show(selectedItem.artist)}</dd></div>
                    <div><dt>Turnaround</dt><dd>{show(selectedItem.turnaround)}</dd></div>
                    <div><dt>Archive ID</dt><dd>#{selectedItem.id}</dd></div>
                  </dl>
                  <div className="detail-actions">
                    <button className="action-primary" type="button" onClick={toggleAvailability} disabled={isBusy}>
                      {isBusy ? "UPDATING..." : selectedItem.status === "Available" ? "MARK SOLD OUT" : "MAKE AVAILABLE"}
                    </button>
                    <button type="button" onClick={() => setFormMode("edit")} disabled={isBusy}>EDIT</button>
                    <button className="delete-button" type="button" onClick={removeItem} disabled={isBusy}>DELETE</button>
                  </div>
                </div>
              </article>
            )}
          </section>
        </div>
      </section>

      <section className="studio-strip" id="studio">
        <img src="images/studio-process.jpg" alt="Custom sneaker painting process" />
        <div>
          <p className="micro-label">STREETALA STUDIO</p>
          <h2>MADE<br />BY <span>HAND.</span></h2>
          <p>Every pair is cleaned, prepared, painted and sealed by hand. Small variations make each finished pair unique.</p>
        </div>
      </section>

      <footer><span>streetALA © 2026</span><span>CUSTOM SNEAKERS · ALMATY</span></footer>

      {formMode && (
        <SneakerForm
          sneaker={formMode === "edit" ? selectedItem : null}
          busy={isBusy}
          onCancel={() => setFormMode(null)}
          onSave={saveItem}
        />
      )}
    </main>
  );
}
