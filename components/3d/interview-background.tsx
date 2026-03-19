"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, Stars, MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";

const NeuralNode = ({ position, color, speed }: { position: [number, number, number], color: string, speed: number }) => {
  return (
    <Float speed={speed} rotationIntensity={2} floatIntensity={1}>
      <Icosahedron position={position} args={[1, 1]}>
        <MeshWobbleMaterial color={color} factor={0.6} speed={speed} roughness={0} metalness={0.8} />
      </Icosahedron>
    </Float>
  );
};

const InterviewBackground = () => {
  const nodes = useMemo(() => {
    return [
      { position: [-8, 0, -10], color: "#a855f7", speed: 2 },
      { position: [8, 4, -12], color: "#6366f1", speed: 1.5 },
      { position: [0, -6, -15], color: "#7c3aed", speed: 1.8 },
    ] as const;
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[15, 15, 15]} intensity={1.5} color="#a855f7" />
        <pointLight position={[-15, -15, -15]} intensity={1} color="#6366f1" />
        <Stars radius={100} depth={50} count={4000} factor={6} saturation={0} fade speed={2} />
        
        {nodes.map((node, i) => (
          <NeuralNode key={i} {...node} />
        ))}
        
        {/* Central brain glow */}
        <Sphere args={[3, 32, 32]} position={[0, 0, -5]}>
            <meshStandardMaterial 
                color="#a855f7" 
                emissive="#a855f7" 
                emissiveIntensity={4} 
                transparent 
                opacity={0.1} 
            />
        </Sphere>
      </Canvas>
    </div>
  );
};

import { Sphere } from "@react-three/drei";
export default InterviewBackground;
