// Mock data for Supabase responses
export const mockProjects = [
    { id: '1', name: 'CNPJ-Alfanumérico', created_at: '2024-01-01T00:00:00Z' },
    { id: '2', name: 'Projeto Teste', created_at: '2024-01-02T00:00:00Z' }
];

export const mockCategories = [
    { id: '01-planejamento', project_id: '1', name: '01-Planejamento', created_at: '2024-01-01T00:00:00Z' },
    { id: '02-execucao', project_id: '1', name: '02-Execução', created_at: '2024-01-01T00:00:00Z' },
    { id: '03-testes', project_id: '1', name: '03-Testes', created_at: '2024-01-01T00:00:00Z' }
];

export const mockAtas = [
    {
        id: 'ata-1',
        project_id: '1',
        title: 'Kickoff do Projeto CNPJ',
        content: '# Kickoff\n\nReunião inicial do projeto.',
        category: '01-planejamento',
        date: '2024-01-15',
        author: 'Rafael',
        comments: [
            { author: 'Rafael', text: 'Ótima reunião!', date: '2024-01-15' }
        ],
        created_at: '2024-01-15T10:00:00Z'
    },
    {
        id: 'ata-2',
        project_id: '1',
        title: 'Daily Standup',
        content: '# Daily\n\nRevisão das tarefas.',
        category: '02-execucao',
        date: '2024-01-16',
        author: 'Mauricio',
        comments: [],
        created_at: '2024-01-16T09:00:00Z'
    }
];

export const mockUsers = {
    Rafael: { password: 'senha123' },
    Mauricio: { password: 'senha123' }
};
