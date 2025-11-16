# Prompt para Lovable - Financial Wallet Frontend MVP

Crie um frontend React completo para uma **carteira digital financeira** com as seguintes especificações:

## 🎨 Design System

### Paleta de Cores (Grupo Adriano)
- **Azul Corporativo:** `#002a54` (primário)
- **Azul Médio:** `#003d7a` (gradientes)
- **Dourado:** `#e6c35f` (CTA e destaques)
- **Dourado Escuro:** `#d4b050` (hover)
- **Verde:** `#10b981` (sucesso)
- **Vermelho:** `#ef4444` (erro)
- **Cyan:** `#22d3ee` (info)

### Tipografia
- **Font:** "Noto Sans", sans-serif
- **Títulos:** 700 weight, letter-spacing: 0.025em
- **Corpo:** 400-600 weight

### Componentes Base
- Gradientes: `linear-gradient(135deg, #002a54 0%, #003d7a 100%)`
- Border-radius: 12-16px
- Shadows: `0 4px 24px rgba(0, 42, 84, 0.3)`
- Transições: `cubic-bezier(0.34, 1.56, 0.64, 1)` (elastic)

## 🔐 Autenticação (Priority 1)

### Tela de Login
- Email + Password
- "Lembrar-me" checkbox
- Link "Esqueci minha senha"
- Botão "Entrar" (gradiente dourado)
- Link para "Criar conta"
- Validação em tempo real
- Mensagens de erro amigáveis

**API Endpoint:**
```
POST /api/v1/login
Body: { "email": "string", "password": "string" }
Response: { "token": "string", "user": {...} }
```

### Tela de Registro
- Nome completo (validação: 3-100 chars)
- Email (validação email)
- Password (min 8 chars, 1 maiúscula, 1 número, 1 especial)
- Password confirmation
- Checkbox aceite termos
- CPF (validação dígitos + formatação)
- Botão "Criar conta"

**API Endpoint:**
```
POST /api/v1/register
Body: {
  "name": "string",
  "email": "string",
  "password": "string",
  "password_confirmation": "string",
  "document": "string (CPF sem formatação)"
}
Response: { "token": "string", "user": {...} }
```

## 💼 Dashboard (Priority 2)

### Header
- Logo Grupo Adriano
- Nome do usuário + avatar (inicial)
- Dropdown: Perfil, Configurações, Sair
- Indicador de role (Admin/Cliente)

### Card de Saldo
- Saldo atual em destaque (R$ formato brasileiro)
- Ícone de olho para ocultar/mostrar valor
- Botões primários:
  - "Depositar" (verde)
  - "Transferir" (azul)
  - "Histórico" (dourado outline)

**API Endpoint:**
```
GET /api/v1/wallet
Headers: { "Authorization": "Bearer {token}" }
Response: {
  "id": "uuid",
  "balance": "decimal",
  "currency": "BRL",
  "status": "active"
}
```

### Últimas Transações (5 mais recentes)
- Ícone por tipo (↑ envio, ↓ recebimento, + depósito, ↩ estorno)
- Nome/descrição
- Data/hora (formato: "15 nov, 14:32")
- Valor (verde positivo, vermelho negativo)
- Status badge (pending/completed/failed/reversed)

**API Endpoint:**
```
GET /api/v1/transactions?limit=5&page=1
Response: {
  "data": [
    {
      "id": "uuid",
      "type": "transfer|deposit|reversal",
      "amount": "decimal",
      "description": "string",
      "status": "pending|completed|failed|reversed",
      "created_at": "ISO 8601"
    }
  ],
  "meta": { "total": 0, "per_page": 5, "current_page": 1 }
}
```

## 💸 Transferência (Priority 3)

### Modal/Página de Transferência
- Input email destinatário (com validação)
- Input valor (R$ formatado, validar > 0.01)
- Input descrição (opcional, max 255 chars)
- Preview antes de confirmar:
  - "De: [seu nome]"
  - "Para: [email destinatário]"
  - "Valor: R$ X,XX"
  - "Saldo após: R$ Y,YY"
- Botões: Cancelar / Confirmar
- Loading state durante processamento
- Success/Error toast

**API Endpoint:**
```
POST /api/v1/transactions/transfer
Body: {
  "recipient_email": "string",
  "amount": "decimal",
  "description": "string|null"
}
Response: {
  "id": "uuid",
  "type": "transfer",
  "amount": "decimal",
  "status": "completed",
  "recipient": { "email": "string", "name": "string" }
}
```

## 💰 Depósito (Priority 4)

### Modal de Depósito
- Input valor (R$ formatado)
- Botões rápidos: R$ 50 / R$ 100 / R$ 500
- Input descrição opcional
- Botão "Depositar"
- Success feedback

**API Endpoint:**
```
POST /api/v1/transactions/deposit
Body: {
  "amount": "decimal",
  "description": "string|null"
}
Response: {
  "id": "uuid",
  "type": "deposit",
  "amount": "decimal",
  "status": "completed"
}
```

## 📜 Histórico Completo (Priority 5)

### Página de Transações
- Filtros:
  - Por tipo (todos/depósito/transferência/estorno)
  - Por data (range picker)
  - Por status
