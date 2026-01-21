# Arquitetura do Sistema QA Vault

Este documento descreve a arquitetura técnica, decisões de design e fluxo de dados do QA Vault.

## 1. Visão Geral

O QA Vault é uma Single Page Application (SPA) construída com React para facilitar a gestão de atas e anotações da equipe de QA. A aplicação prioriza a experiência do usuário (UX) através de interfaces responsivas e edição rica de texto, e garante consistência de dados através de uma sincronização em tempo real com um backend Serverless (Supabase).

## 2. Diagrama de Arquitetura (Conceitual)

```mermaid
graph TD
    Client[Cliente React (Vite)]
    Supabase[Supabase (Backend as a Service)]
    Postgres[(PostgreSQL DB)]
    Realtime(Realtime Engine)

    Client -- Fetch/Upsert --> Supabase
    Supabase -- Persisência --> Postgres
    Postgres -- Change Data Capture (CDC) --> Realtime
    Realtime -- Websocket Events --> Client
```

## 3. Decisões Técnicas

### 3.1 Frontend
- **Framework**: Vite + React para performance e DX (Developer Experience).
- **Estilização**: Tailwind CSS para desenvolvimento rápido e consistente.
- **State Management**: React `useState` + `useEffect` (suficiente para a complexidade atual).
- **Markdown**: Adoção de `react-markdown` e `remark-gfm` ao invés de editores WYSIWYG pesados para manter o controle total sobre o formato dos dados e facilitar a portabilidade.

### 3.2 Backend & Dados
- **Supabase**: Escolhido pela facilidade de configurar um banco PostgreSQL com APIs REST instantâneas e suporte nativo a Realtime.
- **Estratégia de ID**: Uso de strings (UUIDs gerados no cliente ou timestamps para simplicidade inicial) para permitir criação offline-first futura se necessário.
- **Schema**:
    - `id` (text, PK)
    - `title` (text)
    - `content` (text, markdown)
    - `category` (text)
    - `date` (text)
    - `comments` (jsonb) - Armazena array de comentários de forma flexível sem criar tabela relacional complexa prematuramente.

### 3.3 Colaboração em Tempo Real
A aplicação assina o canal `public:atas` do Supabase.
- **Eventos**: `INSERT`, `UPDATE`, `DELETE`.
- **Fluxo**: Quando User A salva uma ata, o Supabase emite um evento. O cliente do User B recebe o payload e atualiza o estado local (`setAtas`) instantaneamente.

## 4. Estrutura de Pastas e Responsabilidades

| Diretório | Responsabilidade |
|-----------|------------------|
| `src/components/` | Componentes de UI. `AtaEditor` e `MarkdownEditor` isolam a lógica de edição complexa. |
| `src/data/` | Dados estáticos. Mantido para `initialData.js` (fallback) ou seeds. |
| `src/supabaseClient.js` | Singleton para conexão com Supabase. |
| `src/App.jsx` | "Brain" da aplicação. Gerencia o estado global (`atas`, `user`), rotas (via renderização condicional) e subscriptions. |

## 5. Próximos Passos Arquiteturais (Roadmap)

1. **Autenticação Robusta**: Migrar do "Login Simples" (hardcoded) para Supabase Auth.
2. **Row Level Security (RLS)**: Implementar políticas no banco para restringir edição apenas a usuários autenticados.
3. **PWA**: Adicionar Service Workers para suporte offline real.
