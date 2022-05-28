// SPDX-License-Identifier: MIT
pragma solidity <=0.8.4;

contract Hashing {
    function getMessageHash(
        uint256[2] memory _amount,
        address _contractAddress,
        uint256 _nonce
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_amount, _contractAddress, _nonce));
    }

    function verify(
        address _signer,
        uint256[2] memory _amount,
        address _contractAddress,
        uint256 _nonce,
        bytes memory _signature
    ) public pure returns (bool) {
        bytes32 _msgHash = getMessageHash(_amount, _contractAddress, _nonce);
        bytes32 _ethSignedMessageHash = getEthSignedMessageHash(_msgHash);

        return recover(_ethSignedMessageHash, _signature) == _signer;
    }

    function getEthSignedMessageHash(bytes32 _messageHash)
        public
        pure
        returns (bytes32)
    {
        return
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    _messageHash
                )
            );
    }

    function recover(bytes32 _ethSignedMessageHash, bytes memory _signature)
        public
        pure
        returns (address)
    {
        (bytes32 r, bytes32 s, uint8 v) = split(_signature);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function split(bytes memory _signature)
        public
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(_signature.length == 65, "Invalid Signature !!");

        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := byte(0, mload(add(_signature, 96)))
        }
    }
}
