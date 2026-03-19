"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, Octahedron, Line } from "@react-three/drei";
import * as THREE from "three";

const Milestone = ({ position, color }: { position: [number, number, number], color: string }) => {
  return (
    <Float speed={1.5} rotationIntensity={2} floatIntensity={1}>
      <Octahedron position={position} args={[1, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} wireframe />
      </Octahedron>
    </Float>
  );
};

const RoadmapBackground = () => {
  const points = useMemo(() => {
    return [
      [-10, 5, -15],
      [-5, -2, -10],
      [2, 4, -8],
      [8, -3, -12],
      [12, 6, -18],
    ] as [number, number, number][];
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#a855f7" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {points.map((p, i) => (
          <Milestone key={i} position={p} color={i % 2 === 0 ? "#a855f7" : "#6366f1"} />
        ))}

        {/* Connecting lines */}
        {points.map((p, i) => i < points.length - 1 && (
          <Line
            key={`line-${i}`}
            points={[p, points[i+1]]}
            color="#a855f7"
            lineWidth={1}
            transparent
            opacity={0.3}
          />
        ))}
        
        {/* Distant glowing nebula */}
        <mesh position={[0, 0, -50]}>
            <planeGeometry args={[200, 200]} />
            <meshBasicMaterial color="#1e1b4b" transparent opacity={0.5} />
        </mesh>
      </Canvas>
    </div>
  );
};

export default RoadmapBackground;
