import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(t);
  }, []);
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <h1
        className="glitch-text text-6xl font-bold"
        data-text="CYBER PULSE"
      >
        CYBER PULSE
      </h1>
    </div>
  );
}
