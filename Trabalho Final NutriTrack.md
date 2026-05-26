# [cite_start]Trabalho Final — Sistema de Registro de Calorias e Jejum [cite: 1]

## [cite_start]Visão Geral [cite: 2]

[cite_start]Você desenvolverá uma aplicação web *full-stack* para acompanhamento de consumo calórico e jejum intermitente[cite: 3]. [cite_start]O sistema deverá permitir que cada usuário registre suas refeições, defina metas diárias, acompanhe ciclos de jejum e visualize seu progresso ao longo da semana[cite: 4].

> ⚠️ **Aviso ético:** Este sistema é um exercício acadêmico. [cite_start]Ao desenvolver, prefira uma abordagem neutra e informativa, evitando linguagem que reforce dietas restritivas ou metas agressivas[cite: 5]. [cite_start]Inclua, na tela inicial ou no rodapé, um aviso de que a aplicação não substitui orientação médica ou nutricional[cite: 6].

---

## [cite_start]Stack Obrigatória [cite: 7]

* [cite_start]**Framework:** Next.js 14+ (App Router) [cite: 8]
* [cite_start]**Linguagem:** TypeScript [cite: 9]
* [cite_start]**Autenticação:** Firebase Authentication ou Supabase Auth (à escolha) [cite: 10]
* [cite_start]**Banco de Dados:** Firestore ou Supabase (Postgres) ou Local [cite: 10]
* [cite_start]**API:** Route Handlers do Next.js (`app/api/...`), Server Actions ou Local [cite: 11]
* [cite_start]**Estilização:** Livre (Tailwind, shadcn/ui, CSS Modules, etc.) [cite: 11]
* [cite_start]**Gráficos:** Livre (Recharts, Chart.js, Tremor, etc.) [cite: 12]
* [cite_start]**Deploy:** Vercel (ou equivalente público) [cite: 13]

---

## [cite_start]Requisitos Funcionais [cite: 14]

### [cite_start]1. Autenticação [cite: 15]
* [cite_start]Cadastro com e-mail e senha [cite: 16]
* [cite_start]Login e logout [cite: 17]
* [cite_start]Recuperação de senha [cite: 18]
* [cite_start]**Rotas protegidas:** nenhum dado de usuário pode ser acessível sem autenticação[cite: 19]. [cite_start]Cada usuário deve ver apenas seus próprios dados[cite: 19].

### [cite_start]2. Registro de Calorias (CRUD completo) [cite: 20]
* [cite_start]Criar registro contendo: data/hora, descrição do alimento, calorias e tipo de refeição (café, almoço, lanche, jantar, ceia)[cite: 22, 23].
* [cite_start]Listar registros com filtro por data[cite: 24].
* [cite_start]Editar qualquer registro existente[cite: 25].
* [cite_start]Excluir registro (com confirmação)[cite: 26].

### [cite_start]3. Meta Calórica [cite: 27]
* [cite_start]Definir meta diária de calorias[cite: 28].
* [cite_start]Editar a meta a qualquer momento[cite: 29].
* [cite_start]Exibir o consumo atual versus a meta no *dashboard* (ex.: barra de progresso)[cite: 30].

### [cite_start]4. Registro de Jejum [cite: 31]
* [cite_start]Iniciar um jejum (registra horário de início)[cite: 32].
* [cite_start]Encerrar o jejum em andamento (registra horário de fim e calcula duração)[cite: 33].
* [cite_start]Selecionar tipo planejado: 16:8, 18:6, 20:4, 24h ou personalizado[cite: 33].
* [cite_start]Apenas um jejum ativo por vez[cite: 34].

### [cite_start]5. Históricos [cite: 35]
* [cite_start]Histórico de jejuns[cite: 37].

### [cite_start]6. Resumo Semanal (Gráfico) [cite: 38]
* [cite_start]Gráfico de calorias consumidas por dia nos últimos 7 dias, com linha de referência da meta[cite: 39].
* [cite_start]Gráfico (ou indicador equivalente) de horas de jejum por dia nos últimos 7 dias[cite: 40].
* [cite_start]Indicadores agregados: média diária de calorias, total de jejuns concluídos na semana e tempo médio de jejum[cite: 41].

---

## [cite_start]Requisitos Não Funcionais [cite: 42]

* [cite_start]**Responsividade:** Funcional em mobile e desktop[cite: 44].
* [cite_start]**Validação:** Validar entradas no *client* e no *server* (sugestão: Zod)[cite: 45].
* [cite_start]**Estados de UI:** Tratar *loading*, erro e estado vazio em todas as telas[cite: 47].
* [cite_start]**Segurança:** Regras do Firestore / Row Level Security (RLS) do Supabase devidamente configuradas[cite: 48].
* [cite_start]**Variáveis de Ambiente:** Chaves sensíveis nunca commitadas; arquivo `.env.example` no repositório[cite: 49].
* [cite_start]**Acessibilidade básica:** Uso correto de *labels*, contraste adequado e navegação por teclado nos formulários principais[cite: 50].

---

## [cite_start]Entregáveis [cite: 51]

1.  [cite_start]**Repositório público no GitHub com:** [cite: 52]
    * [cite_start]Código-fonte[cite: 53].
    * [cite_start]`README.md` contendo: descrição, stack, instruções de setup local, variáveis de ambiente necessárias, link da aplicação em produção e screenshots das telas principais[cite: 54].
    * [cite_start]Histórico de commits coerente (não será aceito commit único)[cite: 55].
2.  [cite_start]**Aplicação publicada** com URL acessível[cite: 56].
3.  [cite_start]**Vídeo demonstrativo de 3 a 5 minutos** mostrando o uso real da aplicação (upload no Google Drive, YouTube como não listado ou Loom)[cite: 57].

---

## [cite_start]Critérios de Avaliação [cite: 58]

| Critério | Peso |
| :--- | :---: |
| Funcionalidades implementadas conforme requisitos | 35% |
| Qualidade do código (organização, tipagem, separação de responsabilidades) | 20% |
| Modelagem de dados e segurança (regras de acesso, validações) | 15% |
| UI/UX (clareza, responsividade, feedback ao usuário) | 15% |
| Documentação e entrega (README, deploy funcional, vídeo) | 10% |
| Commits e processo de desenvolvimento | 5% |

### [cite_start]Bônus (até 1,0 ponto na nota final) [cite: 60]
* [cite_start]Modo escuro funcional[cite: 61].
* [cite_start]Exportação dos dados em CSV ou JSON[cite: 63].
* [cite_start]PWA instalável[cite: 63].
* [cite_start]Testes automatizados (unitários ou e2e)[cite: 64].
* [cite_start]Notificação ao final do jejum planejado[cite: 65].
* [cite_start]Importação de alimentos a partir de uma API pública (ex.: OpenFoodFacts)[cite: 66].

---

## [cite_start]Regras [cite: 67]

* [cite_start]Trabalho individual (ou em dupla)[cite: 68].
* O uso de IA generativa é permitido, mas o aluno deve compreender e saber explicar todo o código entregue. [cite_start]**Haverá arguição**[cite: 69, 70].
* [cite_start]Plágio entre trabalhos zera a nota de todos os envolvidos[cite: 71].
* [cite_start]**Atrasos:** Desconto de 10% por dia de atraso, até no máximo 3 dias[cite: 72].