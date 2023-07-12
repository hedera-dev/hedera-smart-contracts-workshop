const path = require('node:path');

const dotEnvPath = path.resolve(__dirname, '../.env');
require('dotenv').config({
  path: dotEnvPath,
});

const {
  AccountId,
  PrivateKey,
  Client,
  ContractCallQuery,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  Hbar,
  HbarUnit,
} = require('@hashgraph/sdk');

if (process.env.OPERATOR_ID == null ||
  process.env.OPERATOR_KEY == null) {
  throw new Error(
    'Environment variables OPERATOR_ID, OPERATOR_KEY are required.'
  );
}
// NOTE: Initialise operator account
// Step (F2) in the accompanying tutorial
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorPrivateKey = PrivateKey.fromString(process.env.OPERATOR_KEY);
const client = Client.forTestnet();
client.setOperator(operatorId, operatorPrivateKey);

async function main({
  contractId,
}) {
  // NOTE: Invoke payable function with zero value
  // Step (F3) in the accompanying tutorial
  // Invoke burninate with msg.value = 0
  // --> error: CONTRACT_REVERT_EXECUTED
  const scWrite1 = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(100_000)
    .setFunction(
      'burninate',
      new ContractFunctionParameters(),
    );
  const scWrite1Tx = await scWrite1.execute(client);
  try {
    const scWrite1Receipt = await scWrite1Tx.getReceipt(client);
    console.log('ContractExecuteTransaction #1', scWrite1Receipt);
  } catch (ex1) {
    console.error('ContractExecuteTransaction #1', ex1);
  }

  // NOTE: Invoke payable function with non-zero value
  // Step (F4) in the accompanying tutorial
  // Invoke burninate with msg.value = 123
  // --> succeeds
  const scWrite2 = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(100_000)
    .setPayableAmount(new Hbar(123, HbarUnit.Tinybar))
    .setFunction(
      'burninate',
      new ContractFunctionParameters(),
    );
  const scWrite2Tx = await scWrite2.execute(client);
  try {
    const scWrite2Receipt = await scWrite2Tx.getReceipt(client);
    console.log('ContractExecuteTransaction #2', scWrite2Receipt);
  } catch (ex2) {
    console.error('ContractExecuteTransaction #2', ex2);
  }

  // NOTE: Invoke view function with no parameters
  // Step (F5) in the accompanying tutorial
  // Invoke totalBurnt
  // --> multiple of 123, depending on how many times this has been invoked
  const scRead1 = new ContractCallQuery()
    .setContractId(contractId)
    .setGas(100_000)
    .setFunction(
      'totalBurnt',
      new ContractFunctionParameters(),
    )
    .setQueryPayment(new Hbar(2));
  const scRead1Tx = await scRead1.execute(client);
  const scRead1ReturnValue = scRead1Tx.getUint256();
  console.log('ContractCallQuery #1', scRead1Tx);
  console.log('return value', scRead1ReturnValue.toString());

  // NOTE: Convert account ID to EVM address
  // Step (F6) in the accompanying tutorial
  // from Account ID format to EVM address format
  // Ref: https://github.com/hedera-dev/hedera-code-snippets/blob/main/convert-hedera-native-address-to-evm-address/
  // Ref: https://stackoverflow.com/q/76680532/194982
  const operatorPublicKey = operatorPrivateKey.publicKey;
  const operatorEvmAddress = operatorPublicKey.toEvmAddress();

  // NOTE: Invoke auto-generated view function with parameters
  // Step (F7) in the accompanying tutorial
  // Invoke totalBurnt, with EVM account address parameter
  // --> multiple of 123, depending on how many times this has been invoked
  const scRead2 = new ContractCallQuery()
    .setContractId(contractId)
    .setGas(100_000)
    .setFunction(
      'amounts',
      new ContractFunctionParameters()
        .addAddress(operatorEvmAddress),
    )
    .setQueryPayment(new Hbar(2));
  const scRead2Tx = await scRead2.execute(client);
  console.log('ContractCallQuery #2', scRead2Tx);
  const scRead2ReturnValue = scRead2Tx.getUint256();
  console.log('return value', scRead2ReturnValue.toString());

  process.exit(0);
}

main({
  // NOTE: Specify deployed contract ID
  // Step (F1) in the accompanying tutorial
  // obtained by running `./deploy-sc.json`
  contractId: '0.0.474926',
});
