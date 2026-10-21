import { useState } from "react";

const emptySneaker = {
  name: "",
  description: "",
  silhouette: "Converse Chuck 70 High",
  palette: "Black / White",
  sizes: "36–45 EU",
  price: "",
  artist: "streetALA studio",
  status: "Available",
  turnaround: "7–10 days",
  image: "images/graffiti-high.jpg",
};

export default function SneakerForm({ sneaker, busy, onCancel, onSave }) {
  const [form, setForm] = useState(
    sneaker ? { ...emptySneaker, ...sneaker } : emptySneaker,
  );
  const [imageError, setImageError] = useState("");

  function changeField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function uploadImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please choose an image file.");
      return;
    }

    if (file.size > 1_500_000) {
      setImageError("Please choose an image smaller than 1.5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, image: String(reader.result) }));
      setImageError("");
    };
    reader.onerror = () => setImageError("Could not read this image.");
    reader.readAsDataURL(file);
  }

  function submit(event) {
    event.preventDefault();
    onSave(form);
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div className="modal-heading">
          <div>
            <p className="eyebrow">{sneaker ? "Edit custom" : "New pair"}</p>
            <h2 id="form-title">{sneaker ? "Update sneakers" : "Add custom sneakers"}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onCancel} disabled={busy} aria-label="Close">X</button>
        </div>

        <form className="task-form" onSubmit={submit}>
          <label className="full-field">
            Model name
            <input name="name" value={form.name} onChange={changeField} required maxLength="60" />
          </label>

          <label className="full-field">
            Description
            <textarea name="description" value={form.description} onChange={changeField} required rows="3" maxLength="240" />
          </label>

          <label>
            Base model
            <select name="silhouette" value={form.silhouette} onChange={changeField}>
              <option>Converse Chuck 70 High</option>
              <option>Converse Chuck 70 Low</option>
              <option>Onitsuka Tiger Mexico 66</option>
              <option>Nike Air Force 1 Low</option>
            </select>
          </label>

          <label>
            Color palette
            <input name="palette" value={form.palette} onChange={changeField} required maxLength="40" />
          </label>

          <label>
            Sizes
            <input name="sizes" value={form.sizes} onChange={changeField} required maxLength="30" />
          </label>

          <label>
            Price, USD
            <input type="number" name="price" value={form.price} onChange={changeField} required min="1" />
          </label>

          <label>
            Artist
            <input name="artist" value={form.artist} onChange={changeField} required maxLength="40" />
          </label>

          <label>
            Turnaround
            <input name="turnaround" value={form.turnaround} onChange={changeField} required maxLength="30" />
          </label>

          <label className="full-field">
            Status
            <select name="status" value={form.status} onChange={changeField}>
              <option>Available</option>
              <option>Sold out</option>
            </select>
          </label>

          <label className="full-field upload-field">
            Product photo
            <input type="file" accept="image/*" onChange={uploadImage} />
            <small>JPG, PNG or WEBP, up to 1.5 MB.</small>
          </label>

          {imageError && <p className="image-error full-field">{imageError}</p>}

          {form.image && (
            <div className="image-preview full-field">
              <img src={form.image} alt="Product preview" />
              <span>Image preview</span>
            </div>
          )}

          <div className="form-actions full-field">
            <button className="button secondary" type="button" onClick={onCancel} disabled={busy}>Cancel</button>
            <button className="button primary" type="submit" disabled={busy}>
              {busy ? "Saving..." : sneaker ? "Save changes" : "Add pair"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
