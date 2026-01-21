import React, { useState } from 'react';
import { Edit3, Save } from 'lucide-react';
import MarkdownEditor from './MarkdownEditor';

const AtaEditor = ({ ata, onSave, onCancel }) => {
    const [formData, setFormData] = useState(ata || {
        title: '',
        date: new Date().toISOString().split('T')[0],
        category: '00-Kickoffs',
        content: '# Nova Ata\n\n**Participantes:** ...\n\n## 1. Tópicos Principais\n* ...',
        comments: []
    });

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <Edit3 className="w-6 h-6 mr-2 text-indigo-600" />
                {ata ? 'Editar Ata' : 'Nova Ata'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                    <select
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option value="00-Kickoffs">00 - Kickoffs & Planejamento</option>
                        <option value="01-Kanban">01 - Execução (Kanban)</option>
                        <option value="02-Milestones">02 - Revisões & Milestones</option>
                        <option value="03-Shift-Left">03 - Estratégia Shift-Left</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                    <input
                        type="date"
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1">Conteúdo (Markdown Suportado)</label>
                <div className="h-[500px]">
                    <MarkdownEditor
                        value={formData.content}
                        onChange={(newContent) => setFormData({ ...formData, content: newContent })}
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded font-medium"
                >
                    Cancelar
                </button>
                <button
                    onClick={() => onSave(formData)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium flex items-center"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Ata
                </button>
            </div>
        </div>
    );
};

export default AtaEditor;
