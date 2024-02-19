import { SET_ALERT, REMOVE_ALERT } from '../actions/include/types';

const initialState = [];

// state set as initialState
const alert = (state = initialState, action) => {
  // Pull from action
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      // Include existing state with spread operator
      // Will dispatch payload to the state
      return [...state, payload];
    case REMOVE_ALERT:
      // Filter through state array
      // Return alerts that don't match the payload
      return state.filter((alert) => alert.id !== payload);
    default:
      // Every reducer requires default state
      return state;
  }
}

export default alert;
