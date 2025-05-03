import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function FloatingMesh() {
  const mesh = useRef<any>();
  useFrame(({ clock }) => {
    mesh.current.rotation.y = clock.getElapsedTime() * 0.1;
    mesh.current.position.x = Math.sin(clock.getElapsedTime()) * 2;
  });
  return (
    <mesh ref={mesh} position={[0, 0, -10]}>
      <dodecahedronGeometry args={[4, 0]} />
      <meshStandardMaterial color="#00f0ff" transparent opacity={0.2} />
    </mesh>
  );
}

export default function ParallaxBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5] }}
      style={{ position: 'fixed', inset: 0, zIndex: -1 }}
    >
      <ambientLight intensity={0.3} />
      <FloatingMesh />
    </Canvas>
  );
}
