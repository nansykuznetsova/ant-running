import { configureStore } from '@reduxjs/toolkit';
import antsReducer from '../features/antsSlice';

export const store = configureStore({
  reducer: {
    ants: antsReducer
  },
})