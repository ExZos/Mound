import { createAsyncThunk } from '@reduxjs/toolkit';

import { server, api } from '../server';
import { setSpace } from '../store';

export function spaceMiddleware({ dispatch }) {
  return function(next) {
    return function(action) {
      switch(action.type) {
        case setSpace.toString():
          console.log(setSpace.toString());
          break;

        default:
          console.log('DEFAULT');
      }

      return next(action);
    };
  };
}

export const getSpaceByName = createAsyncThunk('root/getSpaceByName', (name) => {
  return server.get(api.getSpaceByName + name)
    .then((res) => {
      return res.data;
    });
});

export const addSpace = createAsyncThunk('root/addSpace', (space) => {
  console.log(space);
  return server.post(api.spaces, space)
    .then((res) => {
      return res.data;
    });
});
