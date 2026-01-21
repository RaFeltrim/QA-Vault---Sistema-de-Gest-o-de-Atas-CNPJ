import React, { useState } from 'react';
import { X, Plus, Trash2, FolderPlus } from 'lucide-react';

const ProjectManager = ({ projects, onClose, onAdd, onDelete }) => {
    const [newProjectName, setNewProjectName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newProjectName.trim()) return;
        onAdd(newProjectName);
        setNewProjectName('');
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
                <div className="bg-slate-800 p-4 flex justify-between items-center text-white">
                    <h2 className="text-lg font-bold flex items-center">
                        <FolderPlus className="w-5 h-5 mr-2" /> Gerenciar Projetos
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Projetos Existentes</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {projects.map((project, idx) => (
                                <div key={project.id || idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                                    <span className="text-slate-800 font-medium">{project.name}</span>
                                    {/* Prevent deleting the default hardcoded project if we want, but for now allow all except maybe active one? */}
                                    <button
                                        onClick={() => onDelete(project.id)}
                                        className="text-slate-400 hover:text-red-500 p-1"
                                        title="Excluir Projeto"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {projects.length === 0 && (
                                <p className="text-slate-400 text-center italic">Nenhum projeto encontrado.</p>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="border-t border-slate-100 pt-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Novo Projeto</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="Nome do projeto..."
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProjectManager;
