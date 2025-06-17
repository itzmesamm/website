import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { fetchProducts } from "../api/api";
import './SearchResultPage.css';
import Filter from "../components/Filter";
import { addToWishlist } from "../api/api"; 

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const query = searchParams.get("q");

  const handleFilterChange = (filters) => {
    fetchProducts({ query, ...filters }).then(setProducts);
  };

  useEffect(() => {
    if (query) {
      fetchProducts({ query }).then(setProducts);
    }
  }, [query]);

  const addToWishlist = async (productId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setMessage("🔒 Please log in to use wishlist.");
      return;
    }

    const res = await fetch("/api/users/wishlist/add/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ product_id: productId })
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("✅ Added to wishlist!");
      setTimeout(() => setMessage(""), 2000);
    } else {
      setMessage(data.error || "❌ Failed to add to wishlist");
    }
  };

  return (
    <div className="search-page">
      <p className="result-heading">Search Results for "{query}"</p>
      {message && <p className="wishlist-message">{message}</p>}
      <Filter onFilterChange={handleFilterChange} />
      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-link">
              <Link to={`/product/${product.id}`}>
                <div className="product-card">
                  <img src={product.Image} alt={product.Product_Name} className="product-image" />
                  <div className="product-info">
                    <h2 className="product-title">{product.Product_Name}</h2>
                    <p className="product-price"><sup>₹</sup>{product.Latest_Price}</p>
                  </div>
                </div>
              </Link>
              <div className="product-actions">
                <a 
                  href={product.Links} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="external-link-button"
                >
                  View on {product.Source}
                </a>
                <button
                    className="wishlist-btn"
                    onClick={() => addToWishlist(product.id)}
                    >
                      ❤️ Add to Wishlist
                    </button>
              </div>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}

export default SearchResultsPage;
