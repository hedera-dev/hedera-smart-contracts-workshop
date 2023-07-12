// SPDX-License-Identifier: MIT
// NOTE: Specify solc version number
// Step (A1) in the accompanying tutorial
pragma solidity 0.8.17;

// NOTE: Specify name of smart contract
// Step (A2) in the accompanying tutorial
contract Trogdor {
    // NOTE: Primitive type state variable
    // Step (A3) in the accompanying tutorial
    uint256 public constant MIN_FEE = 100;

    // NOTE: Dynamic type state variable
    // Step (A4) in the accompanying tutorial
    mapping(address => uint256) public amounts;

    // NOTE: Specify an event
    // Step (A10) in the accompanying tutorial
    event Burnination(address who, uint256 amount);

    function burninate()
        // NOTE: Specify function modifiers
        // Step (A5) in the accompanying tutorial
        public
        payable
    {
        // NOTE: Specify condition for require
        // Step (A7) in the accompanying tutorial
        require(msg.sender != address(0), "zero address not allowed");
        // NOTE: Specify error message for require
        // Step (A8) in the accompanying tutorial
        require(msg.value >= MIN_FEE, "pay at least minimum fee");
        // NOTE: Update state
        // Step (A9) in the accompanying tutorial
        amounts[msg.sender] = amounts[msg.sender] + msg.value;
        // NOTE: Emit an event
        // Step (A11) in the accompanying tutorial
        emit Burnination(msg.sender, msg.value);
    }

    function totalBurnt()
        // NOTE: Specify function modifiers
        // Step (A5) in the accompanying tutorial
        external
        view
        // NOTE: Specify function return values
        // Step (6) in the accompanying tutorial
        returns(uint256)
    {
        return address(this).balance;
    }
}
