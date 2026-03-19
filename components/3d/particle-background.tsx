"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Stars } from "@react-three/drei";
import * as THREE from "three";

const ParticleField = ({ count = 2000 }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        p[i * 3] = (Math.random() - 0.5) * 40;
        p[i * 3 + 1] = (Math.random() - 0.5) * 40;
        p[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return p;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null!);

  useFrame((state) => {
    const { mouse, clock } = state;
    const time = clock.getElapsedTime();
    
    // Slow drift
    pointsRef.current.rotation.y = time * 0.02;
    
    // Parallax effect based on mouse
    pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, mouse.x * 2, 0.05);
    pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, mouse.y * 2, 0.05);
  });

  return (
    <Points ref={pointsRef} positions={points} stride={3}>
      <PointMaterial
        transparent
        color="#a855f7"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const SpiralGalaxy = ({ count = 5000 }) => {
  const meshRef = useRef<THREE.Points>(null!);
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    
    const colorInside = new THREE.Color("#bc8df7");
    const colorOutside = new THREE.Color("#1e1b4b");

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        
        // Random spiral parameters
        const radius = Math.random() * 20;
        const spinAngle = radius * 5;
        const branchAngle = ((i % 3) * 2 * Math.PI) / 3;

        const randomX = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * radius);
        const randomY = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * radius);
        const randomZ = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * radius);

        pos[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        pos[i3 + 1] = randomY;
        pos[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // Color blending
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / 20);
        
        cols[i3] = mixedColor.r;
        cols[i3 + 1] = mixedColor.g;
        cols[i3 + 2] = mixedColor.b;
    }
    return [pos, cols];
  }, [count]);

  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
  });

  return (
    <Points ref={meshRef} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        transparent
        vertexColors
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const ShootingStars = () => {
  const starsRef = useRef<THREE.Group>(null!);
  const stars = useMemo(() => {
    return Array.from({ length: 8 }).map(() => ({
      position: [(Math.random() - 0.5) * 80, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 20] as [number, number, number],
      speed: 0.8 + Math.random() * 1.2
    }));
  }, []);

  useFrame((state) => {
    starsRef.current.children.forEach((child, i) => {
      child.position.x += stars[i].speed;
      child.position.y -= stars[i].speed * 0.4;
      
      if (child.position.x > 40 || child.position.y < -40) {
        child.position.x = -40;
        child.position.y = 40;
      }
      
      const s = state.clock.getElapsedTime() * 2 + i;
      (child.material as THREE.MeshBasicMaterial).opacity = Math.max(0, Math.sin(s) * 0.6);
    });
  });

  return (
    <group ref={starsRef}>
      {stars.map((star, i) => (
        <mesh key={i} position={star.position}>
          <planeGeometry args={[0.4, 0.01]} />
          <meshBasicMaterial color="#bc8df7" transparent opacity={0} />
        </mesh>
      ))}
    </group>
  );
};

const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#030207] pointer-events-none">
      <Canvas camera={{ position: [0, 15, 25], fov: 60 }}>
        <ParticleField count={3000} />
        <SpiralGalaxy count={8000} />
        <ShootingStars />
        <Stars radius={200} depth={50} count={15000} factor={6} saturation={1} fade speed={2} />
        
        {/* Ambient cosmic light */}
        <ambientLight intensity={0.8} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#7c3aed" />
      </Canvas>
      
      {/* Immersive Space Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_0%,#030207_90%)] opacity-70" />
      <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
    </div>
  );
};

export default ParticleBackground;
