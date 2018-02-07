import {Deployer} from 'truffle';
import {DepositArtifacts} from 'deposit';

declare const artifacts: DepositArtifacts;

const Migrations = artifacts.require('./Migrations.sol');

async function deploy(deployer: Deployer) {
    await deployer.deploy(Migrations);
}

function migrate(deployer: Deployer) {
    deployer.then(() => deploy(deployer));
}

export = migrate;
