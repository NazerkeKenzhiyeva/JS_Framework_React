const DATA_KEY = "streetala-routes-sneakers-v1";

const API_CONFIG = {
  minDelay: 350,
  maxDelay: 900,
  errorChance: 0.05,
};

const initialData = [
  {
    id: 1,
    name: "Chuck 70 High — Graffiti",
    description: "A Chuck 70 High covered with layered marker tags, handwritten notes and small illustrations. Each pair is painted and sealed by hand.",
    silhouette: "Converse Chuck 70 High",
    palette: "Cream / Multicolor",
    sizes: "36–45 EU",
    price: 165,
    artist: "streetALA studio",
    status: "Available",
    turnaround: "5–7 days",
    image: "/images/graffiti-high.jpg",
  },
  {
    id: 2,
    name: "Mexico 66 — Manga",
    description: "A Mexico 66 with comic-inspired drawings, turquoise details and bright orange stripes on a clean white base.",
    silhouette: "Onitsuka Tiger Mexico 66",
    palette: "White / Orange / Cyan",
    sizes: "37–44 EU",
    price: 190,
    artist: "streetALA studio",
    status: "Sold out",
    turnaround: "10–14 days",
    image: "/images/manga-runner.jpg",
  },
  {
    id: 3,
    name: "Air Force 1 — Almaty Sunset",
    description: "Warm sunset tones and a minimal mountain line turn the classic white Air Force 1 into a quiet tribute to Almaty evenings.",
    silhouette: "Nike Air Force 1 Low",
    palette: "White / Orange / Navy",
    sizes: "36–44 EU",
    price: 210,
    artist: "streetALA studio",
    status: "Available",
    turnaround: "7–10 days",
    image: "/images/studio-process.jpg",
  },
  {
    id: 4,
    name: "Chuck 70 Low — Steppe Lines",
    description: "Loose black linework and muted green accents inspired by open steppe landscapes and hand-drawn travel notebooks.",
    silhouette: "Converse Chuck 70 Low",
    palette: "Black / Sand / Green",
    sizes: "35–43 EU",
    price: 145,
    artist: "A. Sapar",
    status: "Available",
    turnaround: "6–8 days",
    image: "/images/custom-wall.jpg",
  },
  {
    id: 5,
    name: "Air Force 1 — Night Tram",
    description: "A dark city-inspired custom with silver lettering, reflective details and electric blue marks across the panels.",
    silhouette: "Nike Air Force 1 Low",
    palette: "Black / Silver / Blue",
    sizes: "38–45 EU",
    price: 225,
    artist: "streetALA studio",
    status: "Sold out",
    turnaround: "12–14 days",
    image: "/images/graffiti-high.jpg",
  },
  {
    id: 6,
    name: "Mexico 66 — Apricot Sky",
    description: "A light everyday pair with apricot stripes, pale blue brushwork and a small hand-painted sun near the heel.",
    silhouette: "Onitsuka Tiger Mexico 66",
    palette: "Cream / Apricot / Sky Blue",
    sizes: "36–42 EU",
    price: 195,
    artist: "Dana K.",
    status: "Available",
    turnaround: "8–10 days",
    image: "/images/manga-runner.jpg",
  },
  {
    id: 7,
    name: "Chuck 70 High — Mountain Ink",
    description: "Ink-style mountain silhouettes wrap around a black high-top canvas with small white handwritten coordinates.",
    silhouette: "Converse Chuck 70 High",
    palette: "Black / White / Grey",
    sizes: "37–45 EU",
    price: 180,
    artist: "A. Sapar",
    status: "Available",
    turnaround: "7–9 days",
    image: "/images/custom-wall.jpg",
  },
  {
    id: 8,
    name: "Chuck 70 Low — Neon Bazaar",
    description: "Bright hand-lettering, sticker-like shapes and neon color blocks bring an energetic market-night mood to the low-top canvas.",
    silhouette: "Converse Chuck 70 Low",
    palette: "Cream / Lime / Magenta",
    sizes: "35–42 EU",
    price: 155,
    artist: "Dana K.",
    status: "Sold out",
    turnaround: "6–9 days",
    image: "/images/graffiti-high.jpg",
  },
];

