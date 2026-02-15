import React, { useState, useEffect } from 'react';
import { StudyHistory } from '../types';
import { Globe, ShieldCheck, Clock, Plus, Box, Code2, Book, Trophy, Calendar } from 'lucide-react';
import { CHALLENGE_END_DATE } from '../constants';

interface DashboardProps {
  history: StudyHistory[];
  isCleared: boolean;
  bibleCount: number;
  goCount: number;
  fullCycleCount: number;
  onIncrement: (type: 'bible' | 'go' | 'fc') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ history, isCleared, bibleCount, goCount, fullCycleCount, onIncrement }) => {
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

  const getLastDate = (type: string) => {
    const sortedHistory = [...history].sort((a, b) => b.date.localeCompare(a.date));
    const lastEntry = sortedHistory.find(h => h.taskIds.some(id => id.startsWith(type)));
    if (!lastEntry) return "NONE YET";
    
    const [y, m, d] = lastEntry.date.split('-');
    return `${d}/${m}/${y}`;
  };

  const ruleStatus = !studiedToday && !studiedYesterday && !isCleared ? {
    label: "CHAIN BROKEN",
    desc: "Survival at risk. Perform immediate training.",
    color: "bg-rose-700 animate-pulse",
    icon: <Globe size={24} />
  } : {
    label: "SHIELD ACTIVE",
    desc: "Training sequence maintained.",
    color: "bg-emerald-600",
    icon: <ShieldCheck size={24} />
  };

  const cards = [
    {
      id: 'bible',
      title: "ENGLISH BIBLE",
      subtitle: "Faith & Language Resilience",
      lastDate: getLastDate('bible'),
      color: "emerald",
      icon: <Book size={100} />,
      btnLabel: "Log Bible Study",
      desc: "Learn English while studying the Word of God and building resilience."
    },
    {
      id: 'go',
      title: "GO COURSE",
      subtitle: "Scalable Systems Mastery",
      lastDate: getLastDate('go'),
      color: "cyan",
      icon: <Code2 size={100} />,
      btnLabel: "Log Go Session",
      desc: "Backend focus: Simple, concise, multi-platform, and high performance."
    },
    {
      id: 'fc',
      title: "FULL CYCLE",
      subtitle: "Elite Software Engineering",
      lastDate: getLastDate('fc'),
      color: "purple",
      icon: <Box size={100} />,
      btnLabel: "Log FC Session",
      desc: "Architect REST APIs, deploy to AWS, and master SOLID/MVC from scratch."
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-8 gap-4">
        <div>
          <h2 className="text-6xl font-black text-white tracking-tighter uppercase italic">The War Room</h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 flex items-center gap-2">
            <Globe size={12} className="text-rose-600" /> TRIPLE THREAT: BIBLE | GO | FULL CYCLE
          </p>
        </div>
        {!isCleared && (
          <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
            <Clock size={16} className="text-amber-500" />
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Time Remaining</p>
              <p className="text-xl font-black text-white leading-none">{daysRemaining} DAYS</p>
            </div>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 gap-8">
        {cards.map((card) => (
          <div key={card.id} className={`bg-slate-900 border border-white/5 rounded-[3.5rem] p-8 md:p-12 relative overflow-hidden group hover:border-${card.color}-500/30 transition-all`}>
            <div className={`absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity text-${card.color}-500`}>
              {card.icon}
            </div>
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="flex-1">
                <p className={`text-[10px] font-black text-${card.color}-500 uppercase tracking-[0.4em] mb-2`}>{card.subtitle}</p>
                <h3 className="text-5xl font-black text-white italic mb-2 tracking-tighter">{card.title}</h3>
                <p className="text-slate-500 text-sm font-medium max-w-lg mb-8 uppercase tracking-wide">{card.desc}</p>
                
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Last Entry Recorded</p>
                   <div className="flex items-center gap-3">
                      <Calendar className={`text-${card.color}-500`} size={20} />
                      <span className="text-3xl font-black text-white tabular-nums tracking-tighter uppercase italic">{card.lastDate}</span>
                   </div>
                </div>
              </div>

              <div className="shrink-0 flex flex-col items-center justify-center gap-4">
                <button 
                  onClick={() => onIncrement(card.id as any)} 
                  className={`px-12 py-6 bg-${card.color}-600 text-white font-black uppercase tracking-[0.2em] rounded-[2.5rem] hover:bg-${card.color}-500 transition-all flex items-center gap-3 active:scale-95 shadow-2xl hover:scale-105`}
                >
                  <Plus size={24} /> {card.btnLabel}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SHIELD STATUS */}
      <div className={`rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 ${ruleStatus.color} shadow-2xl transition-all duration-500`}>
         <div className="bg-white/10 p-6 rounded-[2rem] backdrop-blur-md border border-white/20">
            {isCleared ? <Trophy size={40} className="text-white" /> : ruleStatus.icon}
         </div>
         <div className="flex-1 text-center md:text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70 mb-2">Triple Threat Protocol</p>
            <h4 className="text-4xl font-black text-white italic tracking-tighter">{isCleared ? 'SURVIVOR STATUS ACHIEVED' : ruleStatus.label}</h4>
            <p className="text-white/80 font-bold mt-1 uppercase text-sm">{isCleared ? 'All pillars mastered. Protocol finished.' : ruleStatus.desc}</p>
         </div>
         <div className="flex gap-3">
            {[...Array(7)].map((_, i) => {
               const d = new Date(nowBR);
               d.setDate(d.getDate() - (6 - i));
               const dStr = d.toISOString().split('T')[0];
               const studied = history.some(h => h.date === dStr);
               return (
                 <div key={i} className={`w-10 h-10 rounded-xl border-4 ${studied ? 'bg-white border-white' : 'border-white/20'}`} />
               );
            })}
         </div>
      </div>
    </div>
  );
};

export default Dashboard;