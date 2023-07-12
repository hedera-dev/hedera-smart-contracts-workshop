// SPDX-License-Identifier: MIT
// NOTE: Copy smart contract
// Step (D1) in the accompanying tutorial
pragma solidity 0.8.17;

contract Trogdor {
    uint256 public constant MIN_FEE = 100;

    mapping(address => uint256) public amounts;

    event Burnination(address who, uint256 amount);

    function burninate()
        public
        payable
    {
        require(msg.sender != address(0), "zero address not allowed");
        require(msg.value >= MIN_FEE, "pay at least minimum fee");
        amounts[msg.sender] = amounts[msg.sender] + msg.value;
        emit Burnination(msg.sender, msg.value);
    }

    function totalBurnt()
        external
        view
        returns(uint256)
    {
        return address(this).balance;
    }
}
