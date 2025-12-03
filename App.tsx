import React, { useState, useEffect } from 'react';
import { AppStep, UserInput, MediationResult } from './types';
import InputSection from './components/InputSection';
import ResultSection from './components/ResultSection';
import BackgroundElements from './components/BackgroundElements';
import { analyzeDispute } from './services/geminiService';
import { Shield, Loader2, Sparkles, AlertCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock initial data
const initialUser: UserInput = { name: '', role: 'A', description: '', demand: '', image: null };

export default function App() {
  const [step, setStep] = useState<AppStep>(AppStep.ONBOARDING);
  const [userA, setUserA] = useState<UserInput>({ ...initialUser, role: 'A' });
  const [userB, setUserB] = useState<UserInput>({ ...initialUser, role: 'B' });
  const [result, setResult] = useState<MediationResult | null>(null);
  const [score, setScore] = useState<number>(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load score from local storage
  useEffect(() => {
    const savedScore = localStorage.getItem('zootopia_synergy_score');
    if (savedScore) {
      setScore(parseInt(savedScore, 10));
    }
  }, []);

  const saveScore = (newScore: number) => {
    const clamped = Math.max(0, Math.min(100, newScore));
    setScore(clamped);
    localStorage.setItem('zootopia_synergy_score', clamped.toString());
  };

  const handleStart = () => {
    setStep(AppStep.INPUT);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setStep(AppStep.ANALYZING);

    try {
      const data = await analyzeDispute(userA, userB);
      setResult(data);
      saveScore(score + data.synergyScoreChange); 
      setStep(AppStep.RESULT);
    } catch (err: any) {
      console.error(err);
      setError("ZPD 信号丢失！请检查网络连接（或 API Key）后再试一次～");
      setStep(AppStep.INPUT);
    } finally {
      setLoading(false);
    }
  };

  const handleReconcile = () => {
    saveScore(score + 5); 
    setStep(AppStep.RECONCILIATION);
  };

  const handleReset = () => {
    setUserA({ ...initialUser, role: 'A', name: userA.name }); 
    setUserB({ ...initialUser, role: 'B', name: userB.name });
    setResult(null);
    setStep(AppStep.INPUT);
  };

  const getScoreBadge = (s: number) => {
    if (s >= 90) return { label: '最佳搭档', color: 'text-yellow-600', bg: 'bg-yellow-50/80 border-yellow-200', icon: '🥇', shadow: 'shadow-yellow-100' };
    if (s >= 80) return { label: '优秀拍档', color: 'text-blue-600', bg: 'bg-blue-50/80 border-blue-200', icon: '🥈', shadow: 'shadow-blue-100' };
    return { label: '磨合期', color: 'text-orange-600', bg: 'bg-orange-50/80 border-orange-200', icon: '🥉', shadow: 'shadow-orange-100' };
  };

  const badge = getScoreBadge(score);

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 selection:bg-pink-200 relative overflow-x-hidden">
      
      {/* Background Elements */}
      <BackgroundElements />

      {/* Header */}
      <header className="fixed top-0 w-full z-50 transition-all duration-300 px-4 pt-4 pointer-events-none">
        <div className="max-w-5xl mx-auto px-6 py-3 flex justify-between items-center pointer-events-auto">
          <div 
            className="flex items-center gap-3 cursor-pointer group select-none" 
            onClick={() => setStep(AppStep.ONBOARDING)}
          >
             <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 text-white p-2 rounded-full shadow-md transform group-hover:rotate-12 transition-transform duration-300">
               <Shield size={20} fill="currentColor" className="opacity-90" />
             </div>
             <div className="flex flex-col">
               <h1 className="font-black text-lg text-slate-800 tracking-tight leading-none group-hover:text-blue-600 transition-colors flex items-center gap-1">
                 <span>Zootopia</span>
                 <span className="text-pink-500">Mediator</span>
               </h1>
             </div>
          </div>
          
          <div className={`flex items-center gap-3 px-4 py-1.5 rounded-full border shadow-sm transition-all ${badge.bg} ${badge.shadow}`}>
             <div className="text-xl filter drop-shadow-sm transform hover:scale-110 transition-transform cursor-default" title="默契等级">{badge.icon}</div>
             <div className="flex flex-col items-end leading-none">
                <span className="text-[9px] uppercase font-bold text-slate-400 mb-0.5 tracking-wider">默契值</span>
                <span className={`font-black text-lg tabular-nums ${badge.color}`}>{score}</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-6 pt-32 flex flex-col justify-center min-h-[calc(100vh-60px)] relative z-10">
        
        <AnimatePresence mode="wait">
          {/* Step 1: Onboarding */}
          {step === AppStep.ONBOARDING && (
            <motion.div 
              key="onboarding"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              className="text-center space-y-12 py-12 relative"
            >
              <div className="relative inline-block group cursor-default select-none">
                 {/* Decorative Circle */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
                 
                 <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} 
                    className="text-[10rem] mb-4 drop-shadow-2xl relative z-10 inline-block"
                 >
                    🚓
                 </motion.div>
                 
                 <motion.div 
                   animate={{ rotate: [0, 10, 0], x: [0, 10, 0] }}
                   transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                   className="absolute -right-16 -top-10 text-8xl drop-shadow-xl z-20 transform hover:scale-110 transition-transform cursor-pointer"
                 >
                   🐰
                 </motion.div>
                 <motion.div 
                    animate={{ rotate: [0, -5, 0], x: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
                    className="absolute -left-16 bottom-0 text-8xl drop-shadow-xl z-20 transform hover:scale-110 transition-transform cursor-pointer"
                 >
                   🦊
                 </motion.div>
              </div>
              
              <div className="space-y-6 max-w-3xl mx-auto relative z-10">
                <h2 className="text-5xl md:text-7xl font-black text-slate-800 drop-shadow-sm tracking-tight leading-[1.1]">
                  <span className="inline-block transform hover:-rotate-2 transition-transform duration-300 origin-bottom-right">吵架了？</span><br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-orange-500 animate-gradient-x">
                    找朱迪和尼克评评理！
                  </span>
                </h2>
                <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed opacity-90">
                  别让小误会变成大麻烦。<br className="hidden md:block"/>
                  输入你们的委屈，AI 动物城搭档将在 <span className="font-black text-blue-600 bg-blue-50 px-2 rounded">10 秒</span> 内给出最幽默公正的裁决。
                </p>
              </div>
              
              <motion.button 
                onClick={handleStart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center justify-center gap-4 bg-slate-900 hover:bg-slate-800 text-white text-xl font-bold py-6 px-16 rounded-full shadow-2xl shadow-blue-900/20 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Sparkles className="w-6 h-6 relative z-10" />
                <span className="relative z-10">开始评理</span>
                <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          )}

          {/* Step 2: Input */}
          {step === AppStep.INPUT && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98, filter: "blur(10px)" }}
              transition={{ duration: 0.4 }}
            >
              <InputSection 
                userA={userA} 
                userB={userB} 
                setUserA={setUserA} 
                setUserB={setUserB} 
                onSubmit={handleSubmit} 
              />
            </motion.div>
          )}

          {/* Step 3: Loading / Analyzing */}
          {step === AppStep.ANALYZING && (
             <motion.div 
               key="analyzing"
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
               className="flex flex-col items-center justify-center py-24 text-center space-y-10 bg-white/80 backdrop-blur-2xl rounded-[3rem] p-12 border border-white/80 shadow-2xl mx-auto max-w-xl relative overflow-hidden"
             >
                {/* Decorative background elements for loading */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 animate-gradient-x"></div>

                <div className="relative">
                  <div className="absolute inset-0 bg-blue-200 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                  <Loader2 className="w-24 h-24 text-blue-600 animate-spin relative z-10 drop-shadow-lg" strokeWidth={2} />
                  <div className="absolute inset-0 flex items-center justify-center text-5xl z-10 animate-bounce">🍩</div>
                </div>
                
                <div className="relative z-10 w-full">
                  <h3 className="text-3xl font-black text-slate-800 mb-4">案件受理中...</h3>
                  
                  <div className="space-y-4 w-full bg-slate-50/50 p-6 rounded-2xl border border-white/50">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center gap-4 bg-white p-3 rounded-xl shadow-sm"
                    >
                      <span className="text-3xl bg-pink-100 p-2 rounded-full">🐰</span> 
                      <span className="font-bold text-slate-700">朱迪正在调取监控录像...</span>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.5 }}
                      className="flex items-center gap-4 bg-white p-3 rounded-xl shadow-sm"
                    >
                      <span className="text-3xl bg-orange-100 p-2 rounded-full">🦊</span> 
                      <span className="font-bold text-slate-700">尼克正在买爪爪冰棍...</span>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 3.5 }}
                      className="flex items-center gap-4 bg-white/50 p-3 rounded-xl border border-dashed border-slate-300"
                    >
                      <span className="text-3xl grayscale opacity-70">🦥</span> 
                      <span className="font-medium text-slate-500 italic">闪...电...正...在...听...</span>
                    </motion.div>
                  </div>
                </div>
             </motion.div>
          )}

          {/* Step 4: Results */}
          {(step === AppStep.RESULT || step === AppStep.RECONCILIATION) && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.3 }}
            >
              <ResultSection 
                result={result} 
                userA={userA} 
                userB={userB}
                onReconcile={handleReconcile}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Notification */}
        <AnimatePresence>
          {error && step === AppStep.INPUT && (
             <motion.div 
               initial={{ opacity: 0, y: 50, scale: 0.9 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-100 text-red-800 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50 max-w-sm w-full"
             >
                <div className="bg-red-100 p-2.5 rounded-full shrink-0">
                  <AlertCircle size={24} className="text-red-600" />
                </div>
                <div>
                   <h4 className="font-bold">发生错误</h4>
                   <p className="text-sm opacity-90">{error}</p>
                </div>
                <button 
                  onClick={() => setError(null)}
                  className="ml-auto text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
             </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
