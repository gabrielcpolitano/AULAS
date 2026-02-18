import React, { useState } from 'react';
import { DebriefAnswer } from '../types';
import { ShieldAlert, CheckCircle2, AlertCircle, FileText, Lock, ShieldCheck, GraduationCap, Award } from 'lucide-react';

interface DebriefingProps {
  answers: DebriefAnswer[];
  onUpdate: (id: string, answer: string) => void;
  isCleared: boolean;
  onClear: () => void;
}

const DebriefingPage: React.FC<DebriefingProps> = ({ answers, onUpdate, isCleared, onClear }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  
  const allAnswered = answers.every(a => a.answer.trim().length > 20);

  const handleFinalClear = () => {
    if (allAnswered) {
      if (confirm("VOCÊ ESTÁ PRESTES A CONCLUIR SEU CICLO ACADÊMICO. ESTA AÇÃO É IRREVERSÍVEL E REPRESENTA SUA GRADUAÇÃO NO PROTOCOLO 2026. DESEJA PROSSEGUIR?")) {
        onClear();
      }
    }
  };

  if (isCleared) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-1000">
        <div className="bg-[#ed1c24]/5 border border-[#ed1c24]/20 p-16 rounded-[4rem] max-w-3xl shadow-2xl relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#ed1c24] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(237,28,36,0.5)]">
            <Award className="text-white" size={40} />
          </div>
          <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter mb-6 mt-6">GRADUADO</h2>
          <p className="text-slate-400 font-medium text-xl mb-12 italic">
            "Gabriel Correia Politano, sua defesa acadêmica foi aceita. Você concluiu o protocolo de imersão da FIAP com distinção."
          </p>
          <div className="space-y-8 text-left">
            {answers.map(a => (
              <div key={a.id} className="border-l-4 border-[#ed1c24] pl-8 py-4 bg-white/5 rounded-r-2xl">
                <p className="text-[10px] font-black text-[#ed1c24] uppercase tracking-widest mb-2">{a.question}</p>
                <p className="text-base text-slate-200 whitespace-pre-wrap leading-relaxed">{a.answer}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-4">
             <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-[#ed1c24]">
                <GraduationCap size={24} />
             </div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Diploma Digital Autenticado</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">Banca Examinadora</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Responda aos protocolos de avaliação final para obter sua graduação tecnológica.</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
           <ShieldAlert className="text-[#ed1c24]" size={20} />
           <span className="text-sm font-black text-white uppercase tracking-widest">Status: Defesa Final</span>
        </div>
      </header>

      <section className="bg-black/40 border border-white/5 rounded-[3.5rem] p-10 md:p-16 space-y-12 shadow-2xl">
        {answers.map((item, idx) => (
          <div key={item.id} className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-[#ed1c24] flex items-center justify-center text-white font-black text-sm shadow-[0_0_15px_rgba(237,28,36,0.3)]">
                 0{idx + 1}
               </div>
               <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">{item.question}</h3>
            </div>
            <textarea
              className="w-full h-48 bg-black border border-white/10 rounded-[2rem] p-8 text-slate-300 font-medium text-base focus:outline-none focus:border-[#ed1c24] transition-all resize-none placeholder:text-slate-700 shadow-inner"
              placeholder="Descreva sua resposta com detalhes acadêmicos (mínimo 20 caracteres)..."
              value={item.answer}
              onChange={(e) => onUpdate(item.id, e.target.value)}
            />
          </div>
        ))}

        <div className="pt-12 border-t border-white/5 flex flex-col items-center">
          {!allAnswered && (
            <div className="flex items-center gap-3 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 bg-amber-500/5 px-6 py-2 rounded-full border border-amber-500/20">
               <AlertCircle size={14} /> Todas as questões devem ser respondidas para submissão à banca.
            </div>
          )}
          
          <button
            disabled={!allAnswered}
            onClick={handleFinalClear}
            className={`flex items-center gap-4 px-16 py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-sm transition-all ${
              allAnswered 
              ? 'bg-[#ed1c24] text-white hover:bg-[#ff4d4d] shadow-[0_0_40px_rgba(237,28,36,0.4)] hover:scale-105 active:scale-95' 
              : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
            }`}
          >
            {allAnswered ? <ShieldCheck size={24} /> : <Lock size={24} />}
            Solicitar Graduação
          </button>
        </div>
      </section>

      <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] flex items-center gap-8 italic relative overflow-hidden group">
         <div className="absolute left-0 top-0 w-1 h-full bg-[#ed1c24]" />
         <FileText className="text-slate-500 shrink-0 group-hover:text-[#ed1c24] transition-colors" size={40} />
         <p className="text-slate-400 text-base font-medium leading-relaxed">
           "Gabriel, este documento representa a síntese do seu aprendizado. Ao preenchê-lo, você reafirma seu compromisso com a excelência tecnológica e os valores da FIAP. O mercado de trabalho aguarda seu próximo passo."
         </p>
      </div>
    </div>
  );
};

export default DebriefingPage;