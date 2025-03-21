'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ParticleProps {
  density?: number;
  size?: number;
  speed?: number;
  direction?: 'top' | 'right' | 'bottom' | 'left';
  opacitySpeed?: number;
  color?: string;
  className?: string;
}

export const Sparkles = ({
  density = 500,
  size = 1,
  speed = 1,
  direction = 'top',
  opacitySpeed = 1,
  color = '#ffffff',
  className,
}: ParticleProps) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const wrapper = useRef<HTMLDivElement>(null);

  const randomNumberInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const generateParticles = useCallback(() => {
    if (!wrapper.current) return [];

    const particles = [];
    const wrapperWidth = wrapper.current.offsetWidth;
    const wrapperHeight = wrapper.current.offsetHeight;

    setWidth(wrapperWidth);
    setHeight(wrapperHeight);

    for (let i = 0; i < density; i++) {
      const x = randomNumberInRange(0, wrapperWidth);
      const y = randomNumberInRange(0, wrapperHeight);
      const w = randomNumberInRange(size, size * 3);
      const h = randomNumberInRange(size, size * 3);
      const duration = randomNumberInRange(speed * 10, speed * 20);
      const opacity = randomNumberInRange(0.1, 1);
      const delay = randomNumberInRange(0, 5);

      particles.push({
        id: i,
        x,
        y,
        w,
        h,
        duration,
        opacity,
        delay,
      });
    }

    return particles;
  }, [density, size, speed]);

  const particles = useMemo(() => generateParticles(), [generateParticles]);

  const calculateEndPosition = useCallback(
    (x: number, y: number) => {
      switch (direction) {
        case 'top':
          return { x, y: -100 };
        case 'right':
          return { x: width + 100, y };
        case 'bottom':
          return { x, y: height + 100 };
        case 'left':
          return { x: -100, y };
        default:
          return { x, y: -100 };
      }
    },
    [direction, height, width]
  );

  useEffect(() => {
    const handleResize = () => {
      if (wrapper.current) {
        setWidth(wrapper.current.offsetWidth);
        setHeight(wrapper.current.offsetHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={wrapper}
      className={cn('relative w-full h-full overflow-hidden', className)}
    >
      {particles.map((particle) => {
        const end = calculateEndPosition(particle.x, particle.y);
        return (
          <motion.span
            key={particle.id}
            className="absolute rounded-full bg-current"
            style={{
              x: particle.x,
              y: particle.y,
              width: particle.w,
              height: particle.h,
              color,
            }}
            animate={{
              x: end.x,
              y: end.y,
              opacity: [0, particle.opacity, 0],
            }}
            transition={{
              duration: particle.duration,
              ease: 'linear',
              repeat: Infinity,
              delay: particle.delay,
              repeatDelay: 0,
              opacity: {
                duration: particle.duration / opacitySpeed,
                ease: 'linear',
                repeat: Infinity,
                delay: particle.delay,
              },
            }}
          />
        );
      })}
    </div>
  );
}; 