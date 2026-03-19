"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Stars, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

const DataNode = ({ position, color }: { position: [number, number, number], color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y += Math.sin(time + position[0]) * 0.002;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} position={position} args={[0.15, 16, 16]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </Sphere>
    </Float>
  );
};

const GridFloor = () => {
    return (
        <gridHelper args={[100, 50, "#a855f7", "#1e1b4b"]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -10]} opacity={0.2} transparent />
    );
};

const DashboardBackground = () => {
  const nodes = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 5 - 5
      ] as [number, number, number],
      color: i % 2 === 0 ? "#a855f7" : "#6366f1"
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#a855f7" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <GridFloor />
        {nodes.map((node, i) => (
          <DataNode key={i} {...node} />
        ))}
        
        {/* Large abstract brain-like shape in far back */}
        <Sphere args={[10, 64, 64]} position={[0, 0, -30]}>
            <MeshDistortMaterial
                color="#7c3aed"
                distort={0.4}
                speed={1.5}
                roughness={0}
                opacity={0.1}
                transparent
            />
        </Sphere>
      </Canvas>
    </div>
  );
};

export default DashboardBackground;
