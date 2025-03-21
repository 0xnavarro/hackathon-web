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
  const [isHovered, setIsHovered] = useState(true); // Siempre visible
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null);

  const mouseX = useSpring(0, springOptions);
  const mouseY = useSpring(0, springOptions);

  const spotlightLeft = useTransform(mouseX, (x) => `${x - size / 2}px`);
  const spotlightTop = useTransform(mouseY, (y) => `${y - size / 2}px`);

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

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!parentElement) return;
      const { left, top } = parentElement.getBoundingClientRect();
      mouseX.set(event.clientX - left);
      mouseY.set(event.clientY - top);
    },
    [mouseX, mouseY, parentElement]
  );

  useEffect(() => {
    if (!parentElement) return;

    parentElement.addEventListener('mousemove', handleMouseMove);
    parentElement.addEventListener('mouseenter', () => setIsHovered(true));
    // No establecemos mouseleave para mantenerlo siempre visible
    // parentElement.addEventListener('mouseleave', () => setIsHovered(false));

    return () => {
      parentElement.removeEventListener('mousemove', handleMouseMove);
      parentElement.removeEventListener('mouseenter', () => setIsHovered(true));
      // parentElement.removeEventListener('mouseleave', () => setIsHovered(false));
    };
  }, [parentElement, handleMouseMove]);

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
        left: spotlightLeft,
        top: spotlightTop,
        background: `radial-gradient(circle at center, ${determineColor()}, transparent 70%)`,
        filter: 'blur(40px)',
      }}
      {...props}
    />
  );
} 