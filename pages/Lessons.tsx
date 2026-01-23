import React, { useState, useMemo } from 'react';
import { Lesson } from '../types';
import { Search, Filter, CheckCircle, Circle, Layers } from 'lucide-react';

interface LessonsProps {
  lessons: Lesson[];
  completedIds: number[];
  onToggle: (id: number) => void;
}

const Lessons: React.FC<LessonsProps> = ({ lessons, completedIds, onToggle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [moduleFilter, setModuleFilter] = useState('All');

  const modules = useMemo(() => {
    const relevantLessons = courseFilter === 'All' ? lessons : lessons.filter(l => l.course === courseFilter);
    const mods = Array.from(new Set(relevantLessons.map(l => l.module)));
    return ['All', ...mods];
  }, [lessons, courseFilter]);

  const filteredLessons = lessons.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.id.toString() === searchTerm;
    const matchesCourse = courseFilter === 'All' || l.course === courseFilter;
    const matchesModule = moduleFilter === 'All' || l.module === moduleFilter;
    return matchesSearch && matchesCourse && matchesModule;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Aulas</h2>
          <p className="text-slate-500">Organize seus estudos por curso ou módulo.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative group flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Buscar título..."
              className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative group">
            <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              className="pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none text-sm transition-all cursor-pointer font-medium"
              value={courseFilter}
              onChange={(e) => {
                setCourseFilter(e.target.value);
                setModuleFilter('All');
              }}
            >
              <option value="All">Todos Cursos</option>
              <option value="Laravel">Laravel</option>
              <option value="PostgreSQL">PostgreSQL</option>
            </select>
          </div>

          <div className="relative group">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              className="pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none text-sm transition-all cursor-pointer font-medium"
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

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] w-16">#</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Curso</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Título da Aula</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Módulo</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] w-20 text-center">Feito</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLessons.map((lesson) => (
                <tr 
                  key={lesson.id} 
                  className={`group hover:bg-slate-50/80 transition-all cursor-pointer ${completedIds.includes(lesson.id) ? 'bg-emerald-50/20' : ''}`}
                  onClick={() => onToggle(lesson.id)}
                >
                  <td className="px-6 py-4 text-xs font-bold text-slate-300">
                    {lesson.id > 100 ? lesson.id - 100 : lesson.id}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${lesson.course === 'Laravel' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                      {lesson.course}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-sm font-semibold transition-all ${completedIds.includes(lesson.id) ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {lesson.title}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-500 font-medium">
                      {lesson.module}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {completedIds.includes(lesson.id) ? (
                        <div className="bg-emerald-500 text-white p-1 rounded-full">
                          <CheckCircle size={14} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200 group-hover:border-indigo-400 transition-colors" />
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
            <Layers className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-medium italic">Nenhuma aula corresponde aos seus filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lessons;