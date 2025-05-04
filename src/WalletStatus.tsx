// src/WalletStatus.tsx
import { useEffect, useState } from 'react';
import { useCurrentAccount } from '@iota/dapp-kit';
import { networkConfig } from './networkConfig';
import { Container, Flex, Heading, Text } from '@radix-ui/themes';
import { motion } from 'framer-motion';

type AddressInfo = { balance: string };

export default function WalletStatus() {
  const account = useCurrentAccount();
  const envAddress = import.meta.env.VITE_IOTA_ADDRESS || '';
  const [balance, setBalance] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (account) return;

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

  const MotionContainer = motion(Container);

  return (
    <MotionContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-sm w-full mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_8px_24px_rgba(0,0,0,0.6)] text-white"
    >
      <Heading
        size="2"
        className="text-2xl font-extrabold text-center text-[#39FF14] drop-shadow-[0_0_4px_#39FF14]"
      >
        Wallet Status
      </Heading>

      {account ? (
        <Flex direction="column" className="space-y-1 mt-2">
          <Text className="text-[#39FF14] font-medium drop-shadow-[0_0_4px_#39FF14]">
            Connected
          </Text>
          <Text className="text-sm break-all">{account.address}</Text>
        </Flex>
      ) : error ? (
        <Text className="text-[#FF00C8] font-medium mt-2 drop-shadow-[0_0_4px_#FF00C8]">
          {error}
        </Text>
      ) : (
        <Flex direction="column" className="space-y-1 mt-2">
          <Text className="text-[#00FFFF] font-medium drop-shadow-[0_0_4px_#00FFFF]">
            Using fallback address:
          </Text>
          <Text className="text-sm break-all text-[#00FFFF] drop-shadow-[0_0_4px_#00FFFF]">
            {envAddress}
          </Text>
          <Text className="text-[#39FF14] font-medium drop-shadow-[0_0_4px_#39FF14]">
            Balance: {balance} i
          </Text>
        </Flex>
      )}

      <hr className="border-t border-white/20 my-4" />

     
    </MotionContainer>
  );
}
// src/WalletStatus.tsx