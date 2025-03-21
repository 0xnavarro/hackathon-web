'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  alpha: number;
  vx: number;
  vy: number;
}

interface Trail {
  x: number;
  y: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
}

const colors = [
  '#00ffcc', // verde neón
  '#7000ff', // morado
  '#ff00c3', // rosa
  '#00a3ff', // azul
  '#ffcc00', // amarillo
];

const ParticlesContainer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const trailsRef = useRef<Trail[]>([]);
  const mouseRef = useRef<{x: number, y: number, lastX: number, lastY: number, moving: boolean}>({ 
    x: 0, 
    y: 0, 
    lastX: 0, 
    lastY: 0,
    moving: false 
  });
  const animationFrameId = useRef<number | null>(null);
  const [isActive, setIsActive] = useState(true);

  // Inicializar partículas
  const initParticles = useCallback((width: number, height: number) => {
    const count = width < 768 ? 30 : 50;
    const particles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 1 + 0.5,
        alpha: Math.random() * 0.6 + 0.3,
        vx: Math.random() * 1 - 0.5,
        vy: Math.random() * 1 - 0.5
      });
    }
    
    particlesRef.current = particles;
    trailsRef.current = [];
  }, []);

  // Inicializar canvas y eventos
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctxRef.current = ctx;
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const mouse = mouseRef.current;
      
      // Guardar posición anterior
      mouse.lastX = mouse.x;
      mouse.lastY = mouse.y;
      
      // Actualizar posición
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      // Detectar si el ratón se está moviendo
      const dx = mouse.x - mouse.lastX;
      const dy = mouse.y - mouse.lastY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      mouse.moving = distance > 2;
      
      // Crear partículas de rastro
      if (mouse.moving) {
        createTrailParticles(mouse.x, mouse.y);
      }
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [initParticles]);

  // Crear partículas para el rastro del ratón
  const createTrailParticles = (x: number, y: number) => {
    // Añadir partículas de destello en la posición del ratón
    for (let i = 0; i < 3; i++) {
      trailsRef.current.push({
        x: x + (Math.random() * 20 - 10),
        y: y + (Math.random() * 20 - 10),
        size: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.7 + 0.3,
        life: Math.random() * 30 + 10
      });
    }
    
    // Limitar el número de partículas de rastro para rendimiento
    if (trailsRef.current.length > 100) {
      trailsRef.current = trailsRef.current.slice(-100);
    }
  };

  // Ciclo de animación principal
  useEffect(() => {
    if (!canvasRef.current || !ctxRef.current || !isActive) return;
    
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    
    const animate = () => {
      // Clear canvas with a slightly transparent black for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const mouse = mouseRef.current;
      
      // Actualizar y dibujar partículas principales
      updateMainParticles(ctx, canvas, mouse);
      
      // Actualizar y dibujar partículas del rastro
      updateTrailParticles(ctx);
      
      // Dibuja un aura alrededor del cursor cuando se mueve
      if (mouse.moving) {
        const gradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 80
        );
        gradient.addColorStop(0, 'rgba(0, 255, 204, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 255, 204, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(mouse.x, mouse.y, 80, 0, Math.PI * 2);
        ctx.fill();
        
        // Dibujar líneas energéticas desde el cursor a las partículas cercanas
        drawEnergyLines(ctx, mouse);
      }
      
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isActive]);
  
  // Actualizar y dibujar las partículas principales
  const updateMainParticles = (
    ctx: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement, 
    mouse: {x: number, y: number, moving: boolean}
  ) => {
    const particles = particlesRef.current;
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // Calcular la distancia al cursor
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Movimiento de las partículas
      if (dist < 150 && mouse.moving) {
        // Atraer hacia el cursor cuando se mueve
        const force = (150 - dist) / 150;
        const angle = Math.atan2(dy, dx);
        const targetX = mouse.x + Math.cos(angle + Math.PI) * 30;
        const targetY = mouse.y + Math.sin(angle + Math.PI) * 30;
        
        p.x += (targetX - p.x) * force * 0.05;
        p.y += (targetY - p.y) * force * 0.05;
        
        // Aumentar tamaño y alpha cuando están cerca del cursor
        p.size = Math.min(6, p.size + 0.1);
        p.alpha = Math.min(1, p.alpha + 0.02);
      } else {
        // Movimiento normal
        p.x += p.vx * p.speed;
        p.y += p.vy * p.speed;
        
        // Volver lentamente al tamaño normal
        p.size = Math.max(p.size * 0.98, 1);
        p.alpha = Math.max(p.alpha * 0.98, 0.3);
        
        // Cambiar dirección aleatoriamente
        if (Math.random() < 0.01) {
          p.vx = Math.random() * 1 - 0.5;
          p.vy = Math.random() * 1 - 0.5;
        }
        
        // Límites del canvas
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }
      
      // Dibujar partícula con glow
      ctx.beginPath();
      
      // Glow efecto
      const gradient = ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.size * 3
      );
      gradient.addColorStop(0, p.color);
      gradient.addColorStop(1, 'transparent');
      
      ctx.globalAlpha = p.alpha * 0.7;
      ctx.fillStyle = gradient;
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Núcleo de la partícula
      ctx.beginPath();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.globalAlpha = 1;
    }
  };
  
  // Actualizar y dibujar partículas del rastro
  const updateTrailParticles = (ctx: CanvasRenderingContext2D) => {
    const trails = trailsRef.current;
    
    for (let i = trails.length - 1; i >= 0; i--) {
      const t = trails[i];
      
      // Actualizar vida
      t.life -= 1;
      
      // Eliminar las que ya no son visibles
      if (t.life <= 0) {
        trails.splice(i, 1);
        continue;
      }
      
      // Reducir tamaño y opacidad gradualmente
      t.size *= 0.92;
      t.alpha *= 0.92;
      
      // Dibujar partícula de rastro
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(
        t.x, t.y, 0,
        t.x, t.y, t.size
      );
      gradient.addColorStop(0, t.color.replace(')', ', ' + t.alpha + ')').replace('rgb', 'rgba'));
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  
  // Dibujar líneas de energía desde el cursor
  const drawEnergyLines = (
    ctx: CanvasRenderingContext2D,
    mouse: {x: number, y: number}
  ) => {
    const particles = particlesRef.current;
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 150) {
        // Dibujar línea entre el cursor y las partículas cercanas
        ctx.beginPath();
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = (1 - dist / 150) * 0.5;
        ctx.lineWidth = (1 - dist / 150) * 2;
        
        // Línea con curvatura para efecto más dinámico
        const cx = (mouse.x + p.x) / 2;
        const cy = (mouse.y + p.y) / 2 - dist / 8;
        
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.quadraticCurveTo(cx, cy, p.x, p.y);
        ctx.stroke();
        
        ctx.globalAlpha = 1;
      }
    }
  };
  
  // Parar animación cuando la pestaña no es visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsActive(!document.hidden);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-10 bg-transparent"
    />
  );
};

export default ParticlesContainer; 