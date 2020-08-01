import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import { rootMiddleware } from './middleware';
import rootReducer from './reducers/root';
import spaceReducer from './reducers/space';
import userReducer from './reducers/user';
import pollReducer from './reducers/poll';

const middleware = [
  ...getDefaultMiddleware(),
  rootMiddleware,
];

const store = configureStore({
  reducer:  {
    root: rootReducer,
    space: spaceReducer,
    user: userReducer,
    poll: pollReducer,
  },
  middleware,
});

export default store;
