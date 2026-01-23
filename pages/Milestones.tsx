import React from 'react';
import { Lesson, Milestone, MilestoneStatus } from '../types';
import { CheckCircle2, Target, Flag, Clock, Database, Layout } from 'lucide-react';

interface MilestonesProps {
  lessons: Lesson[];
  completedIds: number[];
  milestones: Milestone[];
}

const Milestones: React.FC<MilestonesProps> = ({ lessons, completedIds, milestones }) => {
  const getMilestoneStatus = (m: Milestone) => {
    // Agora filtramos lições que pertencem especificamente ao curso do marco
    const milestoneLessons = lessons.filter(l => l.course === m.course && l.id <= m.maxLessonId);
    const completedCount = milestoneLessons.filter(l => completedIds.includes(l.id)).length;
    
    if (completedCount === milestoneLessons.length && milestoneLessons.length > 0) return MilestoneStatus.COMPLETED;
    if (completedCount > 0) return MilestoneStatus.IN_PROGRESS;
    return MilestoneStatus.NOT_STARTED;
  };

  const getMilestoneProgress = (m: Milestone) => {
    const milestoneLessons = lessons.filter(l => l.course === m.course && l.id <= m.maxLessonId);
    const completedCount = milestoneLessons.filter(l => completedIds.includes(l.id)).length;
    return milestoneLessons.length > 0 ? Math.round((completedCount / milestoneLessons.length) * 100) : 0;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Marcos do Desafio</h2>
        <p className="text-slate-500">Seu roadmap completo de 23/01 a 23/02.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
        {milestones.map((m) => {
          const status = getMilestoneStatus(m);
          const progress = getMilestoneProgress(m);

          return (
            <div 
              key={m.id} 
              className={`relative bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${
                status === MilestoneStatus.COMPLETED 
                ? 'border-emerald-200 shadow-emerald-50 shadow-lg' 
                : 'border-slate-100 shadow-sm'
              }`}
            >
              {/* Top Course Indicator bar */}
              <div className={`h-1.5 w-full ${m.course === 'Laravel' ? 'bg-rose-500' : 'bg-indigo-500'}`} />

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-xl flex items-center gap-2 ${
                    status === MilestoneStatus.COMPLETED ? 'bg-emerald-100 text-emerald-600' :
                    status === MilestoneStatus.IN_PROGRESS ? 'bg-slate-100 text-indigo-600' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {m.course === 'Laravel' ? <Layout size={18} /> : <Database size={18} />}
                    <span className="text-[10px] font-black uppercase tracking-widest">{m.course}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    status === MilestoneStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700' :
                    status === MilestoneStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">{m.name}</h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">{m.description}</p>

                <div className="space-y-3 mb-8">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conhecimentos Chave</p>
                  <ul className="grid grid-cols-1 gap-2">
                    {m.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 size={14} className={status === MilestoneStatus.COMPLETED ? 'text-emerald-500' : 'text-slate-300'} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <Clock size={12} /> ID Limite: {m.maxLessonId > 100 ? m.maxLessonId - 100 : m.maxLessonId}
                    </span>
                    <span className={`text-xs font-bold ${status === MilestoneStatus.COMPLETED ? 'text-emerald-600' : 'text-indigo-600'}`}>
                      {progress}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-700 ${
                        status === MilestoneStatus.COMPLETED ? 'bg-emerald-500' : m.course === 'Laravel' ? 'bg-rose-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Milestones;