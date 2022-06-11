import {
  CONTRACT_INSTANCE,
  CURRENT_ACCOUNT,
  LOAD,
  METAMASK_CONNECT_FUNCTION,
  METAMASK_STATUS,
  NETWORK_ID,
  SHOW_LOADER,
} from "./types";

export const changeMetamaskStatus = (payload) => ({
  type: METAMASK_STATUS,
  payload,
});
export const changeContractInstance = (payload) => ({
  type: CONTRACT_INSTANCE,
  payload,
});
export const changeCurrentAccount = (payload) => ({
  type: CURRENT_ACCOUNT,
  payload,
});
export const changeMetamaskConnectFunction = (payload) => ({
  type: METAMASK_CONNECT_FUNCTION,
  payload,
});
export const changeNetworkId = (payload) => ({ type: NETWORK_ID, payload });
export const changeLoad = (payload) => ({ type: LOAD, payload });
export const changeShowLoader = (payload) => ({ type: SHOW_LOADER, payload });
