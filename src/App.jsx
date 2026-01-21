import { Menu, Search, Plus, FileText, ChevronRight, Calendar, MessageSquare, Upload } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import LoginScreen from './components/LoginScreen';
import AtaEditor from './components/AtaEditor';
import AtaDetail from './components/AtaDetail';
import { INITIAL_DATA } from './data/initialData';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [atas, setAtas] = useState([]);
    const [activeCategory, setActiveCategory] = useState('00-Kickoffs');
    const [view, setView] = useState('list'); // list, detail, create, edit
    const [selectedAta, setSelectedAta] = useState(null);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const fileInputRef = useRef(null);

    const categories = [
        { id: '00-Kickoffs', label: '00 - Kickoffs & Planejamento' },
        { id: '01-Kanban', label: '01 - Execução (Kanban)' },
        { id: '02-Milestones', label: '02 - Revisões & Milestones' },
        { id: '03-Shift-Left', label: '03 - Estratégia Shift-Left' },
    ];

    // Load initial data
    useEffect(() => {
        // Check if we have data in localStorage
        const savedData = localStorage.getItem('qa_vault_atas');
        if (savedData) {
            setAtas(JSON.parse(savedData));
        } else {
            setAtas(INITIAL_DATA);
            localStorage.setItem('qa_vault_atas', JSON.stringify(INITIAL_DATA));
        }

        const auth = localStorage.getItem('qa_vault_auth');
        if (auth === 'true') setIsAuthenticated(true);
    }, []);

    // Save changes to localStorage whenever atas change
    useEffect(() => {
        if (atas.length > 0) {
            localStorage.setItem('qa_vault_atas', JSON.stringify(atas));
        }
    }, [atas]);

    const handleLogin = () => {
        setIsAuthenticated(true);
        localStorage.setItem('qa_vault_auth', 'true');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('qa_vault_auth');
        setView('list'); // Reset view on logout
    };

    const handleSaveAta = (ataData) => {
        if (selectedAta) {
            // Edit
            const updatedAtas = atas.map(a => a.id === selectedAta.id ? { ...ataData, id: a.id, comments: a.comments } : a);
            setAtas(updatedAtas);
        } else {
            // Create
            const newAta = {
                ...ataData,
                id: Date.now().toString(),
                comments: []
            };
            setAtas([...atas, newAta]);
        }
        setView('list');
        setSelectedAta(null);
    };

    const handleAddComment = (ataId, text) => {
        const updatedAtas = atas.map(a => {
            if (a.id === ataId) {
                return {
                    ...a,
                    comments: [...a.comments, {
                        author: 'QA Member',
                        text,
                        date: new Date().toLocaleString()
                    }]
                };
            }
            return a;
        });
        setAtas(updatedAtas);

        // Update selected ata view immediately
        if (selectedAta && selectedAta.id === ataId) {
            const updated = updatedAtas.find(a => a.id === ataId);
            setSelectedAta(updated);
        }
    };

    const handleImportFile = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (!Array.isArray(importedData)) {
                    alert('Formato inválido. O arquivo deve conter uma lista de atas.');
                    return;
                }

                // Merge strategy: Update existing by ID, append new ones
                const currentIds = new Set(atas.map(a => a.id));
                const mergedAtas = [...atas];

                let newCount = 0;
                let updatedCount = 0;

                importedData.forEach(importedAta => {
                    if (!importedAta.id || !importedAta.title || !importedAta.content) return; // Skip invalid records

                    if (currentIds.has(importedAta.id)) {
                        // Update existing
                        const index = mergedAtas.findIndex(a => a.id === importedAta.id);
                        mergedAtas[index] = { ...mergedAtas[index], ...importedAta };
                        updatedCount++;
                    } else {
                        // Add new
                        mergedAtas.push(importedAta);
                        currentIds.add(importedAta.id);
                        newCount++;
                    }
                });

                setAtas(mergedAtas);
                alert(`Importação concluída!\n${newCount} novas atas adicionadas.\n${updatedCount} atas atualizadas.`);
                setView('list');
            } catch (error) {
                console.error('Erro ao importar:', error);
                alert('Erro ao ler o arquivo JSON. Verifique o formato.');
            }
        };
        reader.readAsText(file);
        // Reset input
        event.target.value = '';
    };

    const stripMarkdown = (text) => {
        if (!text) return '';
        return text
            .replace(/#/g, '') // Headers
            .replace(/\*\*/g, '') // Bold
            .replace(/\*/g, '') // Bullets
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
            .replace(/`/g, '') // Code
            .trim();
    };

    if (!isAuthenticated) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    const filteredAtas = atas
        .filter(ata => ata.category === activeCategory)
        .filter(ata =>
            ata.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ata.content.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <div className="flex h-screen bg-slate-100 font-sans text-slate-900">
            <Sidebar
                activeCategory={activeCategory}
                setActiveCategory={(cat) => { setActiveCategory(cat); setView('list'); }}
                categories={categories}
                onLogout={handleLogout}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 p-4 shadow-sm flex justify-between items-center z-10">
                    <div className="flex items-center">
                        <button className="md:hidden mr-3 text-slate-600" onClick={() => setIsMobileOpen(true)}>
                            <Menu />
                        </button>
                        <h2 className="text-xl font-bold text-indigo-900">
                            {categories.find(c => c.id === activeCategory)?.label}
                        </h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative hidden md:block">
                            <input
                                type="text"
                                placeholder="Buscar em atas..."
                                className="pl-10 pr-4 py-2 border border-slate-300 rounded-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 transition-all focus:w-80"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        </div>
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="text-slate-500 hover:text-indigo-600 px-3 py-2 rounded-lg flex items-center text-sm font-medium transition-colors"
                            title="Importar JSON"
                        >
                            <Upload className="w-5 h-5 mr-1" />
                            <span className="hidden sm:inline">Importar</span>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImportFile}
                            accept=".json"
                            className="hidden"
                        />
                        <button
                            onClick={() => { setSelectedAta(null); setView('create'); }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-bold shadow-md transition-transform hover:scale-105"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Nova Ata
                        </button>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {view === 'list' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
                            {filteredAtas.length === 0 ? (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                                    <FileText className="w-16 h-16 mb-4 opacity-50" />
                                    <p className="text-lg font-medium">Nenhuma ata encontrada nesta categoria.</p>
                                    <button
                                        onClick={() => { setSelectedAta(null); setView('create'); }}
                                        className="mt-4 text-indigo-600 hover:text-indigo-800 font-semibold"
                                    >
                                        Criar a primeira agora
                                    </button>
                                </div>
                            ) : (
                                filteredAtas.map(ata => (
                                    <div
                                        key={ata.id}
                                        onClick={() => { setSelectedAta(ata); setView('detail'); }}
                                        className="bg-white rounded-lg shadow-sm hover:shadow-md border border-slate-200 p-6 cursor-pointer transition-all hover:border-indigo-300 group"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-1 rounded">
                                                {ata.id.includes('b') || ata.id.includes('c') ? 'Técnica' : 'Geral'}
                                            </span>
                                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-700">{ata.title}</h3>
                                        <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                                            {stripMarkdown(ata.content).substring(0, 150)}...
                                        </p>
                                        <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-100 pt-3">
                                            <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {ata.date}</span>
                                            <span className="flex items-center"><MessageSquare className="w-3 h-3 mr-1" /> {ata.comments.length} Comentários</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {view === 'detail' && selectedAta && (
                        <div className="max-w-4xl mx-auto">
                            <AtaDetail
                                ata={selectedAta}
                                onBack={() => setView('list')}
                                onEdit={() => setView('edit')}
                                onAddComment={handleAddComment}
                            />
                        </div>
                    )}

                    {(view === 'create' || view === 'edit') && (
                        <div className="max-w-4xl mx-auto">
                            <AtaEditor
                                ata={selectedAta}
                                onSave={handleSaveAta}
                                onCancel={() => {
                                    if (view === 'edit') setView('detail');
                                    else setView('list');
                                }}
                            />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
