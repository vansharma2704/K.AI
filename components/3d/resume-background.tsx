"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Box, Stars, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

const FloatingCard = ({ position, rotation, color }: { position: [number, number, number], rotation: [number, number, number], color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.z = Math.sin(time * 0.5 + position[0]) * 0.1;
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
      <Box ref={meshRef} position={position} rotation={rotation} args={[3, 4, 0.05]}>
        <meshPhysicalMaterial 
            color={color} 
            transparent 
            opacity={0.2} 
            transmission={0.9} 
            thickness={0.5} 
            roughness={0.1} 
            metalness={0.1}
            ior={1.5}
        />
      </Box>
    </Float>
  );
};

const ResumeBackground = () => {
  const cards = useMemo(() => {
    return [
      { position: [-6, 2, -5], rotation: [0.2, 0.5, 0], color: "#a855f7" },
      { position: [7, -3, -8], rotation: [-0.3, -0.4, 0.1], color: "#6366f1" },
      { position: [-2, -5, -12], rotation: [0.1, 0.2, -0.2], color: "#7c3aed" },
      { position: [4, 6, -15], rotation: [-0.1, -0.5, 0.3], color: "#ffffff" },
    ] as const;
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#a855f7" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#6366f1" />
        <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        
        {cards.map((card, i) => (
          <FloatingCard key={i} {...card} />
        ))}

        {/* Abstract scanning line effect (large plane) */}
        <mesh position={[0, 0, -20]}>
            <planeGeometry args={[100, 100]} />
            <MeshDistortMaterial
                color="#a855f7"
                distort={0.1}
                speed={2}
                opacity={0.05}
                transparent
            />
        </mesh>
      </Canvas>
    </div>
  );
};

export default ResumeBackground;
