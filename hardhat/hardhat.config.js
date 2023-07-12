const path = require('node:path');

const dotEnvPath = path.resolve(__dirname, '../.env');
require('dotenv').config({
  path: dotEnvPath,
});

// populates hre.ethers, hre.waffle, enables typechain, etc
require('@nomicfoundation/hardhat-toolbox');
require('@nomicfoundation/hardhat-chai-matchers');

// import './tasks/deploy';
// import './tasks/interact';

/*
https://docs.hedera.com/hedera/tutorials/more-tutorials/json-rpc-connections/hedera-json-rpc-relay
https://docs.hedera.com/hedera/tutorials/more-tutorials/json-rpc-connections/arkhia
*/
const rpcUrlHederatestnet = process.env.RPC_URL_HEDERATESTNET;
if (!rpcUrlHederatestnet || !rpcUrlHederatestnet.startsWith('http')) {
  throw new Error(
    'Missing RPC URL in RPC_URL_HEDERATESTNET env var',
  );
}
/*
Issue the following command to generate a BIP-39 seed phrase
and save it in the env file:

npx mnemonics@1.1.3
*/
const seedPhrase = process.env.BIP39_SEED_PHRASE;
if (!seedPhrase || seedPhrase.split(' ').length < 12) {
  throw new Error(
    'Missing BIP-39 seed phrase in BIP39_SEED_PHRASE env var',
  );
}

const accounts = {
  mnemonic: seedPhrase,
  // Ref: https://github.com/hashgraph/hedera-sdk-js/blob/1a73f3f1329a48702f2a5170260bd05f186e0ca3/packages/cryptography/src/Mnemonic.js#L34
  path: "m/44'/60'/0'/0",
  // path: "m/44'/3030'/0'/0",
  initialIndex: 0,
  count: 10,
};

const hardhatConfig = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      accounts,
    },
    hederatestnet: {
      chainId: 296,
      url: rpcUrlHederatestnet,
      gasMultiplier: 1.1,
      accounts,
    },
  },
  mocha: {
    timeout: 6000000,
  },
};

module.exports = hardhatConfig;

/*
To verify that we're able to connect to Hedera Testnet successfully:

npx hardhat console --network hederatestnet

// latest block number
(await require('hardhat').network.provider.send('eth_getBlockByNumber', ['latest', false])).number

// the default EOA that will be used in deployment transactions
(await hre.ethers.getSigners())[0].address

.exit
*/
