export type AuthMode = 'signin' | 'signup' | 'forgot-password';

export type UserRole = 'creator' | 'payee' | 'both';

export interface User {
  id: string;
  name: string;
  email?: string;
  address?: string;
  role: UserRole;
  avatarUrl?: string;
  authProvider: 'wallet' | 'email' | 'google' | 'github';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isConnectingWallet: boolean;
  activeWalletProvider?: string;
}

export interface WalletOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  installed?: boolean;
}
