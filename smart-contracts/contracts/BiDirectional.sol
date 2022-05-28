// SPDX-License-Identifier: MIT
pragma solidity <=0.8.4;
pragma experimental ABIEncoderV2;

import "./Hashing.sol";

contract BiDirectional is Hashing {
    address[2] public users;
    mapping(address => bool) public isUser;
    mapping(address => uint256) public balances;
    uint256 public nonce;

    uint256 public endsAt;
    uint256 public period;

    event BalanceChanged(
        address _address,
        uint256 _nonce,
        uint256 _balance1,
        uint256 _balance2
    );
    event WithdrawAmount(address _address, uint256 _amount);

    modifier checkBalance(uint256[2] memory _balances) {
        require(
            address(this).balance >= _balances[0] + _balances[1],
            "Balance of contract must be greater or equal to the balances of users !!"
        );
        _;
    }

    constructor(
        address[2] memory _users,
        uint256[2] memory _balances,
        uint256 _endsAt,
        uint256 _period
    ) payable checkBalance(_balances) {
        require(_endsAt > block.timestamp, "End date must be ahead of now !!");
        require(_period > 0, "The period should be a valid range !!");

        for (uint8 i = 0; i < users.length; i++) {
            require(!isUser[_users[i]], "Duplicate addresses not allowed !!");
            users[i] = _users[i];
            isUser[users[i]] = true;

            balances[users[i]] = _balances[i];
        }

        endsAt = _endsAt;
        period = _period;
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    modifier onlyUser() {
        require(isUser[msg.sender], "Only Users Allowed !!");
        _;
    }

    modifier checkSignatures(
        bytes[2] memory _signatures,
        uint256 _nonce,
        uint256[2] memory _balances
    ) {
        address[2] memory signers;
        for (uint256 i = 0; i < 2; i++) signers[i] = users[i];

        for (uint256 i = 0; i < 2; i++) {
            require(
                verify(
                    signers[i],
                    _balances,
                    address(this),
                    _nonce,
                    _signatures[i]
                ),
                "Invalid Signature !!"
            );
        }
        _;
    }

    function changeBalance(
        bytes[2] memory _signatures,
        uint256 _nonce,
        uint256[2] memory _balances
    )
        public
        onlyUser
        checkSignatures(_signatures, _nonce, _balances)
        checkBalance(_balances)
    {
        require(block.timestamp < endsAt, "Executing an expired contract !!");
        require(nonce < _nonce, "Wrong Nonce value !!");

        for (uint256 i = 0; i < 2; i++) balances[users[i]] = _balances[i];
        nonce = _nonce;

        endsAt = block.timestamp + period;

        emit BalanceChanged(
            msg.sender,
            nonce,
            balances[users[0]],
            balances[users[0]]
        );
    }

    function withdraw() public onlyUser {
        require(block.timestamp >= endsAt, "Period is not expired yet !!");

        uint256 amount = balances[msg.sender];
        balances[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Amount Transfer is failed !!");

        emit WithdrawAmount(msg.sender, amount);
    }
}
