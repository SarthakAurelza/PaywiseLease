import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    engine: '',
    brand: '',
    model: '',
    body: '',
    seats: 0, // Numeric value for seats
    comparisonCars: [],
    allCars: [],
  },
  reducers: {
    setFilter: (state, action) => {
      if (action.payload.key === 'engine') {
        if (action.payload.value === 'Petrol/Diesel') {
          state.engine = ['Petrol', 'Diesel'];
        } else {
          state.engine = [action.payload.value];
        }
      } else {
        state[action.payload.key] = action.payload.value;
      }
    },
    resetFilters: (state) => {
      state.engine = '';
      state.brand = '';
      state.model = '';
      state.body = '';
      state.seats = 0;
    },
    setAllCars: (state, action) => {
      state.allCars = action.payload;
    },
    addToComparison: (state, action) => {
      if (state.comparisonCars.length < 3) {
        const existingCar = state.comparisonCars.find((car) => car.id === action.payload.id);
        if (!existingCar) {
          state.comparisonCars.push(action.payload);
        }
      } else {
        alert('You can only compare a maximum of 3 cars.');
      }
    },
    removeFromComparison: (state, action) => {
      state.comparisonCars = state.comparisonCars.filter((car) => car.id !== action.payload);
    },
  },
});

export const {
  setFilter,
  resetFilters,
  setAllCars,
  addToComparison,
  removeFromComparison,
} = filtersSlice.actions;

export default filtersSlice.reducer;
