"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Environment, Float, MeshDistortMaterial, Sphere, Plane } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/hooks/useTheme";
import { useDynamicColor } from "@/hooks/useDynamicColor";

function MotionBackground() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
            meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.2;
        }
    });

    return (
        <group position={[0, 0, -5]}>
            <Float speed={3} rotationIntensity={1} floatIntensity={1}>
                {/* Technical Prism Outer */}
                <mesh ref={meshRef}>
                    <icosahedronGeometry args={[8, 1]} />
                    <meshStandardMaterial
                        color="#0ea5e9"
                        emissive="#0369a1"
                        emissiveIntensity={0.5}
                        wireframe
                        transparent
                        opacity={0.3}
                    />
                </mesh>
                {/* Solid Inner Core */}
                <mesh scale={0.5}>
                    <icosahedronGeometry args={[8, 0]} />
                    <meshStandardMaterial
                        color="#1e293b"
                        metalness={0.9}
                        roughness={0.1}
                    />
                </mesh>
            </Float>
        </group>
    );
}

function StarField({ color = "#60a5fa" }: { color?: string }) {
    const count = 3000;
    const pointsRef = useRef<THREE.Points>(null);

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 100;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (pointsRef.current) {
            const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
            pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.01;
            pointsRef.current.position.z = scrollY * 0.002;
        }
    });

    return (
        <Points ref={pointsRef} positions={positions} stride={3}>
            <PointMaterial
                transparent
                color={color}
                size={1.2}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.7}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}

function Rig() {
    const { camera, mouse } = useThree();
    const vec = new THREE.Vector3();
    useFrame(() => {
        const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
        camera.position.lerp(vec.set(mouse.x * 2, mouse.y * 1 - (scrollY * 0.005), 10), 0.05);
        camera.lookAt(0, - (scrollY * 0.005), 0);
    });
    return null;
}

export function HeroScene() {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const accentColor = useDynamicColor("/pfp.png");

    // Fallback if accentColor is transparent or not loaded
    const dynamicAccent = accentColor === "transparent" ? "#60a5fa" : accentColor;
    const bgColor = isDark ? "#020308" : "#ffffff";
    const starColor = dynamicAccent;

    return (
        <div className="fixed inset-0 -z-10 w-full h-full bg-transparent">
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 2]}>
                <Suspense fallback={null}>
                    <ambientLight intensity={isDark ? 0.5 : 0.8} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} color={dynamicAccent} />
                    <spotLight position={[0, 10, 0]} intensity={1.2} color="#ffffff" angle={0.6} penumbra={0.8} />

                    <group position={[0, 0, -5]}>
                        <Float speed={3} rotationIntensity={1} floatIntensity={1}>
                            <mesh>
                                <icosahedronGeometry args={[8, 1]} />
                                <meshStandardMaterial
                                    color={dynamicAccent}
                                    emissive={dynamicAccent}
                                    emissiveIntensity={0.5}
                                    wireframe
                                    transparent
                                    opacity={0.3}
                                />
                            </mesh>
                            <mesh scale={0.5}>
                                <icosahedronGeometry args={[8, 0]} />
                                <meshStandardMaterial
                                    color={isDark ? "#1e293b" : "#e2e8f0"}
                                    metalness={0.9}
                                    roughness={0.1}
                                />
                            </mesh>
                        </Float>
                    </group>

                    <StarField color={dynamicAccent} />
                    <Rig />

                    <Environment preset={isDark ? "night" : "warehouse"} />
                    <fog attach="fog" args={[bgColor, 5, 25]} />
                </Suspense>
            </Canvas>
            {/* Subtle overlays */}
            <div
                className="absolute inset-0 pointer-events-none opacity-60"
                style={{
                    background: `radial-gradient(circle_at_center, transparent 0%, ${bgColor} 100%)`
                }}
            />
            <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
        </div>
    );
}
