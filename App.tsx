import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { neon } from '@neondatabase/serverless';
import { Task, StudyHistory, ProgressData, DebriefAnswer } from './types';
import Dashboard from './pages/Dashboard';
import BenefitsPage from './pages/Benefits';
import DebriefingPage from './pages/Debriefing';
import { LayoutDashboard, Zap, ShieldAlert, Download, Upload, Skull, FileText, ShieldCheck, Plus, Languages, Cpu, Database, CloudSync, Wifi, WifiOff } from 'lucide-react';
import { KATA_GOAL, FLASHCARD_GOAL, NEON_DATABASE_URL } from './constants';

const sql = neon(NEON_DATABASE_URL);

const INITIAL_DEBRIEF: DebriefAnswer[] = [
  { id: 'logic', question: "Como seu raciocínio lógico evoluiu após 1000 desafios?", answer: "" },
  { id: 'english', question: "Descreva seu nível de conforto com a documentação em inglês agora.", answer: "" },
  { id: 'habits', question: "Como você manteve a disciplina para bater ambas as metas de 1000?", answer: "" },
  { id: 'next', question: "Qual o próximo nível agora que os 2000 marcos foram batidos?", answer: "" },
];

const App: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dbStatus, setDbStatus] = useState<'connecting' | 'online' | 'error'>('connecting');
  const [isSyncing, setIsSyncing] = useState(false);

  const getBrasiliaDateString = () => {
    const now = new Date();
    const brDate = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
    return brDate.toISOString().split('T')[0];
  };

  const [tasks, setTasks] = useState<Task[]>([]);
  const [kataCount, setKataCount] = useState<number>(0);
  const [flashcardCount, setFlashcardCount] = useState<number>(0);
  const [studyHistory, setStudyHistory] = useState<StudyHistory[]>([]);
  const [debriefAnswers, setDebriefAnswers] = useState<DebriefAnswer[]>(INITIAL_DEBRIEF);
  const [isCleared, setIsCleared] = useState<boolean>(false);

  // Initialize and Fetch from Neon
  useEffect(() => {
    const initDb = async () => {
      try {
        setDbStatus('connecting');
        // Ensure table exists
        await sql`
          CREATE TABLE IF NOT EXISTS survival_state (
            id INTEGER PRIMARY KEY,
            data JSONB,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          )
        `;

        const result = await sql`SELECT data FROM survival_state WHERE id = 1`;
        
        if (result.length > 0) {
          const cloudData = result[0].data as ProgressData;
          setTasks(cloudData.tasks || []);
          setKataCount(cloudData.kataCount || 0);
          setFlashcardCount(cloudData.flashcardCount || 0);
          setStudyHistory(cloudData.history || []);
          setDebriefAnswers(cloudData.debriefAnswers || INITIAL_DEBRIEF);
          setIsCleared(!!cloudData.isCleared);
        } else {
          // Initialize row 1 if empty
          const initialData: ProgressData = { tasks: [], history: [], debriefAnswers: INITIAL_DEBRIEF, isCleared: false, kataCount: 0, flashcardCount: 0 };
          await sql`INSERT INTO survival_state (id, data) VALUES (1, ${initialData})`;
        }
        setDbStatus('online');
      } catch (err) {
        console.error("DB Connection Error:", err);
        setDbStatus('error');
        // Fallback to local storage if DB fails
        const savedTasks = localStorage.getItem('survival_tasks');
        if (savedTasks) setTasks(JSON.parse(savedTasks));
      }
    };

    initDb();
  }, []);

  // Sync to Neon helper
  const syncToCloud = async (newData: Partial<ProgressData>) => {
    if (dbStatus !== 'online') return;
    setIsSyncing(true);
    try {
      // Get current data to merge
      const result = await sql`SELECT data FROM survival_state WHERE id = 1`;
      const currentData = result[0].data;
      const mergedData = { ...currentData, ...newData };
      
      await sql`
        UPDATE survival_state 
        SET data = ${mergedData}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = 1
      `;
    } catch (err) {
      console.error("Sync Error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const incrementCount = (type: 'kata' | 'flash') => {
    const newKata = type === 'kata' ? kataCount + 1 : kataCount;
    const newFlash = type === 'flash' ? flashcardCount + 1 : flashcardCount;
    
    if (type === 'kata') setKataCount(newKata);
    else setFlashcardCount(newFlash);

    const today = getBrasiliaDateString();
    let newHistory: StudyHistory[] = [];
    
    setStudyHistory(hPrev => {
      const existingDay = hPrev.find(day => day.date === today);
      const unitId = type === 'kata' ? 'kata-unit' : 'flash-unit';
      if (existingDay) {
        newHistory = hPrev.map(day => day.date === today ? { ...day, taskIds: [...day.taskIds, unitId] } : day);
      } else {
        newHistory = [...hPrev, { date: today, taskIds: [unitId] }];
      }
      
      // Push to cloud
      syncToCloud({ 
        kataCount: newKata, 
        flashcardCount: newFlash, 
        history: newHistory 
      });
      
      return newHistory;
    });
  };

  const updateDebrief = (id: string, answer: string) => {
    const updated = debriefAnswers.map(a => a.id === id ? { ...a, answer } : a);
    setDebriefAnswers(updated);
    syncToCloud({ debriefAnswers: updated });
  };

  const setGlobalCleared = (status: boolean) => {
    setIsCleared(status);
    syncToCloud({ isCleared: status });
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

  const Sidebar = () => {
    const location = useLocation();
    const links = [
      { to: '/', label: 'WAR ROOM', icon: LayoutDashboard },
      { to: '/benefits', label: 'BENEFITS', icon: Zap },
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
              {isCleared ? 'SURVIVOR' : 'DEADLINE: 31 DEC'}
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
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl relative group overflow-hidden">
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

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden">
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

          <div className="mt-8 border-t border-white/5 pt-6 px-4">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${dbStatus === 'online' ? 'bg-emerald-400 neon-status-active' : dbStatus === 'connecting' ? 'bg-amber-400 animate-pulse' : 'bg-rose-600'}`} />
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Neon DB Live</span>
                </div>
                {isSyncing && <CloudSync className="text-rose-600 animate-spin" size={12} />}
             </div>
             <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                <p className="text-[7px] text-slate-600 font-mono uppercase truncate">ID: {NEON_DATABASE_URL.split('@')[1].split('.')[0]}</p>
             </div>
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
              <Route path="/benefits" element={<BenefitsPage />} />
              <Route path="/debrief" element={<DebriefingPage answers={debriefAnswers} onUpdate={updateDebrief} isCleared={isCleared} onClear={() => setGlobalCleared(true)} />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;