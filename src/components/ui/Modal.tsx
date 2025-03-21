'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  title = "", 
  maxWidth = "max-w-2xl" 
}) => {
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Add listeners to close with ESC key
  useEffect(() => {
    const handleEscClose = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    // Prevent body scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscClose);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscClose);
    };
  }, [isOpen, onClose]);

  // Close if clicking outside the modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.5,
        bounce: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.98,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-hidden"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Modal Content */}
          <motion.div
            ref={modalContentRef}
            className={`relative bg-black/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 w-full ${maxWidth} max-h-[90vh] overflow-y-auto hide-scrollbar shadow-xl`}
            variants={modalVariants}
          >
            {/* Close button - ampliado y con mejor posicionamiento */}
            <button
              className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 transition-colors group"
              onClick={onClose}
              aria-label="Close"
            >
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
                className="w-6 h-6 flex items-center justify-center"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  className="w-5 h-5 text-white group-hover:text-white/80"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.div>
            </button>
            
            {/* Modal Title */}
            {title && (
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
              </div>
            )}
            
            {/* Modal Body */}
            <div className="px-1">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 