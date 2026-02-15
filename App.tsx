import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { neon } from '@neondatabase/serverless';
import { Task, StudyHistory, ProgressData, DebriefAnswer } from './types';
import Dashboard from './pages/Dashboard';
import BenefitsPage from './pages/Benefits';
import DebriefingPage from './pages/Debriefing';
import { LayoutDashboard, Zap, ShieldAlert, Download, Upload, Skull, FileText, ShieldCheck, Plus, Languages, Cpu, Database, CloudSync, Wifi, WifiOff, Box, Code2 } from 'lucide-react';
import { KATA_GOAL, FLASHCARD_GOAL, NEON_DATABASE_URL } from './constants';

const sql = neon(NEON_DATABASE_URL);

const INITIAL_DEBRIEF: DebriefAnswer[] = [
  { id: 'logic', question: "Como seu raciocínio lógico evoluiu após 1000 desafios?", answer: "" },
  { id: 'english', question: "Descreva seu nível de conforto com a documentação em inglês agora.", answer: "" },
  { id: 'habits', question: "Como você manteve a disciplina para bater ambas as metas de 1000?", answer: "" },
  { id: 'next', question: "Qual o próximo nível agora que os 2000 marcos foram batidos?", answer: "" },
];

const App: React.FC = () => {
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
  const [fullCycleCount, setFullCycleCount] = useState<number>(0);
  const [goCount, setGoCount] = useState<number>(0);
  const [studyHistory, setStudyHistory] = useState<StudyHistory[]>([]);
  const [debriefAnswers, setDebriefAnswers] = useState<DebriefAnswer[]>(INITIAL_DEBRIEF);
  const [isCleared, setIsCleared] = useState<boolean>(false);

  useEffect(() => {
    const initDb = async () => {
      try {
        setDbStatus('connecting');
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
          setFullCycleCount(cloudData.fullCycleCount || 0);
          setGoCount(cloudData.goCount || 0);
          setStudyHistory(cloudData.history || []);
          setDebriefAnswers(cloudData.debriefAnswers || INITIAL_DEBRIEF);
          setIsCleared(!!cloudData.isCleared);
        } else {
          const initialData: ProgressData = { 
            tasks: [], 
            history: [], 
            debriefAnswers: INITIAL_DEBRIEF, 
            isCleared: false, 
            kataCount: 0, 
            flashcardCount: 0,
            fullCycleCount: 0,
            goCount: 0
          };
          await sql`INSERT INTO survival_state (id, data) VALUES (1, ${initialData})`;
        }
        setDbStatus('online');
      } catch (err) {
        console.error("DB Connection Error:", err);
        setDbStatus('error');
      }
    };

    initDb();
  }, []);

  const syncToCloud = async (newData: Partial<ProgressData>) => {
    if (dbStatus !== 'online') return;
    setIsSyncing(true);
    try {
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

  const incrementCount = (type: 'kata' | 'flash' | 'fc' | 'go') => {
    let newKata = kataCount;
    let newFlash = flashcardCount;
    let newFC = fullCycleCount;
    let newGo = goCount;

    if (type === 'kata') { newKata++; setKataCount(newKata); }
    if (type === 'flash') { newFlash++; setFlashcardCount(newFlash); }
    if (type === 'fc') { newFC++; setFullCycleCount(newFC); }
    if (type === 'go') { newGo++; setGoCount(newGo); }

    const today = getBrasiliaDateString();
    let newHistory: StudyHistory[] = [];
    
    setStudyHistory(hPrev => {
      const existingDay = hPrev.find(day => day.date === today);
      const unitId = `${type}-unit`;
      if (existingDay) {
        newHistory = hPrev.map(day => day.date === today ? { ...day, taskIds: [...day.taskIds, unitId] } : day);
      } else {
        newHistory = [...hPrev, { date: today, taskIds: [unitId] }];
      }
      
      syncToCloud({ 
        kataCount: newKata, 
        flashcardCount: newFlash, 
        fullCycleCount: newFC,
        goCount: newGo,
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

  const Sidebar = () => {
    const location = useLocation();
    const links = [
      { to: '/', label: 'WAR ROOM', icon: LayoutDashboard },
      { to: '/benefits', label: 'BENEFITS', icon: Zap },
      { to: '/debrief', label: 'FINAL', icon: FileText },
    ];

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

          <div className="mt-8 space-y-3 px-2">
              <div className="flex flex-col gap-2">
                <button onClick={() => incrementCount('kata')} className="w-full py-2.5 bg-rose-600/10 border border-rose-600/30 text-rose-500 text-[10px] font-black uppercase rounded-xl hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2">
                  <Cpu size={14} /> +1 Kata ({kataCount})
                </button>
                <button onClick={() => incrementCount('flash')} className="w-full py-2.5 bg-indigo-600/10 border border-indigo-600/30 text-indigo-500 text-[10px] font-black uppercase rounded-xl hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2">
                  <Languages size={14} /> +1 Lang ({flashcardCount})
                </button>
                <div className="h-px bg-white/5 my-2" />
                <button onClick={() => incrementCount('fc')} className="w-full py-2.5 bg-purple-600/10 border border-purple-600/30 text-purple-500 text-[10px] font-black uppercase rounded-xl hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-2">
                  <Box size={14} /> +20m Full Cycle ({fullCycleCount})
                </button>
                <button onClick={() => incrementCount('go')} className="w-full py-2.5 bg-cyan-600/10 border border-cyan-600/30 text-cyan-500 text-[10px] font-black uppercase rounded-xl hover:bg-cyan-600 hover:text-white transition-all flex items-center justify-center gap-2">
                  <Code2 size={14} /> +20m Go Lang ({goCount})
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
              <Route path="/" element={<Dashboard history={studyHistory} isCleared={isCleared} kataCount={kataCount} flashcardCount={flashcardCount} fullCycleCount={fullCycleCount} goCount={goCount} onIncrement={incrementCount} />} />
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