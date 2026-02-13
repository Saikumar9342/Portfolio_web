"use client";

import { useRef, Suspense, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function ScrollableObject({ scrollProgress }: { scrollProgress: number }) {
    const groupRef = useRef<THREE.Group>(null);
    const objectRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (groupRef.current) {
            // Smooth rotation based on scroll
            groupRef.current.rotation.x = scrollProgress * Math.PI * 3;
            groupRef.current.rotation.y = scrollProgress * Math.PI * 2;
        }

        // Animate the main object
        if (objectRef.current) {
            objectRef.current.rotation.x += 0.001;
            objectRef.current.rotation.y += 0.002;
            
            // Scale based on scroll for emphasis
            const scale = 1 + scrollProgress * 0.2;
            objectRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            {/* Single elegant rotating object - Icosahedron representing projects/portfolio */}
            <mesh ref={objectRef} position={[0, 0, 0]}>
                <icosahedronGeometry args={[3, 4]} />
                <meshStandardMaterial
                    color="#00d4ff"
                    emissive="#0ea5e9"
                    emissiveIntensity={0.6}
                    metalness={0.85}
                    roughness={0.15}
                    wireframe={false}
                    transparent
                    opacity={0.95}
                />
            </mesh>

            {/* Subtle glow ring around the object */}
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 3, 0, 0]}>
                <torusGeometry args={[4, 0.3, 16, 100]} />
                <meshStandardMaterial
                    color="#60a5fa"
                    emissive="#00d4ff"
                    emissiveIntensity={0.4}
                    metalness={0.7}
                    roughness={0.2}
                    wireframe={true}
                    transparent
                    opacity={0.4}
                />
            </mesh>
        </group>
    );
}



function ScrollDrivenCamera({ scrollProgress }: { scrollProgress: number }) {
    const { camera } = useThree();

    useFrame(() => {
        // Smooth easing function for camera movement
        const easeScroll = scrollProgress * scrollProgress; // ease-out
        
        // Camera orbits around objects as you scroll
        const distance = 12 - scrollProgress * 2; // Zoom in as scroll increases
        const angle = scrollProgress * Math.PI * 4;
        
        camera.position.x = Math.cos(angle) * distance;
        camera.position.z = Math.sin(angle) * distance + 10;
        camera.position.y = 3 + easeScroll * 5;
        
        camera.lookAt(0, 0, 0);
    });

    return null;
}

interface PanoramaSceneProps {
    scrollProgress?: number;
}

export function PanoramaScene({ scrollProgress = 0 }: PanoramaSceneProps) {
    const [currentScroll, setCurrentScroll] = useState(scrollProgress);

    useEffect(() => {
        const handleScroll = () => {
            const scrollingElement = window.document.scrollingElement || window.document.body;
            const totalHeight = scrollingElement.scrollHeight - window.innerHeight;
            const progress = totalHeight > 0 ? scrollingElement.scrollTop / totalHeight : 0;
            // Smooth scroll progress (0 to 1)
            setCurrentScroll(Math.min(Math.max(progress, 0), 1));
        };

        // Use passive listener for smooth scrolling
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <Canvas 
            camera={{ position: [0, 3, 12], fov: 75, near: 0.1, far: 1000 }} 
            dpr={[1, 2]}
            className="!absolute inset-0"
            gl={{ antialias: true, alpha: true }}
        >
            <Suspense fallback={null}>
                {/* Simplified lighting for single object */}
                <ambientLight intensity={0.35} />
                <pointLight position={[0, 0, 20]} intensity={1.8} color="#00d4ff" distance={120} decay={2} />
                <pointLight position={[15, 15, 0]} intensity={0.6} color="#60a5fa" distance={80} decay={2} />
                <pointLight position={[-15, -15, 0]} intensity={0.4} color="#0ea5e9" distance={80} decay={2} />
                <directionalLight position={[10, 10, 5]} intensity={0.4} color="#ffffff" />

                {/* Portfolio 3D Object that responds to scroll */}
                <ScrollableObject scrollProgress={currentScroll} />
                <ScrollDrivenCamera scrollProgress={currentScroll} />
            </Suspense>
        </Canvas>
    );
}

