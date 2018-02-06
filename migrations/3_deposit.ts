import { Deployer } from 'truffle';
import {RegisterArtifacts} from 'register';

declare const artifacts: RegisterArtifacts;

const Deposit = artifacts.require('./Deposit.sol');

async function deploy(deployer: Deployer) {

    await deployer.deploy(Deposit);
}

function migrate(deployer: Deployer) {
    deployer.then(() => deploy(deployer));
}

export = migrate;
