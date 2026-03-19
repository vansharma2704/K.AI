"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, Torus, MeshDistortMaterial, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

const AuthShape = () => {
    const meshRef = useRef<THREE.Mesh>(null!);
    
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.x = time * 0.2;
        meshRef.current.rotation.y = time * 0.3;
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <Torus ref={meshRef} args={[4, 1.5, 32, 100]}>
                <MeshDistortMaterial
                    color="#a855f7"
                    speed={2}
                    distort={0.4}
                    roughness={0}
                    metalness={0.9}
                    emissive="#a855f7"
                    emissiveIntensity={0.5}
                />
            </Torus>
        </Float>
    );
};

const AuthBackground = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={75} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#a855f7" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <AuthShape />
      </Canvas>
    </div>
  );
};

export default AuthBackground;
