'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useSpring, useTransform, SpringOptions } from 'framer-motion';
import { cn } from '@/lib/utils';

type SpotlightProps = {
  className?: string;
  size?: number;
  springOptions?: SpringOptions;
  fill?: string;
};

export function Spotlight({
  className,
  size = 800,
  springOptions = { bounce: 0, damping: 20, stiffness: 150 },
  fill = 'rgba(111, 63, 245, 0.85)', // Color violeta vibrante por defecto
  ...props
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null);

  const mouseRef = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const springConfig = { stiffness: 150, damping: 15 };
  const spring = useSpring({
    transform: `translate(${position.x}px, ${position.y}px)`,
    config: springConfig,
  });

  const determineColor = () => {
    // Si hay un color personalizado, úsalo
    if (fill !== 'rgba(111, 63, 245, 0.85)') {
      return fill;
    }
    
    return fill;
  };

  useEffect(() => {
    if (containerRef.current) {
      // Buscamos el elemento #prizes como contenedor
      const prizeSection = document.getElementById('prizes');
      
      if (prizeSection) {
        setParentElement(prizeSection);
        if (!prizeSection.style.position) {
          prizeSection.style.position = 'relative';
        }
        if (!prizeSection.style.overflow) {
          prizeSection.style.overflow = 'hidden';
        }
      } else {
        // Fallback al elemento padre directo
        const parent = containerRef.current.parentElement;
        if (parent) {
          parent.style.position = 'relative';
          parent.style.overflow = 'hidden';
          setParentElement(parent);
        }
      }
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setPosition({ x: e.clientX, y: e.clientY });
    };

    if (parentElement) {
      parentElement.addEventListener('mousemove', handleMouseMove);
    } else {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (parentElement) {
        parentElement.removeEventListener('mousemove', handleMouseMove);
      } else {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [parentElement]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'pointer-events-none fixed rounded-full opacity-100 z-0',
        className
      )}
      style={{
        width: size,
        height: size,
        left: position.x - size / 2,
        top: position.y - size / 2,
        background: `radial-gradient(circle at center, ${determineColor()}, transparent 70%)`,
        filter: 'blur(40px)',
      }}
      {...props}
    />
  );
} 