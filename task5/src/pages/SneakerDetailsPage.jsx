import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SneakerForm from "../components/SneakerForm.jsx";
import { deleteItem, getItem, updateItem } from "../services/service.js";

function getErrorMessage(error) {
  return error instanceof Error ? error.message : "Something went wrong";
}

export default function SneakerDetailsPage() {
  // useParams reads the dynamic :id part of /sneakers/:id.
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [request, setRequest] = useState({ status: "loading", error: "" });
  const [reloadKey, setReloadKey] = useState(0);
  const [editing, setEditing] = useState(false);
  const [mutation, setMutation] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    // active protects the page from stale API responses.
    let active = true;

    async function loadItem() {
      setItem(null);
      setRequest({ status: "loading", error: "" });
      try {
        const result = await getItem(id);
        if (!active) return;
        setItem(result);
        setRequest({ status: "success", error: "" });
      } catch (error) {
        if (!active) return;
        const message = getErrorMessage(error);
        setRequest({
          status: message === "Item not found" ? "missing" : "error",
          error: message,
        });
      }
    }

    loadItem();
    return () => {
      active = false;
    };
  }, [id, reloadKey]);

  async function saveChanges(values) {
    if (!item || mutation) return;
    // Save the ID before await because state can change during a request.
    const targetId = item.id;
    setMutation(true);
    setNotice("");
    try {
      const updated = await updateItem(targetId, { ...values, price: Number(values.price) });
      setItem((current) => current?.id === targetId ? updated : current);
      setEditing(false);
      setNotice("Pair updated successfully.");
    } catch (error) {
      setNotice(`Could not update pair: ${getErrorMessage(error)}`);
    } finally {
      setMutation(false);
    }
  }

  async function toggleAvailability() {
    if (!item || mutation) return;
    const targetId = item.id;
    // Switch between the two possible availability states.
    const nextStatus = item.status === "Available" ? "Sold out" : "Available";
    setMutation(true);
    setNotice("");
    try {
      const updated = await updateItem(targetId, { status: nextStatus });
      // Update only if the response still belongs to the current item.
      setItem((current) => current?.id === targetId ? updated : current);
      setNotice(`Status changed to ${nextStatus.toLowerCase()}.`);
    } catch (error) {
      setNotice(`Could not change status: ${getErrorMessage(error)}`);
    } finally {
      setMutation(false);
    }
  }

  async function removeSneaker() {
    if (!item || mutation) return;
    const targetId = item.id;
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    setMutation(true);
    setNotice("");
    try {
      await deleteItem(targetId);
      navigate("/sneakers", { replace: true });
    } catch (error) {
      setNotice(`Could not delete pair: ${getErrorMessage(error)}`);
      setMutation(false);
    }
  }

  return (
    <section className="details-page page-section">
      <div className="details-nav">
        <button className="text-button" type="button" onClick={() => navigate(-1)}>← BACK</button>
        <Link className="text-link" to="/sneakers">ALL SNEAKERS</Link>
      </div>

      {request.status === "loading" && <div className="state-card">LOADING PAIR...</div>}

      {request.status === "error" && (
        <div className="state-card error-state">
          <p>{request.error}</p>
          <button className="button secondary" type="button" onClick={() => setReloadKey((value) => value + 1)}>
            TRY AGAIN
          </button>
        </div>
      )}

      {request.status === "missing" && (
        <div className="state-card">
          <p className="eyebrow">PAIR NOT FOUND</p>
          <h1>NO CUSTOM WITH ID #{id}</h1>
          <Link className="button primary" to="/sneakers">ALL SNEAKERS</Link>
        </div>
      )}

      {request.status === "success" && item && (
        <article className="details-layout">
          <div className="details-image">
            <span>ONE OF ONE</span>
            <img src={item.image || "/images/graffiti-high.jpg"} alt={item.name} />
            <strong>${item.price}</strong>
          </div>

          <div className="details-copy">
            <div className="details-title">
              <div>
                <p className="eyebrow">CUSTOM NO. {String(item.id).padStart(3, "0")}</p>
                <h1>{item.name}</h1>
              </div>
              <span className={`status-pill ${item.status === "Available" ? "available" : "sold-out"}`}>
                {item.status}
              </span>
            </div>

            <p className="details-description">{item.description}</p>

            <dl className="details-specs">
              <div><dt>Base model</dt><dd>{item.silhouette}</dd></div>
              <div><dt>Palette</dt><dd>{item.palette}</dd></div>
              <div><dt>Sizes</dt><dd>{item.sizes}</dd></div>
              <div><dt>Price</dt><dd>${item.price}</dd></div>
              <div><dt>Artist</dt><dd>{item.artist}</dd></div>
              <div><dt>Status</dt><dd>{item.status}</dd></div>
              <div><dt>Turnaround</dt><dd>{item.turnaround}</dd></div>
              <div><dt>Archive ID</dt><dd>#{item.id}</dd></div>
            </dl>

            {notice && <p className="notice" role="status">{notice}</p>}

            <div className="details-actions">
              <button className="button primary" type="button" onClick={toggleAvailability} disabled={mutation}>
                {mutation ? "UPDATING..." : item.status === "Available" ? "MARK SOLD OUT" : "MAKE AVAILABLE"}
              </button>
              <button className="button secondary" type="button" onClick={() => setEditing(true)} disabled={mutation}>
                EDIT
              </button>
              <button className="button danger" type="button" onClick={removeSneaker} disabled={mutation}>
                DELETE
              </button>
            </div>
          </div>
        </article>
      )}

      {editing && item && (
        <SneakerForm
          sneaker={item}
          busy={mutation}
          onCancel={() => setEditing(false)}
          onSave={saveChanges}
        />
      )}
    </section>
  );
}
