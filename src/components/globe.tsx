'use client';
import React, { useEffect, useRef } from 'react';
import createGlobe from 'cobe';
import { cn } from '@/lib/utils';

interface EarthProps {
  className?: string;
  theta?: number;
  dark?: number;
  scale?: number;
  diffuse?: number;
  mapSamples?: number;
  mapBrightness?: number;
  baseColor?: [number, number, number];
  markerColor?: [number, number, number];
  glowColor?: [number, number, number];
}

const Earth: React.FC<EarthProps> = ({
  className,
  theta = 0.3,
  dark = 1.2,
  scale = 1.15,
  diffuse = 3.0,
  mapSamples = 60000,
  mapBrightness = 8,
  baseColor = [0.1, 0.2, 0.8],
  markerColor = [0.7, 0.3, 0.2],
  glowColor = [0.2, 0.4, 1],
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let width = 0;
    const onResize = () =>
      canvasRef.current && (width = canvasRef.current.offsetWidth);
    window.addEventListener('resize', onResize);
    onResize();
    let phi = 0;

    onResize();
    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: theta,
      dark: dark,
      scale: scale,
      diffuse: diffuse,
      mapSamples: mapSamples,
      mapBrightness: mapBrightness,
      baseColor: baseColor,
      markerColor: markerColor,
      glowColor: glowColor,
      opacity: 1,
      offset: [0, 0],
      markers: [],
      onRender: (state: Record<string, any>) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi;
        phi += 0.002;
      },
    });

    return () => {
      globe.destroy();
    };
  }, [theta, dark, scale, diffuse, mapSamples, mapBrightness, baseColor, markerColor, glowColor]);

  return (
    <div className={cn("relative", className)}>
      <div className="aspect-square w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            aspectRatio: '1',
            filter: 'drop-shadow(0 0 30px rgba(30, 64, 175, 0.4))'
          }}
        />
      </div>
      
      {/* Resplandor / glow effect */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-blue-500/10 blur-3xl"></div>
    </div>
  );
};

export default Earth; 