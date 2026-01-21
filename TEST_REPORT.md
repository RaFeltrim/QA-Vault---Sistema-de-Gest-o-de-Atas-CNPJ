# Relatório de Testes QA Vault

**Data:** 21/01/2026
**Ambiente:** Produção (Vercel)
**URL:** [https://qa-vault-sistema-de-gest-o-de-atas.vercel.app](https://qa-vault-sistema-de-gest-o-de-atas.vercel.app)
**Status da Automação:** 🔴 Falha (Erro de Ambiente Local)

## ⚠️ Resumo da Execução Automatizada

A tentativa de executar testes ponta-a-ponta (E2E) via agente automatizado falhou devido a restrições técnicas no ambiente de navegação (Erro de conexão CDP).
**Isso não indica erro na sua aplicação**, mas sim que eu não consegui "ver" o site rodando daqui.

## ✅ Checklist de Validação Manual (User Acceptance Testing)

Por favor, execute os seguintes passos para validar a entrega:

### 1. Acesso & Login
- [ ] Acessar [https://qa-vault-sistema-de-gest-o-de-atas.vercel.app](https://qa-vault-sistema-de-gest-o-de-atas.vercel.app).
- [ ] Verificar se a tela de login aparece.
- [ ] Tentar login com senha errada (Deve mostrar erro).
- [ ] Tentar login com senha correta: `OLAMUNDOQACNPJ098` (Deve redirecionar para Home).

### 2. Editor & Criação
- [ ] Clicar em "Nova Ata".
- [ ] Preencher Título: "Teste de Produção".
- [ ] Digitar no Editor Markdown:
    ```markdown
    # Título
    * Item 1
    * Item 2
    ```
- [ ] Verificar se o Preview (lado direito) renderiza corretamente em tempo real.
- [ ] Testar botões da Toolbar (Negrito, Itálico).
- [ ] Clicar em "Salvar Ata".

### 3. Visualização & Lista
- [ ] Verificar se a nova ata aparece na lista na categoria "00 - Kickoffs".
- [ ] Clicar na ata para ver detalhes.
- [ ] Verificar se o Markdown está renderizado bonito (sem `*` ou `#` soltos).

### 4. Colaboração (Supabase Real-Time)
- [ ] **Teste de Fogo:** Abra o site em DUAS abas (ou no celular e no PC).
- [ ] Crie uma ata na Aba A.
- [ ] Verifique se ela aparece *automaticamente* na Aba B sem recarregar a página.

### 5. Importação
- [ ] Se tiver o arquivo `sample-import.json`, clique em "Importar" e selecione-o.
- [ ] Verifique se as atas foram carregadas em lote.

---

**Nota Técnica:** Se a aplicação ficar com "Tela Branca" ou não carregar dados, verifique se as **Variáveis de Ambiente** foram configuradas corretamente no Painel da Vercel (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_APP_ACCESS_PASSWORD`).
