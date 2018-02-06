import {assert} from 'chai';
import {Deposit, DepositArtifacts} from 'register';
import {ContractContextDefinition} from 'truffle';
import * as Web3 from 'web3';

declare const web3: Web3;
declare const artifacts: DepositArtifacts;
declare const contract: ContractContextDefinition;

const DepositContract = artifacts.require('./Deposit.sol');

contract('Deposit', accounts => {
    const owner = accounts[0];

    let deposit: Deposit;

    beforeEach(async () => {
        deposit = await DepositContract.new({from: owner});
    });

    describe('#constructor', () => {
        it('should create contract', async () => {
            assert.isOk(deposit);
        });
    });

    describe('#deposit', () => {
        context('When is in db', () => {
            it('Should be able to deposit', async () => {
                assert.fail();
            });
        });


        context('When is not in db', () => {
            it('Should not be able to deposit', async () => {
                assert.fail();
            });
        });
    });

    describe('#withdraw', () => {
        context('When is not in db', () => {
            it('Should be able to withdraw', async () => {
                assert.fail();
            });
        });

        context('When is not in db', () => {
            it('Should not be able to withdraw', async () => {
                assert.fail();
            });
        });
    });
});
