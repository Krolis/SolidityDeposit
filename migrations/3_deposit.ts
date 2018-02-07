import {Deployer} from 'truffle';
import {RegisterArtifacts} from 'register';

declare const artifacts: RegisterArtifacts;

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
