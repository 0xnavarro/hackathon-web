'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ParallaxLayer, ParallaxSection } from './ParallaxEffect';

// Sponsor interface
interface Sponsor {
  name: string;
  logo: string;
  description: string;
  website: string;
  isPlaceholder?: boolean;
}

const SponsorsSection = () => {
  const [selectedSponsor, setSelectedSponsor] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Lista de patrocinadores
  const sponsors: Sponsor[] = [
    // Patrocinadores reales
    { 
      name: 'Supabase', 
      logo: '/sponsors/Supabase_Logo.svg', 
      description: 'The open source Firebase alternative. Supabase provides all the backend features developers need to build a product: a Postgres database, Authentication, instant APIs, Edge Functions, Realtime subscriptions, and Storage.',
      website: 'https://supabase.com'
    },
    { 
      name: 'Cloudflare', 
      logo: '/sponsors/Cloudflare_Logo.svg', 
      description: 'Cloudflare is a global network designed to make everything you connect to the Internet secure, private, fast, and reliable.',
      website: 'https://cloudflare.dev'
    },
    { 
      name: 'Netlify', 
      logo: '/sponsors/Netlify_logo.svg', 
      description: 'Netlify is a web developer platform that multiplies productivity. By unifying the elements of the modern decoupled web, from local development to advanced edge logic.',
      website: 'https://netlify.com'
    },
    { 
      name: 'Sentry', 
      logo: '/sponsors/sentryio-ar21.svg', 
      description: 'Sentry provides application monitoring with a focus on error tracking. Gain valuable insight into the health of your applications.',
      website: 'https://sentry.io'
    },
    { 
      name: 'Algorand', 
      logo: '/sponsors/Algorand.svg', 
      description: 'The Algorand Foundation is dedicated to fulfilling the global promise of blockchain technology by leveraging the Algorand protocol and open source software.',
      website: 'https://algorand.foundation'
    },
    // Patrocinadores ficticios para rellenar espacios
    { 
      name: 'AteneaLabs', 
      logo: '/placeholder.svg', 
      description: 'Innovando en inteligencia artificial y blockchain para el futuro del desarrollo descentralizado.',
      website: '#',
      isPlaceholder: true
    },
    { 
      name: 'ELODAO', 
      logo: '/placeholder.svg', 
      description: 'Organización autónoma descentralizada enfocada en construir el futuro financiero democrático.',
      website: '#',
      isPlaceholder: true
    },
    { 
      name: 'TechNexus', 
      logo: '/placeholder.svg', 
      description: 'Acelerando el desarrollo tecnológico a través de la investigación avanzada y la innovación disruptiva.',
      website: '#',
      isPlaceholder: true
    },
    { 
      name: 'QuantumCode', 
      logo: '/placeholder.svg', 
      description: 'A fictional quantum computing platform for developers.',
      website: '#',
      isPlaceholder: true
    },
    { 
      name: 'MetaChain', 
      logo: '/placeholder.svg', 
      description: 'A fictional metaverse blockchain company building immersive experiences.',
      website: '#',
      isPlaceholder: true
    },
    { 
      name: 'HyperWeb', 
      logo: '/placeholder.svg', 
      description: 'A fictional web3 infrastructure provider.',
      website: '#',
      isPlaceholder: true
    },
    { 
      name: 'CodeNexus', 
      logo: '/placeholder.svg', 
      description: 'A fictional developer platform for building and deploying secure applications.',
      website: '#',
      isPlaceholder: true
    },
    { 
      name: 'ChainLabs', 
      logo: '/placeholder.svg', 
      description: 'A fictional blockchain research and development lab.',
      website: '#',
      isPlaceholder: true
    },
    { 
      name: 'TechNova', 
      logo: '/placeholder.svg', 
      description: 'A fictional technology innovation company focused on AI and blockchain.',
      website: '#',
      isPlaceholder: true
    },
    { 
      name: 'DataSphere', 
      logo: '/placeholder.svg', 
      description: 'A fictional data infrastructure company for decentralized applications.',
      website: '#',
      isPlaceholder: true
    },
    { 
      name: 'NeuralNet', 
      logo: '/placeholder.svg', 
      description: 'A fictional AI company focused on neural networks and machine learning.',
      website: '#',
      isPlaceholder: true
    },
    { 
      name: 'ZeroProtocol', 
      logo: '/placeholder.svg', 
      description: 'A fictional zero-knowledge protocol company.',
      website: '#',
      isPlaceholder: true
    },
    { 
      name: 'BlockchainVentures', 
      logo: '/placeholder.svg', 
      description: 'Empresa ficticia de capital de riesgo especializada en blockchain e inversiones en Web3.',
      website: '#',
      isPlaceholder: true
    },
    { 
      name: 'QuantumSphere', 
      logo: '/placeholder.svg', 
      description: 'Empresa ficticia de computación cuántica aplicada a la criptografía y seguridad de redes blockchain.',
      website: '#',
      isPlaceholder: true
    },
    { 
      name: 'FuturoFinance', 
      logo: '/placeholder.svg', 
      description: 'Plataforma ficticia de DeFi para la tokenización de activos del mundo real.',
      website: '#',
      isPlaceholder: true
    }
  ];

  // Filtrar patrocinadores por búsqueda
  const filteredSponsors = sponsors.filter(sponsor => 
    searchQuery === '' || sponsor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (index: number) => {
    if (sponsors[index].isPlaceholder) return;
    setSelectedSponsor(index);
  };

  const handleCloseModal = () => {
    setSelectedSponsor(null);
  };

  const handleVisitWebsite = (website: string) => {
    window.open(website, '_blank', 'noopener,noreferrer');
  };

  // Renderizar tarjeta de patrocinador
  const renderSponsorCard = (sponsor: Sponsor, index: number) => (
    <motion.div
      key={sponsor.name}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <div 
        className={`relative group overflow-hidden rounded-xl cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#7000ff] to-[#00ffcc] h-32 ${sponsor.isPlaceholder ? 'opacity-70' : ''} shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_30px_rgba(112,0,255,0.3)] hover:scale-105 hover:translate-y-[-5px]`}
        onClick={() => handleOpenModal(sponsors.findIndex(s => s.name === sponsor.name))}
        style={{
          transform: "perspective(1000px) rotateX(5deg)",
          transformStyle: "preserve-3d"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#7000ff]/20 via-[#00ffcc]/10 to-[#ff00c3]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute -inset-1 bg-gradient-to-r from-[#7000ff]/40 via-[#00ffcc]/30 to-[#ff00c3]/40 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
        
        <div className="relative h-full w-full flex items-center justify-center p-6 group-hover:transform group-hover:translate-z-20">
          {sponsor.isPlaceholder ? (
            <div className="text-white font-bold text-xl transform transition-transform duration-300 group-hover:scale-110">{sponsor.name}</div>
          ) : (
            <Image
              src={sponsor.logo}
              alt={sponsor.name}
              fill
              style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="p-4 transform transition-transform duration-300 group-hover:scale-110"
            />
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <ParallaxSection id="sponsors" className="py-32 relative bg-gradient-to-b from-black/90 via-[#7000ff]/20 to-black/95">
      {/* Elementos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M0,0 L20,0 L20,20 L40,20 L40,40 L60,40 L60,60 L80,60 L80,80 L100,80" 
                  fill="none" stroke="rgba(112, 0, 255, 0.6)" strokeWidth="0.5" />
            <path d="M0,100 L20,100 L20,80 L40,80 L40,60 L60,60 L60,40 L80,40 L80,20 L100,20" 
                  fill="none" stroke="rgba(0, 255, 204, 0.6)" strokeWidth="0.5" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>
        
        {/* Partículas animadas - valores fijos para prevenir errores de hidratación */}
        {[
          { x: 43, y: 6, opacity: 0.72, scale: 1.18 },
          { x: 37, y: 86, opacity: 0.74, scale: 0.89 },
          { x: 5, y: 84, opacity: 0.55, scale: 2.48 },
          { x: 30, y: 68, opacity: 0.40, scale: 1.66 },
          { x: 10, y: 65, opacity: 0.69, scale: 0.71 },
          { x: 31, y: 29, opacity: 0.68, scale: 1.47 },
          { x: 95, y: 25, opacity: 0.63, scale: 0.66 },
          { x: 49, y: 40, opacity: 0.53, scale: 2.17 },
          { x: 89, y: 15, opacity: 0.45, scale: 1.99 },
          { x: 51, y: 50, opacity: 0.68, scale: 1.69 },
          { x: 19, y: 94, opacity: 0.42, scale: 1.70 },
          { x: 9, y: 6, opacity: 0.50, scale: 1.58 },
          { x: 54, y: 20, opacity: 0.54, scale: 1.75 },
          { x: 45, y: 32, opacity: 0.78, scale: 1.79 },
          { x: 12, y: 82, opacity: 0.52, scale: 2.28 },
          { x: 95, y: 49, opacity: 0.75, scale: 1.27 },
          { x: 91, y: 76, opacity: 0.34, scale: 1.99 },
          { x: 71, y: 17, opacity: 0.35, scale: 1.54 },
          { x: 30, y: 17, opacity: 0.44, scale: 0.99 },
          { x: 41, y: 53, opacity: 0.65, scale: 2.41 }
        ].map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#3273ff]/30"
            initial={{
              x: `${particle.x}%`,
              y: `${particle.y}%`,
              opacity: particle.opacity,
              scale: particle.scale
            }}
            animate={{
              x: `${particle.x + (i % 2 === 0 ? 5 : -5)}%`,
              y: `${particle.y + (i % 3 === 0 ? 5 : -5)}%`,
              transition: {
                duration: 15 + i,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          >
            <div 
              className="absolute w-1 h-1 rounded-full bg-[#3273ff]/30"
              style={{
                opacity: particle.opacity,
                transform: `translateX(${particle.x}%) translateY(${particle.y}%) scale(${particle.scale})`
              }}
            ></div>
          </motion.div>
        ))}
      </div>
      
      <ParallaxLayer 
        depth={0.7} 
        speed={0.4} 
        className="absolute inset-0"
      >
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[#7000ff]/10 blur-[100px] -top-[100px] right-[10%]"></div>
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[#00ffcc]/10 blur-[100px] bottom-[10%] left-[5%]"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full bg-[#ff00c3]/5 blur-[80px] top-[40%] right-[25%]"></div>
      </ParallaxLayer>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <ParallaxLayer depth={0.2} speed={0.8}>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6">
              Our <span className="gradient-text">Sponsors</span>
            </h2>
          </ParallaxLayer>
          
          <ParallaxLayer depth={0.1} speed={0.5}>
            <p className="text-xl max-w-3xl mx-auto text-gray-300 mb-8">
              Thank you to our amazing sponsors who make this hackathon possible
            </p>
          </ParallaxLayer>

          {/* Buscador */}
          <div className="flex justify-center items-center mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search sponsor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-[#7000ff]/30 text-white placeholder-gray-400 outline-none w-full md:w-60 focus:border-[#00ffcc]/60 transition-all duration-300"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Vista de cuadrícula para todos los patrocinadores */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl mx-auto mb-12">
          {filteredSponsors.map((sponsor, index) => renderSponsorCard(sponsor, index))}
        </div>

        {/* Mensaje si no se encuentran patrocinadores */}
        {filteredSponsors.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 my-12"
          >
            No sponsors found matching the search criteria.
          </motion.p>
        )}
      </div>
      
      {/* Modal de detalles del patrocinador */}
      <AnimatePresence>
        {selectedSponsor !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          >
            <motion.div 
              className="relative bg-black/95 border border-[#7000ff]/30 rounded-2xl w-full max-w-2xl p-6 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 500 }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <svg className="absolute w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
                  <pattern id="tech-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M0,0 L20,0 L20,20 L0,20 Z" fill="none" stroke="rgba(0, 255, 204, 0.3)" strokeWidth="0.5" />
                  </pattern>
                  <rect x="0" y="0" width="100%" height="100%" fill="url(#tech-pattern)" />
                </svg>
              </div>
              
              <div 
                className="absolute inset-0 opacity-40 -z-10"
                style={{ 
                  background: `radial-gradient(circle at center, #7000ff40 0%, transparent 70%)`,
                  filter: 'blur(40px)'
                }}
              />
              
              <div className="flex justify-between items-start mb-6">
                <div className="relative h-14 w-48">
                  <Image
                    src={sponsors[selectedSponsor].logo}
                    alt={sponsors[selectedSponsor].name}
                    fill
                    style={{ objectFit: 'contain', objectPosition: 'left', filter: 'brightness(0) invert(1)' }}
                  />
                </div>
                
                <button 
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white p-2 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{sponsors[selectedSponsor].name}</h3>
              
              <p className="text-gray-300 mb-8">
                {sponsors[selectedSponsor].description}
              </p>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-all duration-300"
                >
                  Close
                </button>
                {!sponsors[selectedSponsor].isPlaceholder && (
                  <button
                    onClick={() => handleVisitWebsite(sponsors[selectedSponsor].website)}
                    className="ml-2 px-4 py-2 bg-gradient-to-r from-[#00ffcc] via-[#7000ff] to-[#ff00c3] text-white rounded hover:shadow-[0_0_15px_rgba(112,0,255,0.5)] transition-all duration-300"
                  >
                    Visit website
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ParallaxSection>
  );
};

export default SponsorsSection; 