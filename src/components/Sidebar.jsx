import React from 'react';
import { ShieldAlert, X, FolderOpen, LogOut } from 'lucide-react';

const Sidebar = ({ activeCategory, setActiveCategory, categories, onLogout, isMobileOpen, setIsMobileOpen }) => {
    return (
        <div className={`
      fixed inset-y-0 left-0 transform ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      md:relative md:translate-x-0 transition duration-200 ease-in-out
      w-64 bg-slate-800 text-slate-300 flex flex-col h-full z-20 shadow-xl
    `}>
            <div className="p-6 flex items-center space-x-3 border-b border-slate-700">
                <ShieldAlert className="w-6 h-6 text-indigo-400" />
                <span className="font-bold text-lg text-white">QA Vault</span>
                <button className="md:hidden ml-auto" onClick={() => setIsMobileOpen(false)}>
                    <X className="w-6 h-6" />
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Estrutura Organizacional
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
