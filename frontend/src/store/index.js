import { configureStore } from '@reduxjs/toolkit';
import pollReducer from './pollSlice';

export const store = configureStore({
  reducer: {
    poll: pollReducer,
  },
});

// For TypeScript (if you add TypeScript later)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

