const fs = require('node:fs/promises');
const path = require('node:path');

const dotEnvPath = path.resolve(__dirname, '../.env');
require('dotenv').config({
  path: dotEnvPath,
});

const {
  AccountId,
  PrivateKey,
  Client,
  FileCreateTransaction,
  ContractCreateTransaction,
} = require('@hashgraph/sdk');

if (process.env.OPERATOR_ID == null ||
  process.env.OPERATOR_KEY == null) {
  throw new Error(
    'Environment variables OPERATOR_ID, OPERATOR_KEY are required.'
  );
}
// NOTE: Initialise operator account
// Step (E1) in the accompanying tutorial
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_KEY);
const client = Client.forTestnet();
client.setOperator(operatorId, operatorKey);

async function main() {
  // NOTE: Read the EVM bytecode from file
  // Step (E2) in the accompanying tutorial
  const evmBytecode = await fs.readFile(
    './trogdor_sol_Trogdor.bin', { encoding: 'utf8' });

  // NOTE: Use HFS to store EVM bytecode on network
  // Step (E3) in the accompanying tutorial
  const fileCreate = new FileCreateTransaction()
    .setContents(evmBytecode.toString());
  const fileCreateTx = await fileCreate.execute(client);
  const fileCreateReceipt = await fileCreateTx.getReceipt(client);
  console.log('HFS FileCreateTransaction', fileCreateReceipt);
  const fileId = fileCreateReceipt.fileId;

  // NOTE: Deploy a smart contract on HSCS by referencing the bytecode on HFS
  // Step (E4) in the accompanying tutorial
  const scDeploy = new ContractCreateTransaction()
    .setBytecodeFileId(fileId)
    .setGas(100_000);
  const scDeployTx = await scDeploy.execute(client);
  const scDeployReceipt = await scDeployTx.getReceipt(client);
  console.log('HSCS ContractCreateTransaction', scDeployReceipt);
  const scId = scDeployReceipt.contractId;

  console.log(`Deployed to ${scId}`);
  process.exit(0);
}

main();
