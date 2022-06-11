import { combineReducers } from "redux";
import {
  CONTRACT_INSTANCE,
  CURRENT_ACCOUNT,
  LOAD,
  METAMASK_CONNECT_FUNCTION,
  METAMASK_STATUS,
  NETWORK_ID,
  SHOW_LOADER,
} from "./types";

const metamaskStatus = (state = false, action) => {
  if (action.type === METAMASK_STATUS) return action.payload;
  return state;
};
const contractInstance = (state = {}, action) => {
  if (action.type === CONTRACT_INSTANCE) return action.payload;
  return state;
};
const currentAccount = (state = "", action) => {
  if (action.type === CURRENT_ACCOUNT) return action.payload;
  return state;
};
const metamaskConnectFunction = (state = {}, action) => {
  if (action.type === METAMASK_CONNECT_FUNCTION) return action.payload;
  return state;
};
const networkId = (state = "", action) => {
  if (action.type === NETWORK_ID) return action.payload;
  return state;
};
const load = (state = false, action) => {
  if (action.type === LOAD) return action.payload;
  return state;
};
const showLoader = (state = false, action) => {
  if (action.type === SHOW_LOADER) return action.payload;
  return state;
};

export default combineReducers({
  metamaskConnectFunction,
  contractInstance,
  currentAccount,
  metamaskStatus,
  networkId,
  load,
  showLoader,
});
