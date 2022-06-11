import BigNumber from "bignumber.js";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "../axios";
import Utils from "../components/Utils";
import { changeShowLoader } from "../redux/action";

const Settings = ({ state, changeShowLoader }) => {
  const { contractInstance, currentAccount } = state;

  const [amount, setAmount] = useState("");
  const [bal1, setBal1] = useState({});
  const [isUser1, setIsUser1] = useState(false);
  const [bal2, setBal2] = useState({});

  useEffect(() => {
    (async () => {
      changeShowLoader(true);
      await getContractData();
      changeShowLoader(false);
    })();
  }, []);

  const getContractData = async () => {
    if (!contractInstance.address) return;

    const add1 = await contractInstance.users(0);
    const add2 = await contractInstance.users(1);

    const balAdd1 = await contractInstance.balances(add1);
    const balAdd2 = await contractInstance.balances(add2);

    const _bal1 = new BigNumber(balAdd1._hex);
    const _bal2 = new BigNumber(balAdd2._hex);

    const _isUser1 = parseInt(add1, 16) === parseInt(currentAccount, 16);

    setBal1(_bal1);
    setBal2(_bal2);
    setIsUser1(_isUser1);
  };

  const sendAmount = async () => {
    console.log(isUser1 && amount > bal1.toFixed());
    if (!contractInstance.address || !bal1 || !bal2)
      return alert("Contract is not connected, try reloading the page !!");

    if (amount <= 0) return alert("Not a valid input !!");

    if (
      (isUser1 && amount > bal1.toFixed()) ||
      (!isUser1 && amount > bal2.toFixed())
    )
      return alert("Not enough funds !!");

    changeShowLoader(true);
    const index = isUser1 ? 0 : 1;
    const inputAmount = new BigNumber(amount);
    let newBal1, newBal2;
    if (isUser1) {
      newBal1 = new BigNumber(bal1.minus(inputAmount));
      newBal2 = new BigNumber(bal2.plus(inputAmount));
    } else {
      newBal2 = new BigNumber(bal2.minus(inputAmount));
      newBal1 = new BigNumber(bal1.plus(inputAmount));
    }

    const res = await axios.post("/", {
      contractAddress: contractInstance.address,
      acc1bal: newBal1,
      acc2bal: newBal2,
    });

    // const
    // const tx = await contractInstance;

    changeShowLoader(false);
    setAmount("");
  };

  const withdrawAmount = async () => {
    if (!contractInstance.address) return alert("Contract not connected !!");

    try {
      changeShowLoader(true);
      const tx = await contractInstance.withdraw();
      await tx.wait();
      changeShowLoader(false);
    } catch (err) {
      Utils.handleError(err);
      changeShowLoader(false);
    }
  };

  return (
    <div className="settings">
      <div className="settings__container">
        <div className="settings__container--item">
          <div className="settings__container--item__desc">
            Send Amount to the Address
          </div>
          <div className="settings__container--item__input">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter Amount in Wei"
              type="number"
            />
            <button onClick={sendAmount}>Send</button>
          </div>
        </div>
        <div className="settings__container--item">
          <div className="settings__container--item__desc">
            WithDraw Amount from the Contract
          </div>
          <div className="settings__container--item__input">
            <button onClick={withdrawAmount}>Withdraw</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ state });
export default connect(mapStateToProps, { changeShowLoader })(Settings);
