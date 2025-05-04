// src/evmConfig.ts
import { createConfig, http } from 'wagmi';
import { mainnet, type Chain } from 'wagmi/chains';

// ─── 1) Define your IOTA‑EVM Testnet chain ────────────────────────────────
export const shimmerEvm: Chain = {
  id: 1075,
  name: 'IOTA EVM Testnet',
  rpcUrls: {
    default: { http: ['https://json-rpc.evm.testnet.iotaledger.net'] },
    public:  { http: ['https://json-rpc.evm.testnet.iotaledger.net'] },
  },
  nativeCurrency: { name: 'IOTA', symbol: 'IOTA', decimals: 18 },
  blockExplorers: {
    default: {
      name: 'Explorer',
      url: 'https://explorer.evm.testnet.iotaledger.net',
    },
  },
  testnet: true,
};

// ─── 2) Create the wagmi config ────────────────────────────────────────────
export const wagmiConfig = createConfig({
  // List all chains your app will support
  chains: [shimmerEvm, mainnet],

  // Per‑chain JSON‑RPC transports—use your Testnet URL for IOTA EVM,
  // and default RPC for mainnet.
  transports: {
    [shimmerEvm.id]: http(shimmerEvm.rpcUrls.default.http[0]),
    [mainnet.id]:    http(),
  },
});

// (Optional) export the chains array for RainbowKit or manual connector setup
export const chains = [shimmerEvm, mainnet];
