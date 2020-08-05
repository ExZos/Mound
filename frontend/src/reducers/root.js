import { createSlice } from '@reduxjs/toolkit';

const rootSlice = createSlice({
  name: 'root',
  initialState: {
    showDialog: false,
  },
  reducers: {
    setShowDialog: (state, action) => {
      state.showDialog = action.payload;
    },
    setMenuAnchor: (state, action) => {
      state.menuAnchor = action.payload;
    },
    removeMenuAnchorNSetTab: (state, action) => {
      state.menuAnchor = null;
      state.tab = action.payload;
    },
  },
});

export const { setShowDialog, setMenuAnchor, removeMenuAnchorNSetTab } = rootSlice.actions;
export default rootSlice.reducer;
