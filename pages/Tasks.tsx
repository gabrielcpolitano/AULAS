
import React, { useState } from 'react';
import { Task } from '../types';
import { Plus, Trash2, CheckCircle, Circle, AlertCircle, Skull } from 'lucide-react';

interface TasksProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onAdd: (title: string, priority: 'high' | 'medium' | 'low') => void;
  onDelete: (id: string) => void;
}

const TasksPage: React.FC<TasksProps> = ({ tasks, onToggle, onAdd, onDelete }) => {
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAdd(newTitle, priority);
    setNewTitle('');
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Target List</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">If it's not on this list, it doesn't exist.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 bg-white/5 p-4 rounded-3xl border border-white/10">
          <input
            type="text"
            placeholder="New objective..."
            className="flex-1 min-w-[200px] bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-rose-600 transition-colors"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <select 
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold uppercase text-slate-400"
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
          >
            <option value="high">Critical</option>
            <option value="medium">Standard</option>
            <option value="low">Minor</option>
          </select>
          <button type="submit" className="bg-rose-600 hover:bg-rose-500 p-2 rounded-xl text-white transition-colors">
            <Plus size={20} />
          </button>
        </form>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {sortedTasks.map((task) => (
          <div 
            key={task.id} 
            className={`group flex items-center justify-between p-6 rounded-[1.5rem] border transition-all duration-300 ${
              task.completed 
              ? 'bg-slate-900/50 border-white/5 opacity-50' 
              : 'bg-slate-900 border-white/10 hover:border-rose-600/40'
            }`}
          >
            <div className="flex items-center gap-6 flex-1">
              <button onClick={() => onToggle(task.id)} className="transition-transform active:scale-90">
                {task.completed ? (
                  <div className="bg-emerald-600 text-white p-1 rounded-full"><CheckCircle size={20} /></div>
                ) : (
                  <div className={`w-8 h-8 rounded-full border-2 ${task.priority === 'high' ? 'border-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.3)]' : 'border-slate-700'} group-hover:border-rose-600 transition-colors`} />
                )}
              </button>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                   {task.priority === 'high' && <span className="text-[9px] font-black bg-rose-600 text-white px-2 py-0.5 rounded-full uppercase">Critical</span>}
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Added: {new Date(task.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
                <p className={`text-lg font-black tracking-tight ${task.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                  {task.title}
                </p>
              </div>
            </div>

            <button 
              onClick={() => onDelete(task.id)}
              className="p-3 text-slate-700 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
            <Skull className="mx-auto text-slate-800 mb-4" size={64} />
            <p className="text-slate-600 font-black uppercase tracking-widest italic">The Target List is empty. Define your path or face defeat.</p>
          </div>
        )}
      </div>

      <div className="bg-rose-950/10 border border-rose-900/20 p-8 rounded-[2.5rem] flex items-center gap-6">
         <AlertCircle className="text-rose-600 shrink-0" size={32} />
         <div>
            <h4 className="text-white font-black uppercase italic tracking-tighter">DEADLINE PROTOCOL</h4>
            <p className="text-slate-500 text-sm font-medium">Focus on the API and Database. Only add tasks that directly lead to a functioning product. Refactoring and aesthetics are non-priority until the survival goal is met.</p>
         </div>
      </div>
    </div>
  );
};

export default TasksPage;