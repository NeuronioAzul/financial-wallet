# Regras de Negócio de Transações

## Visão Geral

Este documento descreve as regras de negócio implementadas para as operações de transações no Financial Wallet MVP.

## Tipos de Transações

### 1. Depósito (DEPOSIT)

**Descrição:** Adiciona fundos à carteira do usuário.

**Regras de Negócio:**

- ✅ Valor deve ser positivo (> 0)
- ✅ Funciona corretamente mesmo se o saldo estiver negativo
- ✅ O valor do depósito é somado ao saldo atual (positivo ou negativo)
- ✅ Transação pode ser revertida a qualquer momento

**Validações:**

```php
- amount: required, numeric, min:0.01, max:999999.99
- description: nullable, string, max:500
```

**Exemplo com Saldo Negativo:**

```text
Saldo Atual: -R$ 50,00
Depósito: +R$ 100,00
Novo Saldo: R$ 50,00
```

**Exemplo com Saldo Positivo:**

```text
Saldo Atual: R$ 1.000,00
Depósito: +R$ 500,00
Novo Saldo: R$ 1.500,00
```

### 2. Transferência (TRANSFER)

**Descrição:** Transfere fundos entre duas carteiras.

**Regras de Negócio:**

- ✅ Remetente deve ter saldo suficiente
- ✅ Valor deve ser positivo (> 0)
- ✅ Não pode transferir para si mesmo
- ✅ Destinatário deve existir
- ✅ Mensagem de erro detalhada mostra saldo disponível e valor requerido
- ✅ Transação pode ser revertida a qualquer momento

**Validações:**

```php
- receiver_email: required, email, exists:users, different:auth_user_email
- amount: required, numeric, min:0.01, max:999999.99
- description: nullable, string, max:500
```

**Validação de Saldo:**

Se o saldo for insuficiente, o sistema retorna uma mensagem clara:

```text
Insufficient balance. 
Available: 50,75 BRL, 
Required: 100,50 BRL
```

**Exemplo de Transferência:**

```text
Remetente:
  Saldo Anterior: R$ 1.000,00
  Valor: -R$ 200,00
  Novo Saldo: R$ 800,00

Destinatário:
  Saldo Anterior: R$ 500,00
  Valor: +R$ 200,00
  Novo Saldo: R$ 700,00
```

### 3. Reversão (REVERSAL)

**Descrição:** Reverte uma transação anterior (depósito ou transferência).

**Regras de Negócio:**

- ✅ Pode ser executada por qualquer caso de inconsistência
- ✅ Pode ser executada por solicitação do usuário
- ✅ **NÃO valida saldo disponível** - permite reversão mesmo que resulte em saldo negativo
- ✅ Inverte o fluxo de dinheiro da transação original
- ✅ Marca a transação original como "REVERSED"
- ✅ Registra o motivo da reversão

**Validações:**

```php
- reason: required, string, max:1000
```

**Casos de Uso:**

1. **Inconsistência Detectada:**
   - Sistema detecta erro na transação
   - Admin ou sistema automaticamente reverte
   - Saldo pode ficar negativo temporariamente

2. **Solicitação do Usuário:**
   - Usuário solicita estorno
   - Sistema permite reversão independente do saldo
   - Garante que todas as transações sejam reversíveis

**Exemplo de Reversão com Saldo Insuficiente:**

```text
Transação Original (Depósito):
  Valor: +R$ 200,00
  Saldo do Usuário passou de R$ 100,00 → R$ 300,00

Usuário gastou o dinheiro:
  Saldo Atual: R$ 50,00

Reversão Solicitada:
  Valor: -R$ 200,00
  Saldo Final: -R$ 150,00 (PERMITIDO!)
```

**Exemplo de Reversão de Transferência:**

```text
Transação Original:
  João → Maria: R$ 100,00
  João: R$ 500,00 → R$ 400,00
  Maria: R$ 200,00 → R$ 300,00

Maria gastou o dinheiro:
  Saldo Atual de Maria: R$ 50,00

Reversão:
  Maria → João: R$ 100,00
  Maria: R$ 50,00 → -R$ 50,00 (PERMITIDO!)
  João: R$ 400,00 → R$ 500,00
```

