import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PriceHistoryGraph from "../components/PriceHistoryGraph";
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) {
      setError('Product ID is missing.');
      return;
    }

    const url = `http://localhost:8000/api/product/${productId}/`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setProductData(data))
      .catch((error) => setError(`Error fetching product details: ${error.message}`));
  }, [productId]);

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    if (typeof price === 'string') return price;
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="product-container">
      {error && <p className="text-red-500">{error}</p>}

      {productData ? (
        <div>
          <h1 className="product-header">{productData.Product_Name}</h1>
          <div className="flex flex-col sm:flex-row gap-6">
            <img
              src={productData.Image}
              alt={productData.Product_Name}
              className="product-image"
            />
            <div className="product-info">
              <p><strong>Price:</strong> {formatPrice(productData.Latest_Price)}</p>
              <p><strong>Ratings:</strong> {productData.Ratings}</p>
              <p><strong>Reviews:</strong> {productData.Reviews}</p>
              <p><strong>Source:</strong> <span className="text-blue-600">{productData.Source}</span></p>
              <a
                href={productData.Links}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Product
              </a>
            </div>
          </div>

          {/* Price History Graph */}
          {productData.Price_History && (
            <div className="mt-8">
              <PriceHistoryGraph priceHistory={productData.Price_History} />
            </div>
          )}

          {/* Min/Max Prices */}
          <div className="min-max-container">
            <p><strong>Minimum Price:</strong> {formatPrice(productData.Min_Price)}</p>
            <p><strong>Maximum Price:</strong> {formatPrice(productData.Max_Price)}</p>
          </div>

          {/* Recommendation */}
          <div className="recommendation-box">
            Recommendation: {productData.Recommendation}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProductDetailPage;
