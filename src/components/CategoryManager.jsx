import React, { useState } from 'react';
import { X, Plus, Trash2, FolderPlus } from 'lucide-react';

const CategoryManager = ({ categories, onClose, onAdd, onDelete, activeProject }) => {
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newCategoryName.trim()) {
            onAdd(newCategoryName.trim());
            setNewCategoryName('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-white/20 transform transition-all scale-100">
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-5 flex justify-between items-center text-white shadow-lg">
                    <h3 className="font-bold text-lg flex items-center tracking-wide">
                        <FolderPlus className="w-6 h-6 mr-2 opacity-90" />
                        Gerenciar Categorias
                    </h3>
                    <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors active:scale-95">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-sm text-slate-500 mb-6 flex items-center">
                        Projeto Atual:
                        <span className="ml-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100 truncate max-w-[200px]">
                            {activeProject}
                        </span>
                    </p>

                    <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Nova Categoria..."
                            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-inner"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!newCategoryName.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </form>

                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {categories.length === 0 ? (
                            <div className="text-center py-8 opacity-50 flex flex-col items-center">
                                <FolderPlus className="w-12 h-12 mb-2 text-slate-300" />
                                <p className="text-sm text-slate-400">Nenhuma categoria criada.</p>
                            </div>
                        ) : (
                            categories.map(cat => (
                                <div key={cat.id} className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group">
                                    <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors">{cat.label || cat.name}</span>
                                    <button
                                        onClick={() => onDelete(cat.id)}
                                        className="text-slate-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0"
                                        title="Excluir categoria"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryManager;
