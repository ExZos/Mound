import { setSpace } from '../reducers/space';
import { setUser } from '../reducers/user';

export function rootMiddleware({ dispatch }) {
  return function(next) {
    return function(action) {
      const reducerActions = {
        [setSpace]: () => {
          if(!action.payload.name) {
            action.payload.name = '';
          }
        },
        [setUser]: () => {
          if(!action.payload.name) {
            action.payload.name = '';
          }
        },
      };

      let currentAction = reducerActions[action.type];
      if(currentAction) {
        currentAction();
      }

      return next(action);
    };
  };
}
