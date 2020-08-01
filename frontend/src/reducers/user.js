import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { server, api } from '../server';

export const getUserInSpaceByName = createAsyncThunk('user/getInSpaceByName', (payload) => {
  return server.get(api.getUserInSpaceByName + payload.spaceID + '/' + payload.userName)
    .then((res) => {
      return res.data;
    });
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
      state.user = action.payload;
    },
    setUserName: (state, action) => {
      state.user.name = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserInSpaceByName.pending, (state, action) => {
        console.log('GET PENDING');
        state.loaded = false;
        state.error = false;
      })
      .addCase(getUserInSpaceByName.rejected, (state) => {
        console.log('GET REJECTED');
        state.loaded = true;
        state.error = true;
      })
      .addCase(getUserInSpaceByName.fulfilled, (state, action) => {
        console.log('GET FULFILLED');
        state.loaded = true;
        state.error = false;
        state.user = action.payload;
      });
  },
});

export const { setUser, setUserName } = userSlice.actions;
export default userSlice.reducer;
