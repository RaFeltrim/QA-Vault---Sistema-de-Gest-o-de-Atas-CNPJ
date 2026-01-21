import React from 'react';
import { ShieldAlert, X, FolderOpen, LogOut, Settings, FileText, PenTool } from 'lucide-react';

const Sidebar = ({ activeCategory, setActiveCategory, categories, onLogout, isMobileOpen, setIsMobileOpen, projects, activeProject, setActiveProject, onManageProjects, onManageCategories }) => {
    return (
        <div className={`
            fixed md:relative z-20 h-full w-64 bg-slate-800 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out shadow-xl
            ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
            {/* Logo Area */}
            <div className="p-6 flex items-center justify-between border-b border-slate-700 bg-slate-900">
                <div className="flex items-center space-x-3">
                    <div className="bg-indigo-500 p-2 rounded-lg">
                        <FolderOpen className="text-white w-6 h-6" />
                    </div>
                    <span className="text-lg font-bold text-white tracking-tight">QA Vault</span>
                </div>
                <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsMobileOpen(false)}>
                    <X />
                </button>
            </div>

            {/* Project Selector */}
            <div className="px-4 py-4 border-b border-slate-700 bg-slate-800/50">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Projeto Ativo</label>
                    <button onClick={onManageProjects} className="text-slate-500 hover:text-indigo-400 transition-colors" title="Gerenciar Projetos">
                        <Settings className="w-3.5 h-3.5" />
                    </button>
                </div>
                <div className="relative">
                    <select
                        value={projects.find(p => p.name === activeProject)?.id || ''}
                        onChange={(e) => {
                            const project = projects.find(p => p.id === e.target.value);
                            if (project) setActiveProject(project.name);
                        }}
                        className="w-full bg-slate-900 text-slate-200 text-sm rounded-md border border-slate-700 px-3 py-2 focus:ring-1 focus:ring-indigo-500 outline-none appearance-none cursor-pointer hover:border-slate-600 transition-colors"
                    >
                        {projects && projects.length > 0 ? (
                            projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))
                        ) : (
                            <option value="">Carregando...</option>
                        )}
                    </select>
                    <div className="absolute right-3 top-2.5 pointer-events-none text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                <div className="px-4 mb-2 flex items-center justify-between group">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Categorias
                    </div>
                    <button onClick={onManageCategories} className="text-slate-600 hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all" title="Editar Categorias">
                        <Settings className="w-3 h-3" />
                    </button>
                </div>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => {
                            setActiveCategory(cat.id);
                            setIsMobileOpen(false);
                        }}
                        className={`w-full flex items-center px-6 py-3 hover:bg-slate-700 transition-colors ${activeCategory === cat.id ? 'bg-slate-700 text-white border-r-4 border-indigo-500' : ''
                            }`}
                    >
                        <FolderOpen className="w-4 h-4 mr-3" />
                        <span className="text-sm font-medium">{cat.label}</span>
                    </button>
                ))}
                <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-6">
                    Ferramentas
                </div>
                <button
                    onClick={() => {
                        setActiveCategory('drafts');
                        setIsMobileOpen(false);
                    }}
                    className={`w-full flex items-center px-6 py-3 hover:bg-slate-700 transition-colors ${activeCategory === 'drafts' ? 'bg-slate-700 text-white border-r-4 border-indigo-500' : ''
                        }`}
                >
                    <FileText className="w-4 h-4 mr-3" />
                    <span className="text-sm font-medium">Rascunho</span>
                </button>
                <button
                    onClick={() => {
                        setActiveCategory('whiteboard');
                        setIsMobileOpen(false);
                    }}
                    className={`w-full flex items-center px-6 py-3 hover:bg-slate-700 transition-colors ${activeCategory === 'whiteboard' ? 'bg-slate-700 text-white border-r-4 border-indigo-500' : ''
                        }`}
                >
                    <PenTool className="w-4 h-4 mr-3" />
                    <span className="text-sm font-medium">Fluxogramas</span>
                </button>
            </nav>

            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={onLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-slate-700 rounded transition-colors"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair do Sistema
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
