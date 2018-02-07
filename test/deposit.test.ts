import { assert } from 'chai';
import { ContractContextDefinition, TransactionResult } from 'truffle';
import * as Web3 from 'web3';
import { assertNumberAlmostEqual, assertReverts, findLastLog } from './helpers';
import * as tempo from '@digix/tempo';
import { Web3Utils } from '../utils';
import { AddressRegister, Deposit, DepositArtifacts } from 'deposit';

declare const web3: Web3;
declare const artifacts: DepositArtifacts;
declare const contract: ContractContextDefinition;

const utils = new Web3Utils(web3);
const DepositContract = artifacts.require('./Deposit.sol');
const AddressRegisterContract = artifacts.require('./AddressRegister.sol');

contract('Deposit', accounts => {
  const owner = accounts[0];
  const registeredAddress = accounts[1];
  const notRegisteredAddress = accounts[2];

  let addressRegister: AddressRegister;
  let deposit: Deposit;

  beforeEach(async () => {
    addressRegister = await AddressRegisterContract.new({ from: owner });
    deposit = await DepositContract.new(addressRegister.address, {
      from: owner
    });
    const registerAddressTx = await addressRegister.registerAddress(
      registeredAddress
    );
    assert.equal(
      findLastLog(registerAddressTx, 'AddressRegistered').args.addr,
      registeredAddress
    );
  });

  describe('#constructor', () => {
    it('should create contract', async () => {
      assert.isOk(deposit);
    });

    it('should set register address', async () => {
      assert.equal(await deposit.addressRegister(), addressRegister.address);
    });
  });

  describe('#deposit', () => {
    context('When is in db', () => {
      it('should be able to deposit', async () => {
        const depositAmount: number = +web3.toWei(1, 'ether');
        const depositTx: TransactionResult = await deposit.deposit({
          from: registeredAddress,
          value: depositAmount
        });
        assert.isOk(depositTx);
      });

      it('should returns increased balance after deposit', async () => {
        const account: Address = registeredAddress;
        const balanceBefore: number = (await deposit.getBalance({
          from: account
        })).toNumber();
        const depositAmount: number = +web3.toWei(1, 'ether');

        await deposit.deposit({ from: account, value: depositAmount });

        const balanceAfter: number = (await deposit.getBalance({
          from: account
        })).toNumber();
        assert.equal(balanceBefore + depositAmount, balanceAfter);
      });
    });

    context('When is not in db', () => {
      it('should not be able to deposit', async () => {
        await assertReverts(async () => {
          await deposit.deposit({ from: notRegisteredAddress, value: 100000 });
        });
      });
    });
  });

  describe('#withdraw', () => {
    const waitUntilLockExpire = tempo(web3).wait;
    const twoWeeksInSeconds = 14 * 24 * 3600;
    let balanceBefore: number;

    beforeEach(async () => {
      await deposit.deposit({
        from: registeredAddress,
        value: web3.toWei(1, 'ether')
      });
      balanceBefore = (await deposit.getBalance({
        from: registeredAddress
      })).toNumber();
      // console.log('balance ' + balanceBefore);
    });

    context('When is in db', () => {
      it('should be able to withdraw', async () => {
        const account = registeredAddress;
        const withdrawAmount: number = parseInt(web3.toWei(1, 'ether'), 10);
        const accountBalanceBefore: number = (await utils.getBalance(
          account
        )).toNumber();

        await waitUntilLockExpire(twoWeeksInSeconds + 100);
        await deposit.withdraw(withdrawAmount, { from: account });

        const balanceAfter: number = (await deposit.getBalance({
          from: account
        })).toNumber();
        const accountBalanceAfter: number = (await utils.getBalance(
          account
        )).toNumber();

        assert.equal(balanceBefore - withdrawAmount, balanceAfter);
        assertNumberAlmostEqual(
          accountBalanceBefore + withdrawAmount,
          accountBalanceAfter,
          parseInt(web3.toWei(0.5, 'ether'), 10)
        );
      });

      it('should revert if balance too small', async () => {
        await assertReverts(async () => {
          await deposit.withdraw(balanceBefore + 1, {
            from: registeredAddress
          });
        });
      });
    });
  });
});
