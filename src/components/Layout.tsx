import React, { ReactNode } from 'react'
import { ConnectButton } from '@iota/dapp-kit'
import 'react-toastify/dist/ReactToastify.css'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen relative bg-cyber-bg font-futuristic text-white overflow-hidden">
      {/* overlays */}
      <div className="noise"></div>
      <div className="scanlines"></div>

      <header className="glass mx-4 mt-4 p-4 flex justify-between items-center">
        <h1 className="text-2xl text-cyber-magenta animate-pulsate">CYBER DASH</h1>
        <ConnectButton className="glass px-4 py-2 animate-pulsate" />
      </header>

      <main className="p-6 space-y-6">{children}</main>

      <footer className="glass mx-4 mb-4 p-2 text-center text-sm">
        © 2025 Cyber IOTA
      </footer>
    </div>
  )
}

export default Layout
