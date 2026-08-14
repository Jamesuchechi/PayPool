export const ENV = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  chainId: Number(import.meta.env.VITE_CHAIN_ID || 84532),
  factoryAddress: import.meta.env.VITE_FACTORY_ADDRESS || '0x0000000000000000000000000000000000000000',
};
