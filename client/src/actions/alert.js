// Universal random id
import { v4 as uuid } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

// Send the msg and alertType to state with generated id
export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
  // Generate random id
  const id = uuid();
  // Will be dispatched as case SET_ALERT with payload added its state array
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });

  setTimeout(
    () =>
      dispatch({
        type: REMOVE_ALERT,
        payload: id,
      }),
    timeout
  );
};
