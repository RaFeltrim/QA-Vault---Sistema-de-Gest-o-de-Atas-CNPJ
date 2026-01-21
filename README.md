# QA Vault - Sistema de Gestão de Atas CNPJ

O **QA Vault** é uma aplicação moderna para gestão de atas de reunião, focada na equipe de QA. O sistema permite criar, editar e visualizar atas com suporte a Markdown, organização por categorias e colaboração em tempo real.

## 🚀 Funcionalidades

- **Gestão de Atas**: CRUD completo (Criar, Ler, Editar, Excluir*) de atas.
- **Editor Rico**: Editor Markdown com preview em tempo real e toolbar de formatação.
- **Colaboração Real-Time**: Sincronização automática de dados entre usuários (via Supabase).
- **Categorização**: Organização em Kickoffs, Kanban, Milestones e Shift-Left.
- **Busca**: Filtragem rápida por título e conteúdo.
- **Importação**: Suporte a importação de atas em lote via arquivo JSON.
- **Interface Moderna**: UI polida e responsiva com Tailwind CSS.

## 🛠️ Tech Stack

- **Frontend**: React, Vite
- **Estilização**: Tailwind CSS, PostCSS
- **Ícones**: Lucide React
- **Backend/Banco de Dados**: Supabase (PostgreSQL + Realtime)
- **Markdown**: React Markdown, Remark GFM, Tailwind Typography

## 📦 Estrutura do Projeto

```
src/
├── components/       # Componentes React reutilizáveis
│   ├── AtaDetail.jsx     # Visualização detalhada da ata
│   ├── AtaEditor.jsx     # Formulário de edição/criação
│   ├── MarkdownEditor.jsx# Editor com preview e toolbar
│   ├── Sidebar.jsx       # Navegação lateral
│   └── LoginScreen.jsx   # Tela de login simples
├── data/             # Dados estáticos/iniciais
├── supabaseClient.js # Configuração do cliente Supabase
├── App.jsx           # Componente principal e lógica de estado
└── main.jsx          # Ponto de entrada
```

## 🔧 Configuração e Instalação

### Pré-requisitos

- Node.js (v18+)
- Conta no Supabase (para backend)

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/RaFeltrim/QA-Vault---Sistema-de-Gest-o-de-Atas-CNPJ.git
   cd QA-Vault---Sistema-de-Gest-o-de-Atas-CNPJ
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente (Opcional se hardcoded no `supabaseClient.js`, mas recomendado criar `.env`):
   ```
   VITE_SUPABASE_URL=sua_url_supabase
   VITE_SUPABASE_ANON_KEY=sua_key_supabase
   ```

4. Execute o projeto localmente:
   ```bash
   npm run dev
   ```

## 🗄️ Banco de Dados (Supabase)

Para o funcionamento correto, crie a tabela no SQL Editor do Supabase:

```sql
create table atas (
  id text primary key,
  title text,
  date text,
  category text,
  content text,
  comments jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter publication supabase_realtime add table atas;
```

## 🤝 Contribuição

1. Faça um Fork do projeto
2. Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
