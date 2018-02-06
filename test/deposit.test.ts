import {assert} from 'chai';
import {Deposit, DepositArtifacts} from 'register';
import {ContractContextDefinition} from 'truffle';
import * as Web3 from 'web3';
import {findLastLog} from './helpers';

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
                const depositAmount: number = web3.toWei(1, 'ether');
                const depositTx = await deposit.deposit({from: owner, amount: depositAmount});
                assert.isOk(depositTx);
            });

            it('Should returns increased balance after deposit', async () => {
                const balanceBefore = await deposit.getBalance({from: owner});
                const depositAmount: number = web3.toWei(1, 'ether');

                await deposit.deposit({from: owner, value: depositAmount});

                const balanceAfter = await deposit.getBalance({from: owner});
                assert.equal(balanceBefore.toNumber() + depositAmount, balanceAfter.toNumber());
            });

            /*it('Should emit event after deposit', async () => {
                const depositAmount: number = web3.toWei(1, 'ether');
                const depositTx = await deposit.deposit({from: owner, amount: depositAmount});
                assert.isOk(findLastLog(depositTx, 'Deposited'));
                assert.equal(findLastLog(depositTx, 'Deposited').args.addr, accounts[0]);
            });*/
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
