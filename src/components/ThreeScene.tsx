'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';
import { Vector3 } from 'three';

// Interfaz para las props de la partícula
interface ParticleProps {
  position: [number, number, number];
  color: string;
  size: number;
  mouse: React.MutableRefObject<Vector3>;
  mouseMoved: React.MutableRefObject<boolean>;
}

// Interfaz para las props de las conexiones
interface ParticleConnectionsProps {
  particles: [number, number, number][];
}

// Interfaz para las props del sistema de partículas
interface ParticleSystemProps {
  count?: number;
}

// Componente de partícula individual
const Particle: React.FC<ParticleProps> = ({ position, color, size, mouse, mouseMoved }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const originalPosition = useRef<[number, number, number]>(position);
  const time = useRef(Math.random() * 100);
  const randomSpeed = useRef(Math.random() * 0.1 + 0.05);
  
  // Efectos de animación de partículas con springs
  const { scale } = useSpring({
    scale: hovered ? [1.8, 1.8, 1.8] : [1, 1, 1],
    config: { mass: 1, tension: 280, friction: 40 }
  });
  
  const { intensity } = useSpring({
    intensity: hovered ? 2 : 1,
    config: { mass: 1, tension: 280, friction: 60 }
  });
  
  // Animación de partículas
  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    
    // Tiempo base para animación
    time.current += 0.01;
    
    // Posición base con movimiento ondulatorio
    const baseX = originalPosition.current[0] + Math.sin(time.current * randomSpeed.current) * 0.3;
    const baseY = originalPosition.current[1] + Math.cos(time.current * randomSpeed.current * 1.1) * 0.2;
    const baseZ = originalPosition.current[2] + Math.sin(time.current * randomSpeed.current * 0.7) * 0.3;
    
    // Respuesta al mouse cuando ha habido movimiento
    if (mouseMoved.current) {
      const mouseInfluenceRadius = 1.5;
      const mousePos = mouse.current;
      
      if (mousePos) {
        // Calcular distancia al cursor
        const dx = mousePos.x - baseX;
        const dy = mousePos.y - baseY;
        const dz = mousePos.z - baseZ;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // Aplicar fuerza si está dentro del radio de influencia
        if (distance < mouseInfluenceRadius) {
          // Fuerza repulsiva
          const force = (1 - distance / mouseInfluenceRadius) * 0.15;
          const forceX = (dx / distance) * force * -1;
          const forceY = (dy / distance) * force * -1;
          const forceZ = (dz / distance) * force * -1;
          
          mesh.position.x = baseX + forceX;
          mesh.position.y = baseY + forceY;
          mesh.position.z = baseZ + forceZ;
        } else {
          mesh.position.x = baseX;
          mesh.position.y = baseY;
          mesh.position.z = baseZ;
        }
      }
    } else {
      mesh.position.x = baseX;
      mesh.position.y = baseY;
      mesh.position.z = baseZ;
    }
    
    // Efectos de respiración
    mesh.rotation.x = Math.sin(time.current * 0.3) * 0.2;
    mesh.rotation.y = Math.cos(time.current * 0.2) * 0.2;
  });
  
  // Material de partícula con bloom y glow
  return (
    <animated.mesh
      ref={meshRef}
      position={position}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[size, 12, 12]} />
      <animated.meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={intensity}
        toneMapped={false}
      />
    </animated.mesh>
  );
};

