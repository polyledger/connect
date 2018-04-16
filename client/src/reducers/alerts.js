import * as types from "../constants/actionTypes";
import uuid from "uuid";

let initialState = [];

export default function alerts(state = initialState, action) {
  switch (action.type) {
    case types.ADD_ALERT:
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

    default:
      return state;
  }
}
