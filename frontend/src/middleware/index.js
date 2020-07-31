import { createAsyncThunk } from '@reduxjs/toolkit';

import { server, api } from '../server';
import { setSpace, setUser } from '../store';

export function rootMiddleware({ dispatch }) {
  return function(next) {
    return function(action) {
      switch(action.type) {
        case setSpace.toString():
        case setUser.toString():
          if(!action.payload.name) {
            action.payload.name = '';
          }
          break;

        default:
      }

      return next(action);
    };
  };
}

export const getSpaceByName = createAsyncThunk('space/getSpaceByName', (name) => {
  return server.get(api.getSpaceByName + name)
    .then((res) => {
      return res.data;
    });
});

export const addSpace = createAsyncThunk('space/addSpace', (space) => {
  return server.post(api.spaces, space)
    .then((res) => {
      return res.data;
    });
});
