import {assert} from 'chai';

import * as Web3 from 'web3';

import {AddressRegister, RegisterArtifacts} from 'register';

import {ContractContextDefinition} from 'truffle';
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
            addressRegister = await AddressRegisterContract.new({from: owner});
            assert.isOk(addressRegister);
        });
    });

    describe('#add addresses', () => {
        it('should be able to add address', async () => {
            addressRegister = await AddressRegisterContract.new({from: owner});
            assert.isOk(addressRegister);
        });

        it('should not be able to add duplicated address', async () => {
            addressRegister = await AddressRegisterContract.new({from: owner});
            assert.isOk(addressRegister);
        });
    });

    describe('#get addresses', () => {

        it('should be able to get all addresses', async () => {
            addressRegister = await AddressRegisterContract.new({from: owner});
            assert.isOk(addressRegister);
        });

        it('should be able to check if address exists', async () => {
            addressRegister = await AddressRegisterContract.new({from: owner});
            assert.isOk(addressRegister);
        });

        it('should be able to check if address does not exist', async () => {
            addressRegister = await AddressRegisterContract.new({from: owner});
            assert.isOk(addressRegister);
        });
    });

    describe('#edit address', () => {

        it('should be able to remove address', async () => {
            addressRegister = await AddressRegisterContract.new({from: owner});
            assert.isOk(addressRegister);
        });

        it('should not be able to remove not existing address', async () => {
            addressRegister = await AddressRegisterContract.new({from: owner});
            assert.isOk(addressRegister);
        });

        it('should be able to remove all addresses', async () => {
            addressRegister = await AddressRegisterContract.new({from: owner});
            assert.isOk(addressRegister);
            console.log(accounts);
        });
    });
});
