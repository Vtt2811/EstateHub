import { useState } from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
  });

  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    setSearchParams(query);
  };

  return (
    <div className="bg-white rounded-card shadow-card p-5 space-y-4">
      <h2 className="font-heading text-xl text-navy-900">
        Search results for <span className="text-accent-500">{searchParams.get("city") || "all locations"}</span>
      </h2>

      {/* Location Input */}
      <div>
        <label htmlFor="city" className="label-text mb-1 block">Location</label>
        <input
          type="text"
          id="city"
          name="city"
          placeholder="Enter city or area"
          onChange={handleChange}
          defaultValue={query.city}
          className="input-field"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[100px]">
          <label htmlFor="type" className="label-text mb-1 block">Type</label>
          <select
            name="type"
            id="type"
            onChange={handleChange}
            defaultValue={query.type}
            className="select-field"
          >
            <option value="">Any</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>
        <div className="flex-1 min-w-[100px]">
          <label htmlFor="property" className="label-text mb-1 block">Property</label>
          <select
            name="property"
            id="property"
            onChange={handleChange}
            defaultValue={query.property}
            className="select-field"
          >
            <option value="">Any</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
          </select>
        </div>
        <div className="flex-1 min-w-[90px]">
          <label htmlFor="minPrice" className="label-text mb-1 block">Min Price</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="Any"
            onChange={handleChange}
            defaultValue={query.minPrice}
            className="input-field"
          />
        </div>
        <div className="flex-1 min-w-[90px]">
          <label htmlFor="maxPrice" className="label-text mb-1 block">Max Price</label>
          <input
            type="text"
            id="maxPrice"
            name="maxPrice"
            placeholder="Any"
            onChange={handleChange}
            defaultValue={query.maxPrice}
            className="input-field"
          />
        </div>
        <div className="flex-1 min-w-[80px]">
          <label htmlFor="bedroom" className="label-text mb-1 block">Beds</label>
          <input
            type="text"
            id="bedroom"
            name="bedroom"
            placeholder="Any"
            onChange={handleChange}
            defaultValue={query.bedroom}
            className="input-field"
          />
        </div>
        <button onClick={handleFilter} className="btn-primary !py-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search
        </button>
      </div>
    </div>
  );
}

export default Filter;
