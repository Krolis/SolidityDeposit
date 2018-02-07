import { BigNumber } from 'bignumber.js';
import { AnyNumber } from 'web3';

export function fromGwei(gwei: AnyNumber) {
  return shiftNumber(gwei, 9);
}

export function toWei(eth: AnyNumber) {
  return shiftNumber(eth, 18);
}

export function shiftNumber(num: AnyNumber, decimals: number): BigNumber {
  const factor = new BigNumber(10).pow(decimals);
  return new BigNumber(num).mul(factor);
}
