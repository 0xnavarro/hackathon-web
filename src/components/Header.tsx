'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Home', href: '#hero' },
    { name: 'Prizes', href: '#prizes' },
    { name: 'Judges', href: '#judges' },
    { name: 'Sponsors', href: '#sponsors' },
    { name: 'Join', href: 'https://form.typeform.com/to/wf94YwH4', isButton: true }
  ];

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-lg py-1' : 'bg-black/20 backdrop-blur-sm py-2'}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.1, 0.9, 0.2, 1] }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="#hero" className="flex items-center relative group">
            <motion.span 
              className="text-lg md:text-xl font-bold flex items-center"
              whileHover={{ scale: 1.03 }}
            >
              <motion.span 
                className="text-white mr-1"
              >
                THE
              </motion.span>
              <motion.span 
                className="gradient-text"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                LARGEST
              </motion.span> 
              <motion.span 
                className="text-white ml-1 hidden md:inline"
              >
                HACKATHON IN HISTORY
              </motion.span>
              <motion.span 
                className="text-white ml-1 md:hidden"
              >
                HACKATHON
              </motion.span>
            </motion.span>
          </Link>
          
          <motion.span
            className="text-xs text-gray-400 ml-3 border-l border-gray-700 pl-3 tracking-wider items-center hidden md:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <span className="text-gray-400">by</span>
            <motion.span 
              className="ml-1 text-white hover:text-[#00ffcc] transition-colors font-semibold"
              whileHover={{ 
                textShadow: "0 0 8px rgba(0, 255, 204, 0.5)"
              }}
            >
              bolt.new
            </motion.span>
          </motion.span>
        </motion.div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 items-center">
          {menuItems.map((item, index) => (
            item.isButton ? (
              <motion.div
                key={item.name} 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 255, 204, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={item.href} target="_blank" rel="noopener noreferrer" 
                  className="gradient-border px-4 py-1 rounded-full font-bold bg-black hover:bg-black/80 transition-all text-white text-sm">
                  {item.name}
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key={item.name} 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
              >
                <Link href={item.href}
                  className="text-white hover:text-[#00ffcc] transition-colors text-sm font-medium">
                  {item.name}
                </Link>
              </motion.div>
            )
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <motion.button 
            onClick={handleMenuToggle} 
            className="text-white p-1 bg-black/50 backdrop-blur-md rounded-md"
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/95 backdrop-blur-xl py-3 border-t border-white/10"
          >
            <div className="container mx-auto px-4 flex flex-col space-y-3">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    href={item.href}
                    className={`text-center py-2 block ${item.isButton 
                      ? 'rounded-full font-bold transition-all text-white px-6 py-3 mx-auto max-w-[200px] relative overflow-hidden group' 
                      : 'text-white hover:text-[#00ffcc] transition-colors'
                    }`}
                    onClick={() => setIsOpen(false)}
                    target={item.isButton ? "_blank" : undefined}
                    rel={item.isButton ? "noopener noreferrer" : undefined}
                  >
                    {item.isButton ? (
                      <>
                        <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-[#00ffcc] via-[#7000ff] to-[#ff00c3] font-bold text-lg">
                          {item.name}
                        </span>
                        <span className="absolute inset-0 bg-black border border-[#00ffcc]/30 rounded-full group-hover:border-[#00ffcc]/60 transition-all duration-300"></span>
                        <span className="absolute inset-0 bg-gradient-to-r from-[#00ffcc]/10 via-[#7000ff]/10 to-[#ff00c3]/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                      </>
                    ) : (
                      item.name
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header; 