// Componente para generar conexiones entre partículas
const ParticleConnections: React.FC<ParticleConnectionsProps> = ({ particles }) => {
  const lineRef = useRef<THREE.LineSegments>(null);
  const maxDistance = 0.6; // Distancia máxima para crear conexiones
  
  useFrame(() => {
    if (!lineRef.current || particles.length === 0) return;
    
    const positionArray: number[] = [];
    const colorArray: number[] = [];
    let segmentCount = 0;
    
    // Calcular conexiones basadas en proximidad
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      const p1Pos = new Vector3(p1[0], p1[1], p1[2]);
      
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const p2Pos = new Vector3(p2[0], p2[1], p2[2]);
        
        const distance = p1Pos.distanceTo(p2Pos);
        
        if (distance < maxDistance) {
          // Calcular opacidad basada en distancia
          const opacity = 1 - (distance / maxDistance);
          
          // Añadir puntos para la línea
          positionArray.push(p1[0], p1[1], p1[2]);
          positionArray.push(p2[0], p2[1], p2[2]);
          
          // Color de la línea con opacidad
          const color = new THREE.Color(0x00ffcc);
          colorArray.push(color.r, color.g, color.b, opacity);
          colorArray.push(color.r, color.g, color.b, opacity);
          
          segmentCount++;
        }
      }
    }
    
    // Actualizar geometría
    if (segmentCount > 0) {
      const positions = new Float32Array(positionArray);
      lineRef.current.geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
      );
      
      const colors = new Float32Array(colorArray);
      lineRef.current.geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 4)
      );
      
      lineRef.current.geometry.attributes.position.needsUpdate = true;
      lineRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });
  
  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial
        vertexColors={true}
        transparent={true}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
};

// Componente principal que genera todo el sistema de partículas
const ParticleSystem: React.FC<ParticleSystemProps> = ({ count = 150 }) => {
  const [particles, setParticles] = useState<Array<[number, number, number, number, number]>>([]);
  const { viewport } = useThree();
  const mouse = useRef<Vector3>(new Vector3());
  const mouseMoved = useRef<boolean>(false);
  
  // Colores predefinidos para las partículas
  const colors = [
    "#00ffcc", // Verde neón
    "#7000ff", // Morado
    "#ff00c3", // Rosa
    "#00a3ff", // Azul
    "#ffcc00"  // Amarillo
  ].map(color => new THREE.Color(color));
  
  // Inicializar partículas
  useEffect(() => {
    const tempParticles: Array<[number, number, number, number, number]> = [];
    
    for (let i = 0; i < count; i++) {
      // Distribuir partículas en forma de esfera
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const distance = Math.random() * 3 + 2;
      
      const x = distance * Math.sin(phi) * Math.cos(theta);
      const y = distance * Math.sin(phi) * Math.sin(theta);
      const z = distance * Math.cos(phi);
      
      // Tamaño variable para las partículas
      const size = Math.random() * 0.05 + 0.02;
      
      // Color aleatorio de la paleta
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      tempParticles.push([x, y, z, size, color.getHex()]);
    }
    
    setParticles(tempParticles);
  }, [count]);
  
  // Capturar movimiento del mouse en coordenadas 3D
  useFrame(({ mouse: mousePosition, camera }) => {
    // Convertir coordenadas 2D del mouse a 3D 
    const x = (mousePosition.x * viewport.width) / 2;
    const y = (mousePosition.y * viewport.height) / 2;
    
    // Proyectar a espacio 3D
    const vector = new THREE.Vector3(x, y, 0.5);
    vector.unproject(camera);
    
    // Actualizar posición del mouse en el espacio 3D
    mouse.current = vector;
    mouseMoved.current = true;
  });
  
  return (
    <>
      {/* Sistema de partículas */}
      {particles.map((particle, i) => (
        <Particle
          key={i}
          position={[particle[0], particle[1], particle[2]]}
          size={particle[3]}
          color={`#${particle[4].toString(16).padStart(6, '0')}`}
          mouse={mouse}
          mouseMoved={mouseMoved}
        />
      ))}
      
      {/* Conexiones entre partículas */}
      <ParticleConnections
        particles={particles.map(p => [p[0], p[1], p[2]])}
      />
    </>
  );
};

// Escena principal de Three.js
const ThreeScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <Canvas 
        dpr={[1, 2]} 
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ pointerEvents: 'all' }}
      >
        {/* Cámara */}
        <PerspectiveCamera 
          makeDefault 
          position={[0, 0, 7]} 
          fov={50}
        />
        
        {/* Iluminación ambiental */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ff00c3" />
        
        {/* Sistema de partículas */}
        <ParticleSystem count={120} />
        
        {/* Controles de cámara limitados */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
};

export default ThreeScene; 