import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    engine: '',
    brand: '',
    model: '',
    body: '',
    seats: 0,
    price: { min: 0, max: Infinity },
    fuel_consumption: '',
    comparisonCars: [],
    allCars: [],
    selectedOption: 'browse',
    quoteData: null, // ✅ NEW: Store quoteData globally
    isFetchingQuote: false,
    quoteTime: 'weekly',
  },
  reducers: {
    setFilter: (state, action) => {
      if (action.payload.key === 'engine') {
        if (action.payload.value === 'Petrol/Diesel') {
          state.engine = ['Petrol', 'Diesel'];
        } else {
          state.engine = [action.payload.value];
        }
      } else if (action.payload.key === 'price') {
        state.price = action.payload.value;
      } else {
        state[action.payload.key] = action.payload.value;
      }
    },
    setSelectedOption: (state, action) => {
      state.selectedOption = action.payload;
    },
    resetFilters: (state) => {
      state.engine = '';
      state.brand = '';
      state.model = '';
      state.body = '';
      state.seats = 0;
      state.price = { min: 0, max: Infinity };
      state.fuel_consumption = '';
    },
    setAllCars: (state, action) => {
      console.log("Redux state updating: ", action.payload);
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
    setQuoteData: (state, action) => {
      console.log("Updating quoteData in Redux:", action.payload); // ✅ Log state update
      state.quoteData = action.payload;
      state.isFetchingQuote = false;
    },
    setFetchingQuote: (state, action) => {
      state.isFetchingQuote = action.payload; // ✅ Start/Stop fetching state
    },
    setQuoteTime: (state, action) => {
      state.quoteTime = action.payload;
    },
  },
});

export const {
  setFilter,
  resetFilters,
  setAllCars,
  addToComparison,
  removeFromComparison,
  setSelectedOption,
  setQuoteTime,
  setQuoteData, // ✅ NEW: Export setQuoteData action
  setFetchingQuote,
} = filtersSlice.actions;

export default filtersSlice.reducer;

