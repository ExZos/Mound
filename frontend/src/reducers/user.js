import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import GeneralComponent from '../components/GeneralComponent';
import { server, api } from '../server';

const generalComponent = new GeneralComponent();

export const getUserInSpaceByName = createAsyncThunk('user/getInSpaceByName', (payload) => {
  return server.get(api.getUserInSpaceByName + payload.spaceID + '/' + payload.userName)
    .then((res) => {
      generalComponent.addToSessionArrayItem('users', res.data);

      return res.data;
    });
});

export const createUserNApproveSpace = createAsyncThunk('user/createNApproveSpace', (user) => {
  return server.post(api.createUserNApproveSpace, user)
    .then((res) => {
      generalComponent.addToSessionArrayItem('users', res.data.user);

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
      .addCase(getUserInSpaceByName.pending, (state) => {
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

    builder
      .addCase(createUserNApproveSpace.pending, (state) => {
        console.log('ADD PENDING');
        state.loaded = false;
        state.error = false;
      })
      .addCase(createUserNApproveSpace.rejected, (state) => {
        console.log('ADD REJECTED');
        state.loaded = true;
        state.error = true;
      })
      .addCase(createUserNApproveSpace.fulfilled, (state, action) => {
        console.log('ADD FULFILLED');
        state.loaded = true;
        state.error = false;
        state.user = action.payload.user
        state.space = action.payload.space
      });
  },
});

export const { setUser, setUserName } = userSlice.actions;
export default userSlice.reducer;
