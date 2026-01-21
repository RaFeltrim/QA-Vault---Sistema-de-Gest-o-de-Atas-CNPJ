export const INITIAL_DATA = [
    {
        id: 'ata-00-01',
        title: 'Ata 00.01 – Kick-Off Geral e Planejamento',
        date: '2026-01-13',
        category: '00-Kickoffs',
        content: `# Ata 00.01 – Kick-Off Geral e Planejamento\n\n**Participantes:** Marco Aurélio, Luiz Muller, Silvio Filho, Mauricio Cordeiro, Rafael Feltrim, Marcos Ferreira, Danyla Andrade, Bruno F. Silva, Fabiana Custódio, Denis Souza.\n\n## 1. Tópicos Principais\n* **Contextualização:** Adequação de CNPJ para alfanumérico em todas as aplicações web/banco.\n* **Metodologia:** IA varrerá código gerando ~10k cards. Gestão via Kanban.\n* **Infraestrutura:** Risco crítico de concorrência em ambientes compartilhados (HML).\n\n## 2. Discussões e Acordos\n* **Estratégia QA:** Uso de Robot Framework + Zephyr. Priorizar fluxos que consomem CNPJ.\n* **Ambientes:** Não haverá ambiente segregado. Controle via janelas de congelamento.\n\n## 3. Plano de Ação\n* [Imediato] Rodar IA para mapeamento do repositório.\n* [Em Andamento] Mapear cenários com POs.`,
        comments: []
    },
    {
        id: 'ata-00-01b',
        title: 'Ata 00.01-B – Levantamento Técnico de Stakeholders',
        date: '2026-01-14',
        category: '00-Kickoffs',
        content: `# Ata 00.01-B – Levantamento Técnico de Stakeholders\n\n**Participantes:** Grace Mendes, Silvio Filho, Denis Souza, Bruno F. Silva, Time QA.\n\n## 1. Tópicos Principais\n* **Escopo:** Confirmação de que Mainframe é estrutura separada.\n* **Ausência de Doc:** Legados não têm plano de testes, apenas unitários Maven sem evidência.\n\n## 2. Discussões e Acordos\n* **Mapeamento (Quem é Quem):**\n    * Legados: Mikelane Melo / Diego Oliveira.\n    * Orquestrador: Danyla / Wagner.\n    * Migração: Flaquer / Golf.\n* **Estratégia:** QA deve evidenciar "As-Is" antes de testar "To-Be".`,
        comments: []
    },
    {
        id: 'ata-00-01c',
        title: 'Ata 00.01-C – Alinhamento Tático: Ferramentas e Infra',
        date: '2026-01-13',
        category: '00-Kickoffs',
        content: `# Ata 00.01-C – Alinhamento Tático\n\n**Participantes:** Liderança Técnica Foursys.\n\n## 1. Principais Pontos\n* **Cronograma:** Homologação até Abril, Prod em Julho.\n* **Infra:** Contatos de SRE são Marcuni e Jonas Oliani.\n* **Ferramentas:** Integração IA -> Jira -> Zephyr é obrigatória.`,
        comments: []
    },
    {
        id: 'ata-00-02',
        title: 'Ata 00.02 – Mapeamento de Frentes (Fabi)',
        date: '2026-01-13',
        category: '00-Kickoffs',
        content: `# Ata 00.02 – Mapeamento de Frentes\n\n**Participantes:** Fabiana, Rafael, Luiz, Mauricio.\n\n## 1. Definições\n* **Governança:** Fabi foca em aprovação, não operacional.\n* **Frentes:**\n    * BAU: Wagner/Danyla.\n    * Orquestrador: Flaquer/Golf.\n    * Legados: Mick/Carol.\n\n## 2. Workflow Gherkin\nCiclo de 6 etapas: Escrita -> Validação Tec -> Ajuste -> Validação PO -> Ajuste -> Aprovação Zephyr.`,
        comments: [{ author: 'Rafael Feltrim', text: 'Importante lembrar de configurar o Dashboard no StudyAI.', date: '2026-01-14 10:00' }]
    },
    {
        id: 'ata-00-02b',
        title: 'Ata 00.02-B – Pilotagem Técnica Orquestrador BAU',
        date: '2026-01-15',
        category: '00-Kickoffs',
        content: `# Ata 00.02-B – Orquestrador BAU\n\n**Participantes:** Luiz Muller, Danyla, Wagner.\n\n## 1. Reality Check\n* **Conceito:** Orquestrador é Hub de APIs, sem tela para 99% dos produtos.\n* **Cultura:** Squad "Pastelaria" (sustentação crítica).\n* **Automação:** Migrar de Karatê (inoperante) para Robot em UAT.\n\n## 2. Acordos\n* Testes focados em JSON/BFF e não em Web.\n* Ambiente HML é instável; usar UAT com dados maquiados.`,
        comments: []
    },
    {
        id: 'ata-00-03',
        title: 'Ata 00.03 – Estratégia de Massa de Dados',
        date: '2026-01-16',
        category: '00-Kickoffs',
        content: `# Ata 00.03 – Massa de Dados\n\n**Participantes:** Denis, Gabriel Martins, Silvio, QA Team.\n\n## 1. Problema\n* Dependência de fontes distintas (Data Fabric vs Mainframe).\n* Simone (Gerente) de férias.\n\n## 2. Fluxo de Contato\n* 1º Leonardo Balduino.\n* 2º Victor Tortorello/Kiles (Escalada).\n\n## 3. Ação\n* Mapear nomes comerciais dos produtos (Planilha Anexo 2) antes de pedir massa.`,
        comments: []
    },
    {
        id: 'ata-00-04',
        title: 'Ata 00.04 – Visão de Negócio (Squad Robson)',
        date: '2026-01-16',
        category: '00-Kickoffs',
        content: `# Ata 00.04 – Squad Robson\n\n**Participantes:** Robson Vedovatti, QA Team.\n\n## 1. Descobertas\n* Robson cuida de conexão de dados.\n* QA da Squad é Mateus Machado (Zephyr).\n\n## 2. Estratégia Crítica\n* Squad valida em **Produção com Usuário Interno** antes de liberar cliente, devido a diferenças de ambiente. QA deve avaliar adotar isso.`,
        comments: []
    },
    {
        id: 'ata-00-04c',
        title: 'Ata 00.04-C – Mapeamento de Sponsors e Escopo',
        date: '2026-01-20',
        category: '00-Kickoffs',
        content: `# Ata 00.04-C – Sponsors\n\n**Participantes:** Marco Aurélio, Silvio, Denis, QA Team.\n\n## 1. Bloqueio\n* "Jogo de empurra" na responsabilidade dos produtos.\n\n## 2. Decisão\n* Criar histórico de negativas na planilha para resguardo.\n* **Escopo:** Tudo na lista é escopo até que a IA prove o contrário.`,
        comments: []
    },
    {
        id: 'ata-00-05',
        title: 'Ata 00.05 – Alinhamento de Massa (Governança)',
        date: '2026-01-21',
        category: '00-Kickoffs',
        content: `# Ata 00.05 – Governança de Dados\n\n**Participantes:** Agatha, Leonardo Balduino, QA Team.\n\n## 1. Reality Check\n* **Ambiente:** Não preparado para CNPJ Alfa. Se injetar massa, quebra.\n* **Lista Suja:** Muitos produtos PF (falsos positivos).\n\n## 2. Acordos\n* Sanitizar lista (remover PF).\n* Criar Roadmap de priorização com Negócio antes de pedir massa novamente.`,
        comments: []
    }
];
