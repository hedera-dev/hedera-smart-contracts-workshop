// SPDX-License-Identifier: MIT
// TODO: Specify solc version number
// Step (A1) in the accompanying tutorial
pragma /* ... */;

// TODO: Specify name of smart contract
// Step (A2) in the accompanying tutorial
/* ... */ {
    // TODO: Primitive type state variable
    // Step (A3) in the accompanying tutorial
    /* ... */ public constant /* ... */ = 100;

    // TODO: Dynamic type state variable
    // Step (A4) in the accompanying tutorial
    /* ... */ public /* ... */;

    // TODO: Specify an event
    // Step (A10) in the accompanying tutorial
    /* ... */ Burnination(/* ... */);

    function burninate()
        // TODO: Specify function modifiers
        // Step (A5) in the accompanying tutorial
        /* ... */
        /* ... */
    {
        // TODO: Specify condition for require
        // Step (A7) in the accompanying tutorial
        require(/* ... */, "zero address not allowed");
        // TODO: Specify error message for require
        // Step (A8) in the accompanying tutorial
        require(msg.value >= MIN_FEE, /* ... */);
        // TODO: Update state
        // Step (A9) in the accompanying tutorial
        amounts[msg.sender] = /* ... */;
        // TODO: Emit an event
        // Step (A11) in the accompanying tutorial
        /* ... */ Burnination(/* ... */);
    }

    function totalBurnt()
        // TODO: Specify function modifiers
        // Step (A5) in the accompanying tutorial
        /* ... */
        /* ... */
        // TODO: Specify function return values
        // Step (6) in the accompanying tutorial
        /* ... */
    {
        return address(this).balance;
    }
}
