import * as types from "../constants/actionTypes";

const initialState = {};

export default function accounts(state = initialState, action) {
  switch (action.type) {
    case types.LINK_EXCHANGE:
      return {};
    case types.UNLINK_EXCHANGE:
      return {};
    case types.LINK_ADDRESS:
      return {};
    case types.UNLINK_ADDRESS:
      return {};

    default:
      return state;
  }
}
