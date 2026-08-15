/// <reference types="vite/client" />

export const ENV = {
  apiUrl: (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000',
  chainId: Number((import.meta as any).env?.VITE_CHAIN_ID || 84532),
  factoryAddress: (import.meta as any).env?.VITE_FACTORY_ADDRESS || '0x0000000000000000000000000000000000000000',
};
