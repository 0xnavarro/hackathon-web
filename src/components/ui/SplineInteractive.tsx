'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import Spline from '@splinetool/react-spline'
import type { Application } from '@splinetool/runtime'
import { useInView } from 'framer-motion'

interface SplineInteractiveProps {
  scene: string
  className?: string
}

export function SplineInteractive({ scene, className }: SplineInteractiveProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [spline, setSpline] = useState<Application | null>(null)
  const [objectNames, setObjectNames] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [initialAnimation, setInitialAnimation] = useState(true)
  const [wasInView, setWasInView] = useState(false)
  const [isSplineVisible, setIsSplineVisible] = useState(false)
  const [quality, setQuality] = useState<'low'|'medium'|'high'>('medium')
  const [fpsLimited, setFpsLimited] = useState(false)
  const lastFrameTime = useRef(0)
  const animationFrameId = useRef<number | null>(null)
  const throttleTime = useRef(16) // ~60fps por defecto

  // Detector para saber si el componente está visible en el viewport - umbral reducido para descargar antes
  const isInView = useInView(containerRef, { amount: 0.5 })
  
  // Optimización: Detectar si el dispositivo es de baja potencia
  useEffect(() => {
    // Detectar dispositivos con posible hardware limitado
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const pixelRatio = window.devicePixelRatio || 1
    
    // Ajustar calidad basado en heurísticas del dispositivo
    if (isMobile || pixelRatio < 1.5) {
      setQuality('low')
      throttleTime.current = 33 // ~30fps para dispositivos de menor potencia
      setFpsLimited(true)
    } else if (pixelRatio >= 3) {
      // Dispositivo de alta densidad, pero limitamos igualmente
      setQuality('medium')
      throttleTime.current = 24 // ~42fps 
      setFpsLimited(true)
    }
  }, [])
  
  // Optimización: Solo mostrar Spline cuando es visible y con retraso para evitar carga/descarga frecuente
  useEffect(() => {
    // Si entra en viewport
    if (isInView) {
      const timer = setTimeout(() => {
        setIsSplineVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      // Si sale del viewport, damos más tiempo antes de descargar
      const timer = setTimeout(() => {
        setIsSplineVisible(false);
      }, 2000); // Tiempo aumentado para evitar carga/descarga en scrolls rápidos
      return () => clearTimeout(timer);
    }
  }, [isInView]);
  
  // Detectar cuando el componente entra en el viewport después de estar fuera
  useEffect(() => {
    if (isInView && !wasInView) {
      console.log('Sección ahora visible - Reset del robot')
      // Reiniciar animación cuando entra en vista
      if (spline) {
        resetRobot()
      }
    }
    setWasInView(isInView)
  }, [isInView, spline])
  
  // Cleanup para asegurar que se cancela cualquier animationFrame pendiente
  useEffect(() => {
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [])
  
  // Función para reiniciar el robot
  const resetRobot = useCallback(() => {
    if (!spline) return
    
    try {
      console.log('Reiniciando robot...')
      
      // Intentar encontrar el robot u objeto interactivo
      const targets = objectNames.filter(name => 
        name.toLowerCase().includes('robot') || 
        name.toLowerCase().includes('character') || 
        name.toLowerCase().includes('figure') ||
        name.toLowerCase().includes('3d') ||
        name.toLowerCase().includes('object')
      )
      
      // Emitir eventos para reiniciar el robot
      targets.forEach(targetName => {
        try { 
          console.log(`Reiniciando animación para: ${targetName}`)
          spline.emitEvent('start', targetName) 
          
          // Probar otros eventos que puedan reiniciar la animación
          try { 
            // Estos eventos pueden no estar definidos en el tipo,
            // pero intentamos emitirlos como string para probar
            // @ts-expect-error - Ignoramos el error de tipo para eventos personalizados 
            spline.emitEvent('reset', targetName) 
          } catch {}
          try { 
            // @ts-expect-error - Ignoramos el error de tipo para eventos personalizados
            spline.emitEvent('restart', targetName) 
          } catch {}
        } catch (error) {
          console.warn(`Error al intentar reiniciar ${targetName}:`, error)
        }
      })
      
      // Resetear las variables globales
      try {
        spline.setVariable('mouseX', 0.5)
        spline.setVariable('mouseY', 0.5)
      } catch {}
      
      // Reactivar animación inicial
      setInitialAnimation(true)
      
      // Después de un tiempo, permitir que el robot siga al cursor
      setTimeout(() => {
        setInitialAnimation(false)
        console.log('Animación inicial completada, ahora sigue al cursor')
        
        // Simular movimiento del ratón para comenzar a seguir
        const fakeEvent = new MouseEvent('mousemove', {
          clientX: window.innerWidth / 2,
          clientY: window.innerHeight / 2,
        })
        handleMouseMove(fakeEvent)
      }, 2500)
    } catch (error) {
      console.error('Error al resetear robot:', error)
    }
  }, [spline, objectNames])

  // Handler para cuando Spline carga
  const handleLoad = useCallback((app: Application) => {
    console.log('Spline cargado correctamente')
    setSpline(app)
    setIsLoading(false)
    
    // Configurar la escena para que reaccione más rápido
    try {
      app.setVariable('mouseX', 0.5)
      app.setVariable('mouseY', 0.5)
      
      // Optimización avanzada de rendimiento WebGL
      try {
        // Usamos aserción de tipo para acceder a las propiedades internas
        const rendererAccessor = app as unknown as { 
          renderer?: { 
            setPixelRatio: (ratio: number) => void;
            getContext: () => WebGLRenderingContext;
            shadowMap?: { enabled: boolean };
            toneMapping?: number;
          } 
        };
        
        if (rendererAccessor.renderer) {
          const renderer = rendererAccessor.renderer;
          
          // Reducir resolución según nivel de calidad
          const pixelRatioMap = {
            'low': 0.5,    // 50% de la resolución nativa
            'medium': 0.75, // 75% de la resolución nativa
            'high': 1.0     // Resolución nativa
          };
          
          if (typeof renderer.setPixelRatio === 'function') {
            renderer.setPixelRatio(Math.min(pixelRatioMap[quality], window.devicePixelRatio || 1));
          }
          
          // Optimizaciones adicionales de WebGL si están disponibles
          if (typeof renderer.getContext === 'function') {
            const gl = renderer.getContext();
            
            // Priorizar rendimiento sobre calidad
            if (quality === 'low' || quality === 'medium') {
              // Reducir precisión en shaders para mejorar rendimiento
              const ext = gl.getExtension('WEBGL_debug_renderer_info');
              if (ext) {
                // Verificar si es una GPU integrada para optimizar aún más
                const gpu = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
                const isIntegratedGPU = /(Intel|HD Graphics|UHD Graphics|Iris)/i.test(gpu);
                
                if (isIntegratedGPU) {
                  // Forzar modo de bajo rendimiento para GPUs integradas
                  setQuality('low');
                  throttleTime.current = 33; // 30fps máximo
                  setFpsLimited(true);
                }
              }
            }
            
            if (renderer.shadowMap) {
              // Desactivar sombras en modo de baja calidad
              if (quality === 'low') renderer.shadowMap.enabled = false;
            }
            
            if (quality === 'low' && renderer.toneMapping !== undefined) {
              // Uso de tone mapping más simple
              renderer.toneMapping = 0; // NoToneMapping (0) es el más ligero
            }
          }
        }
        
        // Optimizar físicas, nivel de detalle y animaciones
        const physicsAccessor = app as unknown as { 
          physics?: { fixedDeltaTime: number }; 
          scene?: { 
            traverse?: (callback: (object: {
              type?: string;
              material?: {
                roughness?: number;
                metalness?: number;
                envMapIntensity?: number;
                [key: string]: unknown;
              };
              [key: string]: unknown;
            }) => void) => void;
          }
        };
        
        if (physicsAccessor.physics) {
          // Reducir precisión de físicas
          physicsAccessor.physics.fixedDeltaTime = quality === 'low' ? 1/30 : 1/60;
        }
        
        if (physicsAccessor.scene && typeof physicsAccessor.scene.traverse === 'function') {
          // Bajar nivel de detalle para modelos
          physicsAccessor.scene.traverse((object) => {
            if (object && object.type === 'Mesh' && object.material) {
              // Reducir calidad de materiales
              if (quality === 'low') {
                // Apagar efectos costosos
                if (typeof object.material.roughness !== 'undefined') {
                  object.material.roughness = 1.0; // Apagar reflexiones
                }
                if (typeof object.material.metalness !== 'undefined') {
                  object.material.metalness = 0.0; // Apagar efectos metálicos
                }
                if (typeof object.material.envMapIntensity !== 'undefined') {
                  object.material.envMapIntensity = 0.0; // Desactivar mapas de entorno
                }
              }
            }
          });
        }
      } catch (err) {
        console.warn('No se pudieron aplicar optimizaciones a WebGL/físicas/materiales:', err);
      }
    } catch (err) {
      console.warn('No se pudo optimizar el renderizado:', err);
    }
    
    // Listamos todos los objetos en la escena para identificar cuáles podemos manipular
    try {
      const allObjects = app.getAllObjects()
      const names = allObjects.map(obj => obj.name)
      console.log('Objetos en la escena:', names)
      setObjectNames(names)
      
      // Verificar si hay objetos con nombres relacionados a un robot o character
      const possibleTargets = names.filter(name => 
        name.toLowerCase().includes('robot') || 
        name.toLowerCase().includes('character') || 
        name.toLowerCase().includes('figure') ||
        name.toLowerCase().includes('3d') ||
        name.toLowerCase().includes('object')
      )
      
      if (possibleTargets.length > 0) {
        console.log('Objetos interactivos potenciales:', possibleTargets)
        
        // Probar varios eventos en los objetos encontrados
        possibleTargets.forEach(targetName => {
          try {
            const obj = app.findObjectByName(targetName)
            if (obj) {
              console.log(`Encontrado objeto: ${targetName}`)
            }
            
            // Intentar emitir diferentes tipos de eventos para "despertar" el objeto
            try { app.emitEvent('start', targetName) } catch {}
            try { app.emitEvent('mouseDown', targetName) } catch {}
            try { app.emitEvent('mouseUp', targetName) } catch {}
          } catch (error) {
            console.error(`Error al interactuar con objeto ${targetName}:`, error)
          }
        })
      }
      
      // Configurar el manejo global de eventos para debugging
      try {
        app.setGlobalEvents(true)
        console.log('Eventos globales activados')
      } catch {}
      
    } catch (error) {
      console.error('Error al explorar la escena:', error)
    }
  }, [quality])
  
  // Función para manejar el movimiento del ratón directamente con Spline (ahora con limitación de FPS)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!spline || !containerRef.current || !isInView || initialAnimation) return
    
    // Limitador de FPS opcional para reducir carga
    if (fpsLimited) {
      const now = performance.now()
      const elapsed = now - lastFrameTime.current
      
      if (elapsed < throttleTime.current) {
        // No ha pasado suficiente tiempo entre fotogramas
        return
      }
      
      lastFrameTime.current = now
    }
    
    const rect = containerRef.current.getBoundingClientRect()
    
    // Verificar si el cursor está dentro del elemento
    const isInsideElement = 
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    
    // Si el cursor está fuera del elemento, usar el borde más cercano
    let normalizedX, normalizedY
    
    if (isInsideElement) {
      // Normalizar las coordenadas del ratón
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      
      // Limitar los valores entre 0 y 1
      normalizedX = Math.max(0, Math.min(1, x))
      normalizedY = Math.max(0, Math.min(1, y))
    } else {
      // Calcular el punto más cercano al borde
      const closestX = Math.max(rect.left, Math.min(e.clientX, rect.right))
      const closestY = Math.max(rect.top, Math.min(e.clientY, rect.bottom))
      
      normalizedX = (closestX - rect.left) / rect.width
      normalizedY = (closestY - rect.top) / rect.height
    }
    
    try {
      // Usamos requestAnimationFrame para sincronizar con la tasa de refresco y reducir carga
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current)
      }
      
      animationFrameId.current = requestAnimationFrame(() => {
        // Actualizar las variables en Spline 
        try {
          spline.setVariable('mouseX', normalizedX)
          spline.setVariable('mouseY', normalizedY)
        } catch {}
        
        // Si encontramos algún objeto específico, podemos manipularlo directamente
        if (objectNames.length > 0) {
          // Buscar cualquier objeto que pueda ser interactivo
          const targets = objectNames.filter(name => 
            name.toLowerCase().includes('robot') || 
            name.toLowerCase().includes('character') || 
            name.toLowerCase().includes('figure') ||
            name.toLowerCase().includes('3d') ||
            name.toLowerCase().includes('object')
          )
          
          // Aplicar rotación solo al primer objeto encontrado para reducir cálculos
          // y mejorar rendimiento (en vez de hacer forEach)
          if (targets.length > 0) {
            const targetName = targets[0]
            const object = spline.findObjectByName(targetName)
            
            if (object) {
              // Rotación más suave y con menor rango para mejorar rendimiento
              // Reducimos la intensidad del movimiento para calidad baja o media
              const intensityMap = {
                'low': 0.6,
                'medium': 0.8,
                'high': 1.0
              }
              const intensity = intensityMap[quality]
              
              try {
                // Reducimos los ángulos de rotación para cálculos más ligeros
                const rotationY = (normalizedX - 0.5) * 2.0 * intensity
                const rotationX = -(normalizedY - 0.5) * 1.0 * intensity
                
                object.rotation.y = rotationY
                object.rotation.x = rotationX
              } catch {}
            }
          }
        }
        
        animationFrameId.current = null
      })
    } catch (error) {
      console.error('Error al actualizar con posición del ratón:', error)
    }
  }, [spline, objectNames, isInView, initialAnimation, quality, fpsLimited])
  
  // Efecto para terminar la animación inicial después de un tiempo
  useEffect(() => {
    if (spline && isInView) {
      const timer = setTimeout(() => {
        setInitialAnimation(false)
        console.log("Animación inicial completada, robot ahora sigue al cursor")
      }, 2500) // Dar tiempo a la animación inicial para completarse
      
      return () => clearTimeout(timer)
    }
  }, [spline, isInView])
  
  // Optimización: Limitar la frecuencia de actualización del mouse con un throttle más avanzado
  const throttleMouseMove = useCallback((fn: (e: Event) => void, delay: number) => {
    let lastCall = 0;
    return function(e: Event) {
      const now = performance.now();
      if (now - lastCall >= delay) {
        fn(e);
        lastCall = now;
      }
    };
  }, []);
  
  // Configurar el event listener para el movimiento del ratón
  useEffect(() => {
    // Aplicamos throttling adaptativo según la calidad
    const throttleDelay = quality === 'low' ? 50 : (quality === 'medium' ? 33 : 16);
    
    const throttledMouseMove = throttleMouseMove((e: Event) => {
      if (e instanceof MouseEvent) {
        handleMouseMove(e);
      }
    }, throttleDelay);
    
    // Usar passive para mejorar rendimiento
    document.addEventListener('mousemove', throttledMouseMove, { passive: true });
    
    // También detectar scroll para actualizar la posición del robot
    const handleScroll = () => {
      if (isInView && spline && !initialAnimation) {
        // Simular un evento de ratón para actualizar la posición
        const fakeEvent = new MouseEvent('mousemove', {
          clientX: window.innerWidth / 2,
          clientY: window.innerHeight / 2,
        })
        handleMouseMove(fakeEvent)
      }
    }
    
    // Throttle de scroll más agresivo ya que no es tan crítico
    const throttledScroll = throttleMouseMove(handleScroll, 200);
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      document.removeEventListener('mousemove', throttledMouseMove);
      window.removeEventListener('scroll', throttledScroll);
      
      // Limpiar cualquier animationFrame pendiente
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [handleMouseMove, isInView, spline, initialAnimation, throttleMouseMove, quality]);
  
  // Simular un evento de ratón en el centro cuando se muestra la sección
  useEffect(() => {
    if (spline && isInView && !initialAnimation) {
      // Generar un evento sintético de movimiento del ratón en el centro de la pantalla
      const fakeEvent = new MouseEvent('mousemove', {
        clientX: window.innerWidth / 2,
        clientY: window.innerHeight / 2,
      })
      handleMouseMove(fakeEvent)
    }
  }, [spline, isInView, initialAnimation, handleMouseMove])

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full overflow-visible ${className}`}
      style={{ pointerEvents: 'all' }}
    >
      <div className="absolute inset-0 w-full h-full overflow-visible">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50">
            <span className="loader"></span>
          </div>
        )}
        
        {/* Carga condicional de Spline para conservar recursos */}
        {isSplineVisible && (
          <Spline
            scene={scene}
            onLoad={handleLoad}
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </div>
    </div>
  )
} 