#!/bin/bash

# Financial Wallet API - Test Script
# Testa todos os endpoints da API

BASE_URL="http://localhost:8000/api/v1"

echo "=========================================="
echo "   Financial Wallet API - Test Suite"
echo "=========================================="
echo ""

# 1. LOGIN - João
echo "1. LOGIN (João)"
echo "----------------------------------------"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"password"}')

echo "$LOGIN_RESPONSE" | jq
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')
echo ""
echo "Token obtido: ${TOKEN:0:50}..."
echo ""

# 2. GET USER INFO
echo "2. GET USER INFO (/me)"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq
echo ""

# 3. GET WALLET
echo "3. GET WALLET"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/wallet" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq
echo ""

# 4. GET BALANCE
echo "4. GET BALANCE"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/wallet/balance" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq
echo ""

# 5. DEPOSIT
echo "5. DEPOSIT (R$ 500.00)"
echo "----------------------------------------"
curl -s -X POST "$BASE_URL/transactions/deposit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":500.00}' | jq
echo ""

# 6. GET BALANCE AFTER DEPOSIT
echo "6. GET BALANCE AFTER DEPOSIT"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/wallet/balance" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq
echo ""

# 7. TRANSFER TO MARIA
echo "7. TRANSFER TO MARIA (R$ 200.00)"
echo "----------------------------------------"
TRANSFER_RESPONSE=$(curl -s -X POST "$BASE_URL/transactions/transfer" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"receiver_email":"maria@example.com","amount":200.00}')

echo "$TRANSFER_RESPONSE" | jq
TRANSACTION_ID=$(echo "$TRANSFER_RESPONSE" | jq -r '.data.transaction_id')
echo ""
echo "Transaction ID: $TRANSACTION_ID"
echo ""

# 8. GET BALANCE AFTER TRANSFER
echo "8. GET BALANCE AFTER TRANSFER"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/wallet/balance" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq
echo ""

# 9. LIST TRANSACTIONS
echo "9. LIST TRANSACTIONS"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/transactions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq
echo ""

# 10. GET TRANSACTION DETAIL
echo "10. GET TRANSACTION DETAIL"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/transactions/$TRANSACTION_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq
echo ""

# 11. REVERSE TRANSACTION
echo "11. REVERSE TRANSACTION"
echo "----------------------------------------"
curl -s -X POST "$BASE_URL/transactions/$TRANSACTION_ID/reverse" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Teste de estorno"}' | jq
echo ""

# 12. GET BALANCE AFTER REVERSE
echo "12. GET BALANCE AFTER REVERSE"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/wallet/balance" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq
echo ""

# 13. LOGOUT
echo "13. LOGOUT"
echo "----------------------------------------"
curl -s -X POST "$BASE_URL/logout" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq
echo ""

# 14. REGISTER NEW USER
echo "14. REGISTER NEW USER (Pedro)"
echo "----------------------------------------"
curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name":"Pedro Santos",
    "email":"pedro@example.com",
    "password":"password123",
    "password_confirmation":"password123",
    "document":"32165498701",
    "phone":"21987654321"
  }' | jq
echo ""

echo "=========================================="
echo "   Testes concluídos!"
echo "=========================================="
