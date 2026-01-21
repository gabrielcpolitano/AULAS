
import React from 'react';
import { Lesson, Milestone, MilestoneStatus } from '../types';
import { PlayCircle, Trophy, ListTodo, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  lessons: Lesson[];
  completedIds: number[];
  milestones: Milestone[];
}

const Dashboard: React.FC<DashboardProps> = ({ lessons, completedIds, milestones }) => {
  const nextLesson = lessons.find(l => !completedIds.includes(l.id));
  const progressPercent = Math.round((completedIds.length / lessons.length) * 100);

  const getMilestoneStatus = (m: Milestone) => {
    const milestoneLessons = lessons.filter(l => l.id <= m.maxLessonId);
    const completedCount = milestoneLessons.filter(l => completedIds.includes(l.id)).length;
    
    if (completedCount === milestoneLessons.length) return MilestoneStatus.COMPLETED;
    if (completedCount > 0) return MilestoneStatus.IN_PROGRESS;
    return MilestoneStatus.NOT_STARTED;
  };

  const chartData = milestones.map(m => {
    const mLessons = lessons.filter(l => l.id <= m.maxLessonId);
    const done = mLessons.filter(l => completedIds.includes(l.id)).length;
    return {
      name: `M${m.id}`,
      fullName: m.name.split(':')[0],
      progress: Math.round((done / mLessons.length) * 100),
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-500">Bem-vindo ao seu painel de controle do AdonisJS 6.</p>
      </header>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Progresso</p>
            <p className="text-2xl font-bold">{progressPercent}%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Concluídas</p>
            <p className="text-2xl font-bold">{completedIds.length} / {lessons.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Marcos</p>
            <p className="text-2xl font-bold">
              {milestones.filter(m => getMilestoneStatus(m) === MilestoneStatus.COMPLETED).length} / {milestones.length}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-amber-100 p-3 rounded-xl text-amber-600">
            <ListTodo size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Restante</p>
            <p className="text-2xl font-bold">{lessons.length - completedIds.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Next Recommendation */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl text-white shadow-xl shadow-indigo-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PlayCircle size={20} />
              Próxima Aula
            </h3>
            {nextLesson ? (
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-70">{nextLesson.module}</span>
                  <p className="text-lg font-bold leading-tight mt-1">{nextLesson.title}</p>
                </div>
                <Link 
                  to="/lessons" 
                  className="block w-full text-center py-3 bg-white text-indigo-700 font-bold rounded-xl shadow-lg hover:bg-slate-50 transition-colors"
                >
                  Continuar Curso
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-xl font-bold">🎉 Curso Concluído!</p>
                <p className="text-white/70 text-sm mt-2">Você é um mestre em AdonisJS 6.</p>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Status dos Marcos</h3>
            <div className="space-y-4">
              {milestones.slice(0, 5).map(m => {
                const status = getMilestoneStatus(m);
                return (
                  <div key={m.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 truncate mr-2">{m.name.split(':')[0]}</span>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      status === MilestoneStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700' :
                      status === MilestoneStatus.IN_PROGRESS ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {status.replace('_', ' ')}
                    </span>
                  </div>
                );
              })}
              <Link to="/milestones" className="block text-center text-xs text-indigo-600 font-semibold hover:underline mt-2">
                Ver todos os marcos
              </Link>
            </div>
          </div>
        </div>

        {/* Custom Bar Chart using Tailwind */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Progresso por Marcos</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-1.5 text-xs text-slate-500">
                 <div className="w-3 h-3 bg-indigo-500 rounded-sm" /> Em progresso
               </div>
               <div className="flex items-center gap-1.5 text-xs text-slate-500">
                 <div className="w-3 h-3 bg-emerald-500 rounded-sm" /> Concluído
               </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full flex items-end justify-between gap-2 px-2 border-b border-slate-100 pb-2">
            {chartData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center group relative bar-container h-full justify-end">
                {/* Tooltip */}
                <div className="bar-hover-info absolute bottom-full mb-2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-10 pointer-events-none">
                  {data.fullName}: {data.progress}%
                </div>
                
                {/* Bar */}
                <div 
                  className={`w-full max-w-[32px] rounded-t-lg transition-all duration-1000 ease-out relative overflow-hidden ${
                    data.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                  }`}
                  style={{ height: `${Math.max(data.progress, 5)}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                {/* Label */}
                <span className="mt-2 text-[10px] font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                  {data.name}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between px-2">
            <p className="text-[10px] text-slate-400 font-medium italic">Passe o mouse sobre as barras para detalhes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
