import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { server, api } from '../server';

export const getSpaceByName = createAsyncThunk('space/getByName', (name) => {
  return server.get(api.getSpaceByName + name)
    .then((res) => {
      return res.data;
    });
});

export const addSpace = createAsyncThunk('space/add', (space) => {
  return server.post(api.spaces, space)
    .then((res) => {
      return res.data;
    });
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
    setSpaceName: (state, action) => {
      state.space.name = action.payload
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

export const { setSpace, setSpaceName } = spaceSlice.actions;
export default spaceSlice.reducer;
