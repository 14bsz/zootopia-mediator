import React from 'react';
import { MediationResult, UserInput } from '../types';
import CharacterCard from './CharacterCard';
import { motion } from 'framer-motion';
import { CheckCircle, RefreshCcw, HeartHandshake, FileText, ArrowRight } from 'lucide-react';

interface ResultSectionProps {
  result: MediationResult;
  userA: UserInput;
  userB: UserInput;
  onReconcile: () => void;
  onReset: () => void;
}

const ResultSection: React.FC<ResultSectionProps> = ({ result, userA, userB, onReconcile, onReset }) => {
  const nameA = (userA.name && userA.name.trim().length > 0) ? userA.name : '兔子';
  const nameB = (userB.name && userB.name.trim().length > 0) ? userB.name : '狐狸';
  const { partyA, partyB } = result.responsibility;
  const majorIsA = partyA >= partyB;
  const majorName = majorIsA ? nameA : nameB;
  const minorName = majorIsA ? nameB : nameA;
  const majorPct = majorIsA ? partyA : partyB;
  const minorPct = majorIsA ? partyB : partyA;
  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 pb-12">
      
      {/* Case Header with "Top Secret" vibe */}
      <div className="text-center mb-8 relative">
         <motion.div 
           initial={{ rotate: -10, opacity: 0, scale: 2 }}
           animate={{ rotate: -10, opacity: 1, scale: 1 }}
           transition={{ type: "spring", bounce: 0.5 }}
           className="absolute -top-8 right-4 md:right-20 border-[4px] border-red-700/40 text-red-700/40 font-black text-4xl px-6 py-2 rounded uppercase tracking-widest pointer-events-none transform rotate-12 mask-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAIAIqwMCPDjPwAAAAASUVORK5CYII=)"
         >
            绝密档案
         </motion.div>
         <div className="inline-block bg-white/50 backdrop-blur-sm px-6 py-2 rounded-full border border-white/60 shadow-sm mb-4">
             <div className="flex items-center gap-2 text-sky-800 font-bold text-sm uppercase tracking-wider">
                <FileText size={16} />
                <span>案件编号 #2024-ZPD-{Math.floor(Math.random() * 1000)}</span>
             </div>
         </div>
         <h2 className="text-4xl md:text-6xl font-black text-sky-900 mb-2 tracking-tight drop-shadow-sm">
            AI 搭档评理结果
         </h2>
      </div>

      {/* Responsibility Bar - Tug of War */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-white relative overflow-hidden"
      >
        <div className="p-8 md:p-10">
            <h3 className="text-center font-black text-slate-300 text-xs uppercase tracking-[0.3em] mb-10">责任占比分析</h3>
            
            <div className="flex items-end justify-between mb-4 px-4">
               <div className="flex flex-col items-start">
                  <div className="flex items-center gap-3 mb-2">
                      <div className="text-5xl filter drop-shadow-lg transform -scale-x-100">🐰</div>
                      <div className="flex flex-col">
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{nameA}</span>
                          <span className="text-xl font-black text-slate-700">{nameA}</span>
                      </div>
                  </div>
                  <span className="text-4xl font-black text-pink-500 tabular-nums">{result.responsibility.partyA}%</span>
               </div>
               
               <div className="text-3xl font-black italic text-slate-200 pb-2">VS</div>
               
               <div className="flex flex-col items-end">
                  <div className="flex items-center gap-3 flex-row-reverse mb-2">
                      <div className="text-5xl filter drop-shadow-lg">🦊</div>
                      <div className="flex flex-col items-end">
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{nameB}</span>
                          <span className="text-xl font-black text-slate-700">{nameB}</span>
                      </div>
                  </div>
                  <span className="text-4xl font-black text-orange-500 tabular-nums">{result.responsibility.partyB}%</span>
               </div>
            </div>

            {/* The Bar */}
            <div className="relative h-14 bg-slate-100 rounded-full overflow-hidden flex shadow-inner border-[6px] border-white box-content">
              <motion.div 
                initial={{ width: "50%" }}
                animate={{ width: `${result.responsibility.partyA}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-full bg-gradient-to-r from-pink-400 to-pink-500 relative"
              >
                  {/* Pattern */}
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2.5px)', backgroundSize: '10px 10px' }}></div>
              </motion.div>
              
              {/* Center Indicator */}
              <div className="absolute top-0 bottom-0 w-2 bg-white left-[50%] -translate-x-1/2 z-10 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-[10px] font-bold text-slate-400 border-2 border-slate-100">
                     50
                  </div>
              </div>

              <motion.div 
                initial={{ width: "50%" }}
                animate={{ width: `${result.responsibility.partyB}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-full bg-gradient-to-l from-orange-400 to-orange-500 relative"
              >
                  {/* Pattern */}
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(45deg, #fff 25%, transparent 25%, transparent 50%, #fff 50%, #fff 75%, transparent 75%, transparent)', backgroundSize: '10px 10px' }}></div>
              </motion.div>
            </div>
        </div>
      </motion.div>

      {/* Analysis Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Judy's Analysis */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="bg-white/90 backdrop-blur rounded-[2rem] p-8 shadow-xl border border-white relative overflow-visible"
        >
           <div className="absolute -top-8 left-8 w-20 h-20 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center text-5xl border-4 border-white rotate-[-6deg]">
              🐰
           </div>
           <div className="mt-8">
              <h4 className="font-black text-2xl text-blue-900 mb-4">朱迪的分析</h4>
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 text-blue-900/80 leading-relaxed font-medium relative">
                 <div className="mb-3 text-sm font-bold text-blue-700">判定：主要责任在 {majorName}（{majorPct}%），次要责任在 {minorName}（{minorPct}%）</div>
                 <span className="absolute -top-3 -left-2 text-4xl text-blue-200">“</span>
                 {result.judyAnalysis}
                 <span className="absolute -bottom-6 -right-2 text-4xl text-blue-200 rotate-180">“</span>
              </div>
           </div>
        </motion.div>

        {/* Nick's Comment */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
           className="bg-white/90 backdrop-blur rounded-[2rem] p-8 shadow-xl border border-white relative overflow-visible"
        >
           <div className="absolute -top-8 right-8 w-20 h-20 bg-orange-500 rounded-2xl shadow-lg shadow-orange-500/30 flex items-center justify-center text-5xl border-4 border-white rotate-[6deg]">
              🦊
           </div>
           <div className="mt-8 text-right">
              <h4 className="font-black text-2xl text-orange-900 mb-4">尼克的锐评</h4>
              <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 text-orange-900/80 leading-relaxed font-medium text-left relative">
                 <span className="absolute -top-3 -left-2 text-4xl text-orange-200">“</span>
                 {result.nickComment}
                 <span className="absolute -bottom-6 -right-2 text-4xl text-orange-200 rotate-180">“</span>
              </div>
           </div>
        </motion.div>
      </div>

      {/* Advice Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.4 }}
           className="bg-[#fffdf5] rounded-2xl p-8 shadow-lg border border-yellow-100/50 relative overflow-hidden group hover:-translate-y-1 transition-transform rotate-[-1deg]"
        >
          {/* Tape effect */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-200/60 backdrop-blur-sm transform rotate-1 shadow-sm"></div>
          
          <h4 className="font-black text-pink-600 mb-4 flex items-center gap-3">
            <span className="bg-pink-100 px-3 py-1 rounded-lg text-xs uppercase tracking-wide">给她的建议</span>
            <span className="text-lg text-slate-700">{nameA}</span>
          </h4>
          <p className="text-slate-600 font-medium leading-relaxed">{result.adviceForA}</p>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.5 }}
           className="bg-[#fffdf5] rounded-2xl p-8 shadow-lg border border-yellow-100/50 relative overflow-hidden group hover:-translate-y-1 transition-transform rotate-[1deg]"
        >
          {/* Tape effect */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-200/60 backdrop-blur-sm transform -rotate-1 shadow-sm"></div>

          <h4 className="font-black text-orange-600 mb-4 flex items-center gap-3">
            <span className="bg-orange-100 px-3 py-1 rounded-lg text-xs uppercase tracking-wide">给他的建议</span>
            <span className="text-lg text-slate-700">{nameB}</span>
          </h4>
          <p className="text-slate-600 font-medium leading-relaxed">{result.adviceForB}</p>
        </motion.div>
      </div>

      {/* Reconciliation Plan */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/60 backdrop-blur-md rounded-[2rem] p-8 md:p-10 border border-white shadow-xl"
      >
        <div className="flex items-center gap-4 mb-8">
           <div className="bg-green-100 p-3 rounded-xl text-green-600">
             <HeartHandshake size={32} />
           </div>
           <div>
             <h3 className="text-2xl font-black text-slate-800">和解行动清单</h3>
             <p className="text-slate-500 text-sm font-bold">按照这个做，立马恢复默契！</p>
           </div>
        </div>

        <div className="space-y-2">
          {result.reconciliationPlan.slice(0, 5).map((plan, idx) => (
            <p key={idx} className="text-slate-700 leading-relaxed font-medium">
              {idx + 1}. {plan}
            </p>
          ))}
        </div>
        
        <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={onReconcile}
              className="flex-1 bg-gradient-to-b from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-black py-5 px-8 rounded-2xl shadow-lg shadow-green-200 flex items-center justify-center gap-3 transform hover:-translate-y-1 active:scale-95 transition-all border-b-4 border-green-600 active:border-b-0 active:translate-y-1"
            >
              <CheckCircle size={24} className="animate-bounce" />
              <span className="text-xl">我们和好了！(恢复默契)</span>
            </button>
            <button 
              onClick={onReset}
              className="flex-1 bg-white border-2 border-slate-200 text-slate-500 font-bold py-5 px-8 rounded-2xl hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCcw size={20} />
              <span>发起新评理</span>
            </button>
        </div>
      </motion.div>

    </div>
  );
};

export default ResultSection;
