import React from "react";

function getEngineTypeOptions(engineTypes, cars, filters) {
  // If cars are available, extract unique engine types, including 'Hybrid' if both petrol and electric are present
  if (cars && cars.length > 0) {
    const types = new Set();
    cars.forEach(car => {
      let type = (car.engineTypeDescription || car.engineType || "").toLowerCase();
      if (type.includes("petrol") && type.includes("electric")) {
        types.add("Hybrid");
      } else if (type) {
        types.add(type.charAt(0).toUpperCase() + type.slice(1));
      }
    });
    return Array.from(types);
  }
  return engineTypes;
}

export default function FiltersBar({ filters, setFilters, brands, models, years, engineTypes, seaters, minPrice, maxPrice, variants, cars }) {
  const showModel = !!filters.brand;
  const showVariant = !!filters.model;
  const engineTypeOptions = getEngineTypeOptions(engineTypes, cars, filters);

  return (
    <div className="filters-bar">
      {/* Brand */}
      <select value={filters.brand} onChange={e => setFilters(f => ({ ...f, brand: e.target.value, model: "", variant: "" }))}>
        <option value="">All Brands</option>
        {brands.map(b => <option key={b} value={b}>{b}</option>)}
      </select>
      {/* Model (always shown, disabled if no brand) */}
      <select
        value={filters.model}
        onChange={e => setFilters(f => ({ ...f, model: e.target.value, variant: "" }))}
        disabled={!showModel}
      >
        {!showModel ? <option value="">Select brand first</option> : <option value="">All Models</option>}
        {showModel && models.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      {/* Variant (always shown, disabled if no model) */}
      <select
        value={filters.variant}
        onChange={e => setFilters(f => ({ ...f, variant: e.target.value }))}
        disabled={!showVariant}
      >
        {!showVariant ? <option value="">Select model first</option> : <option value="">All Variants</option>}
        {showVariant && variants && variants.length > 0 && variants.map(v => <option key={v} value={v}>{v}</option>)}
      </select>
      {/* Year */}
      <select value={filters.yearGroup} onChange={e => setFilters(f => ({ ...f, yearGroup: e.target.value }))}>
        <option value="">All Years</option>
        {years.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
      {/* Engine Type */}
      <select value={filters.engineType} onChange={e => setFilters(f => ({ ...f, engineType: e.target.value }))}>
        <option value="">All Engine Types</option>
        {engineTypeOptions.map(eType => <option key={eType} value={eType}>{eType}</option>)}
      </select>
      {/* Seater */}
      <select value={filters.seater} onChange={e => setFilters(f => ({ ...f, seater: e.target.value }))}>
        <option value="">All Seaters</option>
        {seaters.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      {/* Price */}
      <input type="range" min={minPrice} max={maxPrice} value={filters.price} onChange={e => setFilters(f => ({ ...f, price: e.target.value }))} />
      <span>Up to ${filters.price}</span>
    </div>
  );
} 