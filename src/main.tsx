import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// ✅ Styles
import './index.css';                                 // Your custom styles
import '@radix-ui/themes/styles.css';                 // Radix UI theme
import '@iota/dapp-kit/dist/index.css';               // IOTA dApp-Kit styles
import 'react-toastify/dist/ReactToastify.css';       // Toast styles

// ✅ React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ✅ IOTA dApp-Kit
import {
  createNetworkConfig,
  IotaClientProvider,
  WalletProvider
} from '@iota/dapp-kit';
import { getFullnodeUrl } from '@iota/iota-sdk/client';

// 1️⃣ Create the network config for dApp-Kit
const { networkConfig: dAppNetworks } = createNetworkConfig({
  devnet: { url: getFullnodeUrl('testnet') },         // Customize as needed
});

// 2️⃣ Set up React Query
const queryClient = new QueryClient();

// 3️⃣ Render the App with all providers
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <IotaClientProvider networks={dAppNetworks} defaultNetwork="devnet">
        <WalletProvider autoConnect>
          <App />
        </WalletProvider>
      </IotaClientProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
