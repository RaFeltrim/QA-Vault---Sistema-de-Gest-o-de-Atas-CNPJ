import React, { useState } from 'react';
import { Calendar, FolderOpen, Edit3, MessageSquare } from 'lucide-react';

const AtaDetail = ({ ata, onEdit, onBack, onAddComment }) => {
    const [newComment, setNewComment] = useState('');

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        onAddComment(ata.id, newComment);
        setNewComment('');
    };

    // Simple parser to render basic markdown-like structure for display
    const renderContent = (text) => {
        return text.split('\n').map((line, index) => {
            // Headers
            if (line.startsWith('# ')) {
                return <h1 key={index} className="text-2xl font-bold text-indigo-900 mt-6 mb-3">{line.replace('# ', '')}</h1>;
            }
            if (line.startsWith('## ')) {
                return <h2 key={index} className="text-xl font-bold text-slate-800 mt-5 mb-2 border-b pb-1">{line.replace('## ', '')}</h2>;
            }
            // Lists and bullets
            if (line.startsWith('* ')) {
                return (
                    <li
                        key={index}
                        className="ml-4 list-disc text-slate-700 mb-1"
                        dangerouslySetInnerHTML={{ __html: line.replace('* ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                    />
                );
            }
            // Code blocks (very basic)
            if (line.startsWith('|')) {
                return <p key={index} className="font-mono text-xs bg-slate-100 p-1 overflow-x-auto whitespace-pre">{line}</p>;
            }
            // Paragraphs with bold support
            return (
                <p
                    key={index}
                    className="text-slate-700 mb-2 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                />
            );
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-fade-in">
            <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-start">
                <div>
                    <button onClick={onBack} className="text-sm text-indigo-600 hover:underline mb-2 flex items-center">
                        &larr; Voltar para lista
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900">{ata.title}</h1>
                    <div className="flex items-center mt-2 text-slate-500 text-sm space-x-4">
                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {ata.date}</span>
                        <span className="flex items-center"><FolderOpen className="w-4 h-4 mr-1" /> {ata.category}</span>
                    </div>
                </div>
                <button
                    onClick={() => onEdit(ata)}
                    className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition-colors flex items-center font-medium"
                >
                    <Edit3 className="w-4 h-4 mr-2" /> Editar
                </button>
            </div>

            <div className="p-8">
                <div className="prose max-w-none text-slate-800">
                    {renderContent(ata.content)}
                </div>
            </div>

            <div className="bg-slate-50 p-6 border-t border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Comentários e Anotações
                </h3>

                <div className="space-y-4 mb-6">
                    {ata.comments.length === 0 ? (
                        <p className="text-slate-400 italic text-sm">Nenhum comentário ainda. Adicione uma observação.</p>
                    ) : (
                        ata.comments.map((comment, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-sm text-indigo-900">{comment.author}</span>
                                    <span className="text-xs text-slate-400">{comment.date}</span>
                                </div>
                                <p className="text-slate-700 text-sm">{comment.text}</p>
                            </div>
                        ))
                    )}
                </div>

                <form onSubmit={handleCommentSubmit} className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        placeholder="Adicionar um comentário ou observação..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
                    >
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AtaDetail;
