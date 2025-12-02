import React from 'react';
import { motion } from 'framer-motion';

const BackgroundElements: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Top Right Pink Blob */}
      <motion.div 
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, 5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -right-20 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl mix-blend-multiply"
      />

      {/* Bottom Left Blue Blob */}
      <motion.div 
        animate={{ 
          y: [0, -30, 0],
          rotate: [0, -5, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] bg-blue-300/20 rounded-full blur-3xl mix-blend-multiply"
      />

      {/* Center Orange Blob */}
      <motion.div 
        animate={{ 
          x: [0, 40, 0],
          y: [0, 30, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-2xl max-h-2xl bg-orange-200/10 rounded-full blur-3xl mix-blend-overlay"
      />
      
      {/* Floating Geometric Shapes */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-10 text-blue-500/5 text-9xl font-black opacity-20"
      >
        ZPD
      </motion.div>

      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 right-10 text-orange-500/5 text-9xl font-black opacity-20"
      >
        ZOOTOPIA
      </motion.div>
    </div>
  );
};

export default BackgroundElements;
