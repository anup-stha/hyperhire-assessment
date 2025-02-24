import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "./menu/menuSlice";
import sidebarReducer from "./sidebar/sidebarSlice";

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    sidebar: sidebarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
