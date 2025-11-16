# Financial Wallet Frontend

Frontend React da carteira digital desenvolvido com:

- ⚛️ React 18 + TypeScript
- ⚡ Vite
- 🎨 TailwindCSS
- 🔐 React Hook Form + Zod
- 🌐 React Router v6
- 📡 Axios
- 🎯 Toast notifications

## Estrutura

```
src/
├── components/
│   └── ui/           # Button, Input, Card, Modal
├── contexts/         # AuthContext
├── pages/            # LoginPage, Dashboard (em desenvolvimento)
├── services/         # API client
├── types/            # TypeScript interfaces
└── utils/            # formatters, validations
```

## Desenvolvimento

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

## Design System

- **Cores primárias:** #002a54 (azul), #e6c35f (dourado)
- **Fonte:** Noto Sans
- **Border radius:** 12-16px
- **Transições:** cubic-bezier elastic

## API

Backend: http://localhost:8000/api

## Próximos Passos

- [ ] Página de Registro
- [ ] Dashboard completo
- [ ] Transferência e Depósito
- [ ] Histórico de transações
- [ ] Perfil do usuário
- [ ] Responsividade mobile
