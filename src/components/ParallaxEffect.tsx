'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// Tipos para el componente de paralaje
interface ParallaxLayerProps {
  children: React.ReactNode;
  depth?: number; // Factor de profundidad (0-1 donde 0 es primer plano y 1 es fondo)
  speed?: number; // Velocidad de movimiento
  className?: string;
}

// Componente para capas con efecto de paralaje
export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  depth = 0.5,
  speed = 1,
  className = '',
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Calcular el movimiento basado en la profundidad y velocidad
  const yRange = useMemo(() => 
    speed > 0 ? [0, -100 * depth * speed] : [0, 100 * Math.abs(depth * speed)]
  , [depth, speed]);
  
  // Aplicar spring para suavizar el movimiento
  const smoothY = useSpring(
    useTransform(scrollYProgress, [0, 1], yRange),
    { damping: 15, stiffness: 55 }
  );

  return (
    <motion.div 
      ref={ref}
      style={{ y: smoothY }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Componente de sección con efecto de paralaje
interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className = '',
  id,
}) => {
  return (
    <section id={id} className={`relative overflow-hidden w-full ${className}`}>
      {children}
    </section>
  );
};

// Hook personalizado para añadir efectos de revelación con scroll
export const useParallaxReveal = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1 1"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

  return {
    ref,
    opacity,
    y,
    scale,
  };
};

// Componente para crear efecto 3D en tarjetas
interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  glare?: boolean;
  borderColor?: string;
  glowColor?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  depth = 20,
  glare = true,
  borderColor = 'border-[#00ffcc]/40',
  glowColor = 'after:bg-[#00ffcc]/10',
  onClick,
  onMouseEnter,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showGlare, setShowGlare] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Pre-calcular transformaciones basadas en la posición del mouse
  const cardTransform = useMemo(() => {
    const { x, y } = position;
    return {
      transform: `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) scale3d(${isHovering ? 1.05 : 1}, ${isHovering ? 1.05 : 1}, 1)`,
    };
  }, [position.x, position.y, isHovering]);

  // Pre-calcular el estilo del destello si está activo
  const glareStyle = useMemo(() => {
    if (!glare) return {};
    const { x, y } = position;
    const glareX = (x / depth) * 100 + 50;
    const glareY = (y / depth) * 100 + 50;
    
    return {
      background: showGlare 
        ? `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 60%)` 
        : 'none',
      opacity: showGlare ? 0.15 : 0,
    };
  }, [glare, showGlare, position.x, position.y, depth]);

  // Controlador de movimiento del mouse para crear el efecto 3D
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calcular centro de la tarjeta
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calcular posición relativa del mouse
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Convertir a grados de rotación (con límites)
    const rotateX = (-mouseY / (rect.height / 2)) * depth;
    const rotateY = (mouseX / (rect.width / 2)) * depth;
    
    setPosition({ x: rotateY, y: rotateX });
    setShowGlare(true);
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setShowGlare(false);
    setIsHovering(false);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovering(true);
    if (onMouseEnter) onMouseEnter();
    handleMouseMove(e);
  };

  return (
    <div 
      ref={cardRef}
      className={`relative transition-transform duration-150 overflow-hidden ${className}`}
      style={cardTransform}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
    >
      {children}
      
      {/* Borde con brillo */}
      <div className={`absolute inset-0 pointer-events-none border rounded-xl ${borderColor} ${isHovering ? 'opacity-100' : 'opacity-40'} transition-opacity duration-300`} />
      
      {/* Efecto de brillo posterior */}
      <div className={`absolute inset-0 pointer-events-none rounded-xl ${glowColor} ${isHovering ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 after:absolute after:inset-0 after:rounded-xl`} />
      
      {/* Efecto de destello */}
      {glare && (
        <div 
          className="absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-300"
          style={glareStyle}
        />
      )}
    </div>
  );
};

// Implementación del componente de indicador de scroll
interface ScrollDotProps {
  index: number;
  currentSection: number;
  onClick: (index: number) => void;
}

const ScrollDot: React.FC<ScrollDotProps> = ({ 
  index, 
  currentSection,
  onClick
}) => {
  const isActive = index === currentSection;
  
  return (
    <div 
      className={`w-3 h-3 my-1 rounded-full cursor-pointer transition-all duration-300 ${
        isActive 
          ? 'bg-[#00ffcc] scale-[1.3] shadow-[0_0_8px_#00ffcc]' 
          : 'bg-white/30 hover:bg-white/50'
      }`}
      onClick={() => onClick(index)}
    />
  );
};

interface ScrollIndicatorProps {
  count: number;
  sectionIds?: string[];
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ 
  count,
  sectionIds = [] 
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const dots = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);
  
  // Efecto para detectar la sección visible
  useEffect(() => {
    if (sectionIds.length === 0) return;
    
    const sectionElements = sectionIds.map(id => document.getElementById(id));
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      for (let i = 0; i < sectionElements.length; i++) {
        const section = sectionElements[i];
        if (!section) continue;
        
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          setCurrentSection(i);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Llamar al inicio para establecer la sección actual
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);
  
  // Función para scrollear a la sección al hacer clic en el indicador
  const scrollToSection = (index: number) => {
    if (index < sectionIds.length) {
      const sectionId = sectionIds[index];
      const section = document.getElementById(sectionId);
      
      if (section) {
        window.scrollTo({
          top: section.offsetTop,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center z-50 gap-1">
      {/* Barra de progreso para indicar posición de scroll */}
      <div className="absolute h-full w-0.5 bg-white/10 -z-10 rounded-full" />
      
      {/* Indicador visual de progreso */}
      <motion.div 
        className="absolute w-0.5 bg-gradient-to-b from-[#00ffcc] to-[#7000ff] -z-10 rounded-full"
        style={{ 
          height: `${(currentSection + 0.5) * 100 / count}%`,
          top: 0
        }}
      />
      
      {dots.map((index) => (
        <ScrollDot
          key={index}
          index={index}
          currentSection={currentSection}
          onClick={scrollToSection}
        />
      ))}
    </div>
  );
}; 