import { useState } from "react";
import "./searchBar.scss";
import { Link } from "react-router-dom";

const types = ["buy", "rent"];

function SearchBar() {
  const [query, setQuery] = useState({
    type: "buy",
    city: "",
    minPrice: 0,
    maxPrice: 0,
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Type Toggle */}
      <div className="flex">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={`px-8 py-3 font-body font-semibold text-body-sm capitalize rounded-t-btn border border-b-0 transition-all duration-250
              ${query.type === type
                ? "bg-white text-navy-900 border-navy-200"
                : "bg-transparent text-navy-400 border-transparent hover:text-navy-600"
              }`}
          >
            {type}
          </button>
        ))}
      </div>
      {/* Search Form */}
      <form className="flex flex-col sm:flex-row bg-white rounded-b-card rounded-tr-card shadow-elevated border border-navy-100">
        <div className="flex-1 flex flex-col sm:flex-row">
          <input
            type="text"
            name="city"
            placeholder="Enter city or location"
            onChange={handleChange}
            className="flex-1 px-5 py-4 font-body text-body text-navy-800 placeholder-navy-300 bg-transparent border-0
                       focus:outline-none border-b sm:border-b-0 sm:border-r border-surface-200"
          />
          <input
            type="number"
            name="minPrice"
            min={0}
            max={10000000}
            placeholder="Min Price"
            onChange={handleChange}
            className="w-full sm:w-32 px-5 py-4 font-body text-body text-navy-800 placeholder-navy-300 bg-transparent border-0
                       focus:outline-none border-b sm:border-b-0 sm:border-r border-surface-200"
          />
          <input
            type="number"
            name="maxPrice"
            min={0}
            max={10000000}
            placeholder="Max Price"
            onChange={handleChange}
            className="w-full sm:w-32 px-5 py-4 font-body text-body text-navy-800 placeholder-navy-300 bg-transparent border-0
                       focus:outline-none"
          />
        </div>
        <Link
          to={`/list?type=${query.type}&city=${query.city}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
          className="flex"
        >
          <button
            type="button"
            className="w-full sm:w-auto px-7 py-4 bg-accent-500 text-white rounded-b-card sm:rounded-bl-none sm:rounded-r-card
                       hover:bg-accent-600 transition-colors duration-250 flex items-center justify-center gap-2 font-body font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="sm:hidden">Search</span>
          </button>
        </Link>
      </form>
    </div>
  );
}

export default SearchBar;
