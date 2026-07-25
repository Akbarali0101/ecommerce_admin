import { createSlice } from "@reduxjs/toolkit";

/**
 * Faqat UI holatini boshqarish uchun (admin sidebar ochiq/yopiq va h.k.).
 * Backend bilan bog'liq emas — shuning uchun tayyor holda qoldirilgan.
 */
const initialState = {
  isAdminSidebarOpen: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleAdminSidebar: (state) => {
      state.isAdminSidebarOpen = !state.isAdminSidebarOpen;
    },
  },
});

export const { toggleAdminSidebar } = uiSlice.actions;
export default uiSlice.reducer;
