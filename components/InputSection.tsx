import React, { useEffect, useRef, useState } from 'react';
import { UserInput } from '../types';
import { UploadCloud, X, Mic, MicOff, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputSectionProps {
  userA: UserInput;
  userB: UserInput;
  setUserA: React.Dispatch<React.SetStateAction<UserInput>>;
  setUserB: React.Dispatch<React.SetStateAction<UserInput>>;
  onSubmit: () => void;
}

const InputSection: React.FC<InputSectionProps> = ({ userA, userB, setUserA, setUserB, onSubmit }) => {
  const [activeTab, setActiveTab] = useState<'A' | 'B'>('A');
  const [recordingDesc, setRecordingDesc] = useState(false);
  const [recordingDemand, setRecordingDemand] = useState(false);
  const recognitionRef = useRef<{ description: any; demand: any }>({ description: null, demand: null });

  const getRecognizer = () => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return null;
    const rec = new SR();
    rec.lang = 'zh-CN';
    rec.continuous = true;
    rec.interimResults = true;
    return rec;
  };

  const startDictation = (field: 'description' | 'demand') => {
    if (recognitionRef.current[field]) return;
    const rec = getRecognizer();
    if (!rec) return;
    recognitionRef.current[field] = rec;
    if (field === 'description') setRecordingDesc(true); else setRecordingDemand(true);
    rec.onresult = (e: any) => {
      let transcript = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      setCurrentUser(prev => ({ ...prev, [field]: (prev as any)[field] + transcript }));
    };
    rec.onerror = () => {
      if (field === 'description') setRecordingDesc(false); else setRecordingDemand(false);
      recognitionRef.current[field] = null;
    };
    rec.onend = () => {
      if (field === 'description') setRecordingDesc(false); else setRecordingDemand(false);
      recognitionRef.current[field] = null;
    };
    try { rec.start(); } catch {}
  };

  const stopDictation = (field: 'description' | 'demand') => {
    const rec = recognitionRef.current[field];
    if (rec) {
      try { rec.stop(); } catch {}
    }
    recognitionRef.current[field] = null;
    if (field === 'description') setRecordingDesc(false); else setRecordingDemand(false);
  };

  useEffect(() => {
    stopDictation('description');
    stopDictation('demand');
    return () => {
      stopDictation('description');
      stopDictation('demand');
    };
  }, [activeTab]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, role: 'A' | 'B') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updater = role === 'A' ? setUserA : setUserB;
        updater(prev => ({ ...prev, image: file, imageBase64: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (role: 'A' | 'B') => {
    const updater = role === 'A' ? setUserA : setUserB;
    updater(prev => ({ ...prev, image: null, imageBase64: undefined }));
  };

  const currentUser = activeTab === 'A' ? userA : userB;
  const setCurrentUser = activeTab === 'A' ? setUserA : setUserB;

  const isFormValid = userA.description.length > 5 && userB.description.length > 5;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Character Selector / Tabs */}
      <div className="flex justify-center gap-8 mb-10 relative z-10">
        <button
          onClick={() => setActiveTab('A')}
          className={`relative group transition-all duration-500 ${activeTab === 'A' ? 'scale-110 z-10' : 'scale-90 opacity-60 hover:opacity-90 hover:scale-95'}`}
        >
           <div className={`w-28 h-28 rounded-full border-[6px] shadow-2xl overflow-hidden bg-sky-200 transition-all duration-300 ${activeTab === 'A' ? 'border-sky-500 shadow-sky-300/50 rotate-0' : 'border-white rotate-[-10deg]'}`}>
              <img
                src="https://i.pinimg.com/736x/6c/e0/17/6ce01715cf6b4944d2d4cd6aaaf6b694.jpg"
                alt="兔子头像"
                className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ${activeTab !== 'A' ? 'rotate-[10deg]' : ''}`}
                loading="lazy"
              />
           </div>
           <motion.div 
             initial={false}
             animate={{ y: activeTab === 'A' ? 0 : 10, opacity: activeTab === 'A' ? 1 : 0 }}
             className={`absolute -bottom-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-sm font-black shadow-lg whitespace-nowrap transition-colors ${activeTab === 'A' ? 'bg-sky-500 text-white' : 'bg-white text-gray-400'}`}
           >
             {userA.name || '朱迪'}
           </motion.div>
        </button>

        <div className="flex flex-col justify-center items-center z-0">
             <span className="text-4xl font-black text-slate-300 italic transform -skew-x-12 select-none">VS</span>
        </div>

        <button
          onClick={() => setActiveTab('B')}
          className={`relative group transition-all duration-500 ${activeTab === 'B' ? 'scale-110 z-10' : 'scale-90 opacity-60 hover:opacity-90 hover:scale-95'}`}
        >
           <div className={`w-28 h-28 rounded-full border-[6px] shadow-2xl overflow-hidden bg-orange-200 transition-all duration-300 ${activeTab === 'B' ? 'border-orange-500 shadow-orange-300/50 rotate-0' : 'border-white rotate-[10deg]'}`}>
              <img
                src="https://th.bing.com/th/id/R.12ce8602a7fcb7dbb1e0eea27668b02c?rik=6%2f%2f38gn4%2bWnWvg&pid=ImgRaw&r=0"
                alt="狐狸头像"
                className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ${activeTab !== 'B' ? 'rotate-[-10deg]' : ''}`}
                loading="lazy"
              />
           </div>
           <motion.div 
             initial={false}
             animate={{ y: activeTab === 'B' ? 0 : 10, opacity: activeTab === 'B' ? 1 : 0 }}
             className={`absolute -bottom-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-sm font-black shadow-lg whitespace-nowrap transition-colors ${activeTab === 'B' ? 'bg-orange-500 text-white' : 'bg-white text-gray-400'}`}
           >
             {userB.name || '尼克'}
           </motion.div>
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-white/60 overflow-hidden relative transform transition-all duration-500">
        {/* Dynamic decorative top border */}
        <div className={`h-3 w-full transition-colors duration-500 ${activeTab === 'A' ? 'bg-gradient-to-r from-sky-400 to-sky-500' : 'bg-gradient-to-r from-orange-400 to-orange-500'}`}></div>

        <div className="p-6 md:p-10 space-y-8">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === 'A' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === 'A' ? 20 : -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Name Input */}
              <div className="flex flex-col gap-2">
                <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">
                   你的名字 / 昵称
                </label>
                <input
                  type="text"
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="我是..."
                  className={`w-full p-4 text-lg font-bold rounded-2xl border-2 focus:ring-4 focus:ring-opacity-20 transition-all outline-none ${activeTab === 'A' ? 'border-sky-100 focus:border-sky-400 focus:ring-sky-400 bg-sky-50/30 placeholder-sky-300 text-sky-900' : 'border-orange-100 focus:border-orange-400 focus:ring-orange-400 bg-orange-50/30 placeholder-orange-300 text-orange-900'}`}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                 {/* Description Bubble */}
                 <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">
                      案件描述 (发生了什么？)
                    </label>
                 <div className={`relative flex-1 group rounded-3xl p-1 transition-colors duration-300 ${activeTab === 'A' ? 'bg-sky-100 focus-within:bg-sky-300' : 'bg-orange-100 focus-within:bg-orange-300'}`}>
                        <textarea
                          value={currentUser.description}
                          onChange={(e) => setCurrentUser(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="发生了什么争执？请尽可能详细描述..."
                          className="w-full p-6 h-48 rounded-[1.3rem] border-0 focus:ring-0 text-slate-700 leading-relaxed resize-none bg-white placeholder-slate-300 text-lg"
                          maxLength={500}                        />
                        <button
                          type="button"
                          onClick={() => {
                            const supported = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                            if (!supported) return;
                            if (recordingDesc) stopDictation('description'); else startDictation('description');
                          }}
                          className={`absolute bottom-3 left-5 flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'A' ? 'bg-sky-500 text-white hover:bg-sky-600' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
                        >
                          {recordingDesc ? <MicOff size={16} /> : <Mic size={16} />}
                          {recordingDesc ? '停止语音' : '语音输入'}
                        </button>
                        <div className="absolute bottom-3 right-5 text-xs font-bold text-slate-300 bg-white/80 px-2 py-1 rounded-md backdrop-blur-sm">
                          {currentUser.description.length}/500
                        </div>
                 </div>
                 </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                  {/* Demand Bubble */}
                  <div className="flex flex-col gap-2">
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">
                      诉求 / 委屈点
                    </label>
                    <div className={`relative flex-1 rounded-3xl p-1 transition-colors duration-300 ${activeTab === 'A' ? 'bg-sky-100 focus-within:bg-sky-300' : 'bg-orange-100 focus-within:bg-orange-300'}`}>
                        <div className="bg-white rounded-[1.3rem] h-full overflow-hidden">
                            <textarea
                              value={currentUser.demand}
                              onChange={(e) => setCurrentUser(prev => ({ ...prev, demand: e.target.value }))}
                              placeholder="你希望对方怎么做？"
                              className="w-full p-5 h-32 border-0 focus:ring-0 text-slate-700 leading-relaxed resize-none bg-transparent placeholder-slate-300"
                            />
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => {
                                  const supported = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                                  if (!supported) return;
                                  if (recordingDemand) stopDictation('demand'); else startDictation('demand');
                                }}
                                className={`absolute bottom-3 left-5 flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'A' ? 'bg-sky-500 text-white hover:bg-sky-600' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
                              >
                                {recordingDemand ? <MicOff size={16} /> : <Mic size={16} />}
                                {recordingDemand ? '停止语音' : '语音输入'}
                              </button>
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Image Upload - Polaroid Style */}
                  <div className="flex flex-col gap-2">
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">
                      呈堂证供 (可选图片)
                    </label>
                    <div className="relative h-full min-h-[8rem]">
                        {!currentUser.imageBase64 ? (
                          <label className={`flex flex-col items-center justify-center w-full h-32 rounded-3xl border-2 border-dashed cursor-pointer hover:bg-slate-50 transition-all group ${activeTab === 'A' ? 'border-sky-200 hover:border-sky-400' : 'border-orange-200 hover:border-orange-400'}`}>
                            <div className={`p-3 rounded-full mb-2 transition-transform group-hover:scale-110 ${activeTab === 'A' ? 'bg-sky-100 text-sky-500' : 'bg-orange-100 text-orange-500'}`}>
                               <UploadCloud size={24} />
                            </div>
                            <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600">点击上传证据图片</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, activeTab)} />
                          </label>
                        ) : (
                          <div className="relative w-full h-32 bg-slate-800 rounded-3xl overflow-hidden flex items-center justify-center border-4 border-white shadow-md group transform rotate-1 hover:rotate-0 transition-transform duration-300">
                             {/* Plastic reflection effect */}
                             <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none z-10"></div>
                             
                             <img 
                               src={currentUser.imageBase64} 
                               alt="Evidence" 
                               className="object-cover w-full h-full opacity-90"
                             />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 backdrop-blur-sm">
                                <button 
                                  onClick={() => removeImage(activeTab)}
                                  className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transform hover:scale-110 transition-all shadow-xl"
                                >
                                  <X size={20} />
                                </button>
                             </div>
                          </div>
                        )}
                    </div>
                  </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Prompt Bubble */}
          <div className={`mt-8 flex items-start gap-5 p-6 rounded-3xl border-2 transition-colors duration-500 ${activeTab === 'A' ? 'bg-sky-50/50 border-sky-100' : 'bg-orange-50/50 border-orange-100'}`}>
             <div className="bg-white p-2 rounded-2xl shadow-sm shrink-0 text-3xl rotate-[-5deg]">
                {activeTab === 'A' ? '🐰' : '🦊'}
             </div>
             <div>
                <p className={`text-sm font-black mb-1 uppercase tracking-wide ${activeTab === 'A' ? 'text-sky-700' : 'text-orange-700'}`}>
                   {activeTab === 'A' ? '朱迪警官提示：' : '尼克提示：'}
                </p>
                <p className="text-slate-600 leading-relaxed font-medium italic">
                   {activeTab === 'A' 
                     ? "“虽然我们追求真相，但请记得，描述越客观，我和尼克越能帮到你们哦！加油！”" 
                     : "“嘿，伙计，别太紧张。这里是安全区，想说什么就说什么，毕竟谁还没点小脾气呢？”"}
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="mt-8 flex justify-between items-center px-4">
           {activeTab === 'B' ? (
             <button
                onClick={() => setActiveTab('A')}
                className="text-slate-500 hover:text-slate-700 font-bold px-6 py-3 rounded-xl hover:bg-white/50 transition-all flex items-center gap-2 group"
             >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span>返回上一步</span>
             </button>
           ) : (
             <div></div>
           )}

           {activeTab === 'A' ? (
             <button
               onClick={() => setActiveTab('B')}
               className="bg-sky-500 hover:bg-sky-600 text-white text-lg font-bold py-4 px-12 rounded-full shadow-lg shadow-sky-200 transform hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2 group"
             >
               <span>下一步：{userB.name || '乙方'}陈述</span>
               <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
             </button>
           ) : (
             <button
               onClick={onSubmit}
               disabled={!isFormValid}
               className={`text-lg font-bold py-4 px-12 rounded-full shadow-xl flex items-center gap-3 transition-all transform ${
                 isFormValid 
                   ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:scale-105 hover:shadow-orange-200 cursor-pointer' 
                   : 'bg-slate-200 text-slate-400 cursor-not-allowed grayscale'
               }`}
             >
               <div className="bg-white/20 p-1.5 rounded-full"><Mic size={20} /></div>
               开始AI评理
             </button>
           )}
      </div>
    </div>
  );
};

export default InputSection;
