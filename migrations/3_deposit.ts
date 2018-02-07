import { Deployer } from 'truffle';
import { DepositArtifacts } from 'deposit';

declare const artifacts: DepositArtifacts;

const Deposit = artifacts.require('./Deposit.sol');
const AddressRegister = artifacts.require('./AddressRegister.sol');

async function deploy(deployer: Deployer) {
  const register = await AddressRegister.deployed();

  await deployer.deploy(Deposit, register);
}

function migrate(deployer: Deployer) {
  deployer.then(() => deploy(deployer));
}

export = migrate;
