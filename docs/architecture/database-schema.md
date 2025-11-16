# Database Schema Documentation

Schema do banco de dados PostgreSQL 18 para o MVP da carteira financeira.

## 🏗️ Arquitetura

Este schema implementa uma solução completa de LGPD compliance com separação de dados ativos e históricos.

## 📊 Tabelas Principais (Dados Ativos)

### `users`

Cadastro de usuários ativos do sistema.

- UUID v7 como chave primária
- Email e documento (CPF/CNPJ) com unique constraints
- Status: 1=active, 2=inactive, 3=blocked

### `addresses`

Endereços dos usuários (múltiplos por usuário).

- UUID v7 como chave primária
- Relacionamento N:1 com users
- Campos: CEP, logradouro, número, complemento, bairro, cidade, estado, país

### `user_documents`

Documentos dos usuários (CPF, RG, CNH, etc.).

- UUID v7 como chave primária
- Relacionamento N:1 com users
- Tipos: CPF, RG, CNH, passport, etc.
- Status: pending, approved, rejected, expired
- Armazenamento de arquivo (file_path)

### `wallets`

Carteiras digitais dos usuários.

- Uma carteira por usuário por moeda
- Saldo com precisão decimal (15,2)
- Relacionamento 1:N com users

### `transactions`

Registro imutável de todas as transações (NUNCA são deletadas).

- Tipos: 1=deposit, 2=transfer, 3=reversal
- Status: 1=pending, 2=processing, 3=completed, 4=failed, 5=reversed
- Campos desnormalizados para manter rastreabilidade mesmo após arquivamento

## 📜 Tabelas de Histórico (LGPD Compliance)

### `users_history`
Snapshot completo de usuários arquivados.
- Mantém todos os dados originais
- Metadados de arquivamento (razão, quem arquivou, IP)
- Imutável para auditoria

### `wallets_history`
Histórico de carteiras arquivadas.

## 🔍 Tabelas de Auditoria

### `transaction_logs`
Audit trail de mudanças de status em transações.

### `lgpd_audit_log`
Log de todas as ações relacionadas a dados pessoais.

## ⚙️ Funcionalidades Especiais

### Function `archive_user()`
Arquiva usuário de forma atômica:
1. Copia dados para `users_history`
2. Copia carteiras para `wallets_history`
3. Registra em `lgpd_audit_log`
4. Remove dados ativos

### Triggers
- `update_updated_at` - Atualiza timestamp automaticamente

### Views
- `v_user_balances` - Saldos consolidados
- `v_transaction_summary` - Resumo de transações
- `v_archived_users_summary` - Estatísticas de arquivamento

## 🎯 Decisões Técnicas

**UUID v7:**
- Ordenação temporal nativa
- Performance superior em índices
- IDs menores e mais eficientes

**Status como SMALLINT:**
- 2 bytes vs strings
- Melhor performance
- Documentado via comentários SQL

**Separação Ativo/Histórico:**
- Tabelas principais limpas e rápidas
- Unique constraints funcionam sem workarounds
- Compliance LGPD total
- Auditoria completa e imutável

## 📝 Motivos de Arquivamento

```
1 = user_request      (solicitação do usuário)
2 = lgpd_compliance   (direito ao esquecimento)
3 = account_closure   (encerramento de conta)
4 = fraud_detection   (detecção de fraude)
5 = inactivity        (inatividade prolongada)
6 = administrative    (motivo administrativo)
```

## 🧪 Dados de Teste

Usuários pré-cadastrados:
- **João Silva** - joao@example.com (saldo: R$ 1.000,00)
- **Maria Santos** - maria@example.com (saldo: R$ 500,00)

Senha: `password` (hash bcrypt)

