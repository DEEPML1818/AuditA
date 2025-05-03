// src/WalletStatus.tsx
import { useEffect, useState } from 'react';
import { useCurrentAccount } from '@iota/dapp-kit';
import OwnedObjects from './OwnedObjects';
import { networkConfig } from './networkConfig';
import { Container, Flex, Heading, Text } from '@radix-ui/themes';
import { motion } from 'framer-motion';

type AddressInfo = { balance: string };

export default function WalletStatus() {
  const account = useCurrentAccount();
  const envAddress = import.meta.env.VITE_IOTA_ADDRESS || '';
  const [balance, setBalance] = useState<string>('');
  const [error, setError]     = useState<string>('');

  useEffect(() => {
    if (account) return;  // skip REST if wallet connected

    if (!envAddress) {
      setError('No IOTA address configured (VITE_IOTA_ADDRESS)');
      return;
    }

    async function fetchBalance() {
      try {
        const res = await fetch(
          `${networkConfig.devnet.jsonRpcUrl}/api/core/v2/addresses/${envAddress}`
        );
        if (!res.ok) throw new Error(`Node responded ${res.status}`);
        const data = (await res.json()) as AddressInfo;
        setBalance(data.balance);
      } catch (e: any) {
        setError(e.message || 'Failed to fetch balance');
      }
    }

    fetchBalance();
  }, [account, envAddress]);

  // wrap Radix Container for animation
  const MotionContainer = motion(Container);

  return (
    <MotionContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 text-white space-y-4"
    >
      <Heading size="2" className="text-neonGreen">
        Wallet Status
      </Heading>

      {account ? (
        <Flex direction="column" className="space-y-1 mt-2">
          <Text className="text-neonGreen">Connected</Text>
          <Text className="text-sm break-all">{account.address}</Text>
        </Flex>
      ) : error ? (
        <Text className="text-neonPink mt-2">{error}</Text>
      ) : (
        <Flex direction="column" className="space-y-1 mt-2">
          <Text className="text-neonBlue">Using fallback address:</Text>
          <Text className="text-sm break-all text-neonBlue">
            {envAddress}
          </Text>
          <Text className="text-neonGreen">Balance: {balance} i</Text>
        </Flex>
      )}

      <hr className="border-t border-borderGlass my-4" />

      <OwnedObjects />
    </MotionContainer>
  );
}
