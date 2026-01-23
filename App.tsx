
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LESSONS, MILESTONES } from './constants';
import { Lesson, Milestone, StudyHistory, ProgressData } from './types';
import Dashboard from './pages/Dashboard';
import Lessons from './pages/Lessons';
import Milestones from './pages/Milestones';
import { LayoutDashboard, BookOpen, Map, Download, Upload, Trash2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get Brasília Date String YYYY-MM-DD
  const getBrasiliaDateString = () => {
    const now = new Date();
    const brDate = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
    return brDate.toISOString().split('T')[0];
  };

  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('centralizando_progress');
    return saved ? JSON.parse(saved) : [];
  });

  const [studyHistory, setStudyHistory] = useState<StudyHistory[]>(() => {
    const saved = localStorage.getItem('centralizando_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('centralizando_progress', JSON.stringify(completedLessonIds));
    localStorage.setItem('centralizando_history', JSON.stringify(studyHistory));
  }, [completedLessonIds, studyHistory]);

  const toggleLesson = (id: number) => {
    const today = getBrasiliaDateString();
    
    setCompletedLessonIds(prev => {
      const isCompleting = !prev.includes(id);
      
      if (isCompleting) {
        setStudyHistory(hPrev => {
          const existingDay = hPrev.find(day => day.date === today);
          if (existingDay) {
            return hPrev.map(day => day.date === today ? { ...day, lessonIds: [...new Set([...day.lessonIds, id])] } : day);
          }
          return [...hPrev, { date: today, lessonIds: [id] }];
        });
        return [...prev, id];
      } else {
        setStudyHistory(hPrev => hPrev.map(day => ({
          ...day,
          lessonIds: day.lessonIds.filter(lid => lid !== id)
        })).filter(day => day.lessonIds.length > 0));
        return prev.filter(lid => lid !== id);
      }
    });
  };

  const handleExport = () => {
    const data: ProgressData = {
      completedLessonIds,
      history: studyHistory
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = getBrasiliaDateString();
    link.href = url;
    link.download = `centralizando-backup-${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.completedLessonIds && Array.isArray(json.history)) {
          if (confirm('Isso irá substituir seu progresso atual. Deseja continuar?')) {
            setCompletedLessonIds(json.completedLessonIds);
            setStudyHistory(json.history);
            alert('Dados importados com sucesso!');
          }
        } else {
          alert('Arquivo JSON inválido.');
        }
      } catch (err) {
        alert('Erro ao ler o arquivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  const Sidebar = () => {
    const location = useLocation();
    
    const links = [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/lessons', label: 'Aulas', icon: BookOpen },
      { to: '/milestones', label: 'Marcos', icon: Map },
    ];

    return (
      <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Centralizando
          </h1>
          <p className="text-xs text-slate-500 font-medium">Progress Tracker</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <div className="mb-2 px-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Navegação</span>
          </div>
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                location.pathname === to 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}

          <div className="mt-8 mb-2 px-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dados</span>
          </div>
          <button
            onClick={handleExport}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all group"
          >
            <Download size={18} className="group-hover:scale-110 transition-transform" />
            Exportar JSON
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-amber-50 hover:text-amber-700 transition-all group"
          >
            <Upload size={18} className="group-hover:scale-110 transition-transform" />
            Importar JSON
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            accept=".json" 
            className="hidden" 
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global</span>
              <span className="text-xs font-bold text-indigo-600">
                {Math.round((completedLessonIds.length / LESSONS.length) * 100)}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-700 ease-out" 
                style={{ width: `${(completedLessonIds.length / LESSONS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </aside>
    );
  };

  const MobileNav = () => {
    const location = useLocation();
    const links = [
      { to: '/', label: 'Home', icon: LayoutDashboard },
      { to: '/lessons', label: 'Aulas', icon: BookOpen },
      { to: '/milestones', label: 'Marcos', icon: Map },
    ];

    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-50">
        {links.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${
              location.pathname === to ? 'text-indigo-600' : 'text-slate-500'
            }`}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        ))}
      </nav>
    );
  };

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 pb-20 md:pb-0">
          <div className="p-4 md:p-8 max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard lessons={LESSONS} completedIds={completedLessonIds} milestones={MILESTONES} studyHistory={studyHistory} />} />
              <Route path="/lessons" element={<Lessons lessons={LESSONS} completedIds={completedLessonIds} onToggle={toggleLesson} />} />
              <Route path="/milestones" element={<Milestones lessons={LESSONS} completedIds={completedLessonIds} milestones={MILESTONES} />} />
            </Routes>
          </div>
        </main>
        <MobileNav />
      </div>
    </HashRouter>
  );
};

export default App;