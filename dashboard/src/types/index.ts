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
  txHash?: string;
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

export type AppView =
  | 'landing'
  | 'dashboard'
  | 'pools'
  | 'pool-detail'
  | 'my-earnings'
  | 'analytics'
  | 'notifications'
  | 'profile'
  | 'public-pay';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'deposit' | 'withdrawal' | 'system' | 'pool_created';
  poolAddress?: string;
  txHash?: string;
}

export * from './auth';
