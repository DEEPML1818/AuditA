// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Styles
import './index.css';
import '@radix-ui/themes/styles.css';
import '@iota/dapp-kit/dist/index.css';
import 'react-toastify/dist/ReactToastify.css';
import '@rainbow-me/rainbowkit/styles.css';

// React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// IOTA dApp‑Kit
import {
  createNetworkConfig,
  IotaClientProvider,
  WalletProvider as IotaWalletProvider,
} from '@iota/dapp-kit';
import { getFullnodeUrl } from '@iota/iota-sdk/client';

// wagmi & RainbowKit
import { WagmiConfig } from 'wagmi';
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { wagmiConfig } from './evmConfig';

// 1️⃣ IOTA networks
const { networkConfig: dAppNetworks } = createNetworkConfig({
  devnet: { url: getFullnodeUrl('testnet') },
});

// 2️⃣ React Query
const queryClient = new QueryClient();


// 3️⃣ RainbowKit wallets — now including projectId
// Removed unused connectors declaration from getDefaultWallets.
getDefaultWallets({
  appName: 'IOTA Move Audit',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID!,
  // chains, // ❌ Remove this line
});

// ...existing code...

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <IotaClientProvider networks={dAppNetworks} defaultNetwork="devnet">
        <IotaWalletProvider autoConnect>
          <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider theme={darkTheme()}>
              <App />
            </RainbowKitProvider>
          </WagmiConfig>
        </IotaWalletProvider>
      </IotaClientProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
// ...existing code...
