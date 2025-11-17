# Financial Wallet Frontend

Web interface for the digital wallet system built with React 18, TypeScript, Vite, and TailwindCSS.

## ⚛️ Tech Stack

- **React 18.3** + **TypeScript 5.5**
- **Vite 5.3** - Build tool
- **TailwindCSS 3.4** - Styling
- **React Router v6** - Routing
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Date-fns** - Date manipulation

## 🎨 Design System

### Ocean Blue Theme

- **Primary:** `#003161` (Ocean Blue)
- **Secondary:** `#00610D` (Forest Green)
- **Accent:** `#DAB655` (Golden Sand)
- **Royal Blue:** `#3D58B6`
- **Success:** `#00610D`
- **Danger:** `#610019`

### Typography

- **Font:** Noto Sans
- **Border Radius:** 12-16px
- **Transitions:** Cubic-bezier elastic

Complete documentation: `../docs/design-system.md`

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

## 🚀 Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Local Setup (without Docker)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

### Docker Setup

```bash
# From project root
docker compose up -d frontend

# View logs
docker compose logs -f frontend
```

Access: http://localhost:3000

## 📄 Implemented Pages

### 1. LoginPage
- Login with email/password
- Validation with Zod
- Links to registration and password recovery
- Automatic redirect after login

### 2. RegisterPage
- New user registration
- Complete validation (name, email, password, confirmation)
- Redirect to login after registration

### 3. ForgotPasswordPage
- Password recovery via email
- Email validation

### 4. DashboardPage
- Financial summary with balance
- Quick actions (Deposit, Transfer)
- Recent transactions
- Operation modals

### 5. TransactionHistoryPage
- Complete transaction history
- Filters by type and status
- Pagination
- Transaction details
- Tooltips with sender/recipient information

### 6. ProfilePage
- View user data
- Edit profile
- Update information

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

## 🔐 Authentication

### AuthContext

Global context that manages:
- Authentication state
- Login/Logout
- Registration
- Bearer token
- Authenticated user

### Protected Routes

Routes requiring authentication automatically redirect to login.

## 🌐 API Integration

### apiClient (Axios)

HTTP client configured with:
- Base URL: `http://localhost:8000/api`
- Interceptors for Bearer tokens
- Error handling
- Configured timeout

### Services

- **authService** - Login, registration, logout, me
- **walletService** - Wallet and balance queries
- **transactionService** - Deposits, transfers, history

## 🎯 Features

### Implemented ✅

- [x] Complete authentication
- [x] Dashboard with summary
- [x] Transaction history
- [x] Filters and pagination
- [x] Deposits
- [x] Transfers
- [x] User profile
- [x] Toast notifications
- [x] Form validation
- [x] Complete design system
- [x] Responsive layout

### Future Features 🔜

- [ ] Address management
- [ ] Document upload
- [ ] Transaction details modal
- [ ] History export
- [ ] Charts and reports
- [ ] Dark mode
- [ ] E2E tests
- [ ] PWA

## 🛠️ Available Scripts

```bash
# Development
npm run dev

# Production build
npm run build

# Build preview
npm run preview

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

## 📱 Responsive Design

Fully responsive layout optimized for:

- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1440px+)

## 🔍 Form Validation

All forms use:

- **React Hook Form** for management
- **Zod** for validation schemas
- Custom error messages
- Real-time validation

## 🎨 Customization

### Tailwind Config

Custom colors, fonts, and spacing in `tailwind.config.js`.

### Global CSS

Global styles and reset in `src/index.css`.

## 🌍 Environment Variables

Create a `.env` file in the frontend root:

```bash
VITE_API_URL=http://localhost:8000
```

## 📚 Additional Documentation

- [Setup Guide](../docs/SETUP.md)
- [Design System](../docs/design-system.md)
- [Backend API](../backend/README.md)
- [Swagger UI](http://localhost:8080)

## 🐛 Troubleshooting

### API Connection Issues

Verify backend is running and URL is correct in `.env`.

### CORS Errors

Check CORS settings in backend (`config/cors.php`).

### Build Failures

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

## 📄 License

This project is licensed under the MIT License.
