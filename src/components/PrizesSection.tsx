'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ParallaxLayer, ParallaxSection, Card3D, ScrollIndicator } from './ParallaxEffect';
import { useEffect, useState, useRef } from 'react';
import { Spotlight } from './ui/spotlight';
import { SplineInteractive } from '@/components/ui/SplineInteractive';
import { Modal } from './ui/Modal';

const PrizesSection = () => {
  const [showAllPrizesModal, setShowAllPrizesModal] = useState(false);
  const firstThreePrizesRef = useRef<HTMLDivElement>(null);
  
  const prizes = [
    {
      title: 'Grand Prize',
      amount: '$500,000',
      description: 'For the most innovative and impactful project with global reach',
      colorFrom: '#00ffcc',
      colorTo: '#00a864',
      delay: 0,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      title: 'Runner Up',
      amount: '$250,000',
      description: 'For exceptional execution, creativity and technical excellence',
      colorFrom: '#ff00c3',
      colorTo: '#a10081',
      delay: 0.1,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: 'Third Place',
      amount: '$100,000',
      description: 'For outstanding innovation and execution among top projects',
      colorFrom: '#7000ff',
      colorTo: '#4600a3',
      delay: 0.2,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    {
      title: 'Category Prizes',
      amount: '$50,000 each',
      description: 'For best projects in AI, Web3, Climate Tech, Health and more',
      colorFrom: '#00a3ff',
      colorTo: '#0060a1',
      delay: 0.3,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      )
    },
    {
      title: 'Special Mentions',
      amount: '$25,000 each',
      description: 'Recognition for outstanding solutions in specialized technologies',
      colorFrom: '#ff7700',
      colorTo: '#a14600',
      delay: 0.4,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    }
  ];

  // Animations for showing/hiding prizes
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const prizeCardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      } 
    },
    exit: { 
      opacity: 0,
      y: 30,
      scale: 0.95,
      transition: { 
        duration: 0.3
      } 
    }
  };

  const modalPrizeCardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9,
    },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      scale: 1, 
      transition: { 
        type: "spring", 
        stiffness: 80, 
        damping: 17,
        delay: i * 0.05,
      } 
    }),
  };

  useEffect(() => {
    const sectionIds = ["prizes", "hero", "judges", "sponsors"];
    
    const existingSectionIds = sectionIds.filter(id => document.getElementById(id));
    
    if (existingSectionIds.length > 0) {
      const scrollIndicator = document.getElementById("scroll-indicator");
      if (scrollIndicator) {
        scrollIndicator.setAttribute("data-sections", JSON.stringify(existingSectionIds));
      }
    }
  }, []);

  // Función para manejar la visualización de todos los premios
  const handleShowAllPrizes = () => {
    setShowAllPrizesModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowAllPrizesModal(false);
  };

  return (
    <ParallaxSection id="prizes" className="py-32 relative overflow-hidden bg-gradient-to-b from-black via-black/95 to-black min-h-screen flex flex-col justify-center">
      <div id="scroll-indicator" className="hidden">
        <ScrollIndicator 
          count={4} 
          sectionIds={["hero", "prizes", "judges", "sponsors"]} 
        />
      </div>
      
      {/* Background Robot 3D - Se añade como una capa entre el fondo y las tarjetas */}
      <div className="absolute inset-0 z-[1] pointer-events-auto w-full h-full overflow-visible">
        <SplineInteractive 
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode?event-trigger=on"
          className="w-full h-full"
        />
      </div>
      
      {/* Fondo con spotlight y efectos */}
      <div className="absolute inset-0 z-0 overflow-visible">
        <div className="absolute inset-0 bg-gradient-to-b from-[#100818]/90 via-black/80 to-black"></div>
        <Spotlight
          size={1200}
          fill="rgba(111, 63, 245, 0.65)" 
          className="z-[2]"
          springOptions={{ 
            bounce: 0.2, 
            damping: 20, 
            stiffness: 150
          }}
        />
      </div>
      
      {/* Capa adicional para efectos de brillo */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-[#7000ff]/10 via-transparent to-transparent"></div>
      </div>
      
      {/* Capa de gradiente para mejorar contraste y visibilidad del contenido */}
      <ParallaxLayer 
        depth={0.8} 
        speed={0.5} 
        className="absolute inset-0 z-1"
      >
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/40 to-black/60 opacity-70"></div>
      </ParallaxLayer>
      
      <ParallaxLayer 
        depth={0.6} 
        speed={0.3}
        className="absolute inset-0 opacity-20 z-1"
      >
        <div className="absolute w-[800px] h-[800px] rounded-full bg-[#ff00c3]/10 blur-3xl -top-[400px] -left-[400px]"></div>
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[#00ffcc]/10 blur-3xl -bottom-[300px] -right-[300px]"></div>
      </ParallaxLayer>
      
      <div className="absolute inset-0 bg-grid-pattern opacity-5 z-1"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <ParallaxLayer depth={0.2} speed={1.2} className="inline-block">
            <motion.span
              className="inline-block text-xl md:text-2xl font-bold px-6 py-2 rounded-full border border-purple-500/30 mb-6 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-[#00ffcc] via-[#7000ff] to-[#ff00c3]">
                MASSIVE PRIZE POOL
              </span>
              <div className="absolute inset-0 bg-black/70 backdrop-blur-md -z-5"></div>
            </motion.span>
          </ParallaxLayer>
          
          <ParallaxLayer depth={0.3} speed={0.8} className="block">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8">
              <span className="gradient-text inline-block">$1M+</span>{' '}
              <span className="text-white">in Prizes</span>
            </h2>
          </ParallaxLayer>
          
          <ParallaxLayer depth={0.1} speed={0.6} className="block mx-auto max-w-3xl">
            <motion.p 
              className="text-xl md:text-2xl text-gray-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Showcase your talent and win from our massive prize pool with
              <span className="text-[#00ffcc] font-bold px-2 inline-block">
                multiple award categories
              </span>
            </motion.p>
          </ParallaxLayer>
        </motion.div>

        {/* Contenedor principal de premios con animación mejorada */}
        <motion.div 
          layout
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-5xl mx-auto"
        >
          {/* Primeros 3 premios que siempre se muestran */}
          <div ref={firstThreePrizesRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            {prizes.slice(0, 3).map((prize) => (
              <motion.div
                key={prize.title}
                id={`prize-${prize.title}`}
                variants={prizeCardVariants}
                layoutId={`prize-${prize.title}`}
                className="perspective-1000"
              >
                <Card3D 
                  depth={15}
                  glare={true}
                  borderColor={`border-[${prize.colorFrom}]/30`}
                  glowColor={`after:bg-[${prize.colorFrom}]/10`}
                  className="h-full backdrop-blur-sm z-10 transform-gpu"
                >
                  <div className="relative p-[2px] rounded-2xl overflow-hidden h-full">
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-90"
                      style={{ backgroundImage: `linear-gradient(to bottom right, ${prize.colorFrom}, ${prize.colorTo})` }} 
                    />
                    <div className="relative bg-black/80 backdrop-blur-md rounded-2xl p-6 h-full flex flex-col">
                      <div className="flex items-center mb-4">
                        <div 
                          className="p-3 rounded-full mr-4"
                          style={{ color: prize.colorFrom }}
                        >
                          {prize.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white">{prize.title}</h3>
                      </div>
                      
                      <p 
                        className="text-4xl font-bold mb-4"
                        style={{ color: prize.colorFrom, textShadow: `0 0 10px ${prize.colorFrom}40` }}
                      >
                        {prize.amount}
                      </p>
                      <p className="text-gray-200 flex-grow text-sm">{prize.description}</p>
                      
                      <motion.div 
                        className="h-1 w-full mt-4 rounded-full"
                        style={{ backgroundImage: `linear-gradient(to right, ${prize.colorFrom}, ${prize.colorTo})` }}
                        initial={{ width: "0%" }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>

          {prizes.length > 3 && (
            <div className="text-center mt-6">
              <motion.button
                onClick={handleShowAllPrizes}
                className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                {"Show All Prizes"}
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Modal para mostrar todos los premios */}
        <Modal 
          isOpen={showAllPrizesModal} 
          onClose={handleCloseModal}
          title="All Hackathon Prizes"
          maxWidth="max-w-7xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
            {prizes.map((prize, index) => (
              <motion.div
                key={prize.title}
                custom={index}
                variants={modalPrizeCardVariants}
                initial="hidden"
                animate="visible"
                className="perspective-1000"
              >
                <Card3D 
                  depth={10}
                  glare={true}
                  borderColor={`border-[${prize.colorFrom}]/30`}
                  glowColor={`after:bg-[${prize.colorFrom}]/10`}
                  className="h-full backdrop-blur-sm z-10 transform-gpu"
                >
                  <div className="relative p-[2px] rounded-2xl overflow-hidden h-full">
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-90"
                      style={{ backgroundImage: `linear-gradient(to bottom right, ${prize.colorFrom}, ${prize.colorTo})` }} 
                    />
                    <div className="relative bg-black/80 backdrop-blur-md rounded-2xl p-6 h-full flex flex-col">
                      <div className="flex items-center mb-4">
                        <div 
                          className="p-3 rounded-full mr-4"
                          style={{ color: prize.colorFrom }}
                        >
                          {prize.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white">{prize.title}</h3>
                      </div>
                      
                      <p 
                        className="text-4xl font-bold mb-4"
                        style={{ color: prize.colorFrom, textShadow: `0 0 10px ${prize.colorFrom}40` }}
                      >
                        {prize.amount}
                      </p>
                      <p className="text-gray-200 flex-grow text-sm">{prize.description}</p>
                      
                      <motion.div 
                        className="h-1 w-full mt-4 rounded-full"
                        style={{ backgroundImage: `linear-gradient(to right, ${prize.colorFrom}, ${prize.colorTo})` }}
                        initial={{ width: "0%" }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                      />
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <motion.button
              onClick={handleCloseModal}
              className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              Close
            </motion.button>
          </div>
        </Modal>

        <ParallaxLayer depth={0.15} speed={0.7} className="mt-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-8 rounded-3xl backdrop-blur-md border border-white/10"
          >
            <div className="absolute inset-0 opacity-10 mix-blend-overlay rounded-3xl"></div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Join the Largest Hackathon in History?</h3>
            <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-4xl mx-auto">
              Additional prizes will be announced as more sponsors join the event.
              This is your once-in-a-lifetime opportunity to showcase your talent on the global stage!
            </p>
            <Link href="https://form.typeform.com/to/wf94YwH4" target="_blank" rel="noopener noreferrer">
              <motion.button 
                className="gradient-button text-xl px-10 py-4 rounded-full font-bold relative overflow-hidden group"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 30px rgba(0, 255, 204, 0.6)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">JOIN THE COMPETITION</span>
                <div className="absolute inset-0 -z-5 bg-gradient-to-r from-[#00ffcc] via-[#7000ff] to-[#ff00c3]"></div>
              </motion.button>
            </Link>
          </motion.div>
        </ParallaxLayer>
      </div>
    </ParallaxSection>
  );
};

export default PrizesSection; 