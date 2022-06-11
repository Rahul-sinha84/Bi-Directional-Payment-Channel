import React, { useEffect, useState } from "react";
import Link from "next/link";
import { connect } from "react-redux";
import { changeMetamaskStatus } from "../redux/action";
import Utils from "./Utils";

const Header = ({ state, changeMetamaskStatus }) => {
  const { metamaskConnectFunction, currentAccount, metamaskStatus } = state;
  const [displayAddr, setDisplayAddr] = useState("");
  useEffect(() => {
    setDisplayAddr(Utils.shortHash(currentAccount));
  }, [currentAccount]);

  return (
    <div className="header">
      <div className="header__container">
        <div className="header__container--first">
          <div className="header__container--first__item">
            <Link href="/Hashes">All Hashes</Link>
          </div>
          <div className="header__container--first__item">
            <Link href="/ContractInfo">Contract Info</Link>
          </div>
          <div className="header__container--first__item">
            <Link href="/Settings">Settings</Link>
          </div>
        </div>
        <div className="header__container--second">
          <div className="header__container--second__item">
            {metamaskStatus ? (
              <>
                <div className="header__container--second__item--acc-display">
                  {displayAddr}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => metamaskConnectFunction(changeMetamaskStatus)}
                  className="header__container--second__item--cnct-btn"
                >
                  Connect Metamask
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ state });

export default connect(mapStateToProps, { changeMetamaskStatus })(Header);
