import * as types from "../constants/actionTypes";

/*
 * Action creators
 */

export function linkExchange() {
  return {
    type: types.LINK_EXCHANGE
  };
}

export function unlinkExchange() {
  return {
    type: types.UNLINK_EXCHANGE
  };
}

export function linkAddress() {
  return {
    type: types.LINK_ADDRESS
  };
}

export function unlinkAddress() {
  return {
    type: types.UNLINK_ADDRESS
  };
}
