
import React, { useState, useEffect } from 'react';
import { Task, StudyHistory } from '../types';
import { Link } from 'react-router-dom';
import { Skull, Zap, Globe, AlertTriangle, ShieldCheck, Clock, CheckCircle, TrendingUp, Trophy, Flame } from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
  history: StudyHistory[];
  isCleared: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, history, isCleared }) => {
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

  const deadline = new Date('2026-02-23T23:59:59');
  const diff = Math.max(0, deadline.getTime() - nowBR.getTime());
  
  const daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  const pendingTasks = tasks.filter(t => !t.completed).length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // Dynamic Calculation: Targets per day
  // If daysRemaining is 0 but it's still today, we treat it as 1 to avoid division by zero
  const effectiveDays = daysRemaining > 0 ? daysRemaining : 1;
  const tasksPerDay = (pendingTasks / effectiveDays).toFixed(1);

  let ruleStatus = {
    label: "SHIELD ACTIVE",
    desc: "Habit chain unbroken.",
    color: "bg-emerald-600",
    icon: <ShieldCheck size={24} />
  };

  if (!studiedToday && !isCleared) {
    if (studiedYesterday) {
      ruleStatus = {
        label: "SHIELD AT 50%",
        desc: "Don't skip today. Survival at risk.",
        color: "bg-amber-600",
        icon: <Clock size={24} />
      };
    } else {
      ruleStatus = {
        label: "SHIELD DOWN - CRITICAL",
        desc: "2-Day Rule broken. You are failing.",
        color: "bg-rose-700 animate-pulse",
        icon: <AlertTriangle size={24} />
      };
    }
  }

  if (isCleared) {
    ruleStatus = {
      label: "MISSION SUCCESS",
      desc: "Survival protocol completed.",
      color: "bg-indigo-600",
      icon: <Trophy size={24} />
    };
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="flex justify-between items-start border-b border-white/5 pb-8">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">The War Room</h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 flex items-center gap-2">
            <Globe size={12} className="text-rose-600" /> Reference: Brasília Time (UTC-3)
          </p>
        </div>
        <div className="text-right">
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Current State</p>
            <div className={`px-4 py-2 border rounded-xl ${isCleared ? 'bg-emerald-950/40 border-emerald-900/50' : 'bg-rose-950/40 border-rose-900/50'}`}>
               <span className={`${isCleared ? 'text-emerald-500' : 'text-rose-600 animate-pulse'} font-black`}>
                 {isCleared ? 'SURVIVED' : 'ALIVE'}
               </span>
            </div>
        </div>
      </header>

      {/* MASSIVE COUNTDOWN OR SUCCESS BANNER */}
      {isCleared ? (
        <section className="bg-emerald-600 border border-emerald-400/30 rounded-[3rem] p-16 text-center relative overflow-hidden group shadow-[0_0_50px_rgba(16,185,129,0.2)]">
          <div className="absolute inset-0 bg-white/10 opacity-20 group-hover:opacity-30 transition-opacity" />
          <Trophy className="mx-auto text-white mb-6 animate-bounce" size={80} />
          <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter mb-4">SURVIVAL SECURED</h3>
          <p className="text-emerald-100 font-bold uppercase tracking-widest text-sm">The project is finished. You escaped the deadline.</p>
        </section>
      ) : (
        <section className="bg-slate-900 border border-white/5 rounded-[3rem] p-12 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-rose-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-[12px] font-black text-rose-600 uppercase tracking-[0.5em] mb-6">Absolute Deadline: February 23, 2026</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            {[
              { v: Math.max(0, daysRemaining - 1), l: 'Days' },
              { v: hours, l: 'Hours' },
              { v: mins, l: 'Mins' },
              { v: secs, l: 'Secs' }
            ].map((item, i) => (
              <div key={i} className="bg-black/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5">
                <span className="text-6xl md:text-8xl font-black text-white tabular-nums tracking-tighter block">{String(item.v).padStart(2, '0')}</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2 block">{item.l}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">IF I DON'T FINISH, I GO TO DEAD.</h3>
              <div className="h-1 w-64 bg-rose-600 mt-4 shadow-[0_0_15px_rgba(225,29,72,0.6)]" />
          </div>
        </section>
      )}

      {/* DYNAMIC CALCULATIONS SECTION */}
      {!isCleared && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex items-center gap-6">
            <div className="p-4 bg-rose-600/20 rounded-2xl text-rose-600">
              <Skull size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pending Targets</p>
              <p className="text-3xl font-black text-white">{pendingTasks}</p>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex items-center gap-6">
            <div className="p-4 bg-amber-600/20 rounded-2xl text-amber-600">
              <Clock size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Days Remaining</p>
              <p className="text-3xl font-black text-white">{daysRemaining}</p>
            </div>
          </div>

          <div className={`border rounded-[2rem] p-6 flex items-center gap-6 transition-all ${parseFloat(tasksPerDay) > 3 ? 'bg-rose-950/20 border-rose-600/50 shadow-[0_0_20px_rgba(225,29,72,0.1)]' : 'bg-white/5 border-white/10'}`}>
            <div className={`p-4 rounded-2xl ${parseFloat(tasksPerDay) > 3 ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-600/20 text-emerald-600'}`}>
              <Flame size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Required Velocity</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-white">{tasksPerDay}</p>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">tasks / day</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`lg:col-span-2 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8 ${ruleStatus.color} shadow-2xl transition-colors duration-500`}>
           <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/20">
              {ruleStatus.icon}
           </div>
           <div className="flex-1 text-center md:text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-1">Survival Protocol: 2-Day Rule</p>
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

        <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center">
           <TrendingUp className="text-rose-600 mb-4" size={32} />
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Overall Completion</p>
           <span className="text-6xl font-black text-white">{progressPercent}%</span>
           <div className="w-full h-2 bg-white/5 rounded-full mt-4 overflow-hidden">
              <div className={`h-full transition-all duration-1000 shadow-[0_0_10px_rgba(225,29,72,0.5)] ${isCleared ? 'bg-emerald-500' : 'bg-rose-600'}`} style={{width: `${progressPercent}%`}} />
           </div>
           <p className="text-xs text-slate-500 font-bold mt-4 italic">{pendingTasks} targets remaining</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
