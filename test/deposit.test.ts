import { assert } from 'chai';
import { ContractContextDefinition, TransactionResult } from 'truffle';
import * as Web3 from 'web3';
import {
  assertNumberAlmostEqual,
  assertNumberEqual,
  assertReverts,
  findLastLog
} from './helpers';
import * as tempo from '@digix/tempo';
import { toWei, Web3Utils } from '../utils';
import { AddressRegister, Deposit, DepositArtifacts } from 'deposit';
import BigNumber from 'bignumber.js';

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
        const depositAmount: BigNumber = toWei(1);
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
    let balanceBefore: BigNumber;

    beforeEach(async () => {
      await deposit.deposit({
        from: registeredAddress,
        value: web3.toWei(1, 'ether')
      });
      balanceBefore = await deposit.getBalance({
        from: registeredAddress
      });
    });

    context('When is in db', () => {
      it('should be able to withdraw', async () => {
        const account = registeredAddress;
        const withdrawAmount: BigNumber = toWei(1);
        const accountBalanceBefore: BigNumber = await utils.getBalance(account);

        await waitUntilLockExpire(twoWeeksInSeconds + 100);
        await deposit.withdraw(withdrawAmount, { from: account });

        const balanceAfter: BigNumber = await deposit.getBalance({
          from: account
        });
        const accountBalanceAfter: number = (await utils.getBalance(
          account
        )).toNumber();

        assertNumberEqual(balanceBefore.minus(withdrawAmount), balanceAfter);
        assertNumberAlmostEqual(
          accountBalanceBefore.add(withdrawAmount),
          accountBalanceAfter,
          toWei(0.5)
        );
      });

      it('should revert if balance too small', async () => {
        await assertReverts(async () => {
          await deposit.withdraw(balanceBefore.add(1), {
            from: registeredAddress
          });
        });
      });
    });
  });
});
