// src/Layout.tsx
import React, { ReactNode } from 'react';
import { ConnectButton } from '@iota/dapp-kit';
import { Flex, Heading } from '@radix-ui/themes';
import 'react-toastify/dist/ReactToastify.css';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[var(--cyber-bg)] text-white font-mono">
      {/* Noise & scanlines overlays */}
      <div className="noise" />
      <div className="scanlines" />

      {/* ── Sticky Glass Header ───────────────────────────────────────── */}
      <Flex
        as="header"
        position="sticky"
        top={0}
        px="4"
        py="2"
        justify="between"
        align="center"
        className="glass mx-4 mt-4 rounded-2xl shadow-md z-10"
      >
        <Heading className="text-cyber-magenta font-bold  ">
          AuditA
        </Heading>
        <ConnectButton className="glass px-4 py-2 animate-pulsate" />
      </Flex>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="w-full max-w-4xl mx-auto p-6 space-y-6">
        {children}
      </main>
    </div>
  );
}

export default Layout;
