
import React, { useState } from 'react';
import { DebriefAnswer } from '../types';
// Added ShieldCheck to the list of icons imported from lucide-react
import { ShieldAlert, Send, CheckCircle2, AlertCircle, FileText, Lock, ShieldCheck } from 'lucide-react';

interface DebriefingProps {
  answers: DebriefAnswer[];
  onUpdate: (id: string, answer: string) => void;
  isCleared: boolean;
  onClear: () => void;
}

const DebriefingPage: React.FC<DebriefingProps> = ({ answers, onUpdate, isCleared, onClear }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  
  const allAnswered = answers.every(a => a.answer.trim().length > 20); // Each answer must be substantial

  const handleFinalClear = () => {
    if (allAnswered) {
      if (confirm("THIS IS THE FINAL STEP. BY CLEARING THIS PROTOCOL, YOU CONFIRM THE PROJECT IS DONE AND FUNCTIONAL. CONTINUE?")) {
        onClear();
      }
    }
  };

  if (isCleared) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-500">
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-10 rounded-[3rem] max-w-2xl">
          <CheckCircle2 className="mx-auto text-emerald-500 mb-6" size={80} />
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-4">PROTOCOL CLEARED</h2>
          <p className="text-slate-400 font-medium text-lg mb-10 italic">
            "Your debriefing has been recorded. The project is officially delivered. You have survived the challenge of Feb 23."
          </p>
          <div className="space-y-6 text-left">
            {answers.map(a => (
              <div key={a.id} className="border-l-2 border-emerald-500 pl-6 py-2">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">{a.question}</p>
                <p className="text-sm text-slate-300 whitespace-pre-wrap">{a.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Final Debrief (TUDO)</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Answer all protocols to confirm project completion and escape the deadline.</p>
        </div>
        <div className="bg-rose-950/40 border border-rose-900/50 px-4 py-2 rounded-xl flex items-center gap-2">
           <ShieldAlert className="text-rose-600" size={16} />
           <span className="text-xs font-black text-rose-500 uppercase">Status: Final Gate</span>
        </div>
      </header>

      <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 md:p-12 space-y-10">
        {answers.map((item) => (
          <div key={item.id} className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-rose-600/20 flex items-center justify-center text-rose-600 font-black text-xs">
                 {answers.indexOf(item) + 1}
               </div>
               <h3 className="text-lg font-black text-slate-200 italic">{item.question}</h3>
            </div>
            <textarea
              className="w-full h-40 bg-black/40 border border-white/10 rounded-2xl p-6 text-slate-300 font-mono text-sm focus:outline-none focus:border-rose-600 transition-colors resize-none placeholder:text-slate-700"
              placeholder="Type your detailed answer here (minimum 20 characters)..."
              value={item.answer}
              onChange={(e) => onUpdate(item.id, e.target.value)}
            />
          </div>
        ))}

        <div className="pt-10 border-t border-white/5 flex flex-col items-center">
          {!allAnswered && (
            <div className="flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-widest mb-4">
               <AlertCircle size={14} /> Provide detailed answers for all protocols to unlock the gate.
            </div>
          )}
          
          <button
            disabled={!allAnswered}
            onClick={handleFinalClear}
            className={`flex items-center gap-3 px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all ${
              allAnswered 
              ? 'bg-rose-600 text-white hover:bg-rose-500 shadow-[0_0_30px_rgba(225,29,72,0.4)] hover:scale-105 active:scale-95' 
              : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'
            }`}
          >
            {allAnswered ? <ShieldCheck size={20} /> : <Lock size={20} />}
            Confirm Survival Clearance
          </button>
        </div>
      </section>

      <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] flex items-center gap-6 italic">
         <FileText className="text-slate-500 shrink-0" size={32} />
         <p className="text-slate-400 text-sm font-medium">
           "This debriefing is your legacy. Explain how your API works, why you chose the database structure, and how a client can start using it tomorrow. If you can't answer this, you haven't finished the work."
         </p>
      </div>
    </div>
  );
};

export default DebriefingPage;
