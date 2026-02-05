
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Task, StudyHistory, ProgressData, DebriefAnswer } from './types';
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/Tasks';
import DebriefingPage from './pages/Debriefing';
import { LayoutDashboard, CheckSquare, ShieldAlert, Download, Upload, Skull, FileText, ShieldCheck, Zap, Plus, Languages, Cpu } from 'lucide-react';
import { KATA_GOAL, FLASHCARD_GOAL } from './constants';

const INITIAL_DEBRIEF: DebriefAnswer[] = [
  { id: 'logic', question: "Como seu raciocínio lógico evoluiu após 1000 desafios?", answer: "" },
  { id: 'english', question: "Descreva seu nível de conforto com a documentação em inglês agora.", answer: "" },
  { id: 'habits', question: "Como você manteve a disciplina para bater ambas as metas de 1000?", answer: "" },
  { id: 'next', question: "Qual o próximo nível agora que os 2000 marcos foram batidos?", answer: "" },
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

  const [kataCount, setKataCount] = useState<number>(() => {
    const saved = localStorage.getItem('survival_kata_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [flashcardCount, setFlashcardCount] = useState<number>(() => {
    const saved = localStorage.getItem('survival_flash_count');
    return saved ? parseInt(saved, 10) : 0;
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
    localStorage.setItem('survival_kata_count', kataCount.toString());
    localStorage.setItem('survival_flash_count', flashcardCount.toString());
    localStorage.setItem('survival_history', JSON.stringify(studyHistory));
    localStorage.setItem('survival_debrief', JSON.stringify(debriefAnswers));
    localStorage.setItem('survival_cleared', isCleared.toString());
  }, [tasks, kataCount, flashcardCount, studyHistory, debriefAnswers, isCleared]);

  const incrementCount = (type: 'kata' | 'flash') => {
    if (type === 'kata') setKataCount(prev => prev + 1);
    else setFlashcardCount(prev => prev + 1);

    const today = getBrasiliaDateString();
    setStudyHistory(hPrev => {
      const existingDay = hPrev.find(day => day.date === today);
      const unitId = type === 'kata' ? 'kata-unit' : 'flash-unit';
      if (existingDay) {
        return hPrev.map(day => day.date === today ? { ...day, taskIds: [...day.taskIds, unitId] } : day);
      }
      return [...hPrev, { date: today, taskIds: [unitId] }];
    });
  };

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
    const data: ProgressData = { tasks, history: studyHistory, debriefAnswers, isCleared, kataCount, flashcardCount };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `survival-1000x2-intel-${getBrasiliaDateString()}.json`;
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
        setKataCount(json.kataCount || 0);
        setFlashcardCount(json.flashcardCount || 0);
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

    const kataProgress = Math.min(100, Math.round((kataCount / KATA_GOAL) * 100));
    const flashProgress = Math.min(100, Math.round((flashcardCount / FLASHCARD_GOAL) * 100));

    return (
      <aside className="w-64 bg-slate-950 border-r border-rose-900/30 h-screen sticky top-0 flex flex-col hidden md:flex">
        <div className="p-8 pb-4">
          <h1 className="text-2xl font-black text-rose-600 tracking-tighter italic">
            DOUBLE<span className="text-slate-100">1000</span>
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isCleared ? 'bg-emerald-500' : 'bg-rose-600 animate-pulse'}`} />
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isCleared ? 'text-emerald-500' : 'text-rose-500'}`}>
              {isCleared ? 'SURVIVOR' : 'DEADLINE: 01 APR'}
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto pt-4">
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

          <div className="mt-8 space-y-4 px-2">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1"><Cpu size={10} /> Logic</span>
                  <span className="text-[9px] font-black text-white">{kataCount}/1000</span>
                </div>
                <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-600 transition-all duration-1000" style={{width: `${kataProgress}%`}} />
                </div>
                <button onClick={() => incrementCount('kata')} className="w-full mt-3 py-2 bg-rose-600 text-white text-[9px] font-black uppercase rounded-lg hover:bg-rose-500 active:scale-95 transition-all">
                  +1 Kata
                </button>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1"><Languages size={10} /> English</span>
                  <span className="text-[9px] font-black text-white">{flashcardCount}/1000</span>
                </div>
                <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-1000" style={{width: `${flashProgress}%`}} />
                </div>
                <button onClick={() => incrementCount('flash')} className="w-full mt-3 py-2 bg-indigo-600 text-white text-[9px] font-black uppercase rounded-lg hover:bg-indigo-500 active:scale-95 transition-all">
                  +1 Flashcard
                </button>
              </div>
          </div>

          <div className="pt-8 space-y-2 border-t border-white/5 mt-4">
             <button onClick={handleExport} className="w-full flex items-center gap-4 px-5 py-3 rounded-xl text-[10px] font-black text-slate-500 hover:text-emerald-400 uppercase tracking-widest transition-all">
               <Download size={16} /> Export Intel
             </button>
             <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-4 px-5 py-3 rounded-xl text-[10px] font-black text-slate-500 hover:text-amber-400 uppercase tracking-widest transition-all">
               <Upload size={16} /> Import Intel
             </button>
             <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />
          </div>
        </nav>
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
              <Route path="/" element={<Dashboard tasks={tasks} history={studyHistory} isCleared={isCleared} kataCount={kataCount} flashcardCount={flashcardCount} onIncrement={incrementCount} />} />
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
