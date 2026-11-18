import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SneakerForm from "../components/SneakerForm.jsx";
import { useDeleteSneaker, useSneakerQuery, useUpdateSneaker } from "../hooks/useSneakerData.js";

function getErrorMessage(error) {
  return error instanceof Error ? error.message : "Something went wrong";
}

export default function SneakerDetailsPage() {
  // useParams reads the dynamic :id part of /sneakers/:id.
  const { id } = useParams();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState("");
  const request = useSneakerQuery(id);
  const updateSneaker = useUpdateSneaker();
  const deleteSneaker = useDeleteSneaker();
  const item = request.data;
  const mutation = updateSneaker.isPending || deleteSneaker.isPending;
  const requestError = request.error ? getErrorMessage(request.error) : "";
  const requestStatus = request.isPending
    ? "loading"
    : request.isError && requestError === "Item not found"
      ? "missing"
      : request.isError ? "error" : "success";

  async function saveChanges(values) {
    if (!item || mutation) return;
    // Save the ID before await because state can change during a request.
    const targetId = item.id;
    setNotice("");
    try {
      await updateSneaker.mutateAsync({ id: targetId, changes: { ...values, price: Number(values.price) } });
      setEditing(false);
      setNotice("Pair updated successfully.");
    } catch (error) {
      setNotice(`Could not update pair: ${getErrorMessage(error)}`);
    }
  }

  async function toggleAvailability() {
    if (!item || mutation) return;
    const targetId = item.id;
    // Switch between the two possible availability states.
    const nextStatus = item.status === "Available" ? "Sold out" : "Available";
    setNotice("");
    try {
      await updateSneaker.mutateAsync({ id: targetId, changes: { status: nextStatus } });
      setNotice(`Status changed to ${nextStatus.toLowerCase()}.`);
    } catch (error) {
      setNotice(`Could not change status: ${getErrorMessage(error)}`);
    }
  }

  async function removeSneaker() {
    if (!item || mutation) return;
    const targetId = item.id;
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    setNotice("");
    try {
      await deleteSneaker.mutateAsync(targetId);
      navigate("/sneakers", { replace: true });
    } catch (error) {
      setNotice(`Could not delete pair: ${getErrorMessage(error)}`);
    }
  }

  return (
    <section className="details-page page-section">
      <div className="details-nav">
        <button className="text-button" type="button" onClick={() => navigate(-1)}>← BACK</button>
        <Link className="text-link" to="/sneakers">ALL SNEAKERS</Link>
      </div>

      {requestStatus === "loading" && <div className="state-card">LOADING PAIR...</div>}

      {requestStatus === "error" && (
        <div className="state-card error-state">
          <p>{requestError}</p>
          <button className="button secondary" type="button" onClick={() => request.refetch()}>
            TRY AGAIN
          </button>
        </div>
      )}

      {requestStatus === "missing" && (
        <div className="state-card">
          <p className="eyebrow">PAIR NOT FOUND</p>
          <h1>NO CUSTOM WITH ID #{id}</h1>
          <Link className="button primary" to="/sneakers">ALL SNEAKERS</Link>
        </div>
      )}

      {requestStatus === "success" && item && (
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
