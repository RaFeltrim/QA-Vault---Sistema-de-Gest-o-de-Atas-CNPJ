import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

const Drafts = ({ activeProject }) => {
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('');
    const storageKey = `qa_vault_drafts_${activeProject?.id || 'default'}`;

    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) setContent(saved);
        else setContent(''); // Clear if new project has no draft
    }, [storageKey]);

    const handleChange = (e) => {
        const text = e.target.value;
        setContent(text);
        localStorage.setItem(storageKey, text);
        setStatus('Salvo');
        setTimeout(() => setStatus(''), 2000);
    };

    return (
        <div className="flex flex-col h-full bg-white animate-fade-in relative">
            <div className="bg-yellow-50 border-b border-yellow-100 p-3 flex justify-between items-center">
                <h2 className="text-lg font-bold text-yellow-800 flex items-center">
                    📝 Rascunho Rápido
                    <span className="ml-2 text-xs font-normal text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                        Auto-save (Local)
                    </span>
                </h2>
                <span className="text-xs text-green-600 font-medium transition-opacity duration-300" style={{ opacity: status ? 1 : 0 }}>
                    {status}
                </span>
            </div>
            <textarea
                className="flex-1 w-full p-6 text-slate-700 leading-relaxed focus:outline-none resize-none font-mono text-sm"
                placeholder="Digite suas anotações rápidas aqui... (Persiste mesmo após fechar o navegador)"
                value={content}
                onChange={handleChange}
                spellCheck={false}
            />
        </div>
    );
};

export default Drafts;
