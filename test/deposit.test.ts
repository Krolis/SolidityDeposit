import {assert} from 'chai';
import {Deposit, DepositArtifacts} from 'deposit';
import {ContractContextDefinition} from 'truffle';
import * as Web3 from 'web3';

declare const web3: Web3;
declare const artifacts: DepositArtifacts;
declare const contract: ContractContextDefinition;

const DepositContract = artifacts.require('./Deposit.sol');

contract('Deposit', accounts => {
    const owner = accounts[0];
    let deposit: Deposit;

    describe('#constructor', () => {
        it('should create contract', async () => {
            deposit = await DepositContract.new({from: owner});
            assert.isOk(deposit);
        });
    });
});
