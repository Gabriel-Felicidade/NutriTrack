# 🍎 NutriTrack — Controle de Calorias e Jejum

O **NutriTrack** é uma plataforma moderna e intuitiva desenvolvida para auxiliar no monitoramento da saúde e bem-estar. O sistema combina o controle preciso de ingestão calórica diária com o acompanhamento em tempo real de ciclos de jejum intermitente, oferecendo métricas detalhadas e progresso visual.

---

## ✨ Funcionalidades Principais

### 👤 Gestão de Usuário
- **Autenticação Completa:** Fluxo seguro de Login e Cadastro utilizando Firebase Authentication.
- **Persistência de Dados:** Dados do usuário e registros salvos na nuvem com Firestore.

### 🍱 Controle de Refeições (CRUD)
- **Registro de Consumo:** Adição de refeições com descrição, calorias e categoria.
- **Gestão Total:** Visualização, edição e exclusão de refeições registradas no dia.
- **Metas Personalizadas:** Definição e ajuste de meta calórica diária com aviso ético de saúde para metas muito baixas.

### ⏱️ Jejum Intermitente
- **Cronômetro em Tempo Real:** Inicie e acompanhe seu jejum com diversos protocolos (12h, 14h, 16h, 18h, 20h).
- **Métricas de Jejum:** Visualização de tempo médio de jejum, total de ciclos concluídos e seu recorde pessoal.
- **Histórico:** Acompanhamento dos últimos 10 jejuns realizados.

### 📊 Visualização de Progresso
- **Gráfico Semanal:** Progresso visual do consumo calórico dos últimos 7 dias.
- **Cards de Status:** Resumo rápido de calorias consumidas, restantes e meta diária.

---

## 🚀 Diferenciais Técnicos

- **⚡ Performance Máxima:** Uso de *Dynamic Imports* do Next.js para carregamento sob demanda de componentes pesados (gráficos e modais).
- **🌓 Modo Escuro Nativo:** Suporte completo a temas claro e escuro, inclusive com troca automática de logotipos para garantir contraste perfeito.
- **📱 Responsividade Premium:** Layout adaptável para dispositivos móveis, tablets e desktop com animações suaves.
- **🔍 SEO & Semântica:** Implementação de metadados dinâmicos e estrutura HTML5 semântica para melhor acessibilidade e ranking.

---

## 🛠️ Tecnologias Utilizadas

- **Core:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes:** [shadcn/ui](https://ui.shadcn.com/) & [Base UI](https://base-ui.com/)
- **Banco de Dados & Auth:** [Firebase](https://firebase.google.com/)
- **Gráficos:** [Recharts](https://recharts.org/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Datas:** [date-fns](https://date-fns.org/)

---

## ⚙️ Como Executar o Projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/Gabriel-Felicidade/NutriTrack.git
cd NutriTrack
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto e adicione suas credenciais do Firebase:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

### 4. Rodar em desenvolvimento
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000)

---

## 📄 Licença
Este projeto foi desenvolvido para fins acadêmicos e de portfólio.

---

Desenvolvido por **Gabriel Felicidade** 🚀  
Em parceria com o assistente inteligente **Antigravity** 🛠️
