import {fromGwei} from './utils';

const gas = 3500000;
const gasPrice = fromGwei(31);
const host = 'localhost';
const port = 8545;

const defaults = {
    gas,
    gasPrice,
    host,
    port
};

export = {
    networks: {
        privateNet: {
            ...defaults,
            network_id: 15
        }
    }
};
