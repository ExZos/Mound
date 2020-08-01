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
  },
});

export const { setShowDialog } = rootSlice.actions;
export default rootSlice.reducer;
