import { useState } from "react";

function CostumeCard({                                 
  costume,
  onRemove,
  onChangeStatus,
  onResetCard,
}) {
  const [likes, setLikes] = useState(0);

  console.log(`CostumeCard rendered: ${costume.name}`);

  return (
    <article>

      <img
  src={costume.image}
  alt={costume.name}
/>
      <p>{costume.occasion}</p>


      <h3>{costume.name}</h3>

      <p>{costume.price.toLocaleString()} ₸</p>

      <p>Status: {costume.status}</p>

      <button
  className="like-button"
  onClick={() => setLikes(likes + 1)}
>
  ♥ {likes}
</button>

      <button
  className="reset-likes"
  onClick={() => setLikes(0)}
  title="Reset likes" 
>
  ↻
</button>

      <button onClick={() => onChangeStatus(costume.id)}>
        {costume.status === "Available"
          ? "Mark Sold Out"
          : "Make Available"}
      </button>

      <button onClick={() => onRemove(costume.id)}>
        Remove
      </button>

      <button onClick={() => onResetCard(costume.id)}>
        Reset Card
      </button>


    </article>
  );
}

export default CostumeCard; 