import { Menu, Search, Plus, FileText, ChevronRight, Calendar, MessageSquare, Upload } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import Sidebar from './components/Sidebar';
import LoginScreen from './components/LoginScreen';
import AtaEditor from './components/AtaEditor';
import AtaDetail from './components/AtaDetail';
import ProjectManager from './components/ProjectManager';
import CategoryManager from './components/CategoryManager';
import Drafts from './components/Drafts';
import Whiteboard from './components/Whiteboard';
import { INITIAL_DATA } from './data/initialData';

import { supabase } from './supabaseClient';

// PDF Worker setup
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState('Rafael');
    const [atas, setAtas] = useState([]);

    // Project State
    const [projects, setProjects] = useState([]);
    const [activeProject, setActiveProject] = useState(null); // storing full object {id, name}
    const [showProjectManager, setShowProjectManager] = useState(false);

    // Categories State
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [showCategoryManager, setShowCategoryManager] = useState(false);

    const [view, setView] = useState('list'); // list, detail, create, edit
    const [selectedAta, setSelectedAta] = useState(null);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const fileInputRef = useRef(null);

    // Initial Load
    useEffect(() => {
        const auth = localStorage.getItem('qa_vault_auth');
        if (auth === 'true') {
            setIsAuthenticated(true);
            const user = localStorage.getItem('qa_vault_user');
            if (user) setCurrentUser(user);
        }
        fetchProjects();
    }, []);

    // Fetch data when active project changes
    useEffect(() => {
        if (activeProject) {
            fetchCategories(activeProject.id);
            fetchAtas(activeProject.id);
        } else {
            setCategories([]);
            setAtas([]);
        }
    }, [activeProject]);

    // Realtime subscription setup
    useEffect(() => {
        const subscription = supabase
            .channel('public:atas')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'atas' }, (payload) => {
                // Filter realtime events by project if possible, or just update state
                // Ideally check payload.new.project_id === activeProject.id
                if (activeProject && payload.new && payload.new.project_id !== activeProject.id) return;

                if (payload.eventType === 'INSERT') {
                    setAtas(prev => [...prev, payload.new]);
                } else if (payload.eventType === 'UPDATE') {
                    setAtas(prev => prev.map(ata => ata.id === payload.new.id ? payload.new : ata));
                    setSelectedAta(prev => prev && prev.id === payload.new.id ? payload.new : prev);
                } else if (payload.eventType === 'DELETE') {
                    setAtas(prev => prev.filter(ata => ata.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [activeProject]);


    const fetchProjects = async () => {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.warn('Projects fetch error:', error.message);
            // Fallback default if table missing/empty for safety
            const defaultProj = { id: 'default', name: 'CNPJ-Alfanumérico (Equifax-BVS)' };
            setProjects([defaultProj]);
            setActiveProject(defaultProj);
        } else if (data && data.length > 0) {
            setProjects(data);
            setActiveProject(data[0]);
        } else {
            // No projects, create default
            handleAddProject('Meu Primeiro Projeto');
        }
    };

    const fetchCategories = async (projectId) => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('project_id', projectId)
                .order('created_at', { ascending: true });

            if (error) {
                console.warn('Categories fetch error:', error.message);
                // Use default categories
                setCategories([
                    { id: '00-Kickoffs', label: '00 - Kickoffs & Planejamento', name: '00-Kickoffs' },
                    { id: '01-Kanban', label: '01 - Execução (Kanban)', name: '01-Kanban' },
                    { id: '02-Milestones', label: '02 - Revisões & Milestones', name: '02-Milestones' },
                ]);
                setActiveCategory('00-Kickoffs');
            } else if (data && data.length > 0) {
                setCategories(data);
                setActiveCategory(data[0].id);
            } else {
                // No categories, use defaults
                setCategories([
                    { id: '00-Kickoffs', label: '00 - Kickoffs & Planejamento', name: '00-Kickoffs' },
                    { id: '01-Kanban', label: '01 - Execução (Kanban)', name: '01-Kanban' },
                ]);
                setActiveCategory('00-Kickoffs');
            }
        } catch (e) {
            console.error('Categories error:', e);
            setCategories([]);
        }
    };

    const fetchAtas = async (projectId) => {
        try {
            // Try with project_id filter first
            let { data, error } = await supabase
                .from('atas')
                .select('*')
                .eq('project_id', projectId)
                .order('created_at', { ascending: false });

            // If error (likely missing column), fetch all atas
            if (error) {
                console.warn('Fetch with project_id failed, fetching all:', error.message);
                const result = await supabase
                    .from('atas')
                    .select('*')
                    .order('created_at', { ascending: false });
                data = result.data;
                error = result.error;
            }

            if (data) {
                setAtas(data);
            } else {
                setAtas([]);
            }
        } catch (e) {
            console.error('Atas fetch error:', e);
            setAtas([]);
        }
    };

    const handleAddProject = async (name) => {
        const { data, error } = await supabase
            .from('projects')
            .insert({ name })
            .select();

        if (error) {
            console.error('Error adding project:', error);
            // Fallback
            const newProj = { id: crypto.randomUUID(), name };
            setProjects(prev => [...prev, newProj]);
            setActiveProject(newProj);
        } else {
            setProjects(prev => [...prev, data[0]]);
            setActiveProject(data[0]);
        }
    };

    const handleDeleteProject = async (id) => {
        if (!confirm('Excluir este projeto? Todas as atas vinculadas serão perdidas.')) return;

        // DB Cascade should handle it, but if not we might have orphaned atas
        const { error } = await supabase.from('projects').delete().eq('id', id);

        if (error) {
            console.error('Error deleting project:', error);
            setProjects(prev => prev.filter(p => p.id !== id));
        } else {
            setProjects(prev => prev.filter(p => p.id !== id));
            if (activeProject && activeProject.id === id) {
                setActiveProject(null); // Will trigger useEffect to clear data or select next
            }
        }
    };

    const handleAddCategory = async (name) => {
        if (!activeProject) return;
        const { data, error } = await supabase
            .from('categories')
            .insert({ name, project_id: activeProject.id })
            .select();

        if (error) {
            console.error('Error adding category:', error);
            alert('Erro ao criar categoria.');
        } else {
            setCategories(prev => [...prev, data[0]]);
            if (!activeCategory) setActiveCategory(data[0].id);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!confirm('Excluir esta categoria?')) return;
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) {
            console.error('Error deleting category:', error);
        } else {
            setCategories(prev => prev.filter(c => c.id !== id));
            if (activeCategory === id) setActiveCategory(null);
        }
    };

    const handleLogin = (user) => {
        setIsAuthenticated(true);
        setCurrentUser(user);
        localStorage.setItem('qa_vault_auth', 'true');
        localStorage.setItem('qa_vault_user', user);
        fetchProjects(); // Triggers chain
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('qa_vault_auth');
        setView('list');
    };

    const handleDeleteAta = async (id) => {
        if (!confirm('Tem certeza que deseja excluir esta ata?')) return;
        const { error } = await supabase.from('atas').delete().eq('id', id);
        if (error) {
            console.error('Error deleting ata:', error);
            alert('Erro ao excluir ata!');
        } else {
            setView('list');
            setSelectedAta(null);
        }
    };

    const handleSaveAta = async (ataData) => {
        if (!activeProject) {
            alert('Nenhum projeto selecionado!');
            return;
        }
        const timestamp = new Date().toISOString();
        let payload;

        if (selectedAta) {
            // Edit
            payload = { ...ataData, id: selectedAta.id };
        } else {
            // Create
            payload = {
                ...ataData,
                // id: crypto.randomUUID(), // Let DB handle or generate
                project_id: activeProject.id, // ISOLATION KEY
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
            setView('list');
            setSelectedAta(null);
        }
    };

    const handleAddComment = async (ataId, text) => {
        const ata = atas.find(a => a.id === ataId);
        if (!ata) return;

        const newComment = {
            author: currentUser,
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

    const handleEditComment = async (ataId, index, newText) => {
        const ata = atas.find(a => a.id === ataId);
        if (!ata) return;

        const updatedComments = [...ata.comments];
        updatedComments[index] = { ...updatedComments[index], text: newText };

        const { error } = await supabase
            .from('atas')
            .update({ comments: updatedComments })
            .eq('id', ataId);

        if (error) {
            console.error('Error editing comment:', error);
            alert('Erro ao editar comentário');
        }
    };

    const handleDeleteComment = async (ataId, index) => {
        if (!confirm('Excluir este comentário?')) return;

        const ata = atas.find(a => a.id === ataId);
        if (!ata) return;

        const updatedComments = ata.comments.filter((_, i) => i !== index);

        const { error } = await supabase
            .from('atas')
            .update({ comments: updatedComments })
            .eq('id', ataId);

        if (error) {
            console.error('Error deleting comment:', error);
            alert('Erro ao excluir comentário');
        }
    };

    const handleImportFile = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const timestamp = new Date().toISOString();
        const fileExtension = file.name.split('.').pop().toLowerCase();

        try {
            if (fileExtension === 'json') {
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
            } else if (['md', 'txt'].includes(fileExtension)) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const content = e.target.result;
                    const newAta = {
                        id: crypto.randomUUID(),
                        title: file.name,
                        content: content,
                        date: new Date().toLocaleDateString('pt-BR'),
                        category: activeCategory, // Import into current category
                        comments: [],
                        created_at: timestamp
                    };

                    const { error } = await supabase
                        .from('atas')
                        .insert(newAta);

                    if (error) {
                        console.error('Error importing text file:', error);
                        alert('Erro ao importar arquivo texto.');
                    } else {
                        alert('Arquivo importado com sucesso!');
                        setView('list');
                    }
                };
                reader.readAsText(file);
            } else if (fileExtension === 'pdf') {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const loadingTask = pdfjsLib.getDocument(e.target.result);
                    try {
                        const pdf = await loadingTask.promise;
                        let fullText = '';

                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const textContent = await page.getTextContent();
                            const pageText = textContent.items.map(item => item.str).join(' ');
                            fullText += pageText + '\n\n';
                        }

                        const newAta = {
                            id: crypto.randomUUID(),
                            title: file.name,
                            content: fullText,
                            date: new Date().toLocaleDateString('pt-BR'),
                            category: activeCategory,
                            comments: [],
                            created_at: timestamp
                        };

                        const { error } = await supabase
                            .from('atas')
                            .insert(newAta);

                        if (error) {
                            console.error('Error importing PDF:', error);
                            alert('Erro ao importar PDF.');
                        } else {
                            alert('PDF importado com sucesso!');
                            setView('list');
                        }
                    } catch (error) {
                        console.error('Error parsing PDF:', error);
                        alert('Erro ao ler o PDF.');
                    }
                };
                reader.readAsArrayBuffer(file);
            } else {
                alert('Formato de arquivo não suportado (apenas .json, .md, .txt, .pdf)');
            }
        } catch (error) {
            console.error('Error handling file:', error);
        }

        // Reset input
        event.target.value = '';
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
                categories={categories} // Now dynamic
                onLogout={handleLogout}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
                projects={projects}
                activeProject={activeProject ? activeProject.name : ''} // Pass name for display
                setActiveProject={(name) => {
                    const proj = projects.find(p => p.name === name);
                    if (proj) setActiveProject(proj);
                }}
                onManageProjects={() => setShowProjectManager(true)}
                onManageCategories={() => setShowCategoryManager(true)}
            />

            {showProjectManager && (
                <ProjectManager
                    projects={projects}
                    onClose={() => setShowProjectManager(false)}
                    onAdd={handleAddProject}
                    onDelete={handleDeleteProject}
                />
            )}

            {showCategoryManager && activeProject && (
                <CategoryManager
                    categories={categories}
                    activeProject={activeProject.name}
                    onClose={() => setShowCategoryManager(false)}
                    onAdd={handleAddCategory}
                    onDelete={handleDeleteCategory}
                />
            )}

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 p-4 shadow-sm flex justify-between items-center z-10">
                    <div className="flex items-center">
                        <button className="md:hidden mr-3 text-slate-600" onClick={() => setIsMobileOpen(true)}>
                            <Menu />
                        </button>
                        <h2 data-testid="header-title" className="text-xl font-bold text-indigo-900">
                            {categories.find(c => c.id === activeCategory)?.name || (activeCategory === 'drafts' ? 'Rascunho' : activeCategory === 'whiteboard' ? 'Whiteboard' : 'QA Vault')}
                        </h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative hidden md:block">
                            <input
                                data-testid="search-input"
                                type="text"
                                placeholder="Buscar em atas..."
                                className="pl-10 pr-4 py-2 border border-slate-300 rounded-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 transition-all focus:w-80"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        </div>
                        <button
                            data-testid="import-file-btn"
                            onClick={() => fileInputRef.current.click()}
                            className="text-slate-500 hover:text-indigo-600 px-3 py-2 rounded-lg flex items-center text-sm font-medium transition-colors"
                            title="Importar Arquivo"
                        >
                            <Upload className="w-5 h-5 mr-1" />
                            <span className="hidden sm:inline">Importar</span>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImportFile}
                            accept=".json,.md,.txt,.pdf"
                            className="hidden"
                        />
                        <button
                            data-testid="new-ata-btn"
                            onClick={() => { setSelectedAta(null); setView('create'); }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-bold shadow-md transition-transform hover:scale-105"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Nova Ata
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className={`flex-1 overflow-y-auto relative ${activeCategory === 'whiteboard' ? '' : 'p-6'}`}>
                    {activeCategory === 'drafts' ? (
                        <Drafts activeProject={activeProject} />
                    ) : activeCategory === 'whiteboard' ? (
                        <Whiteboard />
                    ) : view === 'list' ? (
                        <div className="max-w-5xl mx-auto space-y-6">
                            {filteredAtas.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
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
                                        data-testid={`ata-list-item-${ata.id}`}
                                        onClick={() => { setSelectedAta(ata); setView('detail'); }}
                                        className="bg-white rounded-lg shadow-sm hover:shadow-md border border-slate-200 p-6 cursor-pointer transition-all hover:border-indigo-300 group"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-1 rounded">
                                                {ata.category}
                                            </span>
                                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-700">{ata.title}</h3>
                                        <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                                            {markdownToTxt(ata.content).substring(0, 150)}...
                                        </p>
                                        <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-100 pt-3">
                                            <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {ata.date}</span>
                                            <span className="flex items-center"><MessageSquare className="w-3 h-3 mr-1" /> {ata.comments ? ata.comments.length : 0} Comentários</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : view === 'detail' && selectedAta ? (
                        <div className="max-w-4xl mx-auto">
                            <AtaDetail
                                ata={selectedAta}
                                onBack={() => setView('list')}
                                onEdit={() => setView('edit')}
                                onAddComment={handleAddComment}
                                onEditComment={handleEditComment}
                                onDeleteComment={handleDeleteComment}
                                onDelete={handleDeleteAta}
                                currentUser={currentUser}
                            />
                        </div>
                    ) : (view === 'create' || view === 'edit') ? (
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
                    ) : null}
                </main>
            </div>
        </div>
    );
}

// Helper to strip markdown for preview safely
const markdownToTxt = (markdown) => {
    if (!markdown) return '';
    return markdown
        .replace(/[#*`_\[\]]/g, '') // Remove simple markdown chars
        .replace(/\(https?:\/\/[^\)]+\)/g, '') // Remove URLs
        .trim();
};
