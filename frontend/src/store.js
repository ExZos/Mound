import { configureStore, getDefaultMiddleware, createSlice } from '@reduxjs/toolkit';
import { rootMiddleware, getSpaceByName, addSpace } from './middleware/index';

const middleware = [
  ...getDefaultMiddleware(),
  rootMiddleware,
];

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

const spaceSlice = createSlice({
  name: 'space',
  initialState: {
    space: {
      name: ''
    }
  },
  reducers: {
    setSpace: (state, action) => {
      state.space = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSpaceByName.pending, (state) => {
        console.log('GET PENDING');
        state.loaded = false;
        state.error = false;
      })
      .addCase(getSpaceByName.rejected, (state) => {
        console.log('GET REJECTED');
        state.loaded = true;
        state.error = true;
      })
      .addCase(getSpaceByName.fulfilled, (state, action) => {
        console.log('GET FULFILLED');
        state.loaded = true;
        state.error = false;
        state.space = action.payload;
      });

    builder
      .addCase(addSpace.pending, (state, action) => {
        console.log('ADD PENDING');
        state.loaded = false;
        state.error = false;

      })
      .addCase(addSpace.rejected, (state, action) => {
        console.log('ADD REJECTED');
        state.loaded = true;
        state.error = true;
      })
      .addCase(addSpace.fulfilled, (state, action) => {
        console.log('ADD FULFILLED');
        state.loaded = true;
        state.error = false;
        state.space = action.payload;
      });
  },
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {
      name: ''
    }
  },
  reducers: {
    setUser: (state, action) => {
      if(!action.payload.name) {
        action.payload.name = '';
      }

      state.user = action.payload;
    },
  },
  extraReducers: {

  },
});

export const { setShowDialog } = rootSlice.actions;
export const { setSpace } = spaceSlice.actions;
export const { setUser } = userSlice.actions;

const rootReducer = rootSlice.reducer;
const spaceReducer = spaceSlice.reducer;
const userReducer = userSlice.reducer;

const store = configureStore({
  reducer:  {
    root: rootReducer,
    space: spaceReducer,
    user: userReducer,
  },
  middleware,
});

export default store;
