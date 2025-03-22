'use client'

import { Suspense, lazy, useEffect, useState, useRef } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))
import type { Application } from '@splinetool/runtime'

interface SplineSceneProps {
  scene: string
  className?: string
  onLoad?: (spline: Application) => void
  lowQuality?: boolean // Nueva prop para forzar modo de baja calidad
}

// Tipo para las propiedades adicionales de navigator
interface NavigatorWithHardware {
  deviceMemory?: number;
  hardwareConcurrency?: number;
}

export function SplineScene({ scene, className, onLoad, lowQuality = false }: SplineSceneProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Asegurar que el parámetro scene tenga una URL válida
  const sceneUrl = scene || 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode';
  
  // Añadimos parámetro de calidad a la URL para optimización
  const finalSceneUrl = lowQuality && sceneUrl.includes('?') 
    ? `${sceneUrl}&quality=low` 
    : lowQuality 
      ? `${sceneUrl}?quality=low` 
      : sceneUrl;
  
  // En dispositivos móviles, podríamos necesitar un enfoque diferente
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Detección de hardware para optimizaciones
  const detectHardware = () => {
    if (typeof window === 'undefined') return false;
    
    // Detección de dispositivos móviles
    const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Detección de dispositivos de baja potencia
    const navigatorExt = navigator as Navigator & NavigatorWithHardware;
    const deviceMem = navigatorExt.deviceMemory || 8; // Valor por defecto si no está disponible
    const cpuCores = navigatorExt.hardwareConcurrency || 8; // Valor por defecto si no está disponible
    
    const isLowEnd = 
      isMobileDevice || 
      deviceMem < 4 ||  // RAM limitada
      cpuCores < 4;     // Pocos núcleos
    
    return isLowEnd;
  };

  // Comprobar si es un dispositivo de baja potencia
  const isLowEndDevice = lowQuality || detectHardware();

  useEffect(() => {
    setIsClient(true);
    setHasMounted(true);
    
    // Usamos IntersectionObserver para cargar el componente solo cuando esté visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 }); // Empezamos a cargar cuando el 10% sea visible
    
    // Observar el elemento contenedor
    const container = document.getElementById('spline-container');
    if (container) {
      observer.observe(container);
    } else {
      // Si no encuentra el contenedor, renderizar de todos modos
      setShouldRender(true);
    }
    
    // Intentar detectar cuando termine de cargar
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, isLowEndDevice ? 3000 : 5000); // Timeout reducido en dispositivos de baja potencia

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [isLoading, isLowEndDevice]);

  // Optimizar el iframe cuando se use como fallback
  useEffect(() => {
    if (hasError || !isClient) {
      // Reducir la calidad del contenido iframe en dispositivos de baja potencia
      if (iframeRef.current && isLowEndDevice) {
        try {
          // Intentar comunicarse con el iframe para reducir calidad
          iframeRef.current.onload = () => {
            try {
              if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage({ 
                  type: 'SPLINE_QUALITY', 
                  quality: 'low' 
                }, '*');
              }
            } catch (err) {
              console.warn('No se pudo optimizar iframe:', err);
            }
          };
        } catch (err) {
          console.warn('Error al configurar iframe:', err);
        }
      }
    }
  }, [hasError, isClient, isLowEndDevice]);

  // Función para manejar el evento de carga completa de Spline
  const handleSplineLoad = (spline: Application) => {
    console.log('SplineScene: Spline cargado correctamente');
    setIsLoading(false);
    
    if (isLowEndDevice) {
      try {
        // Aplicar optimizaciones para dispositivos de baja potencia
        const splineApp = spline as unknown as { 
          renderer?: { 
            setPixelRatio: (ratio: number) => void;
            shadowMap?: { enabled: boolean };
          } 
        };

        if (splineApp.renderer) {
          // Reducir la resolución de renderizado
          splineApp.renderer.setPixelRatio(Math.min(0.75, window.devicePixelRatio || 1));
          
          // Desactivar sombras en dispositivos de baja potencia
          if (splineApp.renderer.shadowMap) {
            splineApp.renderer.shadowMap.enabled = false;
          }
        }
      } catch (err) {
        console.warn('Error al aplicar optimizaciones:', err);
      }
    }
    
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
      <div className={`relative w-full h-full ${className}`} id="spline-container">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50">
            <span className="loader"></span>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          src={`${finalSceneUrl}${isLowEndDevice ? (finalSceneUrl.includes('?') ? '&' : '?') + 'quality=low' : ''}`}
          className="w-full h-full border-0"
          style={{ 
            pointerEvents: 'auto',
            transform: isMobile ? 'scale(1.5)' : 'scale(1.2)',
          }}
          allow="autoplay; fullscreen"
          onLoad={() => setIsLoading(false)}
          onError={() => handleSplineError('Error en iframe')}
          loading="lazy" // Carga diferida para mejorar rendimiento
        />
      </div>
    );
  }

  if (!shouldRender && hasMounted) {
    // Mostrar un placeholder hasta que el componente sea visible
    return (
      <div id="spline-container" className={`relative w-full h-full ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="loader"></span>
        </div>
      </div>
    );
  }

  return (
    <div id="spline-container" className={`relative w-full h-full ${className}`}>
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
          scene={finalSceneUrl}
          className={`w-full h-full ${className}`}
          onLoad={handleSplineLoad}
          onError={handleSplineError}
        />
      </Suspense>
    </div>
  )
} 