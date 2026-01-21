
import React, { useState, useMemo } from 'react';
import { Lesson } from '../types';
import { Search, Filter, CheckCircle, Circle } from 'lucide-react';

interface LessonsProps {
  lessons: Lesson[];
  completedIds: number[];
  onToggle: (id: number) => void;
}

const Lessons: React.FC<LessonsProps> = ({ lessons, completedIds, onToggle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');

  const modules = useMemo(() => {
    const mods = Array.from(new Set(lessons.map(l => l.module)));
    return ['All', ...mods];
  }, [lessons]);

  const filteredLessons = lessons.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.id.toString() === searchTerm;
    const matchesModule = moduleFilter === 'All' || l.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Aulas</h2>
          <p className="text-slate-500">Acompanhe seu progresso aula por aula.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Buscar título ou nº..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full md:w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative group">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              className="pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none transition-all cursor-pointer"
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
            >
              {modules.map(mod => (
                <option key={mod} value={mod}>{mod}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-16">#</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Título</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-32">Módulo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-24">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLessons.map((lesson) => (
                <tr 
                  key={lesson.id} 
                  className={`group hover:bg-slate-50 transition-colors cursor-pointer ${completedIds.includes(lesson.id) ? 'bg-slate-50/30' : ''}`}
                  onClick={() => onToggle(lesson.id)}
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-400">
                    {lesson.id}
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-sm font-semibold transition-all ${completedIds.includes(lesson.id) ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                      {lesson.title}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md text-[10px] font-bold uppercase">
                      {lesson.module}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {completedIds.includes(lesson.id) ? (
                        <CheckCircle className="text-emerald-500" size={22} fill="currentColor" />
                      ) : (
                        <Circle className="text-slate-300 group-hover:text-indigo-400 transition-colors" size={22} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLessons.length === 0 && (
          <div className="p-20 text-center">
            <p className="text-slate-400 font-medium">Nenhuma aula encontrada para esta busca.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lessons;
