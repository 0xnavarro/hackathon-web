'use client';

import { useEffect, useState, useRef } from 'react';
import PrizesSection from '@/components/PrizesSection';
import HeroSection from '@/components/HeroSection';
import JudgesSection from '@/components/JudgesSection';
import SponsorsSection from '@/components/SponsorsSection';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useInView } from 'framer-motion';

// Este componente simplemente es un placeholder para la experiencia virtual
const VirtualExperience = () => {
  return null;
};

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const snapContainerRef = useRef<HTMLDivElement>(null);
  
  // Referencias para cada sección
  const heroRef = useRef<HTMLDivElement>(null);
  const prizesRef = useRef<HTMLDivElement>(null);
  const judgesRef = useRef<HTMLDivElement>(null);
  const sponsorsRef = useRef<HTMLDivElement>(null);
  
  // Detector de visibilidad para cada sección usando framer-motion
  const isHeroInView = useInView(heroRef, { amount: 0.5 });
  const isPrizesInView = useInView(prizesRef, { amount: 0.5 });
  const isJudgesInView = useInView(judgesRef, { amount: 0.5 });
  const isSponsorsInView = useInView(sponsorsRef, { amount: 0.5 });

  // Actualizar sección activa basada en qué sección está en vista
  useEffect(() => {
    if (isHeroInView) setActiveSection('hero');
    else if (isPrizesInView) setActiveSection('prizes');
    else if (isJudgesInView) setActiveSection('judges');
    else if (isSponsorsInView) setActiveSection('sponsors');
  }, [isHeroInView, isPrizesInView, isJudgesInView, isSponsorsInView]);

  // Función para hacer scroll a una sección específica
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Escuchar evento de teclado para navegación con flechas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const sections = ['hero', 'prizes', 'judges', 'sponsors'];
      const currentIndex = sections.indexOf(activeSection);
      
      if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
        scrollToSection(sections[currentIndex + 1]);
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        scrollToSection(sections[currentIndex - 1]);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection]);

  // Iniciar la visualización en la sección héroe
  useEffect(() => {
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      setTimeout(() => {
        scrollToSection(targetId);
      }, 500);
    }
  }, []);

  // Obtener indicadores de secciones para el scroll indicator
  const sectionDots = [
    { id: 'hero', label: 'Hero' },
    { id: 'prizes', label: 'Premios' },
    { id: 'judges', label: 'Jueces' },
    { id: 'sponsors', label: 'Patrocinadores' }
  ];

  // Manejar el comportamiento del footer cuando se sube desde la última sección
  useEffect(() => {
    const footerElement = document.querySelector('footer');
    if (footerElement) {
      footerElement.style.display = 'block';
    }
  }, []);

  return (
    <main className="relative bg-black text-white">
      <Header />
      
      {/* Indicadores de scroll */}
      <div className="scroll-indicator">
        {sectionDots.map(dot => (
          <div
            key={dot.id}
            className={`scroll-dot ${activeSection === dot.id ? 'active' : ''}`}
            onClick={() => scrollToSection(dot.id)}
            title={dot.label}
          />
        ))}
      </div>
      
      {/* Contenedor con scroll snapping */}
      <div className="snap-container" ref={snapContainerRef}>
        <div id="hero" className="snap-section" ref={heroRef}>
          <HeroSection />
        </div>
        
        <div id="prizes" className="snap-section" ref={prizesRef}>
          <PrizesSection />
        </div>
        
        <div id="judges" className="snap-section" ref={judgesRef}>
          <JudgesSection />
        </div>
        
        <div id="sponsors" className="snap-section" ref={sponsorsRef}>
          <SponsorsSection />
        </div>
      </div>
      
      <Footer />
      
      {/* Componente de experiencia virtual */}
      <VirtualExperience />
    </main>
  );
}