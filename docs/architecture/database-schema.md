# Database Schema Documentation

PostgreSQL 18 database schema for the Financial Wallet MVP.

## 🏗️ Architecture

This schema implements a complete LGPD compliance solution with separation of active and historical data.

## 📊 Main Tables (Active Data)

### `users`

Active user registration.

- UUID v7 as primary key
- Email and document (CPF/CNPJ) with unique constraints
- Status: 1=active, 2=inactive, 3=blocked

### `addresses`

User addresses (multiple per user).

- UUID v7 as primary key
- N:1 relationship with users
- Fields: ZIP code, street, number, complement, neighborhood, city, state, country

### `user_documents`

User documents (CPF, RG, CNH, etc.).

- UUID v7 as primary key
- N:1 relationship with users
- Types: CPF, RG, CNH, passport, etc.
- Status: pending, approved, rejected, expired
- File storage (file_path)

### `wallets`

Digital wallets.

- One wallet per user per currency
- Balance with decimal precision (15,2)
- 1:N relationship with users

### `transactions`

Immutable record of all transactions (NEVER deleted).

- Types: 1=deposit, 2=transfer, 3=reversal
- Status: 1=pending, 2=processing, 3=completed, 4=failed, 5=reversed
- Denormalized fields to maintain traceability after archiving

## 📜 Historical Tables (LGPD Compliance)

### `users_history`
Complete snapshot of archived users.
- Maintains all original data
- Archiving metadata (reason, who archived, IP)
- Immutable for audit

### `wallets_history`
Historical archived wallets.

## 🔍 Audit Tables

### `transaction_logs`
Audit trail of transaction status changes.

### `lgpd_audit_log`
Log of all actions related to personal data.

## ⚙️ Special Features

### Function `archive_user()`
Atomically archives user:
1. Copies data to `users_history`
2. Copies wallets to `wallets_history`
3. Records in `lgpd_audit_log`
4. Removes active data

### Triggers
- `update_updated_at` - Automatically updates timestamp

### Views
- `v_user_balances` - Consolidated balances
- `v_transaction_summary` - Transaction summary
- `v_archived_users_summary` - Archiving statistics

## 🎯 Technical Decisions

**UUID v7:**
- Native temporal ordering
- Superior index performance
- Smaller and more efficient IDs

**Status as SMALLINT:**
- 2 bytes vs strings
- Better performance
- Documented via SQL comments

**Active/Historical Separation:**
- Clean and fast main tables
- Unique constraints work without workarounds
- Full LGPD compliance
- Complete and immutable audit

## 📝 Archiving Reasons

```
1 = user_request      (user's request)
2 = lgpd_compliance   (right to be forgotten)
3 = account_closure   (account closure)
4 = fraud_detection   (fraud detection)
5 = inactivity        (prolonged inactivity)
6 = administrative    (administrative reason)
```

## 🧪 Test Data

Pre-registered users:
- **João Silva** - joao@example.com (balance: R$ 1,000.00)
- **Maria Santos** - maria@example.com (balance: R$ 500.00)

Password: `password` (bcrypt hash)

