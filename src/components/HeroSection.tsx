'use client';

import { motion } from 'framer-motion';
import Earth from './globe';
import { Sparkles } from './sparkles';
import { SplashCursor } from './ui/splash-cursor';

const HeroSection = () => {
  return (
    <section id="hero" className="relative h-screen overflow-hidden bg-[#010114] text-white">
      {/* Efecto fluido - ahora con z-index bajo */}
      <SplashCursor 
        SIM_RESOLUTION={128}
        DYE_RESOLUTION={1024}
        DENSITY_DISSIPATION={2.8}
        VELOCITY_DISSIPATION={1.8}
        CURL={4}
        SPLAT_RADIUS={0.15}
        SPLAT_FORCE={6000}
        COLOR_UPDATE_SPEED={12}
        BACK_COLOR={{ r: 0.05, g: 0.1, b: 0.4 }}
        TRANSPARENT={true}
        OPACITY={0.95}
      />
      
      {/* Background stars */}
      <div className="absolute inset-0 z-0">
        <Sparkles
          density={1200}
          speed={0.5}
          size={0.7}
          direction="top"
          opacitySpeed={3}
          color="#ffffff"
          className="absolute inset-0 h-full w-full opacity-70"
        />
      </div>

      {/* Cosmic effects and nebulae */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(50,115,255,0.15),transparent_70%)] opacity-70"></div>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(138,43,226,0.2),transparent_70%)] opacity-60"></div>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,rgba(25,25,112,0.3),transparent_70%)] opacity-60"></div>
      
      {/* Main container */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pt-10 sm:pt-0">
        {/* Earth globe - repositioned to be higher and larger */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute left-1/2 top-2/5 z-0 w-full max-w-lg -translate-x-1/2 -translate-y-1/3 md:max-w-xl lg:max-w-2xl xl:max-w-4xl"
        >
          <Earth 
            baseColor={[0.1, 0.2, 0.8]}
            glowColor={[0.2, 0.4, 1]}
            scale={1.2}
            mapSamples={50000}
            mapBrightness={6}
          />
        </motion.div>

        {/* Text content - moved higher and increased font size */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10 mt-8 text-center md:mt-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mb-6 inline-block transform rounded-full border border-blue-400/30 bg-blue-900/20 px-3 py-1 text-sm backdrop-blur-sm sm:text-base"
          >
            Virtual • Date: TBA • Global
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl xl:text-8xl"
          >
            <span className="block text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">THE WORLD&apos;S</span>
            <span className="bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-400 bg-clip-text text-transparent">LARGEST HACKATHON</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mx-auto mt-6 max-w-2xl text-base font-bold text-blue-100 md:text-lg lg:text-xl bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 bg-clip-text text-transparent"
          >
            Join the ultimate tech competition with over +$1M in prizes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8"
          >
            <a
              href="https://form.typeform.com/to/wf94YwH4"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-block rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 text-base font-medium text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(79,70,229,0.8)] md:px-8 md:py-3 md:text-lg overflow-hidden"
            >
              <span className="relative z-10">REGISTER NOW</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 transition-transform duration-300 ease-out group-hover:translate-x-0"></span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-6 flex items-center justify-center text-xs text-blue-200 md:text-sm"
          >
            <span>Powered by</span>
            <span className="ml-2 font-semibold text-white">bolt.new</span>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 z-5 h-32 bg-gradient-to-t from-[#010114] to-transparent"></div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        animate={{ 
          y: [0, 10, 0],
          opacity: [0.3, 1, 0.3]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      >
        <svg className="h-5 w-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
};

export default HeroSection; 