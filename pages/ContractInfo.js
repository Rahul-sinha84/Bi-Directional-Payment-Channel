import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import BigNumber from "bignumber.js";
import Utils from "../components/Utils";
import { changeShowLoader } from "../redux/action";

const ContractInfo = ({ state, changeShowLoader }) => {
  const [acc1, setAcc1] = useState("");
  const [acc2, setAcc2] = useState("");
  const [period, setPeriod] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [balAcc1, setBalAcc1] = useState("");
  const [balAcc2, setBalAcc2] = useState("");
  const [contractBal, setContractBal] = useState("");

  const { contractInstance } = state;

  useEffect(() => {
    (async () => {
      changeShowLoader(true);
      await getData();
      changeShowLoader(false);
    })();
  }, []);

  const getData = async () => {
    if (!contractInstance.address) return;

    const _acc1 = await contractInstance.users(0);
    const _acc2 = await contractInstance.users(1);
    const _period = await contractInstance.period();
    const _endsAt = await contractInstance.endsAt();
    const _contractBal = await contractInstance.getContractBalance();
    const _balAcc1 = await contractInstance.balances(_acc1);
    const _balAcc2 = await contractInstance.balances(_acc2);

    const reqContractBal = new BigNumber(_contractBal._hex);
    const contractBalWei = reqContractBal.dividedBy(10 ** 18).toFixed();

    const reqBalAcc1 = new BigNumber(_balAcc1._hex);
    const reqBalAcc1Wei = reqBalAcc1.dividedBy(10 ** 18).toFixed();

    const reqBalAcc2 = new BigNumber(_balAcc2._hex);
    const reqBalAcc2Wei = reqBalAcc2.dividedBy(10 ** 18).toFixed();

    const reqPeriod = _period.toNumber() / (24 * 60 * 60 * 1000);
    const date = new Date(_endsAt.toNumber());
    console.log(date, _endsAt);
    const dateVisible = `${date.getDate()} ${Utils.getMonthbyNumber(
      date.getMonth() + 1
    )} ${date.getFullYear()}`;

    setAcc1(_acc1);
    setAcc2(_acc2);
    setPeriod(reqPeriod);
    setEndsAt(dateVisible);
    setContractBal(contractBalWei);
    setBalAcc1(reqBalAcc1Wei);
    setBalAcc2(reqBalAcc2Wei);
  };

  return (
    <div className="contract-info">
      <div className="contract-info__container">
        <div className="contract-info__container--item">
          <div className="contract-info__container--item__desc">Account #1</div>
          <div className="contract-info__container--item__value">{acc1}</div>
        </div>
        <div className="contract-info__container--item">
          <div className="contract-info__container--item__desc">Account #2</div>
          <div className="contract-info__container--item__value">{acc2}</div>
        </div>
        <div className="contract-info__container--item">
          <div className="contract-info__container--item__desc">
            Contract Balance
          </div>
          <div className="contract-info__container--item__value">
            {contractBal} ETH
          </div>
        </div>
        <div className="contract-info__container--item">
          <div className="contract-info__container--item__desc">
            Account #1's Balance
          </div>
          <div className="contract-info__container--item__value">
            {balAcc1} ETH
          </div>
        </div>
        <div className="contract-info__container--item">
          <div className="contract-info__container--item__desc">
            Account #2's Balance
          </div>
          <div className="contract-info__container--item__value">
            {balAcc2} ETH
          </div>
        </div>
        <div className="contract-info__container--item">
          <div className="contract-info__container--item__desc">Period</div>
          <div className="contract-info__container--item__value">
            {period} day/s
          </div>
        </div>
        <div className="contract-info__container--item">
          <div className="contract-info__container--item__desc">End date</div>
          <div className="contract-info__container--item__value">{endsAt}</div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ state });

export default connect(mapStateToProps, { changeShowLoader })(ContractInfo);
