import { useState } from "react";
import "./App.css";
import CostumeCard from "./components/CostumeCard";

function App() {
  const [costumes, setCostumes] = useState([
  {
    id: 1,
    name: "Dracula",
    occasion: "Halloween",
    price: 24990,
    status: "Available",
    createdAt: 1,
    image: "/images/dracula.jpg",
  },
  {
    id: 2,
    name: "Pinkie Pie",
    occasion: "Cosplay",
    price: 28990,
    status: "Available",
    createdAt: 2,
    image: "/images/pinkie-pie.jpg",
  },
  {
    id: 3,
    name: "Donald Duck McDonald's",
    occasion: "Party",
    price: 31990,
    status: "Sold Out",
    createdAt: 3,
    image: "/images/donald-mcdonalds.jpg",
  },
  {
    id: 4,
    name: "Deadpool",
    occasion: "Cosplay",
    price: 32990,
    status: "Available",
    createdAt: 4,
    image: "/images/deadpool.jpg",
  },
  {
    id: 5,
    name: "Pirate Captain",
    occasion: "Party",
    price: 21990,
    status: "Available",
    createdAt: 5,
    image: "/images/pirate.jpg",
  },
  {
    id: 6,
    name: "Wednesday Addams",
    occasion: "Halloween",
    price: 27990,
    status: "Available",
    createdAt: 6,
    image: "/images/wednesday.jpg",
  },
]);

const [occasionFilter, setOccasionFilter] = useState("All");
const [minPrice, setMinPrice] = useState("");
const [maxPrice, setMaxPrice] = useState("");
const [sortBy, setSortBy] = useState("newest");
const [showForm, setShowForm] = useState(false);

const [newName, setNewName] = useState("");
const [newOccasion, setNewOccasion] = useState("Halloween");
const [newPrice, setNewPrice] = useState("");
const [newImage, setNewImage] = useState("");
const [newStatus, setNewStatus] = useState("Available");
const [resetVersions, setResetVersions] = useState({});
const removeCostume = (id) => {
  setCostumes(
    costumes.filter((costume) => costume.id !== id)
  );
};

const changeStatus = (id) => {
  setCostumes(
    costumes.map((costume) =>
      costume.id === id
        ? {
            ...costume,
            status:
              costume.status === "Available"
                ? "Sold Out"
                : "Available",
          }
        : costume
    )
  );
};

const isCostumeVisible = (costume) => {
  const matchesOccasion =
    occasionFilter === "All" ||
    costume.occasion === occasionFilter;

  const matchesMinPrice =
    minPrice === "" ||
    costume.price >= Number(minPrice);

  const matchesMaxPrice =
    maxPrice === "" ||
    costume.price <= Number(maxPrice);

  return matchesOccasion && matchesMinPrice && matchesMaxPrice;
};

const sortedCostumes = [...costumes].sort((a, b) => {
  if (sortBy === "newest") {
    return b.createdAt - a.createdAt;
  }

  if (sortBy === "oldest") {
    return a.createdAt - b.createdAt;
  }

  if (sortBy === "price-low") {
    return a.price - b.price;
  }

  if (sortBy === "price-high") {
    return b.price - a.price;
  }

  return 0;
});

const addCostume = (event) => {
  event.preventDefault();

  if (newName.trim() === "" || newPrice === "") {
    return;
  }

  const newCostume = {

    id: Date.now(),
    name: newName,
    occasion: newOccasion,
    price: Number(newPrice),
    status: newStatus,
    createdAt: Date.now(),
    image: newImage,
  };

  setCostumes([...costumes, newCostume]);

  setNewName("");
  setNewImage("");
  setNewOccasion("Halloween");
  setNewPrice("");
  setNewStatus("Available");
  setShowForm(false);

};

const resetCostumeCard = (id) => {
  setResetVersions((previousVersions) => ({
    ...previousVersions,
    [id]: (previousVersions[id] || 0) + 1,
  }));
};

  return (
    <main>
      <header>
        <h2>MASKED.</h2>
        <p>COSTUME STORE</p>
      </header>

      <section>
        <p>NEW COLLECTION</p>

        <h1>Costumes for every version of you.</h1>

        <p>
          Halloween, Christmas, cosplay, parties and everything in between.
        </p>

        <button onClick={() => setShowForm(true)}>
  + Add Costume
</button>

{showForm && (
  <form onSubmit={addCostume}>
    <h2>Add New Costume</h2>

    <input
      type="text"
      placeholder="Costume name"
      value={newName}
      onChange={(event) => setNewName(event.target.value)}
    />

    <input
  type="file"
  accept="image/*"
  onChange={(event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setNewImage(reader.result);
    };

    reader.readAsDataURL(file);
  }}
/>

{newImage && (
  <img
    src={newImage}
    alt="Costume preview"
    width="200"
  />
)}


    <input
      type="number"
      placeholder="Price"
      value={newPrice}
      onChange={(event) => setNewPrice(event.target.value)}
    />

    <select
      value={newOccasion}
      onChange={(event) => setNewOccasion(event.target.value)}
    >
      <option value="Halloween">Halloween</option>
      <option value="Cosplay">Cosplay</option>
      <option value="Party">Party</option>
    </select>

    <select
      value={newStatus}
      onChange={(event) => setNewStatus(event.target.value)}
    >
      <option value="Available">Available</option>
      <option value="Sold Out">Sold Out</option>
    </select>

    <button type="submit">
      Add Costume
    </button>

    <button
      type="button"
      onClick={() => setShowForm(false)}
    >
      Cancel
    </button>
  </form>
)}


      </section>

      <section>
        <h2>Costumes</h2>

        <div>
          <button
  className={occasionFilter === "All" ? "active-filter" : ""}
  onClick={() => setOccasionFilter("All")}
>
  All
</button>

<button
  className={occasionFilter === "Halloween" ? "active-filter" : ""}
  onClick={() => setOccasionFilter("Halloween")}
>
  Halloween
</button>

<button
  className={occasionFilter === "Cosplay" ? "active-filter" : ""}
  onClick={() => setOccasionFilter("Cosplay")}
>
  Cosplay
</button>

<button
  className={occasionFilter === "Party" ? "active-filter" : ""}
  onClick={() => setOccasionFilter("Party")}
>
  Party
</button>
</div>

<div>
  <input
    type="number"
    placeholder="Min price"
    value={minPrice}
    onChange={(event) => setMinPrice(event.target.value)}
  />

  <input
    type="number"
    placeholder="Max price"
    value={maxPrice}
    onChange={(event) => setMaxPrice(event.target.value)}
  />
</div>
<div>
  <label>Sort by: </label>

  <select
    value={sortBy}
    onChange={(event) => setSortBy(event.target.value)}
  >
    <option value="newest">Newest</option>
    <option value="oldest">Oldest</option>
    <option value="price-low">Price: Low to High</option>
    <option value="price-high">Price: High to Low</option>
  </select>
</div>

<div>
  {sortedCostumes.map((costume) => (
  <div
    key={costume.id}
    style={{
      display: isCostumeVisible(costume) ? "block" : "none",
    }}
  >
    <CostumeCard
      key={`${costume.id}-${resetVersions[costume.id] || 0}`}
      costume={costume}
      onRemove={removeCostume}
      onChangeStatus={changeStatus}
      onResetCard={resetCostumeCard}
    />
  </div>
))}
</div>
      </section>
    </main>
  );
}

export default App;   