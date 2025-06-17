import React, { useEffect, useState } from "react";
import { fetchWishlist, removeFromWishlist } from "../api/api";
import "./WishlistPage.css";

function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Please log in to view your wishlist.");
      return;
    }

    const loadWishlist = async () => {
      try {
        const data = await fetchWishlist(token);
        if (Array.isArray(data)) {
          setWishlist(data);
        } else {
          setError(data?.error || "Failed to load wishlist.");
        }
      } catch (err) {
        console.error("Failed to load wishlist:", err);
        setError("Something went wrong while loading wishlist.");
      }
    };

    loadWishlist();
  }, []);

  const handleRemove = async (productId) => {
    const token = localStorage.getItem("authToken");
    await removeFromWishlist(productId, token);
    setWishlist(wishlist.filter((p) => p.id !== productId));
  };

  return (
    <div className="wishlist-page">
      <h1>My Wishlist</h1>
      {error ? (
        <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
      ) : wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <div key={product.id} className="wishlist-card">
              <img src={product.Image} alt={product.Product_Name} />
              <h3>{product.Product_Name}</h3>
              <p><strong>₹{product.Latest_Price}</strong></p>
              <a
                href={product.Links}
                target="_blank"
                rel="noopener noreferrer"
                className="buy-link"
              >
                Buy on {product.Source}
              </a>
              <button onClick={() => handleRemove(product.id)}>
                ❌ Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
