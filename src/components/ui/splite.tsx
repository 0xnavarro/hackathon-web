'use client'

import { Suspense, lazy, useEffect, useState } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))
import type { Application } from '@splinetool/runtime'

interface SplineSceneProps {
  scene: string
  className?: string
  onLoad?: (spline: Application) => void
}

export function SplineScene({ scene, className, onLoad }: SplineSceneProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Asegurar que el parámetro scene tenga una URL válida
  const sceneUrl = scene || 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode';
  
  // En dispositivos móviles, podríamos necesitar un enfoque diferente
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    setIsClient(true);
    
    // Intentar detectar cuando termine de cargar
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 5000); // Aumentamos el timeout para asegurar que tenga tiempo de cargar

    return () => clearTimeout(timer);
  }, [isLoading]);

  // Función para manejar el evento de carga completa de Spline
  const handleSplineLoad = (spline: Application) => {
    console.log('SplineScene: Spline cargado correctamente');
    setIsLoading(false);
    
    // Verificar si tenemos alguna función de callback para el evento onLoad
    if (onLoad && typeof onLoad === 'function') {
      try {
        onLoad(spline);
      } catch (error) {
        console.error('Error en callback onLoad:', error);
      }
    }
  };

  // Función para manejar errores de carga
  const handleSplineError = (error: unknown) => {
    console.error('Error al cargar la escena de Spline:', error);
    setIsLoading(false);
    setHasError(true);
  };

  // Fallback a iframe si hay error o estamos en Server-Side Rendering
  if (hasError || !isClient) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50">
            <span className="loader"></span>
          </div>
        )}
        
        <iframe
          src={sceneUrl}
          className="w-full h-full border-0"
          style={{ 
            pointerEvents: 'auto', // Cambiado a 'auto' para permitir interacción
            transform: isMobile ? 'scale(1.5)' : 'scale(1.2)',
          }}
          allow="autoplay; fullscreen"
          onLoad={() => setIsLoading(false)}
          onError={() => handleSplineError('Error en iframe')}
        />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Loader mientras carga Spline */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50">
          <span className="loader"></span>
        </div>
      )}

      <Suspense 
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <span className="loader"></span>
          </div>
        }
      >
        <Spline
          scene={sceneUrl}
          className={`w-full h-full ${className}`}
          onLoad={handleSplineLoad}
          onError={handleSplineError}
        />
      </Suspense>
    </div>
  )
} 