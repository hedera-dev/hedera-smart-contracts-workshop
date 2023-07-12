# Intro - Hedera Smart Contracts Workshop

## What smart contracts are, and are not

The term "smart contracts" is kind of a poor choice for a name,
and is the source of a lot of confusion:
Smart contracts are neither smart, and neither are they contracts.

They are, at their core, simply computer programs that are executable.
So what is the big deal about them then?
What makes them different from "regular" computer programs?
The biggest one, that you probably know already, is that they are executed on blockchains/ DLTs.
But there are a few others to be aware of:

- They are typically executed within a VM
- Any state changes need to be agreed upon through network consensus
- Any state queries return values agreed upon by network consensus
- While their state is mutable, their code is not

Combine the above with the decentralised nature of blockchains/ DLTs,
and you get a special breed of computer programs like no other:
Deterministic, p2p execution, that is censorship resistant and interruption resistant.

You can use this powerful technology within the Hedera network too,
via the Hedera Smart Contract Service.
This workshop will show you how!

## Prerequisites

Prior knowledge
- Javascript syntax
- Hedera network core concepts

System
- `git` installed
	- Minimum version: 2.37
	- [Install Git (Github)](https://github.com/git-guides/install-git)
- NodeJs + `npm` installed
	- Minimum version of NodeJs: 18
	- Recommended for Linux & Mac: [`nvm`](https://github.com/nvm-sh/nvm)
	- Recommended for Windows: [`nvm-windows`](https://github.com/coreybutler/nvm-windows)
- Google chrome installed: [Chrome](https://www.google.com/chrome/)
- Metamask chrome extension installed: [Metamask](https://metamask.io/)
- POSIX-compliant shell
	- For Linux & Mac: The shell that ships with the operating system will work. Either `bash` or `zsh` will work.
	- For Windows: The shell that ships with the operating system (`cmd.exe`, `powershell.exe`) will *not* work. Recommended alternatives: WSL/2, or git-bash which ships with git-for-windows.
- Internet connection

## Set up the project

This has already been (mostly) done. All that's left for you to do is clone the [accompanying tutorial GitHub repository](https://github.com/hedera-dev/hedera-smart-contracts-workshop) and install the dependencies:

```sh
git clone -b completed git@github.com:hedera-dev/hedera-smart-contracts-workshop.git
cd hedera-smart-contracts-workshop
npm install
```

{% hint style="info" %}
If you do not have SSH available on your system, or are unable to configure it for GitHub, you may wish to try this git command instead:\
\
`git clone -b completed https://github.com/hedera-dev/hedera-smart-contracts-workshop.git`
{% endhint %}


## Configuration

### Step B1: Environment variables file

In the root directory of the repo, you will find a file named `.env.example`.
Make a copy of this file, and name it `.env`.

```shell
cp .env.example .env
```

### Step B2: Operator account

An operator account is used to obtain an initial sum of HBAR on Hedera Testnet,
and then use that to pay for various Hedera network operations.
This includes everything from basic transactions, to gas fees for HSCS interactions.

Visit the [Hedera Portal](https://portal.hedera.com/) to get started.

* (1) Create a Testnet account.

<figure>
	<img src="https://i.stack.imgur.com/tgkvS.png" alt="" width="375">
	<figcaption>Hedera Portal  - Create Testnet Account</figcaption>
</figure>

* (2) Copy-paste the confirmation code sent to your email.

<figure>
	<img src="https://i.stack.imgur.com/4H9XT.png" alt="" width="375">
	<figcaption>Hedera Portal - Email Verification</figcaption>
</figure>

* (3) Fill out this form with details for your profile.

<figure>
	<img src="https://i.stack.imgur.com/atW69.png" alt="" width="375">
	<figcaption>Hedera Portal - Profile Details</figcaption>
</figure>

* (4) In the top-left there is a drop down menu, select between Hedera Testnet (default) and Previewnet:

<figure>
	<img src="https://i.stack.imgur.com/2A2ua.png" alt="" width="563">
	<figcaption>Hedera Portal - Select Network</figcaption>
</figure>

* (5) From the next screen that shows your accounts, copy the value of the "**DER-encoded private key**" and replace `OPERATOR_KEY` in the `.env` file with it.

<figure>
	<img src="https://i.stack.imgur.com/MrBx0.png" alt="" width="563">
	<figcaption>Hedera Portal - Account Details</figcaption>
</figure>

* (6) From the same screen, copy the value of "**Account ID**" and replace the value of the `OPERATOR_ID` variable in the `.env` file with it.

### Step B3: Seed phrase

When developing smart contracts, you often need more than 1 account to do so.
Thankfully we do not need to go through the somewhat cumbersome process
of creating multiple accounts via the Hedera Portal -
you only really need to do that once for the operator account.

Any subsequent accounts that you wish to create can be generated programmatically,
and funded with HBAR from your operator account.

To do so, we will utilise something called a **seed phrase**,
which is a sequence of selected dictionary words chosen at random.
This process is defined in BIP-39.

Subsequently, we will use that seed phrase as an input and generate multiple accounts;
each of which consists of a private key, a public key, and an address.
This process is defined in BIP-44.

{% hint style="info" %}
- "BIP" stands for Bitcoin Improvement Proposal.
- "EIP" stands for Ethereum Improvement Proposal, and was preceded by "ERC" which stands for Ethereum Request for Comments.
- "HIP" stands for Hedera Improvement Proposal.
{% endhint %}

Interestingly these 2 BIPs were never adopted by the Bitcoin community,
but are almost de-facto used by everyone in the Ethereum community.
On Hedera, you can use these 2 BIPs to generate Hedera EVM accounts,
but this is not possible for Hedera-native accounts
(as they use a different type of public key algorithm).

{% hint style="info" %}
ECDSA (Elliptic Curve Digital Signing Algorithm) is a public key algorithm, and secp256k1 is a particular configuration that may be used by the ECDSA algorithm.  
  
EdDSA (Edwards Digital Signing Algorithm) is another public key algorithm, and Ed25519 is a particular configuration that may be used by the EdDSA algorithm.

Both Bitcoin and Ethereum use ECDSA with secp256k1 for their accounts.

Hedera native accounts use EdDSA with Ed25519,
and Hedera EVM accounts use ECDSA with secp256k1.
{% endhint %}

Enough theory - let's generate a seed phrase!

```shell
npx mnemonics@1.1.3
```

This will output 12 dictionary words to the shell.
Copy these words, and replace the value of the `BIP39_SEED_PHRASE` variable
in the `.env` file with this.

[Ref: BIP-39 Mnemonic code for generating deterministic keys](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)

[Ref: BIP-44: Multi-Account Hierarchy for Deterministic Wallets](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)

### Step B4: Fund several Hedera EVM accounts

At this point, you have an operator account, which is already funded with HBAR,
and you have a seed phrase.
Let's generate more accounts based on the seed phrase ,
and then transfer HBAR to them from the operator account.

First switch to the `intro` directory, and install dependencies using npm.

```
cd ./intro
npm install
```

Next, let's use a script already prepared for you.
We want this script to generate 4 Hedera EVM accounts,
and transfer 100 HBAR to each of them,
so let's set those values in `generate-evm-accounts.js`.

```javascript
const NUM_ACCOUNTS = 4;
const AMOUNT_PER_ACCOUNT = 100;
const HD_PATH = "m/44'/60'/0'/0";
```

{% hint style="info" %}
Above, we're using `m/44'/60'/0'/0` as the derivation path.
This is the Ethereum derivation path, and we need it because Metamask
hardcodes this value as a constant, and does not allow it to be configured.
{% endhint %}

Run this script.

```shell
node ./generate-evm-accounts.js
```

This should output something similar to the following:

```text
EVM account #0 generated.
#0     HD path: m/44'/60'/0'/0/0
#0 Private key: 3030020100300706052b8104000a04220420fb11afc5d508036ac7a9df9f1eb7cea551e4a7b738c2c70da099fe5f379f3364
#0  Public key: 302d300706052b8104000a032200027a753c29cc9f0ea0b6ccf0614676daeba3da0dbd5f54ef9850ad3878ded4e077
#0 EVM address: 07ffaadfe3a598b91ee08c88e5924be3eff35796
EVM account #1 generated.
#1     HD path: m/44'/60'/0'/0/1
#1 Private key: 3030020100300706052b8104000a042204206e3ff9f1f1ae58248a5838ec877acc55d103009586224d76ab74a652d408cf12
#1  Public key: 302d300706052b8104000a03220002c4c2ed7a682a601c9c61dec42e87442b63893a6e5efdf6dc327a4b3bcc62aba9
#1 EVM address: 1c29e31d241f0d06f3763221f5224a6b82f09cce
EVM account #2 generated.
#2     HD path: m/44'/60'/0'/0/2
#2 Private key: 3030020100300706052b8104000a042204203ccfcb41922c242e955cdba0245c3cddc88c45ea84eab4f2a0416a7978b2f897
#2  Public key: 302d300706052b8104000a03220002fa66a7e8c206f1678457524690011a1deedbea413eadec83cf7d2cb1d3b6fece
#2 EVM address: 9a814b5afd6b0fff1e9548dcba4d09cdd8c81568
EVM account #3 generated.
#3     HD path: m/44'/60'/0'/0/3
#3 Private key: 3030020100300706052b8104000a0422042054c156c865a054c6134a1bd282d6803f60763326c3293fbea33853919532e2e2
#3  Public key: 302d300706052b8104000a03220002cb32b5529854dc2c754b8c365d6060de0cb8a209aab44fedf4e74efa74460fcd
#3 EVM address: a80eb8ed3c3c78bee1de8391f89ddd6873bf695d
```

### Check funding of EVM accounts on Hashscan

Copy the transaction ID from (the final line of) the output from the previous step,
and visit Hashscan, and search for that ID.
You should get to a "Transaction" page,
e.g. `https://hashscan.io/testnet/transaction/1689772989.212011003`.

Scroll down to the "Transfers" section,
which should graphically depict the flow of HBAR between various accounts.
In this case `-400` (and a fractional amount of `-0.00185217`)
from the operator account,
`+100.00000000` to each of the 4 EVM accounts,
and fractional amounts to a couple of other accounts to pay for transaction processing.
(Note that the fractional amounts may vary, they won't necessarily be `0.00185217` as above.)

Now you should have 1 Hedera-native account (previously funded),
plus 4 new EVM accounts (freshly funded).

### Address formats

Hedera networks have a native account address format,
called the *Account ID*.
An example of this would be: `0.0.3996280`.

Hedera also supports EVM account address formats.
This has 2 variants:

The *EVM Address Alias*.
An example of this would be: `0x7394111093687e9710b7a7aeba3ba0f417c54474`.
This is sometimes referred to as the *non-long-zero* address.

The *Account Num Alias*.
An example of this would be: `0x00000000000000000000000000000000003cfa78`.
This is sometimes referred to as the *long-zero* address.

Finally Hedera also supports a *Key Alias*,
and this is something that you're unlikely to encounter in most situations.

While you may choose to interact with the Hedera network using any of the address formats,
when interacting with smart contracts, the *EVM Address Alias* is the most useful,
as that is what is visible and understood by smart contracts when they are invoked.

[Ref: HIP-583 - Expand alias support in CryptoCreate & CryptoTransfer Transactions](https://hips.hedera.com/hip/hip-583)

[Ref: hedera-code-snippets - Convert address from Hedera-native (`S.R.N`) format to EVM (`0x...`) format](https://github.com/hedera-dev/hedera-code-snippets/tree/main/convert-hedera-native-address-to-evm-address)

[Ref: Stackoverflow - How to convert a Hedera native address into a non-long-zero EVM address?](https://stackoverflow.com/q/76680532/194982)

### Step B5: RPC endpoint

For this step, you have a choice:

- Run your own Hedera RPC Relay server: [Configuring Hedera JSON-RPC Relay endpoints](https://docs.hedera.com/hedera/tutorials/more-tutorials/json-rpc-connections/hedera-json-rpc-relay)
- Use an RPC service provider, Arkhia: [Configuring Arkhia RPC endpoints](https://docs.hedera.com/hedera/tutorials/more-tutorials/json-rpc-connections/arkhia)

Copy these words, and replace the value of the `BIP39_SEED_PHRASE` variable
in the `.env` file with this.

Whichever method you choose,
obtain the JSON-RPC URL for Hedera Testnet,
and replace the value of the `RPC_URL_HEDERATESTNET` variable
in the `.env` file with this.

## Solidity syntax

Open and edit `intro/trogdor.sol`.

### Comments

In Solidity, comment syntax is similar to what you might be familiar with from Javascript.
Single line comments use `//`, and extend till the rest of the line.
Multi-line comments use `/*` to begin, and `*/`  to end.

```solidity
// single line comment

/* this is a
multi-line
comment. */
```

### SPDX License

[SPDX](https://spdx.org/licenses/) defines a list of software licenses,
and allows you to reference one using a standard short identifier.
The solidity compiler will explicitly check for this as a comment
in the first line of any Solidity file.
If it is missing, it will output a warning.

```solidity
// SPDX-License-Identifier: MIT
```

### Step A1: Specify solc version number

{% hint style="info" %}
Near the top of the file, you should see the following comment:

```solidity
// NOTE: specify solc version number
// Step (A1) in the accompanying tutorial
```

Note that this type of comment will be present throughout the
tutorial repo that accompanies this written tutorial.
Each numbered step in of a *section heading* here
corresponds to the the same number in a *comment* there.
In the subsequent steps of this tutorial, you will follow the same pattern as above. However, this tutorial does not repeat the comments marking the steps for the remainder of the tutorial and instead only include the new/changed lines of code.
{% endhint %}

The pragmas simply defines the which version of the Solidity compiler, `solc`,
it is intended to be compiled with.

```solidity
pragma solidity 0.8.17;
```

Here we simply specify that this file should be compiled with version `0.8.17` only.
You may specify more complex rules, similar to `semver` used by npm.

[Ref: Solidity version pragma](https://docs.soliditylang.org/en/develop/layout-of-source-files.html#version-pragma)

### Step A2: Specify name of smart contract

A smart contract is a grouping of state variables, functions, and other things.
The solidity code needs to group them, and does so by surrounding them
with a pair of squiggly brackets (`{` and `}`).
It also needs a name - and we'll name this one `Trogdor`.

```solidity
contract Trogdor {
```

### Step A3: Primitive type state variable

A smart contract persists its state on the virtual machine,
and may only be modified during a successful transaction on the network.
Solidity supports many different primitive types,
here let's use `uint256` as we'll be representing a an unsigned integer value.

```solidity
	uint256 public MIN_FEE = 100;
```

The above would work, but in this case,
we know that we will not be modifying its value,
so instead of a state variable,
let's use a state constant instead.
This is achieved by adding the `constant` keyword to it.

```solidity
	uint256 public constant MIN_FEE = 100;
```

[Ref: Solidity value types](https://docs.soliditylang.org/en/develop/types.html#value-types)

### Step A4: Dynamic type state variable

Smart contracts can also persist more complex types of data in its state,
and this is accomplished using dynamic state variables.
A `mapping` is used to represents key-value pairs,
and is analogous to a Hashmap in other programming languages.

```solidity
	mapping(address => uint256) public amounts;
```

This mapping stores key-value pairs where the keys are of type `address`,
and the values are of type `uint256`.

[Ref: Solidity mapping type](https://docs.soliditylang.org/en/develop/types.html#mapping-types)

Note that both `MIN_FEE` and `amounts` have a visibility modifier of `public`.
In other cases you might want `internal` or `private`,

[Ref: Solidity State Variable Visibility](https://docs.soliditylang.org/en/develop/contracts.html#state-variable-visibility)

### Functions

Functions are the main part of the smart contract where things actually happen:
Code is executed, and perhaps state is accessed or updated.
The syntax of a function is somewhat similar to Javascript,
with the main differences being the addition of types, and of modifiers.

```solidity
function doSomething(uint256 param1)
	public
	pure
	returns(uint256)
{
	return param1;
}
```

In the above example:

- Name: `doSomething`
- Modifiers: `public`, `pure`
- Parameter name: `param1`
- Parameter type: `uint256`
- Return type: `uint256`

- function
- function syntax


### Step A5: Specify function modifiers

The `burninate` function modifies the state of the smart contract,
and also accepts payment (in HBAR),
so let's go with `public`, `payable` for its modifiers.

```solidity
        public
        payable
```

The `totalBurnt` function does not modify the state of the smart contract,
but does access the state.
It does not accept any payment.
It is intended to only be called by an Externally Owned Account (EOA)
or another smart contract.
For this let's go with `external`, `view` for its modifiers.

```solidity
        external
        view
```

Just like state variables, functions may have the have visibility modifiers
`public`, `private`, and `internal`;
however `external` is a new one, and may apply only to functions.

[Ref: Solidity function visibility modifiers](https://docs.soliditylang.org/en/develop/cheatsheet.html#function-visibility-specifiers)


### Step A6: Specify function return values

The `totalBurnt` function performs a query of the smart contract's state.
Therefore it should reply with this information.
This is done through the `returns` keyword,
which specifies the type of the returned value.

```solidity
		returns(uint256)
```

In this case, the function returns a single value of type `uint256`.
which specifies one or more return values.
Note that Solidity allows functions to return multiple return values,
for example `returns(uint256, address)` would mean that
it returns both a `uint256` and an `address`.

### Special values accessible within a function

When a smart contract function is invoked,
it has access to values that are passed in as parameters.
It also has access to the state variables persisted by the smart contract.

Additionally, there are also several special values that are
specific to the current block (group of transactions)
or specific to the current transaction that are also accessible.
Two of these are `msg.sender` and `msg.value`.

[Ref: Solidity block and transaction properties]

### Step A7: Specify condition for require

The `require` function is used to check for specific conditions within a function invocation.
If these conditions are not met, it throws an exception.
This causes the function invocation to be reverted,
meaning the state of the smart contract would remain as it was before,
as if the function invocation was never made.

```solidity
        require(msg.sender != address(0), "zero address not allowed");
```

Within the `burninate` function, we use a `require` to ensure that
the transaction is not ostensibly from the null address,
also known as the zero address.
This essentially disallows any transactions sent from that particular address

{% hint style="info" %}
Technically it should not be possible for a transaction to be sent by the zero address.
This is done here purely for illustrative purposes.
{% endhint %}

[Ref: Solidity panic and require](https://docs.soliditylang.org/en/develop/control-structures.html#panic-via-assert-and-error-via-require)

### Step A8: Specify error message for require

We have another `require` in this function to ensure that the amount paid (in HBAR)
is at least above a certain threshold (the `MIN_FEE` constant).

```solidity
        require(msg.value >= MIN_FEE, "pay at least minimum fee");
```

This function is is `payable`, meaning that any value (of HBAR)
sent along with the function gets deducted from the balance of the sender's account,
and gets added to the balance of the smart contract's account.
In other words: The transaction sender pays into the smart contract via this function.

{% hint style="info" %}
The numeric value of `msg.value` is not denominated in HBAR,
but rather tinybar, when a smart contract is deployed on a Hedera network.
This is consistent with `msg.value` being denominated not in Ether,
but rather in wei, when a smart contract is deployed on an Ethereum network.

There is a key difference though:
- 1 HBAR = 10^8 tinybar (10 million)
- 1 Ether = 10^18 wei (1 billion billion)
{% endhint %}

In functions which are not `payable`, `msg.value` is guaranteed to be zero.
Whereas in functions which are `payable`, `msg.value` could be zero **or more**.
In this case, the intent is for the function to reject any function invocations
which do not pay enough.

[Ref: Solidity Ether units](https://docs.soliditylang.org/en/develop/units-and-global-variables.html#ether-units)

[Ref: Stackoverflow full unit of HBAR](https://stackoverflow.com/q/76123094/194982)

### Step A9: Update state

After all the checks are completed (by the `require` statements),
we're ready to update the persisted state of this smart contract.
In this case, we are keeping track, as a running tally,
of the total amount paid by each different address that this function has been invoked with.

```solidity
        amounts[msg.sender] = amounts[msg.sender] + msg.value;
```

This statement increments the current value by the amount paid into the function,
keyed on the address that invoked this function.

[Ref: Solidity operators](https://docs.soliditylang.org/en/develop/types.html#operators)

[Ref: Solidity mapping types](https://docs.soliditylang.org/en/develop/types.html#mapping-types)

### Step A10: Specify an event

The EVM outputs logs, which essentially is information that is persisted on the network,
but **not** accessible by smart contracts.
Instead they are intended to be accessed by client applications (such as DApps),
which typically search for specific events,
or listen for specific events.

The canonical use case for events within a smart contract is to
create a "history" of actions performed by that smart contract.
In this case, let's commemorate each time the `burninate` function
is successfully invoked.

```solidity
    event Burnination(address who, uint256 amount);
```

This `event` is named `Burnination`,
and whenever it is produced, it is added  to the EVM logs,
and will contain an `address` and a `uint256`.

### Step A11:  Emit an event

Once the `event` has been defined,
the smart contract should specify exactly when it should be added to the EVM logs.
This is done using `emit`.

```solidity
        emit Burnination(msg.sender, msg.value);
```

Thus, based on where this `emit` statement is located within the function,
this `event` is added to the logs upon each time the `burninate` function is invoked,
only if both of the `require` statements are satisfied.
When it gets added the transaction sender's address
and the amount that they paid into the function are logged.

{% hint style="info" %}
Note that this particular smart contract does not include any means to take out the
HBAR balance that accrues within it over time each time `burninate` is invoked.
This effectively means that the HBAR sent into it is stuck there forever,
and hence is effectively lost.

Trogdor would be proud ;)
{% endhint %}

## Software libraries and developer tools

Before we go further with the implementation,
let's take a look at the various software libraries and developer tools that
you will need to be familiar with when working with smart contracts on HSCS.

[Hedera SDK JS](https://github.com/hashgraph/hedera-sdk-js)
is a software library that contains functions designed to interact the all
of the services available on the Hedera network:
HCS, HTS, HFS, and HSCS.
That includes smart contracts.

Both [EthersJs](https://docs.ethers.org/v5/)
and [Web3Js](https://web3js.readthedocs.io/en/v1.10.0/)
are software libraries that contain functions designed to interact with
the Ethereum network, and any other EVM-compatible networks.
This means that you can use them to interact with HSCS as well
(but not with HCS, HTS, or HFS).

In this workshop, we will be using both Hedera SDK JS and EthersJs.

We've already seen some Solidity syntax,
but we cannot just take the Solidity code and ask HSCS,
or any other EVM implementation for that matter, to run it.
Instead we need [`solc`](https://docs.soliditylang.org/en/v0.8.19/),
the Solidity compiler, to compile it into EVM bytecode,
which can then be executed by any EVM implementation,
including the one in HSCS.

Worth pointing out that Solidity is not the only game in town.
You can actually write smart contracts in any language,
as long as it compiled to EVM bytecode.
The most popular alternative smart contract programming language is
[Vyper](https://docs.vyperlang.org/en/stable/).

In this workshop we will be using Solidity.

[Truffle Suite](https://trufflesuite.com/),
[Hardhat](https://hardhat.org/),
and [Foundry](https://getfoundry.sh/)
are developer frameworks that are designed to make it easier to
work with smart contract development workflows
by providing various utilities, scripts, structure, and documentation
that are useful during development.

In this workshop we will be using Hardhat.
