export interface Payee {
  address: string;
  shares: number;
  pendingETH?: string;
  releasedETH?: string;
}

export interface Pool {
  address: string;
  name: string;
  creator: string;
  payees: Payee[];
  totalReceivedETH: string;
  blockCreated: number;
}

export interface Deposit {
  id: string;
  poolAddress: string;
  token: string;
  amount: string;
  fromAddress: string;
  txHash: string;
  blockNumber: number;
  timestamp: string;
}

export interface Withdrawal {
  id: string;
  poolAddress: string;
  payeeAddress: string;
  token: string;
  amount: string;
  txHash: string;
  blockNumber: number;
  timestamp: string;
}

export interface HealthStatus {
  lastIndexedBlock: number;
  chainHeadBlock: number;
  lagSeconds: number;
  status: 'healthy' | 'degraded' | 'syncing';
}

export * from './auth';

