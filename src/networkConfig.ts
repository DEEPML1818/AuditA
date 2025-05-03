// src/networkConfig.ts
export const networkConfig = {
  devnet: {
    jsonRpcUrl: 'https://api.devnet.iota.cafe',         // for core API calls, if you need them
    indexerUrl:  'https://indexer.devnet.iota.cafe',    // for indexation lookups :contentReference[oaicite:0]{index=0}
  },
  testnet: {
    jsonRpcUrl: 'https://api.testnet.iota.cafe',
    indexerUrl:  'https://indexer.testnet.iota.cafe',
  },
  mainnet: {
    jsonRpcUrl: 'https://api.iota.org',
    indexerUrl:  'https://indexer.iota.org',
  },
};
