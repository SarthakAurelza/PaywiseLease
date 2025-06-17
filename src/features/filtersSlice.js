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
    carQuotes: {}, // carId => quoteData
    isFetchingQuote: false,
    quoteTime: 'weekly',
    userPreferences: {
    salary: 20000,
    leaseTerm: 1,
    yearlyKm: 5000,
    state: "NSW",
    },
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
   
    setQuoteForCar: (state, action) => {
  const { carId, quoteData } = action.payload;
  state.carQuotes[carId] = quoteData;
},
    setUserPreferences: (state, action) => {
  state.userPreferences = { ...state.userPreferences, ...action.payload };
},

    setFetchingQuote: (state, action) => {
      state.isFetchingQuote = action.payload; // ✅ Start/Stop fetching state
    },
    setQuoteTime: (state, action) => {
      state.quoteTime = action.payload;
    },
    removeFromComparison: (state, action) => {
    const carId = action.payload;
    state.comparisonCars = state.comparisonCars.filter((car) => car.id !== carId);
    delete state.carQuotes[carId]; // ✅ also clean quote
  }

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
  setQuoteForCar,
  setUserPreferences,
} = filtersSlice.actions;

export default filtersSlice.reducer;

