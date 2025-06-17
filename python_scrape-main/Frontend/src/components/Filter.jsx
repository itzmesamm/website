// src/components/Filter.jsx
import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./Filter.css";

function Filter({ onFilterChange }) {
  const [range, setRange] = useState([0, 100000]);
  const [minInput, setMinInput] = useState("0");
  const [maxInput, setMaxInput] = useState("100000");
  const [sortOrder, setSortOrder] = useState("");
  const [source, setSource] = useState("");
  const [open, setOpen] = useState(false);

  const updateRange = (vals) => {
    setRange(vals);
    setMinInput(String(vals[0]));
    setMaxInput(String(vals[1]));
  };

  const applyInputs = () => {
    const min = parseInt(minInput) || 0;
    const max = parseInt(maxInput) || 100000;
    if (min <= max) updateRange([min, max]);
    else updateRange([max, min]);
  };

  const handleApply = () => {
    onFilterChange({
      min_price: range[0],
      max_price: range[1],
      sort: sortOrder,
      source: source || null,
    });
    setOpen(false);
  };

  return (
    <>
      <button className="filter-toggle-btn" onClick={() => setOpen(!open)}>
        ☰ Filter
      </button>

      <div className={`filter-panel ${open ? "open" : ""}`}>
        <h3>Filters</h3>

        <label>Price Range: ₹{range[0]} – ₹{range[1]}</label>
        <Slider
          range
          min={0}
          max={100000}
          step={500}
          value={range}
          onChange={updateRange}
        />
        <div className="price-inputs">
          <input
            type="number"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            onBlur={applyInputs}
          />
          <input
            type="number"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            onBlur={applyInputs}
          />
        </div>

        <label>Sort by Price:</label>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="">None</option>
          <option value="price_asc">Low to High</option>
          <option value="price_desc">High to Low</option>
        </select>

        <label>Source:</label>
        <select value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="">All</option>
          <option value="Amazon">Amazon</option>
          <option value="Flipkart">Flipkart</option>
        </select>

        <button onClick={handleApply}>Apply Filters</button>
      </div>
    </>
  );
}

export default Filter;
