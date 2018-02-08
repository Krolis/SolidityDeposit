import { ScriptFinalizer } from 'truffle';
import * as Web3 from 'web3';
import {AddressRegister, DepositArtifacts} from 'deposit';

declare const web3: Web3;
declare const artifacts: DepositArtifacts;

const AddressRegisterContract = artifacts.require('./AddressRegister.sol');

async function asyncExec() {
  const lotOfAccounts = require('./lotOfAccounts.json');

  for (const addressesCount of [2, 20, 100]) {
    const addresses = lotOfAccounts.splice(0, addressesCount);
    console.log(addresses.length);

    const addressRegister: AddressRegister = await AddressRegisterContract.new();


    for (const address of addresses) {
      const addingTx = await addressRegister.registerAddress(address);
      console.log('add', addingTx.receipt.gasUsed, address);
    }

    for (const address of addresses) {
        const lookupTx = await addressRegister.isExist.estimateGas(address);

        console.log('lookup exists', lookupTx, address);
    }

/*    for (const address of addresses) {
      const removeTx = await addressRegister.remove(address);
      console.log('remove', removeTx.receipt.gasUsed, address);
    }*/

    const lookupTx = await addressRegister.isExist.estimateGas(addresses[0]);
    console.log('lookup not exists', lookupTx, addresses[0]);

    const removeAllTx = await addressRegister.removeAll();
    console.log('removeall', removeAllTx.receipt.gasUsed);
  }
}

function exec(finalize: ScriptFinalizer) {
  asyncExec().then(() => finalize(), reason => finalize(reason));
}

export = exec;
