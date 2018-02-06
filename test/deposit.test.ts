import {assert} from 'chai';
import {Deposit, DepositArtifacts} from 'register';
import {ContractContextDefinition, TransactionResult} from 'truffle';
import * as Web3 from 'web3';
import {assertNumberAlmostEqual, assertReverts, findLastLog, getBalance, promisify} from './helpers';
import * as tempo from '@digix/tempo';

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
            it('should be able to deposit', async () => {
                const depositAmount: number = +web3.toWei(1, 'ether');
                const depositTx: TransactionResult = await deposit.deposit({from: owner, amount: depositAmount});
                assert.isOk(depositTx);
            });

            it('should returns increased balance after deposit', async () => {
                const balanceBefore: number = await deposit.getBalance({from: owner});
                const depositAmount: number = +web3.toWei(1, 'ether');

                await deposit.deposit({from: owner, value: depositAmount});

                const balanceAfter: number = (await deposit.getBalance({from: owner})).toNumber();
                assert.equal(balanceBefore + depositAmount, balanceAfter);
            });

            /*it('Should emit event after deposit', async () => {
                const depositAmount: number = web3.toWei(1, 'ether');
                const depositTx = await deposit.deposit({from: owner, amount: depositAmount});
                assert.isOk(findLastLog(depositTx, 'Deposited'));
                assert.equal(findLastLog(depositTx, 'Deposited').args.addr, accounts[0]);
            });*/
        });

        context('When is not in db', () => {
            it('should not be able to deposit', async () => {
                await assertReverts(async () => {
                    await deposit.deposit({from: accounts[1], value: 100000});
                });
            });
        });
    });

    describe('#withdraw', () => {
        const waitUntilLockExpire = tempo(web3).wait;
        const twoWeeksInSeconds = 14 * 24 * 3600;
        let balanceBefore: number;

        beforeEach(async () => {
            await deposit.deposit({from: owner, value: web3.toWei(1, 'ether')});
            balanceBefore = (await deposit.getBalance({from: owner})).toNumber();
            // console.log('balance ' + balanceBefore);
        });

        context('When is in db', () => {
            it('should be able to withdraw', async () => {
                const withdrawAmount: number = parseInt(web3.toWei(1, 'ether'), 10);
                const accountBalanceBefore: number = (await getBalance(owner)).toNumber();

                await waitUntilLockExpire(twoWeeksInSeconds + 100);
                await deposit.withdraw(withdrawAmount, {from: owner});

                const balanceAfter: number = (await deposit.getBalance({from: owner})).toNumber();
                const accountBalanceAfter: number = (await getBalance(owner)).toNumber();

                assert.equal(balanceBefore - withdrawAmount, balanceAfter);
                assertNumberAlmostEqual(accountBalanceBefore + withdrawAmount,
                    accountBalanceAfter,
                    parseInt(web3.toWei(0.5, 'ether'), 10));
            });

            it('Should revert if balance too small', async () => {
                await assertReverts(async () => {
                    await deposit.withdraw(balanceBefore + 1, {from: owner});
                });
            });
        });

        context('When is not in db', () => {
            // should we handling this situations or just return balance ( probably 0 )
            /*it('Should not be able to withdraw', async () => {

            });*/
        });
    });
});
