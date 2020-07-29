import { configureStore, getDefaultMiddleware, createSlice } from '@reduxjs/toolkit';
import { spaceMiddleware, getSpaceByName, addSpace } from './middleware/index';

const middleware = [
  ...getDefaultMiddleware(),
  // spaceMiddleware,
];

const initialState = {
  loaded: true,
  error: false,
  space: {
    name: ''
  },
  showDialog: false,
};

const rootSlice = createSlice({
  name: 'root',
  initialState: initialState,
  reducers: {
    setSpace: (state, action) => {
      if(!action.payload.name) {
        action.payload.name = '';
      }

      state.space = action.payload;
    },
    setShowDialog: (state, action) => {
      state.showDialog = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSpaceByName.pending, (state, action) => {
      console.log('GET PENDING');
      state.loaded = false;
      state.error = false;
    });
    builder.addCase(getSpaceByName.rejected, (state, action) => {
      console.log('GET REJECTED');
      state.loaded = true;
      state.error = true;

      if(state.space.name) {
        state.showDialog = true;
      }
    });
    builder.addCase(getSpaceByName.fulfilled, (state, action) => {
      console.log('GET FULFILLED');
      state.loaded = true;
      state.error = false;
      state.space = action.payload;
    });

    builder.addCase(addSpace.pending, (state, action) => {
      console.log('ADD PENDING');
      state.loaded = false;
      state.error = false;
    });
    builder.addCase(addSpace.rejected, (state, action) => {
      console.log('ADD REJECTED');
      state.loaded = true;
      state.error = true;
    });
    builder.addCase(addSpace.fulfilled, (state, action) => {
      console.log('ADD FULFILLED');
      state.loaded = true;
      state.error = false;
      state.space = action.payload;
    });
  },
});

export const { setSpace, setShowDialog } = rootSlice.actions;
const rootReducer = rootSlice.reducer;

const store = configureStore({
  reducer:  {
    root: rootReducer,
  },
  middleware,
});

export default store;
