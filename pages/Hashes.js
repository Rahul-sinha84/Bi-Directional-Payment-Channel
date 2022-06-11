import React, { useEffect, useState } from "react";
import Utils from "../components/Utils";
import BigNumber from "bignumber.js";
import { connect } from "react-redux";
import { changeShowLoader } from "../redux/action";
import axios from "../axios";

const Hashes = ({ state, changeShowLoader }) => {
  const { contractInstance, currentAccount } = state;

  const [bal1, setBal1] = useState({});
  const [bal2, setBal2] = useState({});
  const [forceLoad, setForceLoad] = useState(false);
  const [isUserOne, setIsUserOne] = useState("");
  const [allHashes, setAllHashes] = useState([]);

  useEffect(() => {
    (async () => {
      changeShowLoader(true);
      await getContractData();
      await getData();
      changeShowLoader(false);
    })();
  }, [currentAccount, forceLoad]);

  const getData = async () => {
    if (!contractInstance.address) return;

    const _allHashes = await axios.get(`/${contractInstance.address}`);
    setAllHashes(_allHashes.data.data);
  };

  const getContractData = async () => {
    if (!contractInstance.address) return;

    const acc1 = await contractInstance.users(0);
    const acc2 = await contractInstance.users(1);

    const bal1 = await contractInstance.balances(acc1);
    const bal2 = await contractInstance.balances(acc2);

    const bal1BN = new BigNumber(bal1._hex);
    const bal2BN = new BigNumber(bal2._hex);

    const _isUserOne = parseInt(currentAccount, 16) === parseInt(acc1, 16);

    setIsUserOne(_isUserOne);
    setBal1(bal1BN);
    setBal2(bal2BN);
  };

  const returnComp = (data) => {
    const {
      _id,
      acc1bal,
      acc2bal,
      acc1signature = "",
      acc2signature = "",
      declined,
      isCompleted,
      contractSuccess,
    } = data;
    const dispAcc1Sign = Utils.shortHash(acc1signature);
    const dispAcc2Sign = Utils.shortHash(acc2signature);

    const acc1BN = new BigNumber(acc1bal);
    const acc2BN = new BigNumber(acc2bal);

    return (
      <div key={_id} className="hashes__container--item">
        <div className="hashes__container--item__upper">
          <div className="hashes__container--item__upper--hash">
            <div className="title">Signature #1</div>
            <div className="value">{dispAcc1Sign}</div>
          </div>
          <div className="hashes__container--item__upper--hash">
            <div className="title">Signature #2</div>
            <div className="value">{dispAcc2Sign}</div>
          </div>
          <div className="hashes__container--item__upper--status">
            <div className="title">Account #1</div>
            <div className="value">
              {acc1BN.dividedBy(10 ** 18).toFixed()} ETH
            </div>
          </div>
          <div className="hashes__container--item__upper--status">
            <div className="title">Account #2</div>
            <div className="value">
              {acc2BN.dividedBy(10 ** 18).toFixed()} ETH
            </div>
          </div>
          <div className="hashes__container--item__upper--btns">
            <button
              disabled={declined || isCompleted}
              onClick={() => declineSign(_id)}
              className={`hash-btn decline ${
                declined || isCompleted ? "disabled" : ""
              }`}
            >
              Decline
            </button>
            <button
              disabled={
                declined ||
                isCompleted ||
                (isUserOne && acc1signature) ||
                (!isUserOne && acc2signature)
              }
              className={`hash-btn sign ${
                declined ||
                isCompleted ||
                (isUserOne && acc1signature) ||
                (!isUserOne && acc2signature)
                  ? "disabled"
                  : ""
              }`}
              onClick={() =>
                signSignature(
                  [acc1BN, acc2BN],
                  _id,
                  acc1signature,
                  acc1signature
                )
              }
            >
              Sign
            </button>
            <button
              onClick={() =>
                handleChangeBalance(
                  [acc1BN, acc2BN],
                  [acc1signature, acc2signature],
                  _id
                )
              }
              disabled={declined || !isCompleted || contractSuccess}
              className={`hash-btn change-balance ${
                declined || !isCompleted || contractSuccess ? "disabled" : ""
              }`}
            >
              Change-Balance
            </button>
          </div>
        </div>
        {declined && (
          <div className="hashes__container--item__lower">
            <div className="declined-message">
              This request has being declined !!{" "}
            </div>
          </div>
        )}
      </div>
    );
  };

  const signSignature = async (amountArr, _id, prevSign1, prevSign2) => {
    if (!contractInstance.address) return alert("Contract is not connected !!");

    try {
      changeShowLoader(true);

      const _nonce = await contractInstance.nonce();
      const messageHash = await contractInstance.getMessageHash(
        [amountArr[0].toFixed(), amountArr[1].toFixed()],
        contractInstance.address,
        _nonce + 1
      );
      const { ethereum } = window;
      const signature = await ethereum.request({
        method: "personal_sign",
        params: [currentAccount, messageHash],
      });

      const response = await axios.put("/", {
        _id,
        acc1signature: isUserOne ? signature : prevSign1,
        acc2signature: !isUserOne ? signature : prevSign2,
      });

      if (response.data.status === 200) alert(response.data.message);

      setForceLoad(!forceLoad);
      changeShowLoader(false);
    } catch (err) {
      return Utils.handleError(err);
    }
  };

  const declineSign = async (signId) => {
    changeShowLoader(true);
    await axios.put("/decline", { _id: signId });
    setForceLoad(!forceLoad);
    changeShowLoader(false);
  };

  const handleChangeBalance = async (balArr, signArr, _id) => {
    if (!contractInstance.address) return alert("Contract not connected !!");

    try {
      changeShowLoader(true);
      // console.log(balArr.length);
      const _nonce = await contractInstance.nonce();
      console.log(_nonce.toNumber() + 1, signArr, [
        balArr[0].toFixed(),
        balArr[1].toFixed(),
      ]);
      const tx = await contractInstance.changeBalance(
        signArr,
        _nonce.toNumber() + 1,
        [balArr[0].toFixed(), balArr[1].toFixed()]
      );
      await tx.wait();

      const response = await axios.put("/contractSuccess", { _id });
      if (response.data.status === 200) {
        alert("Balanced Change Successfully !!");
      }
      setForceLoad(!forceLoad);
      changeShowLoader(false);
    } catch (err) {
      changeShowLoader(false);
      return Utils.handleError(err);
    }
  };

  return (
    <div className="hashes">
      <div className="hashes__container">
        {allHashes.map((val) => returnComp(val))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ state });
export default connect(mapStateToProps, { changeShowLoader })(Hashes);
