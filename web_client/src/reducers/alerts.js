import * as types from "../constants/actionTypes";
import uuid from "uuid";

let initialState = [];

export default function alerts(state = initialState, action) {
  switch (action.type) {
    case types.ADD_ALERT:
      if (state.length >= 1) {
        if (state[state.length - 1].text === action.text) {
          // The previous error is the same, so don't add a duplicate alert.
          return state;
        }
      }
      return [
        ...state,
        {
          id: uuid(),
          text: action.text,
          style: action.style,
          icon: action.icon
        }
      ];
    case types.REMOVE_ALERT:
      return state.filter(alert => {
        return alert.id !== action.id;
      });

    case types.CLEAR_ALERTS:
      return [];

    default:
      return state;
  }
}
