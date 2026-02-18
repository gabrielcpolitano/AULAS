import React, { useState, useEffect } from 'react';
import { StudyHistory } from '../types';
import { Globe, ShieldCheck, Clock, Plus, Box, Book, Trophy, Calendar, Languages, User, Award, CheckCircle, GraduationCap, CreditCard, ReceiptText, TrendingUp } from 'lucide-react';
import { CHALLENGE_START_DATE, CHALLENGE_END_DATE } from '../constants';

interface DashboardProps {
  history: StudyHistory[];
  isCleared: boolean;
  bibleCount: number;
  goCount: number;
  fullCycleCount: number;
  onIncrement: (type: 'bible' | 'go' | 'fc') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ history, isCleared, bibleCount, goCount, fullCycleCount, onIncrement }) => {
  const getBrasiliaDateString = (date: Date = new Date()) => {
    return new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'America/Sao_Paulo',
    }).format(date);
  };

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = getBrasiliaDateString(now);
  const brMidnight = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
  const yesterdayDate = new Date(brMidnight);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = getBrasiliaDateString(yesterdayDate);

  const studiedToday = history.some(h => h.date === todayStr);
  const studiedYesterday = history.some(h => h.date === yesterdayStr);

  const startDate = new Date(`${CHALLENGE_START_DATE}T00:00:00-03:00`);
  const deadline = new Date(`${CHALLENGE_END_DATE}T23:59:59-03:00`);
  
  const totalDuration = deadline.getTime() - startDate.getTime();
  const elapsed = Math.max(0, now.getTime() - startDate.getTime());
  const progressPercentage = Math.min(100, Math.round((elapsed / totalDuration) * 100));

  const diff = Math.max(0, deadline.getTime() - now.getTime());
  const daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));

  const getLastDate = (type: string) => {
    const sortedHistory = [...history].sort((a, b) => b.date.localeCompare(a.date));
    const lastEntry = sortedHistory.find(h => h.taskIds.some(id => id.startsWith(type)));
    if (!lastEntry) return "PENDENTE";
    
    const [y, m, d] = lastEntry.date.split('-');
    return `${d}/${m}/${y}`;
  };

  const academicStatus = !studiedToday && !studiedYesterday && !isCleared ? {
    label: "ATENÇÃO ACADÊMICA",
    desc: "Ausência de registros detectada. Mantenha a constância do curso.",
    color: "bg-amber-600/10 border-amber-500/30 text-amber-500",
    icon: <Globe size={24} />
  } : {
    label: "DESEMPENHO EXCELENTE",
    desc: "Sua trilha de aprendizado está sendo percorrida com sucesso.",
    color: "bg-emerald-600/10 border-emerald-500/30 text-emerald-500",
    icon: <ShieldCheck size={24} />
  };

  const cards = [
    {
      id: 'bible',
      title: "ENGLISH BIBLE",
      subtitle: "Ética e Linguagem",
      lastDate: getLastDate('bible'),
      color: "emerald",
      icon: <Book size={40} />,
      btnLabel: "Registrar Estudo",
      desc: "Imersão bíblica em inglês para desenvolvimento espiritual e linguístico."
    },
    {
      id: 'go',
      title: "DUOLINGO SPRINT",
      subtitle: "Fluência Diária",
      lastDate: getLastDate('go'),
      color: "cyan",
      icon: <Languages size={40} />,
      btnLabel: "Lançar Duolingo",
      desc: "30 minutos de prática intensiva para dominar novos idiomas."
    },
    {
      id: 'fc',
      title: "FULL CYCLE",
      subtitle: "Engenharia de Software",
      lastDate: getLastDate('fc'),
      color: "purple",
      icon: <Box size={40} />,
      btnLabel: "Lançar Sessão",
      desc: "Especialização em arquitetura, DevOps e desenvolvimento escalável."
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
      {/* UNIVERSITY HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <GraduationCap className="text-[#ed1c24]" size={32} />
             <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
               FIAP <span className="text-slate-500 text-2xl font-bold not-italic font-sans">| PORTAL DO ALUNO</span>
             </h2>
          </div>
          <p className="text-slate-500 font-medium text-lg">
            Bem-vindo de volta, <span className="text-white font-black italic">Gabriel Correia Politano</span>.
          </p>
        </div>

        <div className="flex items-center gap-6">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Término do Semestre</p>
              <div className="flex items-center gap-2 justify-end">
                <Clock className="text-[#ed1c24]" size={16} />
                <span className="text-2xl font-black text-white tabular-nums">{daysRemaining} DIAS</span>
              </div>
           </div>
           <div className="w-16 h-16 rounded-2xl bg-[#ed1c24] flex items-center justify-center shadow-[0_0_20px_rgba(237,28,36,0.3)]">
              <User className="text-white" size={32} />
           </div>
        </div>
      </header>

      {/* TOP ROW: PROGRESS & FINANCIAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PROGRESS BAR */}
        <section className="lg:col-span-2 bg-white/5 border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-center">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Progresso Acadêmico Total</p>
              <h4 className="text-xl font-bold text-white uppercase italic tracking-tighter">Conclusão de Ciclo</h4>
            </div>
            <span className="text-2xl font-black text-[#ed1c24] italic">{isCleared ? 100 : progressPercentage}%</span>
          </div>
          <div className="w-full h-4 bg-black rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-[#ed1c24] to-[#ff4d4d] shadow-[0_0_15px_rgba(237,28,36,0.4)] transition-all duration-1000 ease-out" 
              style={{ width: `${isCleared ? 100 : progressPercentage}%` }}
            />
          </div>
        </section>

        {/* FINANCIAL (FATURA) */}
        <section className="bg-gradient-to-br from-[#111] to-[#050505] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl">
          <div className="absolute -right-2 -bottom-2 text-[#ed1c24] opacity-5 group-hover:opacity-10 transition-opacity">
            <CreditCard size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <ReceiptText className="text-[#ed1c24]" size={20} />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Financeiro Acadêmico</p>
            </div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Investido</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-bold text-white">R$</span>
              <span className="text-4xl font-black text-white italic tracking-tighter">1.000,00</span>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">STATUS: PAGO</span>
              </div>
              <TrendingUp className="text-slate-700" size={16} />
            </div>
          </div>
        </section>
      </div>

      {/* ACADEMIC CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {cards.map((card) => (
          <div key={card.id} className="group bg-black/40 border border-white/5 rounded-[3rem] p-8 hover:border-[#ed1c24]/30 transition-all flex flex-col h-full relative overflow-hidden">
            <div className={`absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity text-white`}>
              {card.icon}
            </div>
            
            <div className="mb-8">
              <div className={`w-14 h-14 rounded-2xl bg-${card.color}-600/10 flex items-center justify-center text-${card.color}-500 mb-6 group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">{card.subtitle}</p>
              <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">{card.title}</h3>
            </div>

            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 flex-1">
              {card.desc}
            </p>

            <div className="space-y-6">
              <div className="flex justify-between items-center py-4 border-t border-white/5">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Último Lançamento</span>
                <span className="text-sm font-black text-white tabular-nums tracking-widest italic">{card.lastDate}</span>
              </div>
              
              <button 
                onClick={() => onIncrement(card.id as any)}
                className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-[#ed1c24] hover:border-[#ed1c24] transition-all active:scale-95 shadow-lg"
              >
                <Plus size={18} /> {card.btnLabel}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* STATUS FOOTER */}
      <div className={`rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 border ${academicStatus.color} transition-all duration-500`}>
         <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5 student-card-glow">
            {isCleared ? <Award size={48} className="text-[#ed1c24]" /> : <CheckCircle size={48} className="text-emerald-500" />}
         </div>
         <div className="flex-1 text-center md:text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70 mb-2">Monitoramento de Presença</p>
            <h4 className="text-3xl font-black text-white italic tracking-tighter">{isCleared ? 'ALUNO FORMADO - DISTINÇÃO' : academicStatus.label}</h4>
            <p className="text-white/60 font-medium mt-1 uppercase text-sm">{isCleared ? 'Protocolo acadêmico encerrado com louvor.' : academicStatus.desc}</p>
         </div>
         
         <div className="flex gap-2">
            {[...Array(14)].map((_, i) => {
               const d = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
               d.setDate(d.getDate() - (13 - i));
               const dStr = getBrasiliaDateString(d);
               const studied = history.some(h => h.date === dStr);
               return (
                 <div key={i} title={dStr} className={`w-4 h-12 rounded-full border ${studied ? 'bg-[#ed1c24] border-[#ed1c24] shadow-[0_0_10px_rgba(237,28,36,0.3)]' : 'border-white/10'}`} />
               );
            })}
         </div>
      </div>
    </div>
  );
};

export default Dashboard;