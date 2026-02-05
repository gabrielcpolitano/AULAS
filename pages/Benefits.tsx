
import React from 'react';
import { Cpu, Languages, DollarSign, Globe, Zap, ShieldCheck, Target, Brain, Award } from 'lucide-react';

const BenefitsPage: React.FC = () => {
  const codingBenefits = [
    {
      title: "Neural Syntax Automation",
      desc: "By kata 500, you stop 'thinking' about syntax. Coding becomes as natural as breathing. Your fingers move before your conscious mind speaks.",
      icon: <Brain className="text-rose-500" />
    },
    {
      title: "Algorithmic Intuition",
      desc: "1000 problems will wire your brain to spot patterns in complex systems. You'll solve bugs in 5 minutes that take others 5 hours.",
      icon: <Target className="text-rose-500" />
    },
    {
      title: "Elite Speed & Focus",
      desc: "The grind builds a specialized stamina. You'll be able to produce deep work for 4-6 hours straight without mental exhaustion.",
      icon: <Zap className="text-rose-500" />
    }
  ];

  const englishBenefits = [
    {
      title: "Global Arbitrage",
      desc: "Earning in BRL while living in Brazil is a losing game. Mastering English unlocks USD/EUR salaries, multiplying your purchasing power by 5x.",
      icon: <DollarSign className="text-emerald-500" />
    },
    {
      title: "Zero Documentation Lag",
      desc: "You will read RFCs, GitHub issues, and official docs at native speed. No more waiting for translations or outdated tutorials.",
      icon: <Globe className="text-emerald-500" />
    },
    {
      title: "Unrestricted Network",
      desc: "Connect with elite engineers from Google, Meta, and high-tier startups. The global tech conversation happens in English.",
      icon: <Award className="text-emerald-500" />
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="border-b border-white/5 pb-8">
        <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">The Prize</h2>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">The ROI of suffering through 2000 units of excellence.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LOGIC SECTION */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-rose-600/10 rounded-2xl border border-rose-600/20">
                <Cpu className="text-rose-600" size={24} />
             </div>
             <h3 className="text-2xl font-black text-white uppercase italic">1000 Katas: The Logic God</h3>
          </div>

          <div className="space-y-4">
            {codingBenefits.map((b, i) => (
              <div key={i} className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem] hover:border-rose-600/30 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-black/40 rounded-xl mt-1 group-hover:scale-110 transition-transform">
                    {b.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase text-sm mb-1">{b.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ENGLISH SECTION */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-emerald-600/10 rounded-2xl border border-emerald-600/20">
                <Languages className="text-emerald-500" size={24} />
             </div>
             <h3 className="text-2xl font-black text-white uppercase italic">1000 Cards: The Global Citizen</h3>
          </div>

          <div className="space-y-4">
            {englishBenefits.map((b, i) => (
              <div key={i} className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem] hover:border-emerald-600/30 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-black/40 rounded-xl mt-1 group-hover:scale-110 transition-transform">
                    {b.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase text-sm mb-1">{b.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="bg-indigo-950/20 border border-indigo-500/20 p-10 rounded-[3rem] text-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-600 via-indigo-500 to-emerald-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
         <ShieldCheck className="mx-auto text-indigo-500 mb-6" size={48} />
         <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">THE SUPREME BENEFIT</h4>
         <p className="text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed italic">
           "The true reward is not the certificate or the number. It is the person you must become to finish this. You will kill the lazy version of yourself and birth a high-performance machine that cannot be stopped by any obstacle."
         </p>
      </div>
    </div>
  );
};

export default BenefitsPage;
