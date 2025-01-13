import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, resetFilters } from '../features/filtersSlice';

const Filter = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);

  const handleChange = (key, value) => {
    dispatch(setFilter({ key, value }));
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  return (
    <div>
      <h2>Filter Cars</h2>
      <label>
        Engine Type:
        <select
          value={filters.engine}
          onChange={(e) => handleChange('engine', e.target.value)}
        >
          <option value="">All</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </label>
      <label>
        Brand:
        <input
          type="text"
          value={filters.brand}
          onChange={(e) => handleChange('brand', e.target.value)}
        />
      </label>
      <label>
        Model:
        <input
          type="text"
          value={filters.model}
          onChange={(e) => handleChange('model', e.target.value)}
        />
      </label>
      <label>
        Body Type:
        <select
          value={filters.body}
          onChange={(e) => handleChange('body', e.target.value)}
        >
          <option value="">All</option>
          <option value="Sedan">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="Hatchback">Hatchback</option>
          <option value="Coupe">Coupe</option>
        </select>
      </label>
      <label>
        Seats:
        <input
          type="number"
          min="1"
          value={filters.seats || ''}
          onChange={(e) => handleChange('seats', parseInt(e.target.value, 10) || 0)}
        />
      </label>
      <button onClick={handleReset}>Reset Filters</button>
    </div>
  );
};

export default Filter;
