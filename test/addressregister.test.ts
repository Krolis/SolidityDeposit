import { assert } from 'chai';

import * as Web3 from 'web3';

import { AddressRegister, RegisterArtifacts } from 'register';

import { ContractContextDefinition } from 'truffle';
import {
  assertNumberEqual,
  assertReverts,
  findLastLog,
  ZERO_ADDRESS
} from './helpers';

declare const web3: Web3;
declare const artifacts: RegisterArtifacts;
declare const contract: ContractContextDefinition;

const AddressRegisterContract = artifacts.require('./AddressRegister.sol');

contract('AddressRegister', accounts => {
  const owner = accounts[0];
  let addressRegister: AddressRegister;

  describe('#ctor', () => {
    it('should create contract', async () => {
      addressRegister = await AddressRegisterContract.new({ from: owner });
      assert.isOk(addressRegister);
    });
  });
});