function fakeRequest(operation) {
  // This Promise imitates a real server delay and occasional errors.
  return new Promise((resolve, reject) => {
    const delay = Math.floor(
      Math.random() * (API_CONFIG.maxDelay - API_CONFIG.minDelay + 1),
    ) + API_CONFIG.minDelay;

    setTimeout(() => {
      if (Math.random() < API_CONFIG.errorChance) {
        reject(new Error("Simulated server error"));
        return;
      }

      try {
        resolve(operation());
      } catch (error) {
        reject(error);
      }
    }, delay);
  });
}

function initializeDatabase() {
  // Add sample data only on the first visit.
  if (!localStorage.getItem(DATA_KEY)) {
    localStorage.setItem(DATA_KEY, JSON.stringify(initialData));
  }
}

function readData() {
  return JSON.parse(localStorage.getItem(DATA_KEY) || "[]");
}

function writeData(items) {
  localStorage.setItem(DATA_KEY, JSON.stringify(items));
}

initializeDatabase();

export async function getItemsList(query = "") {
  return fakeRequest(() => {
    // The list settings are received from URL search parameters.
    const params = new URLSearchParams(query);
    const search = (params.get("search") || "").trim().toLowerCase();
    const status = params.get("status") || "";
    const model = params.get("model") || "";
    const sort = params.get("sort") || "name";
    const page = Math.max(Number(params.get("page")) || 1, 1);
    const limit = Math.max(Number(params.get("limit")) || 6, 1);
    const allItems = readData();
    const models = [...new Set(allItems.map((item) => item.silhouette).filter(Boolean))].sort();
    let items = [...allItems];

    if (search) {
      items = items.filter((item) =>
        `${item.name} ${item.description} ${item.artist}`.toLowerCase().includes(search),
      );
    }

    if (status) {
      items = items.filter((item) => item.status === status);
    }

    if (model) {
      items = items.filter((item) => item.silhouette === model);
    }

    // Sorting happens before pagination.
    items.sort((a, b) => {
      if (sort === "name-desc") return b.name.localeCompare(a.name);
      if (sort === "price") return Number(a.price) - Number(b.price);
      if (sort === "price-desc") return Number(b.price) - Number(a.price);
      return a.name.localeCompare(b.name);
    });

    const total = items.length;
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * limit;

    // The response has the same shape as a small real API response.
    return {
      data: items.slice(start, start + limit),
      total,
      page: safePage,
      limit,
      totalPages,
      models,
    };
  });
}

export async function getItem(id) {
  return fakeRequest(() => {
    const item = readData().find((entry) => entry.id === Number(id));
    if (!item) throw new Error("Item not found");
    return item;
  });
}

export async function createItem(data) {
  return fakeRequest(() => {
    const items = readData();
    const nextId = items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
    const newItem = { ...data, id: nextId, price: Number(data.price) };
    writeData([...items, newItem]);
    return newItem;
  });
}

export async function updateItem(id, changes) {
  return fakeRequest(() => {
    const numericId = Number(id);
    const items = readData();
    if (!items.some((item) => item.id === numericId)) throw new Error("Item not found");

    const updatedItems = items.map((item) =>
      item.id === numericId ? { ...item, ...changes, id: numericId } : item,
    );
    writeData(updatedItems);
    return updatedItems.find((item) => item.id === numericId);
  });
}

export async function deleteItem(id) {
  return fakeRequest(() => {
    const numericId = Number(id);
    const items = readData();
    if (!items.some((item) => item.id === numericId)) throw new Error("Item not found");
    writeData(items.filter((item) => item.id !== numericId));
    return { success: true, id: numericId };
  });
}
