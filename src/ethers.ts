// src/ethers.ts
import { ethers } from 'ethers';
import { useMemo } from 'react';
import type { Account, Chain, Client, Transport } from 'viem';
import { Config, useConnectorClient } from 'wagmi';

/** Convert a Viem Client into an Ethers.js Signer */
export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  // transport is a Web3Provider’s provider
  const provider = new ethers.BrowserProvider(transport, network);
  return provider.getSigner(account.address);
}

/** Hook that returns an Ethers Signer (or undefined) */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId });
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client]);
}
