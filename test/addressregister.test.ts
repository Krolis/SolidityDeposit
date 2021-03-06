import { assert } from 'chai';
import { ContractContextDefinition } from 'truffle';
import * as Web3 from 'web3';
import { assertReverts, findLastLog, ZERO_ADDRESS } from './helpers';
import {
  AddressesRegisterClearedEvent,
  AddressRegister,
  AddressRemovedEvent,
  DepositArtifacts
} from 'deposit';

declare const web3: Web3;
declare const artifacts: DepositArtifacts;
declare const contract: ContractContextDefinition;

const AddressRegisterContract = artifacts.require('./AddressRegister.sol');

contract('AddressRegister', accounts => {
  const owner = accounts[0];
  let addressRegister: AddressRegister;

  describe('#constructor', () => {
    it('should create contract', async () => {
      addressRegister = await AddressRegisterContract.new({ from: owner });
      assert.isOk(addressRegister);
    });
  });

  describe('#add addresses', () => {
    beforeEach(async () => {
      addressRegister = await AddressRegisterContract.new({ from: owner });
      assert.isOk(addressRegister);
    });

    it('should emit event after adding address', async () => {
      const addingTx = await addressRegister.registerAddress(accounts[0], {
        from: owner
      });
      assert.isOk(findLastLog(addingTx, 'AddressRegistered'));
      assert.equal(
        findLastLog(addingTx, 'AddressRegistered').args.addr,
        accounts[0]
      );
    });

    it('should not be able to add duplicated address', async () => {
      const addingTx = await addressRegister.registerAddress(accounts[0]);

      assert.isOk(findLastLog(addingTx, 'AddressRegistered'));
      assert.equal(
        findLastLog(addingTx, 'AddressRegistered').args.addr,
        accounts[0]
      );

      await assertReverts(async () => {
        await addressRegister.registerAddress(accounts[0]);
      });
    });

    it('should not be able to add invalid address', async () => {
      await assertReverts(async () => {
        await addressRegister.registerAddress(ZERO_ADDRESS);
      });
    });
  });

  describe('#get addresses', () => {
    const addressesToAdd = [...accounts];

    beforeEach(async () => {
      addressRegister = await AddressRegisterContract.new({ from: owner });
      assert.isOk(addressRegister);

      addressesToAdd.forEach(address => {
        addressRegister.registerAddress(address);
      });
    });

    it('should be able to get all addresses', async () => {
      const allAddresses: Address[] = await addressRegister.getAllAddresses();
      assert.equal(allAddresses.length, addressesToAdd.length);
      addressesToAdd.forEach(addr => {
        assert.isOk(allAddresses.find(addressItem => addressItem === addr));
      });
    });

    it('should be able to check if address exists', async () => {
      addressesToAdd.forEach(async addr => {
        const isExist = await addressRegister.isExisting(addr);
        assert.isTrue(isExist);
      });
    });

    it('should revert for invalid address', async () => {
      await assertReverts(async () => {
        await addressRegister.isExisting(ZERO_ADDRESS);
      });
    });

    it('should be able to check if address does not exist', async () => {
      const isExist = await addressRegister.isExisting(
        '0x2a1c7f37ff4041072cc97ba2f9c31d4e6147935e'
      );
      assert.isFalse(isExist);
    });
  });

  describe('#edit address', () => {
    const addressesToAdd = [...accounts];

    beforeEach(async () => {
      addressRegister = await AddressRegisterContract.new({ from: owner });
      assert.isOk(addressRegister);

      addressesToAdd.forEach(async address => {
        const addingTx = await addressRegister.registerAddress(address);
        assert.equal(
          findLastLog(addingTx, 'AddressRegistered').args.addr,
          address
        );
      });
    });

    const checkIfAddressExists = async (address: any) => {
      return await addressRegister.isExisting(address);
    };

    it('should be able to remove address as a owner', async () => {
      await addressRegister.remove(addressesToAdd[0], { from: owner });
      assert.isFalse(await checkIfAddressExists(addressesToAdd[0]));
    });

    it('should emit event after remove', async () => {
      const addr = addressesToAdd[1];
      const removeTx = await addressRegister.remove(addr, { from: owner });
      const log = findLastLog(removeTx, 'AddressRemoved');
      assert.isOk(log);
      const event = log.args as AddressRemovedEvent;
      assert.isOk(event);
      assert.equal(event.addr, addr);
    });

    it('should not be able to remove address as a not owner', async () => {
      await assertReverts(async () => {
        await addressRegister.remove(addressesToAdd[0], { from: accounts[1] });
      });
    });

    it('should be able to remove all as a owner', async () => {
      await addressRegister.removeAll({ from: owner });

      assert.equal((await addressRegister.getAllAddresses()).length, 0);
      addressesToAdd.forEach(async address => {
        assert.isFalse(await addressRegister.isExisting(address));
      });
    });

    it('should emit event after remove all', async () => {
      const removeTx = await addressRegister.removeAll({ from: owner });

      const log = findLastLog(removeTx, 'AddressRegisterCleared');
      assert.isOk(log);
      const event = log.args as AddressesRegisterClearedEvent;
      assert.isOk(event);
    });

    it('should not be able to remove all as not owner', async () => {
      await assertReverts(async () => {
        await addressRegister.removeAll({ from: accounts[1] });
      });
    });
  });

  describe('#integration', async () => {
    it('should exists after adding address', async () => {
      addressRegister = await AddressRegisterContract.new({ from: owner });
      await addressRegister.registerAddress(accounts[0], {
        from: owner
      });
      const isExist = await addressRegister.isExisting(accounts[0]);
      assert.isTrue(isExist);
    });

    it('should be empty after add and remove one element', async () => {
      addressRegister = await AddressRegisterContract.new({ from: owner });
      await addressRegister.registerAddress(accounts[0], {
        from: owner
      });
      assert.isTrue(await addressRegister.isExisting(accounts[0]));
      await addressRegister.remove(accounts[0], { from: owner });
      assert.isFalse(await addressRegister.isExisting(accounts[0]));
      assert.equal((await addressRegister.getAllAddresses()).length, 0);
    });

    it('should be empty after add and remove few elements', async () => {
      addressRegister = await AddressRegisterContract.new({ from: owner });
      const addresses = [accounts[0], accounts[1], accounts[2]];
      for (const addr of addresses) {
        await addressRegister.registerAddress(addr, {
          from: owner
        });
      }
      assert.equal(
        (await addressRegister.getAllAddresses()).length,
        addresses.length
      );
      for (const addr of addresses) {
        assert.isTrue(await addressRegister.isExisting(addr));
        await addressRegister.remove(addr, { from: owner });
        assert.isFalse(await addressRegister.isExisting(addr));
      }
      assert.equal((await addressRegister.getAllAddresses()).length, 0);
    });
  });
});
