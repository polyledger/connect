import * as types from "../constants/actionTypes";

const initialState = {
  markets: []
};

export default function markets(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_MARKETS:
      return {
        markets: []
      };

    default:
      return state;
  }
}
