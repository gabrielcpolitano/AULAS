import React from 'react';
import { Book, Box, ShieldCheck, GraduationCap, Languages, FileText, Award, Target, Cpu } from 'lucide-react';

const BenefitsPage: React.FC = () => {
  const pillars = [
    {
      title: "Ética e Fé",
      subtitle: "English Bible",
      color: "border-emerald-500/20 bg-emerald-950/5",
      icon: <Book className="text-emerald-500" size={32} />,
      items: [
        "Desenvolvimento de disciplina mental e espiritual.",
        "Domínio de vocabulário acadêmico e literário em inglês.",
        "Resiliência aplicada através da constância diária.",
        "Formação de base ética para liderança em tecnologia."
      ]
    },
    {
      title: "Comunicação Global",
      subtitle: "Duolingo Sprint",
      color: "border-cyan-500/20 bg-cyan-950/5",
      icon: <Languages className="text-cyan-500" size={32} />,
      items: [
        "Aprimoramento contínuo de conversação e escrita.",
        "Preparação para o mercado de trabalho internacional.",
        "Gamificação aplicada ao aprendizado de novos idiomas.",
        "Foco em agilidade mental e processamento linguístico."
      ]
    },
    {
      title: "Especialização Tech",
      subtitle: "Full Cycle Dev",
      color: "border-purple-500/20 bg-purple-950/5",
      icon: <Box className="text-purple-500" size={32} />,
      items: [
        "Arquitetura de sistemas distribuídos e escaláveis.",
        "Domínio de ecossistemas Cloud e DevOps avançado.",
        "Padrões de projeto (SOLID, MVC, Clean Arch).",
        "Desenvolvimento orientado a alta performance e manutenção."
      ]
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="border-b border-white/5 pb-10">
        <div className="flex items-center gap-4 mb-4">
           <GraduationCap className="text-[#ed1c24]" size={40} />
           <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">Matriz Curricular</h2>
        </div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">A base de formação do líder tecnológico do futuro (2026).</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {pillars.map((pillar, idx) => (
          <section key={idx} className={`p-10 rounded-[3.5rem] border ${pillar.color} relative overflow-hidden group hover:scale-[1.02] transition-all`}>
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              {pillar.icon}
            </div>
            
            <div className="mb-10">
              <div className="p-5 bg-black/40 rounded-[1.5rem] w-fit mb-6 border border-white/5 shadow-xl">
                {pillar.icon}
              </div>
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{pillar.title}</h3>
              <p className="text-[#ed1c24] text-[10px] font-black uppercase tracking-widest mt-1">{pillar.subtitle}</p>
            </div>

            <ul className="space-y-5">
              {pillar.items.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-[#ed1c24]/40 shrink-0" />
                  <p className="text-slate-300 text-sm font-medium leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="bg-[#ed1c24]/5 border border-[#ed1c24]/20 p-12 rounded-[4rem] text-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ed1c24] to-transparent shadow-[0_0_30px_#ed1c24]" />
         <Award className="mx-auto text-[#ed1c24] mb-8" size={64} />
         <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-6">CERTIFICAÇÃO DE EXCELÊNCIA</h4>
         <p className="text-slate-400 max-w-3xl mx-auto text-lg font-medium leading-relaxed italic">
           "A educação na FIAP não é apenas sobre bits e bytes, é sobre a construção de um legado. Gabriel, sua jornada através destes pilares define o profissional de elite que você está se tornando."
         </p>
         <div className="mt-10 flex justify-center items-center gap-10">
            <div className="text-center">
               <p className="text-2xl font-black text-white italic">250h</p>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Atividades Comp.</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
               <p className="text-2xl font-black text-white italic">9.8</p>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Média Acadêmica</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default BenefitsPage;