import React, { useState, useEffect } from 'react';
import { MemoryRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { neon } from '@neondatabase/serverless';
import { StudyHistory, ProgressData, DebriefAnswer } from './types';
import Dashboard from './pages/Dashboard';
import BenefitsPage from './pages/Benefits';
import DebriefingPage from './pages/Debriefing';
import { LayoutDashboard, GraduationCap, ClipboardList, CloudSync, Box, Languages, BookOpen, User, Book } from 'lucide-react';
import { NEON_DATABASE_URL } from './constants';

const sql = neon(NEON_DATABASE_URL);

const INITIAL_DEBRIEF: DebriefAnswer[] = [
  { id: 'bible', question: "Como o estudo diário da Bíblia em Inglês fortaleceu sua formação ética e mental?", answer: "" },
  { id: 'go', question: "Como a prática do Duolingo impactou sua fluência técnica para o mercado global?", answer: "" },
  { id: 'fullcycle', question: "Como a especialização Full Cycle alterou sua visão de arquitetura de sistemas?", answer: "" },
  { id: 'future', question: "Qual o seu plano de carreira após concluir este ciclo acadêmico?", answer: "" },
];

const App: React.FC = () => {
  const [dbStatus, setDbStatus] = useState<'connecting' | 'online' | 'error'>('connecting');
  const [isSyncing, setIsSyncing] = useState(false);

  const getBrasiliaDateString = () => {
    return new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'America/Sao_Paulo',
    }).format(new Date());
  };

  const [bibleCount, setBibleCount] = useState<number>(0);
  const [goCount, setGoCount] = useState<number>(0);
  const [fullCycleCount, setFullCycleCount] = useState<number>(0);
  const [studyHistory, setStudyHistory] = useState<StudyHistory[]>([]);
  const [debriefAnswers, setDebriefAnswers] = useState<DebriefAnswer[]>(INITIAL_DEBRIEF);
  const [isCleared, setIsCleared] = useState<boolean>(false);

  useEffect(() => {
    const initDb = async () => {
      try {
        setDbStatus('connecting');
        await sql`
          CREATE TABLE IF NOT EXISTS survival_state_triple (
            id INTEGER PRIMARY KEY,
            data JSONB,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          )
        `;

        const result = await sql`SELECT data FROM survival_state_triple WHERE id = 1`;
        
        if (result.length > 0) {
          const cloudData = result[0].data as ProgressData;
          setBibleCount(cloudData.bibleCount || 0);
          setGoCount(cloudData.goCount || 0);
          setFullCycleCount(cloudData.fullCycleCount || 0);
          setStudyHistory(cloudData.history || []);
          setDebriefAnswers(cloudData.debriefAnswers || INITIAL_DEBRIEF);
          setIsCleared(!!cloudData.isCleared);
        } else {
          const initialData: ProgressData = { 
            tasks: [],
            history: [], 
            debriefAnswers: INITIAL_DEBRIEF, 
            isCleared: false, 
            bibleCount: 0,
            goCount: 0,
            fullCycleCount: 0
          };
          await sql`INSERT INTO survival_state_triple (id, data) VALUES (1, ${initialData})`;
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
      const result = await sql`SELECT data FROM survival_state_triple WHERE id = 1`;
      const currentData = result[0].data;
      const mergedData = { ...currentData, ...newData };
      
      await sql`
        UPDATE survival_state_triple 
        SET data = ${mergedData}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = 1
      `;
    } catch (err) {
      console.error("Sync Error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const incrementCount = (type: 'bible' | 'go' | 'fc') => {
    let newBible = bibleCount;
    let newGo = goCount;
    let newFC = fullCycleCount;

    if (type === 'bible') { newBible++; setBibleCount(newBible); }
    if (type === 'go') { newGo++; setGoCount(newGo); }
    if (type === 'fc') { newFC++; setFullCycleCount(newFC); }

    const today = getBrasiliaDateString();
    let newHistory: StudyHistory[] = [];
    
    setStudyHistory(hPrev => {
      const existingDay = hPrev.find(day => day.date === today);
      const unitId = `${type}-unit-${Date.now()}`;
      if (existingDay) {
        newHistory = hPrev.map(day => day.date === today ? { ...day, taskIds: [...day.taskIds, unitId] } : day);
      } else {
        newHistory = [...hPrev, { date: today, taskIds: [unitId] }];
      }
      
      syncToCloud({ 
        bibleCount: newBible, 
        goCount: newGo,
        fullCycleCount: newFC,
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
      { to: '/', label: 'PAINEL ACADÊMICO', icon: LayoutDashboard },
      { to: '/benefits', label: 'MATRIZ CURRICULAR', icon: GraduationCap },
      { to: '/debrief', label: 'AVALIAÇÃO FINAL', icon: ClipboardList },
    ];

    return (
      <aside className="w-72 bg-black border-r border-white/5 h-screen sticky top-0 flex flex-col hidden md:flex">
        <div className="p-10 pb-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#ed1c24] flex items-center justify-center rounded-lg font-black text-white text-xl">F</div>
            <h1 className="text-3xl font-black text-white tracking-tighter italic">FIAP</h1>
          </div>
          
          <div className="bg-[#111] p-4 rounded-2xl border border-white/5 mb-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-full bg-[#ed1c24]/20 flex items-center justify-center text-[#ed1c24]">
                <User size={16} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estudante</span>
            </div>
            <p className="text-sm font-extrabold text-white truncate">Gabriel C. Politano</p>
            <p className="text-[9px] font-bold text-[#ed1c24] mt-1">RM 2026-SURVIVAL</p>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
          <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Portal do Aluno</p>
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-4 px-4 py-4 rounded-xl text-xs font-black transition-all ${
                location.pathname === to 
                  ? 'bg-[#ed1c24] text-white shadow-[0_0_20px_rgba(237,28,36,0.2)]' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}

          <div className="mt-10 space-y-4">
              <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Registrar Atividades</p>
              <div className="space-y-2">
                <button onClick={() => incrementCount('bible')} className="w-full py-3 bg-white/5 border border-white/5 text-slate-300 text-[10px] font-black uppercase rounded-xl hover:border-[#ed1c24]/50 hover:text-white transition-all flex items-center gap-3 px-4">
                  <Book size={14} className="text-[#ed1c24]" /> English Bible
                </button>
                <button onClick={() => incrementCount('go')} className="w-full py-3 bg-white/5 border border-white/5 text-slate-300 text-[10px] font-black uppercase rounded-xl hover:border-[#ed1c24]/50 hover:text-white transition-all flex items-center gap-3 px-4">
                  <Languages size={14} className="text-[#ed1c24]" /> Duolingo Sprint
                </button>
                <button onClick={() => incrementCount('fc')} className="w-full py-3 bg-white/5 border border-white/5 text-slate-300 text-[10px] font-black uppercase rounded-xl hover:border-[#ed1c24]/50 hover:text-white transition-all flex items-center gap-3 px-4">
                  <Box size={14} className="text-[#ed1c24]" /> Full Cycle Dev
                </button>
              </div>
          </div>
        </nav>

        <div className="p-8 border-t border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Academic Sync</span>
            {isSyncing && <CloudSync className="text-[#ed1c24] animate-spin" size={12} />}
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full bg-[#ed1c24] transition-all duration-500 ${dbStatus === 'online' ? 'w-full' : 'w-1/3 animate-pulse'}`} />
          </div>
        </div>
      </aside>
    );
  };

  return (
    <MemoryRouter>
      <div className="flex min-h-screen bg-[#0a0a0a] text-slate-200">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-16 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard history={studyHistory} isCleared={isCleared} bibleCount={bibleCount} goCount={goCount} fullCycleCount={fullCycleCount} onIncrement={incrementCount} />} />
              <Route path="/benefits" element={<BenefitsPage />} />
              <Route path="/debrief" element={<DebriefingPage answers={debriefAnswers} onUpdate={updateDebrief} isCleared={isCleared} onClear={() => setGlobalCleared(true)} />} />
            </Routes>
          </div>
        </main>
      </div>
    </MemoryRouter>
  );
};

export default App;