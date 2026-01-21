import { Menu, Search, Plus, FileText, ChevronRight, Calendar, MessageSquare, Upload } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import LoginScreen from './components/LoginScreen';
import AtaEditor from './components/AtaEditor';
import AtaDetail from './components/AtaDetail';
import { INITIAL_DATA } from './data/initialData';

import { supabase } from './supabaseClient';

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

    // Load initial data from Supabase and subscribe to changes
    useEffect(() => {
        // Auth check (simple local check for now)
        const auth = localStorage.getItem('qa_vault_auth');
        if (auth === 'true') setIsAuthenticated(true);

        fetchAtas();

        // Realtime subscription
        const subscription = supabase
            .channel('public:atas')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'atas' }, (payload) => {
                console.log('Realtime change received!', payload);
                if (payload.eventType === 'INSERT') {
                    setAtas(prev => [...prev, payload.new]);
                } else if (payload.eventType === 'UPDATE') {
                    setAtas(prev => prev.map(ata => ata.id === payload.new.id ? payload.new : ata));

                    // Update selected view if open
                    setSelectedAta(prev => prev && prev.id === payload.new.id ? payload.new : prev);
                } else if (payload.eventType === 'DELETE') {
                    setAtas(prev => prev.filter(ata => ata.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchAtas = async () => {
        const { data, error } = await supabase
            .from('atas')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching atas:', error);
        } else if (data) {
            setAtas(data);
        }
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
        localStorage.setItem('qa_vault_auth', 'true');
        fetchAtas(); // Fetch on login
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('qa_vault_auth');
        setView('list');
    };

    const handleSaveAta = async (ataData) => {
        const timestamp = new Date().toISOString();
        let payload;

        if (selectedAta) {
            // Edit
            payload = { ...ataData, id: selectedAta.id };
        } else {
            // Create
            // Note: ID generation can be done here or DB side. We'll use uuid or timestamp for now but DB primary key is text.
            payload = {
                ...ataData,
                id: crypto.randomUUID(), // Ensure distinct IDs
                created_at: timestamp,
                comments: []
            };
        }

        const { error } = await supabase
            .from('atas')
            .upsert(payload)
            .select();

        if (error) {
            console.error('Error saving ata:', error);
            alert('Erro ao salvar no Supabase!');
        } else {
            // Optimistic update handled by realtime subscription usually, 
            // but for instant feedback we might want to wait or just rely on subscription. 
            // We'll rely on subscription to update the list, but we need to close the editor.
            setView('list');
            setSelectedAta(null);
        }
    };

    const handleAddComment = async (ataId, text) => {
        const ata = atas.find(a => a.id === ataId);
        if (!ata) return;

        const newComment = {
            author: 'QA Member', // Hardcoded for now until Auth is fully integrated
            text,
            date: new Date().toLocaleString()
        };

        const updatedComments = [...(ata.comments || []), newComment];

        const { error } = await supabase
            .from('atas')
            .update({ comments: updatedComments })
            .eq('id', ataId);

        if (error) {
            console.error('Error adding comment:', error);
            alert('Erro ao adicionar comentário');
        }
    };

    const handleImportFile = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (!Array.isArray(importedData)) {
                    alert('Formato inválido. O arquivo deve conter uma lista de atas.');
                    return;
                }

                // Filter valid records
                const validAtas = importedData.filter(item => item.id && item.title && item.content);

                if (validAtas.length === 0) {
                    alert('Nenhuma ata válida encontrada no arquivo.');
                    return;
                }

                // Batch upsert to Supabase
                const { error } = await supabase
                    .from('atas')
                    .upsert(validAtas);

                if (error) {
                    console.error('Error importing data:', error);
                    alert('Erro ao importar dados para o Supabase.');
                } else {
                    alert(`Importação iniciada! ${validAtas.length} registros processados.`);
                    setView('list');
                }
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
