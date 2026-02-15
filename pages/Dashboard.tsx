import React, { useState, useEffect } from 'react';
import { StudyHistory } from '../types';
import { Skull, Zap, Globe, AlertTriangle, ShieldCheck, Clock, Trophy, Flame, Plus, Languages, Cpu, Box, Code2 } from 'lucide-react';
import { KATA_GOAL, FLASHCARD_GOAL, CHALLENGE_END_DATE } from '../constants';

interface DashboardProps {
  history: StudyHistory[];
  isCleared: boolean;
  kataCount: number;
  flashcardCount: number;
  fullCycleCount: number;
  goCount: number;
  onIncrement: (type: 'kata' | 'flash' | 'fc' | 'go') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ history, isCleared, kataCount, flashcardCount, fullCycleCount, goCount, onIncrement }) => {
  const getBrasiliaTime = () => {
    const now = new Date();
    const brTimeString = now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" });
    return new Date(brTimeString);
  };

  const [nowBR, setNowBR] = useState(getBrasiliaTime());

  useEffect(() => {
    const timer = setInterval(() => setNowBR(getBrasiliaTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = nowBR.toISOString().split('T')[0];
  const yesterdayBR = new Date(nowBR);
  yesterdayBR.setDate(yesterdayBR.getDate() - 1);
  const yesterdayStr = yesterdayBR.toISOString().split('T')[0];

  const studiedToday = history.some(h => h.date === todayStr);
  const studiedYesterday = history.some(h => h.date === yesterdayStr);

  const deadline = new Date(CHALLENGE_END_DATE + 'T23:59:59');
  const diff = Math.max(0, deadline.getTime() - nowBR.getTime());
  
  const daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));

  const remainingKatas = Math.max(0, KATA_GOAL - kataCount);
  const remainingFlash = Math.max(0, FLASHCARD_GOAL - flashcardCount);
  
  const kataPercent = Math.min(100, Math.round((kataCount / KATA_GOAL) * 100));
  const flashPercent = Math.min(100, Math.round((flashcardCount / FLASHCARD_GOAL) * 100));

  const effectiveDays = daysRemaining > 0 ? daysRemaining : 1;
  const katasPerDay = (remainingKatas / effectiveDays).toFixed(1);
  const flashPerDay = (remainingFlash / effectiveDays).toFixed(1);

  let ruleStatus = {
    label: "SHIELD ACTIVE",
    desc: "Habit chain maintained.",
    color: "bg-emerald-600",
    icon: <ShieldCheck size={24} />
  };

  if (!studiedToday && !isCleared) {
    if (studiedYesterday) {
      ruleStatus = {
        label: "SHIELD AT 50%",
        desc: "Complete objectives today to secure the chain.",
        color: "bg-amber-600",
        icon: <Clock size={24} />
      };
    } else {
      ruleStatus = {
        label: "CHAIN BROKEN",
        desc: "Survival at risk. Double work required.",
        color: "bg-rose-700 animate-pulse",
        icon: <AlertTriangle size={24} />
      };
    }
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="flex justify-between items-start border-b border-white/5 pb-8">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">The War Room</h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 flex items-center gap-2">
            <Globe size={12} className="text-rose-600" /> MISSION: 1000x2 + STRATEGIC MASTERY
          </p>
        </div>
      </header>

      {/* CORE OBJECTIVES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group">
             <div className="relative z-10">
                <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.4em] mb-1">Objective A: Coding Logic</p>
                <h3 className="text-4xl font-black text-white italic mb-6">1000 KATAS</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-6xl font-black text-white tabular-nums">{kataCount}</span>
                  <span className="text-xl font-bold text-slate-600">/ 1000</span>
                </div>
                <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                   <div className="h-full bg-rose-600 transition-all duration-1000 shadow-[0_0_15px_rgba(225,29,72,0.4)]" style={{width: `${kataPercent}%`}} />
                </div>
                <button onClick={() => onIncrement('kata')} className="mt-8 px-8 py-4 bg-rose-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-rose-500 transition-all flex items-center gap-2 active:scale-95 shadow-xl">
                  <Plus size={18} /> Log Solution
                </button>
             </div>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group">
             <div className="relative z-10">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-1">Objective B: Languages</p>
                <h3 className="text-4xl font-black text-white italic mb-6">1000 EN & ES</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-6xl font-black text-white tabular-nums">{flashcardCount}</span>
                  <span className="text-xl font-bold text-slate-600">/ 1000</span>
                </div>
                <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                   <div className="h-full bg-indigo-500 transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.4)]" style={{width: `${flashPercent}%`}} />
                </div>
                <button onClick={() => onIncrement('flash')} className="mt-8 px-8 py-4 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-500 transition-all flex items-center gap-2 active:scale-95 shadow-xl">
                  <Plus size={18} /> Log Flashcard
                </button>
             </div>
          </div>
      </div>

      {/* STRATEGIC TRAINING (FULL CYCLE & GO) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-purple-950/20 border border-purple-500/20 rounded-[2.5rem] p-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-6 opacity-10">
              <Box size={80} />
           </div>
           <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Strategic Intel</p>
           <h4 className="text-2xl font-black text-white italic mb-4">FULL CYCLE (20m)</h4>
           <p className="text-4xl font-black text-white mb-6">{fullCycleCount} <span className="text-xs text-slate-500 uppercase">Sessions</span></p>
           <button onClick={() => onIncrement('fc')} className="w-full py-4 bg-purple-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-purple-500 transition-all active:scale-95">
              Confirm Training Session
           </button>
        </div>

        <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-[2.5rem] p-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-6 opacity-10">
              <Code2 size={80} />
           </div>
           <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Strategic Intel</p>
           <h4 className="text-2xl font-black text-white italic mb-4">GO LANG (20m)</h4>
           <p className="text-4xl font-black text-white mb-6">{goCount} <span className="text-xs text-slate-500 uppercase">Sessions</span></p>
           <button onClick={() => onIncrement('go')} className="w-full py-4 bg-cyan-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-500 transition-all active:scale-95">
              Confirm Training Session
           </button>
        </div>
      </div>

      {/* VELOCITY CARDS */}
      {!isCleared && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col justify-center text-center">
            <Clock className="text-amber-500 mx-auto mb-4" size={32} />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Remaining Time</p>
            <p className="text-4xl font-black text-white">{daysRemaining} <span className="text-xs uppercase text-slate-500">Days</span></p>
            <p className="text-[9px] text-rose-500 font-bold mt-2 uppercase">End: 31 Dec 2026</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
            <Flame className="text-rose-600 mb-4" size={32} />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Required Velocity (Katas)</p>
            <p className="text-5xl font-black text-white">{katasPerDay}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
            <Zap className="text-indigo-500 mb-4" size={32} />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Required Velocity (Cards)</p>
            <p className="text-5xl font-black text-white">{flashPerDay}</p>
          </div>
        </div>
      )}

      {/* SHIELD STATUS */}
      <div className={`rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8 ${ruleStatus.color} shadow-2xl transition-colors duration-500`}>
         <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/20">
            {ruleStatus.icon}
         </div>
         <div className="flex-1 text-center md:text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-1">Daily Protocol</p>
            <h4 className="text-3xl font-black text-white italic">{ruleStatus.label}</h4>
            <p className="text-white/80 font-bold mt-1 uppercase text-xs">{ruleStatus.desc}</p>
         </div>
         <div className="flex gap-2">
            {[...Array(7)].map((_, i) => {
               const d = new Date(nowBR);
               d.setDate(d.getDate() - (6 - i));
               const dStr = d.toISOString().split('T')[0];
               const studied = history.some(h => h.date === dStr);
               return (
                 <div key={i} className={`w-8 h-8 rounded-lg border-2 ${studied ? 'bg-white border-white' : 'border-white/20'}`} />
               );
            })}
         </div>
      </div>
    </div>
  );
};

export default Dashboard;