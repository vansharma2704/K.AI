"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, TorusKnot, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

const ToolGear = ({ position, color, args }: { position: [number, number, number], color: string, args: [number, number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = time * 0.2;
    meshRef.current.rotation.y = time * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <TorusKnot ref={meshRef} position={position} args={args}>
        <meshStandardMaterial color={color} wireframe />
      </TorusKnot>
    </Float>
  );
};

const ToolsBackground = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#a855f7" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#6366f1" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <ToolGear position={[-7, 3, -5]} color="#a855f7" args={[1, 0.3, 128, 16]} />
        <ToolGear position={[7, -4, -8]} color="#6366f1" args={[1.5, 0.4, 128, 16]} />
        
        <mesh position={[0,0,-15]}>
            <sphereGeometry args={[10, 32, 32]} />
            <meshBasicMaterial color="#1e1b4b" wireframe transparent opacity={0.1} />
        </mesh>
      </Canvas>
    </div>
  );
};

export default ToolsBackground;
