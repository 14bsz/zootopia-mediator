import React from 'react';
import { motion } from 'framer-motion';

interface CharacterCardProps {
  character: 'judy' | 'nick';
  text: string;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, text }) => {
  const isJudy = character === 'judy';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative p-6 rounded-2xl border-2 shadow-sm group hover:shadow-md transition-shadow ${
        isJudy 
          ? 'bg-[#F0F7FF] border-[#BFDBFE]' 
          : 'bg-[#FFF7ED] border-[#FED7AA]'
      }`}
    >
      <div className="flex items-start gap-4 sm:gap-6">
        {/* Avatar */}
        <div className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-4xl shadow-inner overflow-hidden border-4 ${
          isJudy ? 'bg-blue-100 border-white' : 'bg-orange-100 border-white'
        }`}>
          <span className="z-10 relative">{isJudy ? '🐰' : '🦊'}</span>
          {/* Decorative Pattern Background */}
          <div className={`absolute inset-0 opacity-20 ${isJudy ? 'bg-blue-500' : 'bg-orange-500'}`} style={{ backgroundImage: 'radial-gradient(circle, #fff 10%, transparent 10%)', backgroundSize: '8px 8px' }}></div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`font-black text-lg ${isJudy ? 'text-blue-800' : 'text-orange-800'}`}>
              {isJudy ? 'Officer Judy' : 'Nick Wilde'}
            </h3>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
               isJudy ? 'bg-blue-200 text-blue-700' : 'bg-orange-200 text-orange-700'
            }`}>
              {isJudy ? 'ZPD ANALYSIS' : 'SLY COMMENT'}
            </span>
          </div>
          
          <div className="relative">
             {/* Quote icon */}
             <span className={`absolute -left-3 -top-1 text-3xl font-serif opacity-20 ${isJudy ? 'text-blue-600' : 'text-orange-600'}`}>“</span>
             <p className={`relative z-10 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium ${isJudy ? 'text-slate-700' : 'text-stone-700'}`}>
               {text}
             </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CharacterCard;