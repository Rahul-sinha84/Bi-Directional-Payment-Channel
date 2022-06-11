import { useEffect, useState } from "react";
import {
  contractAddress,
  checkMetamaskStatus,
  connectMetamask,
  firstFunc,
  listenToEvents,
} from "./configureMetamask";

import { connect } from "react-redux";
import {
  changeContractInstance,
  changeLoad,
  changeCurrentAccount,
  changeMetamaskConnectFunction,
  changeMetamaskStatus,
  changeNetworkId,
} from "../redux/action";

import Header from "./Header";
import Modal from "./Modal";

const Layout = ({
  children,
  changeContractInstance,
  changeMetamaskConnectFunction,
  changeCurrentAccount,
  changeLoad,
  changeNetworkId,
  changeMetamaskStatus,
  state,
}) => {
  const {
    contractInstance,
    currentAccount,
    load,
    networkId,
    metamaskStatus,
    metamaskConnectFunction,
    showLoader,
  } = state;

  const [isAllowed, setIsAllowed] = useState(false);

  //default
  useEffect(() => {
    firstFunc(
      changeContractInstance,
      changeCurrentAccount,
      changeNetworkId,
      changeMetamaskStatus
    );
    checkMetamaskStatus(
      changeMetamaskStatus,
      changeCurrentAccount,
      changeNetworkId
    );
    changeMetamaskConnectFunction(connectMetamask);
  }, []);

  // for updating the change when metamask configuration changes !!
  useEffect(() => {
    // function to update the values of state
    getContractData();
    // for listening of events
    //    listenToEvents(contract);
  }, [currentAccount, contractInstance, load]);

  const getContractData = async () => {
    if (!contractInstance.address) return;

    const _user1 = await contractInstance.users(0);
    const _user2 = await contractInstance.users(1);
    const _isAllowed =
      parseInt(_user1, 16) === parseInt(currentAccount, 16) ||
      parseInt(_user2, 16) === parseInt(currentAccount, 16);
    setIsAllowed(_isAllowed);
  };

  return (
    <>
      <Modal active={showLoader} />
      {isAllowed ? (
        <>
          <Header
            metamaskConnectFunction={metamaskConnectFunction}
            changeMetamaskStatus={changeMetamaskStatus}
          />
          {children}
        </>
      ) : (
        <>
          <h1 style={{ textAlign: "center" }}>
            You Are not Allowed for this application !!
          </h1>
          <button onClick={() => metamaskConnectFunction(changeMetamaskStatus)}>
            Connect Metamask
          </button>
        </>
      )}
    </>
  );
};

const mapStateToState = (state) => ({ state });
export default connect(mapStateToState, {
  changeContractInstance,
  changeMetamaskConnectFunction,
  changeCurrentAccount,
  changeLoad,
  changeNetworkId,
  changeMetamaskStatus,
})(Layout);