## Segurança e Integridade

### Locking de Carteiras

Todas as operações utilizam `lockForUpdate()` para prevenir:

- ❌ Race conditions
- ❌ Saldos inconsistentes
- ❌ Transações concorrentes conflitantes

### Order by ID para Deadlock Prevention

```php
$wallets = Wallet::whereIn('id', [$wallet1->id, $wallet2->id])
    ->orderBy('id')  // Sempre na mesma ordem
    ->lockForUpdate()
    ->get();
```

### Auditoria Completa

Todas as transações geram logs em `transaction_logs`:

- Estado anterior
- Estado novo
- Tipo de evento
- IP do usuário
- User agent
- Mensagens de erro (se houver)

## Fluxo de Status

```text
PROCESSING → COMPLETED (sucesso)
           → FAILED (erro)
           → REVERSED (estornado)
```

## Códigos de Transação

Formato: `TXN-{RANDOM}-{TIMESTAMP}`

Exemplo: `TXN-A7K2M9P4Q1-20251117143052`

## Limites e Restrições

| Campo | Mínimo | Máximo |
|-------|--------|--------|
| Valor | R$ 0,01 | R$ 999.999,99 |
| Descrição | - | 500 caracteres |
| Motivo de Reversão | - | 1.000 caracteres |

## Erros Comuns

### 1. Saldo Insuficiente (422)

```json
{
  "message": "Transfer failed",
  "error": "Insufficient balance. Available: 50,75 BRL, Required: 100,50 BRL"
}
```

**Solução:** Verificar saldo antes de transferir.

### 2. Valor Inválido (422)

```json
{
  "message": "The amount field must be at least 0.01"
}
```

**Solução:** Garantir que o valor seja positivo e maior que zero.

### 3. Destinatário Não Encontrado (422)

```json
{
  "message": "The selected receiver email is invalid"
}
```

**Solução:** Verificar se o email do destinatário está correto.

### 4. Transferência para Si Mesmo (422)

```json
{
  "message": "The receiver email field and auth user email must be different"
}
```

**Solução:** Usar email de um destinatário diferente.

## Testes Implementados

### Depósito

- ✅ Cria transação corretamente
- ✅ Atualiza saldo da carteira
- ✅ Funciona com saldo negativo
- ✅ Rejeita valor negativo
- ✅ Rejeita valor zero

### Transferência

- ✅ Valida saldo insuficiente
- ✅ Mostra erro detalhado de saldo
- ✅ Atualiza ambas as carteiras

### Reversão

- ✅ Funciona mesmo com saldo insuficiente
- ✅ Permite reversão de depósito
- ✅ Permite reversão de transferência
- ✅ Permite saldo negativo após reversão

## Exemplo de Uso via API

### Depósito endpoint

```bash
POST /api/v1/transactions/deposit
{
  "amount": 100.50,
  "description": "Recarga de saldo"
}
```

### Transferência endpoint

```bash
POST /api/v1/transactions/transfer
{
  "receiver_email": "maria@example.com",
  "amount": 50.00,
  "description": "Pagamento"
}
```

### Reversão endpoint

```bash
POST /api/v1/transactions/{transaction_id}/reverse
{
  "reason": "Transação duplicada - solicitação do usuário"
}
```

## Conclusão

As regras implementadas garantem:

1. **Flexibilidade:** Depósitos funcionam mesmo com saldo negativo
2. **Segurança:** Transferências validam saldo disponível
3. **Reversibilidade:** Todas as transações podem ser estornadas
4. **Integridade:** Sistema permite investigação de inconsistências através de reversões
5. **Auditoria:** Logs completos de todas as operações

Estas regras foram projetadas para balancear segurança financeira com flexibilidade operacional, garantindo que o sistema possa se recuperar de qualquer inconsistência.
