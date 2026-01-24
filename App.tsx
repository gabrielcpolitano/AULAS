
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Task, StudyHistory, ProgressData, DebriefAnswer } from './types';
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/Tasks';
import DebriefingPage from './pages/Debriefing';
import { LayoutDashboard, CheckSquare, ShieldAlert, Download, Upload, Skull, FileText, ShieldCheck } from 'lucide-react';

const INITIAL_DEBRIEF: DebriefAnswer[] = [
  { id: 'features', question: "O que o projeto tem exatamente agora? (Liste as funcionalidades)", answer: "" },
  { id: 'creation', question: "Como você criou? (Explique a arquitetura e tecnologias)", answer: "" },
  { id: 'status', question: "Está funcionando 100%? (Descreva o estado atual da conexão API/Banco)", answer: "" },
  { id: 'market', question: "Pode começar a oferecer para clientes (mesmo que Beta)? Como?", answer: "" },
];

const App: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getBrasiliaDateString = () => {
    const now = new Date();
    const brDate = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
    return brDate.toISOString().split('T')[0];
  };

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('survival_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [studyHistory, setStudyHistory] = useState<StudyHistory[]>(() => {
    const saved = localStorage.getItem('survival_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [debriefAnswers, setDebriefAnswers] = useState<DebriefAnswer[]>(() => {
    const saved = localStorage.getItem('survival_debrief');
    return saved ? JSON.parse(saved) : INITIAL_DEBRIEF;
  });

  const [isCleared, setIsCleared] = useState<boolean>(() => {
    return localStorage.getItem('survival_cleared') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('survival_tasks', JSON.stringify(tasks));
    localStorage.setItem('survival_history', JSON.stringify(studyHistory));
    localStorage.setItem('survival_debrief', JSON.stringify(debriefAnswers));
    localStorage.setItem('survival_cleared', isCleared.toString());
  }, [tasks, studyHistory, debriefAnswers, isCleared]);

  const addTask = (title: string, priority: 'high' | 'medium' | 'low') => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      completed: false,
      priority,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTask = (id: string) => {
    const today = getBrasiliaDateString();
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const newStatus = !t.completed;
        if (newStatus) {
          setStudyHistory(hPrev => {
            const existingDay = hPrev.find(day => day.date === today);
            if (existingDay) {
              return hPrev.map(day => day.date === today ? { ...day, taskIds: [...new Set([...day.taskIds, id])] } : day);
            }
            return [...hPrev, { date: today, taskIds: [id] }];
          });
        }
        return { ...t, completed: newStatus };
      }
      return t;
    }));
  };

  const updateDebrief = (id: string, answer: string) => {
    setDebriefAnswers(prev => prev.map(a => a.id === id ? { ...a, answer } : a));
  };

  const handleExport = () => {
    const data: ProgressData = { tasks, history: studyHistory, debriefAnswers, isCleared };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `survival-full-intel-${getBrasiliaDateString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        setTasks(json.tasks || []);
        setStudyHistory(json.history || []);
        setDebriefAnswers(json.debriefAnswers || INITIAL_DEBRIEF);
        setIsCleared(!!json.isCleared);
        alert('INTEL LOADED SUCCESSFULLY.');
      } catch (err) { alert('INVALID DATA'); }
    };
    reader.readAsText(file);
  };

  const Sidebar = () => {
    const location = useLocation();
    const links = [
      { to: '/', label: 'WAR ROOM', icon: LayoutDashboard },
      { to: '/tasks', label: 'TARGETS', icon: CheckSquare },
      { to: '/debrief', label: 'FINAL', icon: FileText },
    ];

    return (
      <aside className="w-64 bg-slate-950 border-r border-rose-900/30 h-screen sticky top-0 flex flex-col hidden md:flex">
        <div className="p-8">
          <h1 className="text-2xl font-black text-rose-600 tracking-tighter italic">
            SURVIVAL<span className="text-slate-100">MODE</span>
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isCleared ? 'bg-emerald-500' : 'bg-rose-600 animate-pulse'}`} />
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isCleared ? 'text-emerald-500' : 'text-rose-500'}`}>
              {isCleared ? 'MISSION ACCOMPLISHED' : 'Active Deadline: 23 Feb'}
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-4 px-5 py-4 rounded-xl text-sm font-black transition-all ${
                location.pathname === to 
                  ? 'bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)]' 
                  : 'text-slate-500 hover:text-slate-100 hover:bg-slate-900'
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}

          <div className="pt-8 space-y-2">
             <button onClick={handleExport} className="w-full flex items-center gap-4 px-5 py-3 rounded-xl text-[10px] font-black text-slate-500 hover:text-emerald-400 uppercase tracking-widest transition-all">
               <Download size={16} /> Export Intel
             </button>
             <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-4 px-5 py-3 rounded-xl text-[10px] font-black text-slate-500 hover:text-amber-400 uppercase tracking-widest transition-all">
               <Upload size={16} /> Import Intel
             </button>
             <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />
          </div>
        </nav>

        <div className="p-6">
           <div className={`border p-5 rounded-2xl flex items-center gap-4 transition-colors ${isCleared ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-rose-950/20 border-rose-900/40'}`}>
              {isCleared ? <ShieldCheck className="text-emerald-500" size={32} /> : <Skull className="text-rose-600" size={32} />}
              <div>
                <p className={`text-[9px] font-black uppercase tracking-widest ${isCleared ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {isCleared ? 'PROTOCOL CLEARED' : 'Failure State'}
                </p>
                <p className="text-xs text-slate-400 font-bold leading-tight">
                  {isCleared ? 'You have survived the deadline.' : 'If unfinished by 23/02, I am dead.'}
                </p>
              </div>
           </div>
        </div>
      </aside>
    );
  };

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-slate-950 text-slate-200">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-12 max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard tasks={tasks} history={studyHistory} isCleared={isCleared} />} />
              <Route path="/tasks" element={<TasksPage tasks={tasks} onToggle={toggleTask} onAdd={addTask} onDelete={deleteTask} />} />
              <Route path="/debrief" element={<DebriefingPage answers={debriefAnswers} onUpdate={updateDebrief} isCleared={isCleared} onClear={() => setIsCleared(true)} />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
