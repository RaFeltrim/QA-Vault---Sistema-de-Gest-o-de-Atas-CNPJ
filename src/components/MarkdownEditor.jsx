import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bold, Italic, List, ListOrdered, Code, Quote, Heading1, Heading2, Eye, Edit2, Columns } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const MarkdownEditor = ({ value, onChange, className }) => {
    const [activeTab, setActiveTab] = useState('write'); // 'write', 'preview', 'split'

    const insertText = (before, after = '') => {
        const textarea = document.querySelector('textarea[name="content-editor"]');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);

        const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

        onChange(newText);

        // Restore selection/focus (simulated)
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    };

    const ToolbarButton = ({ icon: Icon, onClick, title, active }) => (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={cn(
                "p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors",
                active && "bg-gray-200 text-gray-900"
            )}
        >
            <Icon size={18} />
        </button>
    );

    return (
        <div className={cn("border rounded-lg overflow-hidden bg-white shadow-sm flex flex-col h-full", className)}>
            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 border-b bg-gray-50 overflow-x-auto">
                <div className="flex items-center gap-1">
                    <ToolbarButton icon={Bold} onClick={() => insertText('**', '**')} title="Negrito" />
                    <ToolbarButton icon={Italic} onClick={() => insertText('*', '*')} title="Itálico" />
                    <div className="w-px h-6 bg-gray-300 mx-2" />
                    <ToolbarButton icon={Heading1} onClick={() => insertText('# ')} title="Título 1" />
                    <ToolbarButton icon={Heading2} onClick={() => insertText('## ')} title="Título 2" />
                    <div className="w-px h-6 bg-gray-300 mx-2" />
                    <ToolbarButton icon={List} onClick={() => insertText('- ')} title="Lista" />
                    <ToolbarButton icon={ListOrdered} onClick={() => insertText('1. ')} title="Lista Numerada" />
                    <div className="w-px h-6 bg-gray-300 mx-2" />
                    <ToolbarButton icon={Quote} onClick={() => insertText('> ')} title="Citação" />
                    <ToolbarButton icon={Code} onClick={() => insertText('`', '`')} title="Código" />
                </div>

                <div className="flex items-center gap-1 bg-gray-200 rounded p-1 ml-4">
                    <button
                        type="button"
                        onClick={() => setActiveTab('write')}
                        className={cn(
                            "p-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors",
                            activeTab === 'write' ? "bg-white shadow text-gray-900" : "text-gray-600 hover:text-gray-900"
                        )}
                        title="Apenas Editor"
                    >
                        <Edit2 size={14} />
                        <span className="hidden sm:inline">Editor</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('split')}
                        className={cn(
                            "p-1.5 rounded text-xs font-medium hidden sm:flex items-center gap-1.5 transition-colors",
                            activeTab === 'split' ? "bg-white shadow text-gray-900" : "text-gray-600 hover:text-gray-900"
                        )}
                        title="Dividir Tela"
                    >
                        <Columns size={14} />
                        <span className="hidden sm:inline">Dividir</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('preview')}
                        className={cn(
                            "p-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors",
                            activeTab === 'preview' ? "bg-white shadow text-gray-900" : "text-gray-600 hover:text-gray-900"
                        )}
                        title="Pré-visualização"
                    >
                        <Eye size={14} />
                        <span className="hidden sm:inline">Preview</span>
                    </button>
                </div>
            </div>

            {/* Editor / Preview Area */}
            <div className="flex-1 relative overflow-hidden flex">
                {/* Write Mode */}
                <div className={cn(
                    "h-full w-full",
                    activeTab === 'split' ? "w-1/2 border-r" : (activeTab === 'preview' ? "hidden" : "")
                )}
                >
                    <textarea
                        name="content-editor"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full h-full p-4 resize-none focus:outline-none font-mono text-sm leading-relaxed"
                        placeholder="Comece a escrever sua ata aqui..."
                    />
                </div>

                {/* Preview Mode */}
                <div className={cn(
                    "h-full overflow-y-auto bg-gray-50 p-8 prose prose-slate max-w-none",
                    activeTab === 'split' ? "w-1/2 block" : (activeTab === 'preview' ? "w-full block" : "hidden")
                )}
                >
                    {value ? (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4 pb-2 border-b" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-6 mb-3" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
                                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4" {...props} />,
                                a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
                                code: ({ node, inline, className, children, ...props }) => {
                                    return inline ?
                                        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-red-500" {...props}>{children}</code> :
                                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code className="text-sm font-mono" {...props}>{children}</code></pre>
                                }
                            }}
                        >
                            {value}
                        </ReactMarkdown>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 italic">
                            Nada para visualizar...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MarkdownEditor;
