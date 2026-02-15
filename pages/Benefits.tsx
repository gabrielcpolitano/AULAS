import React from 'react';
import { Book, Code2, Box, Globe, ShieldCheck, Target, Zap, Cpu, Server, Cloud, Database, Layers } from 'lucide-react';

const BenefitsPage: React.FC = () => {
  const pillars = [
    {
      title: "English Bible",
      subtitle: "Faith & Language Mastery",
      color: "border-emerald-500/30 bg-emerald-950/20",
      icon: <Book className="text-emerald-500" size={32} />,
      items: [
        "Learn English while studying the Word of God.",
        "Develop extreme resilience through daily discipline.",
        "Master technical vocabulary for documentation.",
        "Connect with global spiritual and professional communities."
      ]
    },
    {
      title: "Go Course",
      subtitle: "The Language of Scalable Systems",
      color: "border-cyan-500/30 bg-cyan-950/20",
      icon: <Code2 className="text-cyan-500" size={32} />,
      items: [
        "Backend focus: Simple, concise, and multi-platform.",
        "Master cross-compilation and high-performance APIs.",
        "Build CLIs, microservices, and data processing tools.",
        "The standard for cloud services and container orchestration."
      ]
    },
    {
      title: "Full Cycle",
      subtitle: "Elite Software Engineering",
      color: "border-purple-500/30 bg-purple-950/20",
      icon: <Box className="text-purple-500" size={32} />,
      items: [
        "Build a ticket sales system from scratch to AWS deploy.",
        "Master SOLID principles and MVC Architecture.",
        "Design scalable REST APIs and handle concurrency.",
        "Apply strategies for high-performance and maintainable code."
      ]
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="border-b border-white/5 pb-8">
        <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">The Pillars</h2>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">The absolute ROI of your 2026 survival protocol.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {pillars.map((pillar, idx) => (
          <section key={idx} className={`p-8 rounded-[3rem] border ${pillar.color} relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              {pillar.icon}
            </div>
            
            <div className="mb-8">
              <div className="p-4 bg-black/40 rounded-2xl w-fit mb-4">
                {pillar.icon}
              </div>
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{pillar.title}</h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">{pillar.subtitle}</p>
            </div>

            <ul className="space-y-4">
              {pillar.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                  <p className="text-slate-300 text-xs font-medium leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="bg-indigo-950/20 border border-indigo-500/20 p-10 rounded-[3rem] text-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
         <ShieldCheck className="mx-auto text-indigo-500 mb-6" size={48} />
         <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">SURVIVAL CLEARANCE</h4>
         <p className="text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed italic">
           "Knowledge is the only asset that cannot be taken from you. Master the Word, master the Tool, master the Cycle."
         </p>
      </div>
    </div>
  );
};

export default BenefitsPage;