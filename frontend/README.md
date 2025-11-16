# Financial Wallet Frontend

Interface web da carteira digital desenvolvida com React 18, TypeScript, Vite e TailwindCSS.

## ⚛️ Stack

- **React 18.3** + **TypeScript 5.5**
- **Vite 5.3** - Build tool
- **TailwindCSS 3.4** - Styling
- **React Router v6** - Roteamento
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Axios** - Cliente HTTP
- **React Hot Toast** - Notificações
- **Lucide React** - Ícones
- **Date-fns** - Manipulação de datas

## 🎨 Design System

### Ocean Blue Theme

- **Primary:** `#003161` (Ocean Blue)
- **Secondary:** `#00610D` (Forest Green)
- **Accent:** `#DAB655` (Golden Sand)
- **Royal Blue:** `#3D58B6`
- **Success:** `#00610D`
- **Danger:** `#610019`

### Tipografia

- **Fonte:** Noto Sans
- **Border Radius:** 12-16px
- **Transições:** Cubic-bezier elastic

Documentação completa: `../docs/design-system.md`

## 📁 Estrutura do Projeto

```text
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (Button, Input, Card, Modal)
│   ├── DashboardHeader.tsx
│   ├── WalletCard.tsx
│   ├── RecentTransactions.tsx
│   ├── DepositModal.tsx
│   ├── TransferModal.tsx
│   └── UserTooltip.tsx
├── contexts/           # Contexts React
│   └── AuthContext.tsx # Autenticação global
├── pages/             # Páginas da aplicação
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── DashboardPage.tsx
│   ├── TransactionHistoryPage.tsx
│   └── ProfilePage.tsx
├── services/          # Serviços de API
│   ├── apiClient.ts   # Cliente Axios configurado
│   ├── authService.ts
│   ├── walletService.ts
│   └── transactionService.ts
├── types/             # TypeScript interfaces
│   └── index.ts
├── utils/             # Utilitários
│   ├── formatters.ts  # Formatação de valores
│   └── validators.ts  # Validações
├── App.tsx            # Componente raiz
├── main.tsx           # Entry point
└── index.css          # Estilos globais
```

## 🚀 Desenvolvimento

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Setup Local (sem Docker)

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

### Setup com Docker

```bash
# Da raiz do projeto
docker compose up -d frontend

# Ver logs
docker compose logs -f frontend
```

Acesse: <http://localhost:3000>

## 📄 Páginas Implementadas

### 1. LoginPage

- Login com email/password
- Validação com Zod
- Link para registro e recuperação de senha
- Redirecionamento automático após login

### 2. RegisterPage

- Registro de novo usuário
- Validação completa (nome, email, senha, confirmação)
- Redirecionamento para login após registro

### 3. ForgotPasswordPage

- Recuperação de senha via email
- Validação de email

### 4. DashboardPage

- Resumo financeiro com saldo
- Ações rápidas (Depósito, Transferência)
- Últimas transações
- Modais de operações

### 5. TransactionHistoryPage

- Histórico completo de transações
- Filtros por tipo e status
- Paginação
- Detalhes de cada transação
- Tooltips com informações do remetente/destinatário

### 6. ProfilePage

- Visualização de dados do usuário
- Edição de perfil
- Atualização de informações

## 🧩 Componentes Principais

### Layout

- **DashboardHeader** - Header com saldo e botões de ação
- **WalletCard** - Card exibindo saldo da carteira

### Transações

- **RecentTransactions** - Lista de transações recentes
- **TransactionItem** - Item individual de transação
- **UserTooltip** - Tooltip com dados do usuário em transações

### Modais

- **DepositModal** - Modal para realizar depósitos
- **TransferModal** - Modal para realizar transferências

### UI Base

- **Button** - Botão customizado com variantes
- **Input** - Input customizado com validação
- **Card** - Container de conteúdo
- **Modal** - Modal base reutilizável
- **Loading** - Spinner de carregamento

## 🔐 Autenticação

### AuthContext

Context global que gerencia:

- Estado de autenticação
- Login/Logout
- Registro
- Token Bearer
- Usuário autenticado

### Rotas Protegidas

Rotas que requerem autenticação redirecionam automaticamente para login.

## 🌐 Integração com API

### apiClient (Axios)

Cliente HTTP configurado com:

- Base URL: `http://localhost:8000/api`
- Interceptors para tokens Bearer
- Tratamento de erros
- Timeout configurado

### Services

- **authService** - Login, registro, logout, me
- **walletService** - Consulta de carteira e saldo
- **transactionService** - Depósitos, transferências, histórico

## 🎯 Funcionalidades

### Implementadas ✅

- [x] Autenticação completa
- [x] Dashboard com resumo
- [x] Histórico de transações
- [x] Filtros e paginação
- [x] Depósitos
- [x] Transferências
- [x] Perfil do usuário
- [x] Notificações toast
- [x] Validação de formulários
- [x] Design system completo
- [x] Layout responsivo

### Próximas Features 🔜

- [ ] Gerenciamento de endereços
- [ ] Upload de documentos
- [ ] Detalhes de transação em modal
- [ ] Exportação de histórico
- [ ] Gráficos e relatórios
- [ ] Dark mode
- [ ] Testes E2E
- [ ] PWA

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

## 📱 Responsividade

O layout é totalmente responsivo e otimizado para:

- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1440px+)

## 🔍 Validação de Formulários

Todos os formulários utilizam:

- **React Hook Form** para gerenciamento
- **Zod** para schemas de validação
- Mensagens de erro customizadas
- Validação em tempo real

## 🎨 Customização

### Tailwind Config

Cores, fontes e espaçamentos customizados em `tailwind.config.js`.

### CSS Global

Estilos globais e reset em `src/index.css`.

## 🌍 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do frontend:

```bash
VITE_API_URL=http://localhost:8000
```

## 📚 Documentação Adicional

- [Setup Guide](../docs/SETUP.md)
- [Design System](../docs/design-system.md)
- [Backend API](../backend/README.md)
- [Swagger UI](http://localhost:8080)

## 🐛 Troubleshooting

### Problema: API não conecta

Verifique se o backend está rodando e se a URL está correta em `.env`.

### Problema: Erros de CORS

Verifique as configurações de CORS no backend (`config/cors.php`).

### Problema: Build falha

```bash
# Limpar node_modules e reinstalar
rm -rf node_modules
npm install
```

## 📄 Licença

Este projeto está sob a licença MIT.
