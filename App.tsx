
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LESSONS, MILESTONES } from './constants';
import { Lesson, Milestone, MilestoneStatus } from './types';
import Dashboard from './pages/Dashboard';
import Lessons from './pages/Lessons';
import Milestones from './pages/Milestones';
import { LayoutDashboard, BookOpen, Map, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('centralizando_progress');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('centralizando_progress', JSON.stringify(completedLessonIds));
  }, [completedLessonIds]);

  const toggleLesson = (id: number) => {
    setCompletedLessonIds(prev => 
      prev.includes(id) ? prev.filter(lid => lid !== id) : [...prev, id]
    );
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
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === to 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-semibold text-slate-500">PROGRÉS</span>
              <span className="text-xs font-bold text-indigo-600">
                {Math.round((completedLessonIds.length / LESSONS.length) * 100)}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-500" 
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
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 pb-20 md:pb-0">
          <div className="p-4 md:p-8 max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard lessons={LESSONS} completedIds={completedLessonIds} milestones={MILESTONES} />} />
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
