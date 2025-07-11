# Optimizaciones implementadas para mejorar rendimiento WebGL

1. Detección automática de hardware de baja potencia
2. Ajuste dinámico de calidad basado en capacidades del dispositivo
3. Reducción de la resolución de renderizado (pixelRatio)
4. Limitación de FPS (30fps en dispositivos de baja potencia)
5. Carga diferida condicionada a visibilidad en viewport
6. Desactivación de efectos costosos como sombras
7. Optimización de materiales (roughness, metalness)
8. Reducción de frecuencia de eventos de mouse con throttling
9. Utilización de requestAnimationFrame para sincronización
10. Uso de transformaciones más ligeras para rotación del robot
11. Parámetro quality=low añadido a la URL de Spline
12. Mejora de la gestión de memoria con cleanup explícito
13. Reducción de precisión de físicas
14. Optimización de iframe para fallback
15. Carga perezosa de componentes 3D (lazy loading)
16. Detección y optimización específica para GPUs integradas
17. Desactivación de tone mapping en modo de baja calidad
18. Reducción del número de objetos 3D manipulados simultáneamente 
19. Implementación de umbrales de carga/descarga para evitar ciclos frecuentes
20. Verificación de disponibilidad de funciones antes de llamarlas (protección contra errores)
