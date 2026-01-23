import React from 'react';
import { Lesson, Milestone, MilestoneStatus, StudyHistory } from '../types';
import { CHALLENGE_END_DATE, CHALLENGE_START_DATE } from '../constants';
import { PlayCircle, Database, Layout, Clock, Calendar, Zap, Globe, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  lessons: Lesson[];
  completedIds: number[];
  milestones: Milestone[];
  studyHistory: StudyHistory[];
}

const Dashboard: React.FC<DashboardProps> = ({ lessons, completedIds, milestones, studyHistory }) => {
  const nextLesson = lessons.find(l => !completedIds.includes(l.id));
  
  const getBrasiliaTime = () => {
    const now = new Date();
    const brTimeString = now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" });
    return new Date(brTimeString);
  };

  const nowBR = getBrasiliaTime();
  const todayStr = nowBR.toISOString().split('T')[0];
  
  const yesterdayBR = new Date(nowBR);
  yesterdayBR.setDate(yesterdayBR.getDate() - 1);
  const yesterdayStr = yesterdayBR.toISOString().split('T')[0];

  // Regra dos 2 Dias Logic
  const studiedToday = studyHistory.some(h => h.date === todayStr);
  const studiedYesterday = studyHistory.some(h => h.date === yesterdayStr);
  
  let habitStatus = {
    label: "Protegido",
    desc: "Você estudou hoje. Ciclo mantido!",
    color: "bg-emerald-500",
    icon: <CheckCircle className="text-white" size={20} />,
    alert: false
  };

  if (!studiedToday) {
    if (studiedYesterday) {
      habitStatus = {
        label: "Atenção",
        desc: "Você não estudou hoje. Não falhe amanhã!",
        color: "bg-amber-500",
        icon: <Clock className="text-white" size={20} />,
        alert: false
      };
    } else {
      habitStatus = {
        label: "ZONA DE RISCO",
        desc: "Você não estudou ontem nem hoje. ESTUDE AGORA!",
        color: "bg-rose-600 animate-pulse",
        icon: <AlertTriangle className="text-white" size={20} />,
        alert: true
      };
    }
  }

  // Define o final do desafio
  const endDateBR = new Date('2026-02-23T23:59:59'); 
  const startDateBR = new Date('2026-01-23T00:00:00');
  
  const timeDiff = endDateBR.getTime() - nowBR.getTime();
  const daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
  
  const totalDuration = endDateBR.getTime() - startDateBR.getTime();
  const elapsed = nowBR.getTime() - startDateBR.getTime();
  const timeProgress = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));

  const lessonsLeft = lessons.length - completedIds.length;
  const requiredPace = daysRemaining > 0 ? (lessonsLeft / daysRemaining).toFixed(1) : lessonsLeft;

  const getCourseProgress = (course: 'Laravel' | 'PostgreSQL') => {
    const courseLessons = lessons.filter(l => l.course === course);
    const done = courseLessons.filter(l => completedIds.includes(l.id)).length;
    return {
      percent: Math.round((done / courseLessons.length) * 100) || 0,
      count: done,
      total: courseLessons.length
    };
  };

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(nowBR);
    d.setDate(d.getDate() - (6 - i));
    const dStr = d.toISOString().split('T')[0];
    return {
      label: d.toLocaleDateString('pt-BR', { weekday: 'narrow' }),
      date: dStr,
      studied: studyHistory.some(h => h.date === dStr)
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500">Regra: Nunca falhe dois dias seguidos.</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
            <Globe className="text-indigo-500" size={14} />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Brasília (UTC-3)</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regra dos 2 Dias Widget */}
        <div className={`lg:col-span-2 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row gap-8 items-center justify-between transition-all duration-500 ${habitStatus.color}`}>
          <div className="flex items-center gap-6">
            <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-sm">
              {habitStatus.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Regra dos 2 Dias</span>
                {habitStatus.alert && <span className="bg-white text-rose-600 text-[9px] font-black px-2 py-0.5 rounded-full animate-bounce">URGENTE</span>}
              </div>
              <h3 className="text-3xl font-black mb-1">{habitStatus.label}</h3>
              <p className="text-white/80 text-sm font-medium">{habitStatus.desc}</p>
            </div>
          </div>
          
          <div className="bg-black/10 rounded-3xl p-4 backdrop-blur-sm border border-white/10">
            <p className="text-[9px] font-bold uppercase tracking-widest mb-3 text-center opacity-60">Últimos 7 Dias</p>
            <div className="flex gap-2">
              {last7Days.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold border ${day.studied ? 'bg-white text-slate-900 border-white' : 'bg-transparent border-white/20 text-white/40'}`}>
                    {day.studied ? '✓' : ''}
                  </div>
                  <span className="text-[9px] font-bold uppercase opacity-50">{day.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mini Stats Quick View */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-center text-center group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Meta de Estudo</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{requiredPace}</span>
            <span className="text-sm font-bold text-slate-400">aulas/dia</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">para concluir até 23/02</p>
        </div>
      </div>

      {/* Main Countdown & Progress Card */}
      <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[120px] -mr-40 -mt-40" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full mb-6 border border-indigo-500/20">
              <Zap size={14} className="fill-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Prazo: 30 Dias</span>
            </div>
            <h3 className="text-5xl font-black mb-4 tracking-tight leading-none">Faltam {daysRemaining} dias</h3>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">Você está no caminho para se tornar um desenvolvedor Fullstack robusto.</p>
          </div>

          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                <span>Início: 23 Jan</span>
                <span className="text-indigo-400">{timeProgress}% do Tempo</span>
                <span>Fim: 23 Fev</span>
              </div>
              <div className="h-4 w-full bg-white/5 rounded-full p-1 overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(99,102,241,0.4)]" 
                  style={{ width: `${timeProgress}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Aulas Restantes</p>
                <p className="text-3xl font-black">{lessonsLeft}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Total Concluído</p>
                <p className="text-3xl font-black text-emerald-400">{completedIds.length}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-rose-100 p-4 rounded-2xl text-rose-600">
              <Layout size={24} />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-800">Laravel</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Web Engine</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-bold">
              <span className="text-slate-400">{getCourseProgress('Laravel').count} de {getCourseProgress('Laravel').total}</span>
              <span className="text-rose-600">{getCourseProgress('Laravel').percent}%</span>
            </div>
            <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: `${getCourseProgress('Laravel').percent}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-indigo-100 p-4 rounded-2xl text-indigo-600">
              <Database size={24} />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-800">PostgreSQL</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Data Core</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-bold">
              <span className="text-slate-400">{getCourseProgress('PostgreSQL').count} de {getCourseProgress('PostgreSQL').total}</span>
              <span className="text-indigo-600">{getCourseProgress('PostgreSQL').percent}%</span>
            </div>
            <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${getCourseProgress('PostgreSQL').percent}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;