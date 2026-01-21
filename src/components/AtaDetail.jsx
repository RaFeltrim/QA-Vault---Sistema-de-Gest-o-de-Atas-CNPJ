import React, { useState } from 'react';
import { Calendar, FolderOpen, Edit3, MessageSquare, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AtaDetail = ({ ata, onEdit, onBack, onAddComment, onDelete, onEditComment, onDeleteComment, currentUser }) => {
    const [newComment, setNewComment] = useState('');
    const [editingCommentIndex, setEditingCommentIndex] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState('');

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        onAddComment(ata.id, newComment);
        setNewComment('');
    };

    const startEditing = (idx, text) => {
        setEditingCommentIndex(idx);
        setEditingCommentText(text);
    };

    const saveEdit = (idx) => {
        onEditComment(ata.id, idx, editingCommentText);
        setEditingCommentIndex(null);
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
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(ata)}
                        className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition-colors flex items-center font-medium"
                    >
                        <Edit3 className="w-4 h-4 mr-2" /> Editar
                    </button>
                    <button
                        onClick={() => onDelete(ata.id)}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center font-medium"
                        title="Excluir Ata"
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> Excluir
                    </button>
                </div>
            </div>

            <div className="p-8">
                <div className="prose prose-indigo max-w-none text-slate-800">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {ata.content}
                    </ReactMarkdown>
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
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-slate-400">{comment.date}</span>
                                        {currentUser === comment.author && (
                                            <div className="flex space-x-1 ml-2">
                                                {editingCommentIndex === idx ? (
                                                    // Edit Mode Controls
                                                    null // Handled below
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => startEditing(idx, comment.text)}
                                                            className="text-slate-400 hover:text-indigo-600 p-1"
                                                            title="Editar"
                                                        >
                                                            <Edit3 className="w-3 h-3" />
                                                        </button>
                                                        <button
                                                            onClick={() => onDeleteComment(ata.id, idx)}
                                                            className="text-slate-400 hover:text-red-600 p-1"
                                                            title="Excluir"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {editingCommentIndex === idx ? (
                                    <div className="flex gap-2 mt-2">
                                        <input
                                            type="text"
                                            className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                                            value={editingCommentText}
                                            onChange={(e) => setEditingCommentText(e.target.value)}
                                        />
                                        <button
                                            onClick={() => saveEdit(idx)}
                                            className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                                        >
                                            Salvar
                                        </button>
                                        <button
                                            onClick={() => setEditingCommentIndex(null)}
                                            className="bg-slate-300 text-slate-700 px-2 py-1 rounded text-xs hover:bg-slate-400"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-slate-700 text-sm whitespace-pre-wrap">{comment.text}</p>
                                )}
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
