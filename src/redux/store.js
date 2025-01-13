import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from '../features/filtersSlice';

const store = configureStore({
  reducer: {
    filters: filtersReducer,
  },
});

export default store;
