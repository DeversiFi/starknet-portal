import Web3Modal from 'web3modal'

import { Layers } from '../../utils/layer'

export type WalletState = {
  [key in Layers]: Layer;
};

type Layer = {
  address: string;
  web3Modal?: Web3Modal;
  allowances: { [key: string]: number };
  balances: { [key: string]: Balance };
  web3?: any
};

export type Balance = {
  symbol: string;
  name: string;
  balance: number;
};

export type SetAllowancePayload = {
  token: string;
  allowance: number;
};

export type FetchAllowancePayload = {
  token: string;
  address: string;
};

export type ApproveTokenPayload = {
  layer: Layers;
  token: string;
  address: string;
};

export type WithdrawPayload = {
  toAddress: string;
  token: string;
  amount: string;
  transferId?: string;
};

export type DepositPayload = {
  fromAddress: string;
} & Omit<WithdrawPayload, 'transferId'>;

export type FetchBalancesPayload = {
  address: string;
};

export type SetBalancesL1Payload = {
  balances: { [key: string]: Balance };
};