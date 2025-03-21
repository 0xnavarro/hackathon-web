'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer = () => {
  const footerLinks = [
    { name: 'Twitter', href: 'https://twitter.com/bolt_new' },
    { name: 'GitHub', href: 'https://github.com/bolt-new' },
    { name: 'Terms', href: '#terms' },
    { name: 'Privacy', href: '#privacy' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <footer className="bg-gradient-to-b from-black to-[#0e0a14] pt-20 border-t border-white/5 relative overflow-hidden">
      {/* Background elements */}
      <motion.div 
        className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
      />
      
      <div className="absolute inset-0 bg-gradient-radial from-[#7000ff]/5 via-transparent to-transparent z-0"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-16">
          {/* Brand column */}
          <div className="space-y-6">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.span 
                className="text-lg font-bold flex items-center"
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
                  className="text-white ml-1"
                >
                  HACKATHON
                </motion.span>
              </motion.span>
            </motion.div>
            
            <p className="text-gray-400 text-sm leading-relaxed">
              Join the world&apos;s largest hackathon with over $1M in prizes and connect with innovators from around the globe.
            </p>
            
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-500">Powered by</p>
              <Link href="https://bolt.new" target="_blank" rel="noopener noreferrer">
                <motion.span 
                  className="text-white font-medium hover:text-[#00ffcc] transition-colors"
                  whileHover={{ 
                    textShadow: "0 0 8px rgba(0, 255, 204, 0.5)"
                  }}
                >
                  bolt.new
                </motion.span>
              </Link>
            </div>
          </div>
          
          {/* Links column */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-4">Links</h3>
                <ul className="space-y-3">
                  {footerLinks.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-gray-400 hover:text-[#00ffcc] text-sm transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-4">Resources</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="#docs" className="text-gray-400 hover:text-[#00ffcc] text-sm transition-colors">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="#api" className="text-gray-400 hover:text-[#00ffcc] text-sm transition-colors">
                      API
                    </Link>
                  </li>
                  <li>
                    <Link href="#support" className="text-gray-400 hover:text-[#00ffcc] text-sm transition-colors">
                      Support
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-4">Contact</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="mailto:info@hackathon.dev" className="text-gray-400 hover:text-[#00ffcc] text-sm transition-colors">
                      info@hackathon.dev
                    </Link>
                  </li>
                  <li>
                    <Link href="#press" className="text-gray-400 hover:text-[#00ffcc] text-sm transition-colors">
                      Press Kit
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} The Global Ultimate Hackathon. All rights reserved.
              </p>
              <div className="text-gray-500 text-sm flex items-center">
                <span>made by</span>
                <Link 
                  href="https://x.com/0xnavarro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00ffcc] hover:underline ml-1 hover:text-white transition-colors"
                >
                  Carlos Navarro
                </Link>
              </div>
            </div>
            
            <div className="flex space-x-6">
              {['Twitter', 'GitHub', 'Discord'].map((platform) => (
                <Link 
                  key={platform}
                  href="#"
                  className="text-gray-400 hover:text-[#00ffcc] transition-colors"
                  aria-label={platform}
                >
                  <motion.svg 
                    className="w-5 h-5" 
                    fill="currentColor" 
                    viewBox="0 0 24 24" 
                    aria-hidden="true"
                    whileHover={{ scale: 1.2 }}
                  >
                    <path 
                      fillRule="evenodd" 
                      d={
                        platform === 'Twitter' 
                          ? "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" 
                          : platform === 'GitHub'
                          ? "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          : "M19.54 0c1.356 0 2.46 1.104 2.46 2.472v21.528l-2.58-2.28-1.452-1.344-1.536-1.428.636 2.22h-13.608c-1.356 0-2.46-1.104-2.46-2.472v-16.224c0-1.368 1.104-2.472 2.46-2.472h16.08zm-4.632 15.672c2.652-.084 3.672-1.824 3.672-1.824 0-3.864-1.728-6.996-1.728-6.996-1.728-1.296-3.372-1.26-3.372-1.26l-.168.192c2.04.624 2.988 1.524 2.988 1.524-1.248-.684-2.472-1.02-3.612-1.152-.864-.096-1.692-.072-2.424.024l-.204.024c-.42.036-1.44.192-2.724.756-.444.204-.708.348-.708.348s.996-.948 3.156-1.572l-.12-.144s-1.644-.036-3.372 1.26c0 0-1.728 3.132-1.728 6.996 0 0 1.008 1.74 3.66 1.824 0 0 .444-.54.804-.996-1.524-.456-2.1-1.416-2.1-1.416l.336.204.048.036.047.027.014.006.047.027c.3.168.6.3.876.408.492.192 1.08.384 1.764.516.9.168 1.956.228 3.108.012.564-.096 1.14-.264 1.74-.516.42-.156.888-.384 1.38-.708 0 0-.6.984-2.172 1.428.36.456.792.972.792.972zm-5.58-5.604c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332.012-.732-.54-1.332-1.224-1.332zm4.38 0c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332 0-.732-.54-1.332-1.224-1.332z"
                      } 
                      clipRule="evenodd" 
                    />
                  </motion.svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 