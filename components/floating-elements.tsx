"use client";

import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial, Icosahedron } from "@react-three/drei";
import React from "react";

const FloatingBlob = ({ color, position, size }: { color: string, position: [number, number, number], size: number }) => (
  <Float speed={2} rotationIntensity={2} floatIntensity={2}>
    <Sphere args={[size, 32, 32]} position={position}>
      <MeshDistortMaterial color={color} distort={0.4} speed={2} />
    </Sphere>
  </Float>
);

const FloatingCrystal = ({ color, position, size }: { color: string, position: [number, number, number], size: number }) => (
  <Float speed={3} rotationIntensity={3} floatIntensity={1.5}>
    <Icosahedron args={[size, 0]} position={position}>
      <meshStandardMaterial color={color} wireframe />
    </Icosahedron>
  </Float>
);

export const FloatingElements = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <FloatingBlob color="#a855f7" position={[-3, 1.5, 0]} size={0.4} />
        <FloatingBlob color="#7c3aed" position={[3, -1.5, 0]} size={0.5} />
        <FloatingCrystal color="#6366f1" position={[2.5, 2, 0]} size={0.3} />
        <FloatingCrystal color="#a855f7" position={[-2.5, -2, 0]} size={0.3} />
      </Canvas>
    </div>
  );
};
