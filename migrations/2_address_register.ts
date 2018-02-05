import { RegisterArtifacts } from 'register';
import { Deployer } from 'truffle';

declare const artifacts: RegisterArtifacts;

const AddressRegister = artifacts.require('./AddressRegister.sol');

async function deploy(deployer: Deployer) {

    await deployer.deploy(AddressRegister);
}

function migrate(deployer: Deployer) {
    deployer.then(() => deploy(deployer));
}

export = migrate;