- Tabela responsiva com colunas:
  - Data/hora
  - Tipo (ícone + label)
  - Descrição
  - Destinatário/Origem
  - Valor
  - Status
  - Ações (estornar se aplicável)
- Paginação (10 items/página)
- Export CSV (bonus)

### Estorno
- Botão "Estornar" em transações completed (tipo transfer/deposit)
- Confirmação: "Tem certeza?"
- Success toast

**API Endpoint:**
```
POST /api/v1/transactions/{id}/reverse
Response: {
  "id": "uuid",
  "original_transaction_id": "uuid",
  "type": "reversal",
  "amount": "decimal",
  "status": "completed"
}
```

## 👤 Perfil (Priority 6)

### Visualização
- Avatar (inicial)
- Nome
- Email
- CPF (formatado, parcialmente oculto: ***.**1.234-**)
- Role (Admin/Cliente)
- Data de criação
- Status da conta

**API Endpoint:**
```
GET /api/v1/me
Response: {
  "id": "uuid",
  "name": "string",
  "email": "string",
  "document": "string",
  "role": "admin|customer",
  "status": "active",
  "created_at": "ISO 8601"
}
```

### Edição (Bonus)
- Atualizar nome
- Alterar senha (atual + nova + confirmação)

## 🛠️ Requisitos Técnicos

### Stack
- **Framework:** React 18+ com TypeScript
- **Styling:** TailwindCSS + shadcn/ui (ou similar)
- **State:** React Context + hooks (ou Zustand)
- **HTTP:** Axios ou Fetch API
- **Forms:** React Hook Form + Zod validation
- **Router:** React Router v6
- **Notifications:** React Hot Toast ou Sonner
- **Icons:** Fontawesome React ou Heroicons

### Estrutura de Pastas
```
src/
├── components/
│   ├── ui/           # Componentes base (Button, Input, Card, Modal)
│   ├── auth/         # Login, Register
│   ├── dashboard/    # Cards, Stats
│   └── transactions/ # Transfer, Deposit, History
├── hooks/            # useAuth, useWallet, useTransactions
├── services/         # API client
├── utils/            # formatters (currency, date, cpf)
├── types/            # TypeScript interfaces
└── pages/            # Login, Dashboard, History, Profile
```

### API Base URL
- Development: `http://localhost:8000/api`
- Headers padrão: 
  - `Accept: application/json`
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}` (rotas protegidas)

### Storage
- Salvar token no localStorage: `wallet_token`
- Salvar user no localStorage: `wallet_user`
- Limpar ao fazer logout

### Validações
- CPF: 11 dígitos numéricos
- Email: regex padrão
- Valores monetários: min 0.01, max 999999.99
- Passwords: min 8 chars, 1 uppercase, 1 number, 1 special

### Formatações
- Moeda: `R$ 1.234,56` (pt-BR)
- Data: `15 nov 2025, 14:32`
- CPF: `123.456.789-01` (exibição) / `12345678901` (envio)

### Estados de Loading
- Skeleton screens nos cards
- Spinners em botões
- Disable inputs durante submissão

### Error Handling
- Toast notifications para erros
- Validação inline em formulários
- Fallback UI para erros críticos
- Retry automático em falhas de rede (3x)

## 🎯 Fluxo de Usuário Ideal

1. **Novo usuário:**
   - Tela Login → Link "Criar conta"
   - Preenche formulário
   - Redirect para Dashboard (já autenticado)

2. **Usuário retornando:**
   - Tela Login → Credenciais
   - Dashboard → Visualiza saldo + últimas transações

3. **Fazer transferência:**
   - Dashboard → Botão "Transferir"
   - Modal → Preenche dados → Confirma
   - Toast success → Atualiza saldo + histórico

4. **Depositar:**
   - Dashboard → Botão "Depositar"
   - Modal → Valor → Confirma
   - Toast success → Atualiza saldo

5. **Ver histórico:**
   - Dashboard → Botão "Histórico"
   - Página completa → Filtros → Estornar se necessário

## 📱 Responsividade

- **Mobile-first:** 320px - 767px
  - Stack vertical
  - Menu hamburger
  - Modals full-screen
  - Cards empilhados

- **Tablet:** 768px - 1023px
  - Grid 2 colunas
  - Sidebar colapsável

- **Desktop:** 1024px+
  - Grid 3-4 colunas
  - Sidebar fixa
  - Modals centralizados

## ✨ Diferenciais (Opcional)

- Dark mode toggle
- Animações suaves (framer-motion)
- Gráfico de gastos (Chart.js ou Recharts)
- Notificações push
- PWA (offline-first)
- QR Code para transferência rápida
- Multi-idioma (i18n)

## 🔒 Segurança

- Sanitizar inputs
- HTTPS only em produção
- Timeout de sessão (30min inatividade)
- Logout em erro 401
- Rate limiting visual (cooldown em botões)

## 🧪 Testes (Bonus)

- Unit: formatters, validators
- Integration: API calls
- E2E: fluxo completo de transferência

---

**Backend já está pronto e rodando em:** `http://localhost:8000`
**Swagger documentation:** `http://localhost:8080`

**Comece pelo login/registro e dashboard. Implemente os recursos em ordem de prioridade.**

