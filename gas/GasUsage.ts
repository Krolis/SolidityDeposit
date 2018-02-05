import {RegisterArtifacts} from 'register';
import {ScriptFinalizer} from 'truffle';
import * as Web3 from 'web3';

declare const web3: Web3;
declare const artifacts: RegisterArtifacts;

const AddressRegisterContract = artifacts.require('./AddressRegister.sol');

async function asyncExec() {
    const lotOfAccounts = require('./lotOfAccounts.json');

    for(const addressesCount of [6, 60]) {
        const addresses = lotOfAccounts.splice(0, addressesCount);
        console.log(addresses.length);

        const addressRegister = await AddressRegisterContract.new();
        //console.log(addressRegister);

        for(const address of addresses){
            const addingTx = await addressRegister.registerAddress(address);
            console.log('add', addingTx.receipt.gasUsed);
            //todo sum
        }
        //todo log1 registerAddresses

        const removeTx = await addressRegister.remove(addresses[addressesCount / 2])
        console.log('remove', removeTx.receipt.gasUsed);
        //todo log 3

        const removeAllTx = await addressRegister.removeAll();
        console.log('removeall', removeAllTx.receipt.gasUsed);
        //todo log 4
    });

}

function exec(finalize: ScriptFinalizer) {
    asyncExec().then(() => finalize(), reason => finalize(reason));
}

export = exec;