// src/components/NeonButton.tsx
import { motion } from 'framer-motion';
import React from 'react';

interface NeonButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}

export function NeonButton({ children, onClick }: NeonButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, boxShadow: '0 0 8px #00f0ff' }}
      className="relative px-5 py-2 bg-neonPink text-black font-bold rounded-lg overflow-hidden"
    >
      {children}
      <span className="absolute inset-0 bg-gradient-to-r from-neonBlue to-neonPurple opacity-30 hover:opacity-60 transition-opacity" />
    </motion.button>
  );
}
