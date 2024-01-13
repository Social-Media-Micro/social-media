import { configureStore } from "@reduxjs/toolkit";
import globalCacheReducer from "./slices/globaCache.slice";
export const store = configureStore({
  reducer: {
    globalCache: globalCacheReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
