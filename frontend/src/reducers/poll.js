import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { server, api } from '../server';

export const getPendingJoinPollInSpaceByName = createAsyncThunk('poll/getPendingJoinInSpaceByName', (payload) =>  {
  return server.get(api.getPendingJoinPollInSpaceByName + payload.spaceID + '/' + payload.userName)
    .then((res) => {
      return res.data;
    });
});

export const createNameRelatedPoll = createAsyncThunk('poll/createNameRelated', (poll) => {
  return server.post(api.createNameRelatedPoll, poll)
    .then((res) => {
      return res.data;
    });
});

const pollSlice = createSlice({
  name: 'poll',
  initialState: {
    poll: {}
  },
  reducers: {
    setPoll: (state, action) => {
      state.poll = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPendingJoinPollInSpaceByName.pending, (state) => {
        console.log('GET PENDING');
        state.loaded = false;
        state.error = false;
      })
      .addCase(getPendingJoinPollInSpaceByName.rejected, (state) => {
        console.log('GET REJECTED');
        state.loaded = true;
        state.error = true;
      })
      .addCase(getPendingJoinPollInSpaceByName.fulfilled, (state, action) => {
        console.log('GET FULFILLED');
        state.loaded = true;
        state.error = false;
        state.poll = action.payload;
      });

    builder
      .addCase(createNameRelatedPoll.pending, (state) => {
        console.log('ADD PENDING');
        state.loaded = false;
        state.error = false;
      })
      .addCase(createNameRelatedPoll.rejected, (state) => {
        console.log('ADD REJECTED');
        state.loaded = true;
        state.error = true;
      })
      .addCase(createNameRelatedPoll.fulfilled, (state, action) => {
        console.log('ADD FULFILLED');
        state.loaded = true;
        state.error = false;
        state.poll = action.payload;
      });
  },
});

export const { setPoll } = pollSlice.actions;
export default pollSlice.reducer;
