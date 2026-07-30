"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  Float, 
  Sphere, 
  MeshDistortMaterial, 
  MeshWobbleMaterial, 
  Points, 
  PointMaterial,
  Environment,
  ContactShadows,
  PerspectiveCamera
} from "@react-three/drei";
import * as THREE from "three";

const CoreSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = time * 0.1;
    meshRef.current.rotation.y = time * 0.15;
    
    // Mouse follow subtlety
    const mouseX = state.mouse.x * 2;
    const mouseY = state.mouse.y * 2;
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mouseX, 0.05);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mouseY, 0.05);
  });

  return (
    <mesh ref={meshRef}>
      <Sphere args={[2, 64, 64]}>
        <MeshDistortMaterial
          color="#a855f7"
          speed={3}
          distort={0.4}
          radius={1}
          roughness={0}
          metalness={1}
          emissive="#7c3aed"
          emissiveIntensity={0.5}
        />
      </Sphere>
      
      {/* Outer wireframe shell */}
      <Sphere args={[2.2, 32, 32]}>
        <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.1} />
      </Sphere>
    </mesh>
  );
};

const HaloSystem = () => {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        groupRef.current.rotation.z = time * 0.2;
        groupRef.current.rotation.y = -time * 0.1;
    });

    return (
        <group ref={groupRef}>
            {[1, 1.2, 1.4].map((scale, i) => (
                <mesh key={i} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
                    <torusGeometry args={[3 * scale, 0.015, 16, 100]} />
                    <meshStandardMaterial 
                        color={i === 0 ? "#a855f7" : i === 1 ? "#6366f1" : "#ffffff"} 
                        emissive={i === 0 ? "#a855f7" : i === 1 ? "#6366f1" : "#ffffff"}
                        emissiveIntensity={2}
                        transparent
                        opacity={0.3}
                    />
                </mesh>
            ))}
        </group>
    );
};

const BrainParticles = () => {
  const count = 1000;
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.5 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = r * Math.cos(phi);
    }
    return p;
  }, []);

  const pointsRef = useRef<THREE.Points>(null!);

  useFrame((state) => {
    pointsRef.current.rotation.y += 0.001;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#a855f7"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const AISphere = () => {
  return (
    <div className="w-full h-full min-h-[500px] relative pointer-events-auto">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#a855f7" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#6366f1" />
        <spotLight position={[0, 5, 10]} angle={0.25} penumbra={1} intensity={2} color="#ffffff" castShadow />
        
        <CoreSphere />
        <HaloSystem />
        <BrainParticles />
        
        <Environment preset="city" />
        <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={20} blur={24} far={4.5} />
      </Canvas>
    </div>
  );
};

export default AISphere;
