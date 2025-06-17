import { useState, useEffect } from "react";
import { fetchProducts, fetchSuggestions } from "../api/api";
import { Link } from "react-router-dom";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (query.length >= 2) {
      fetchSuggestions(query).then((res) => setSuggestions(res.suggestions));
    }
  }, [query]);

  const handleSearch = () => {
    fetchProducts(query).then(setProducts);
  };

  return (
    <div className="p-6">
      <input
        className="border p-2 mr-2"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search product..."
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
        Search
      </button>

      {/* Suggestion List */}
      {suggestions.length > 0 && (
        <ul className="mt-2">
          {suggestions.map((s, i) => (
            <li key={i} className="text-gray-600">{s}</li>
          ))}
        </ul>
      )}

      {/* Search Results */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`}>
            <div className="border p-4 rounded hover:shadow-lg transition">
              <img src={product.Image} alt={product.Product_Name} width={150} className="mb-2" />
              <h2 className="text-lg font-semibold">{product.Product_Name}</h2>
              <p className="text-green-600">₹{product.Latest_Price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;
