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

  // Detector para saber si el componente está visible en el viewport - con umbral más alto
  const isInView = useInView(containerRef, { amount: 0.7 })
  
  // Optimización: Solo mostrar Spline cuando es visible
  useEffect(() => {
    // Añadimos un pequeño retraso para no entrar en ciclos de carga/descarga
    if (isInView) {
      const timer = setTimeout(() => {
        setIsSplineVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        // No ocultamos Spline inmediatamente para evitar parpadeos
        // en scroll rápido
        setIsSplineVisible(isInView);
      }, 1000);
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
      
      // Optimización: Reducir calidad para mejorar rendimiento
      // @ts-expect-error - Parámetros no documentados
      if (app.renderer) {
        // @ts-expect-error - Intentamos acceder a parámetros internos para optimizar
        app.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1))
      }
    } catch (err) {
      console.warn('No se pudo optimizar el renderizado:', err)
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
  }, [])
  
  // Función para manejar el movimiento del ratón directamente con Spline
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!spline || !containerRef.current || !isInView || initialAnimation) return
    
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
      // Actualizar las variables en Spline con una tasa limitada (throttling)
      // para reducir actualizaciones excesivas
      spline.setVariable('mouseX', normalizedX)
      spline.setVariable('mouseY', normalizedY)
      
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
        
        targets.forEach(targetName => {
          const object = spline.findObjectByName(targetName)
          if (object) {
            // Intentar diferentes formas de interacción
            try { 
              // Emitir evento look-at o follow
              spline.emitEvent('lookAt', targetName) 
            } catch {}
            
            try {
              // Actualizar propiedades directas del objeto
              // CORRECCIÓN: El problema principal estaba aquí, el robot miraba hacia arriba
              // porque el eje x estaba invertido incorrectamente. Corregimos las rotaciones:
              object.rotation.y = (normalizedX - 0.5) * 2.5 // Rotación horizontal
              
              // Invertir la rotación en el eje X para que mire correctamente al cursor 
              // y no hacia arriba constantemente - valor negativo para que mire hacia abajo
              object.rotation.x = -(normalizedY - 0.5) * 1.5 // Rotación vertical corregida
            } catch {}
          }
        })
      }
    } catch (error) {
      console.error('Error al actualizar con posición del ratón:', error)
    }
  }, [spline, objectNames, isInView, initialAnimation])
  
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
  
  // Optimización: Limitar la frecuencia de actualización del mouse
  // Implementamos throttling para reducir llamadas y mejorar rendimiento
  const throttleMouseMove = useCallback((fn: (e: Event) => void, delay: number) => {
    let lastCall = 0;
    return function(e: Event) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        fn(e);
        lastCall = now;
      }
    };
  }, []);
  
  // Configurar el event listener para el movimiento del ratón
  useEffect(() => {
    // Aplicamos throttling a 60fps (16ms) para reducir carga
    const throttledMouseMove = throttleMouseMove((e: Event) => {
      if (e instanceof MouseEvent) {
        handleMouseMove(e);
      }
    }, 16);
    
    // Usar document para capturar eventos en toda la página
    document.addEventListener('mousemove', throttledMouseMove);
    
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
    
    // Aplicar throttling también al evento de scroll
    const throttledScroll = throttleMouseMove(handleScroll, 100);
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      document.removeEventListener('mousemove', throttledMouseMove);
      window.removeEventListener('scroll', throttledScroll);
    }
  }, [handleMouseMove, isInView, spline, initialAnimation, throttleMouseMove]);
  
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