import { Deployer } from 'truffle';
import {DepositArtifacts} from 'deposit';

declare const artifacts: DepositArtifacts;

const AddressRegister = artifacts.require('./AddressRegister.sol');

async function deploy(deployer: Deployer) {

    await deployer.deploy(AddressRegister);
}

function migrate(deployer: Deployer) {
    deployer.then(() => deploy(deployer));
}

export = migrate;
