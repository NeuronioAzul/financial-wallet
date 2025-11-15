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

# 3. GET PROFILE (NEW)
echo "3. GET PROFILE"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq
echo ""

# 4. UPDATE PROFILE (NEW)
echo "4. UPDATE PROFILE"
echo "----------------------------------------"
curl -s -X PUT "$BASE_URL/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"phone":"11987654321"}' | jq
echo ""

# 5. CREATE ADDRESS (NEW)
echo "5. CREATE ADDRESS"
echo "----------------------------------------"
ADDRESS_RESPONSE=$(curl -s -X POST "$BASE_URL/addresses" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "zip_code":"01310100",
    "street":"Avenida Paulista",
    "number":"1578",
    "complement":"Apto 101",
    "neighborhood":"Bela Vista",
    "city":"São Paulo",
    "state":"SP",
    "is_primary":true
  }')

echo "$ADDRESS_RESPONSE" | jq
ADDRESS_ID=$(echo "$ADDRESS_RESPONSE" | jq -r '.data.id')
echo ""
echo "Address ID: $ADDRESS_ID"
echo ""

# 6. LIST ADDRESSES (NEW)
echo "6. LIST ADDRESSES"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/addresses" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq
echo ""

# 7. GET ADDRESS DETAIL (NEW)
echo "7. GET ADDRESS DETAIL"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/addresses/$ADDRESS_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq
echo ""

# 8. UPDATE ADDRESS (NEW)
echo "8. UPDATE ADDRESS"
echo "----------------------------------------"
curl -s -X PUT "$BASE_URL/addresses/$ADDRESS_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"complement":"Apto 102"}' | jq
echo ""

# 9. GET WALLET
echo "9. GET WALLET"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/wallet" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq
echo ""

# 10. GET BALANCE
echo "10. GET BALANCE"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/wallet/balance" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq
echo ""

# 11. DEPOSIT
echo "11. DEPOSIT (R$ 500.00)"
echo "----------------------------------------"
curl -s -X POST "$BASE_URL/transactions/deposit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":500.00}' | jq
echo ""

# 12. GET BALANCE AFTER DEPOSIT
echo "12. GET BALANCE AFTER DEPOSIT"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/wallet/balance" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq
echo ""

# 13. TRANSFER TO MARIA
echo "13. TRANSFER TO MARIA (R$ 200.00)"
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

# 14. GET BALANCE AFTER TRANSFER
echo "14. GET BALANCE AFTER TRANSFER"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/wallet/balance" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq
echo ""

# 15. LIST TRANSACTIONS
echo "15. LIST TRANSACTIONS"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/transactions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq
echo ""

# 16. GET TRANSACTION DETAIL
echo "16. GET TRANSACTION DETAIL"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/transactions/$TRANSACTION_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq
echo ""

# 17. REVERSE TRANSACTION
echo "17. REVERSE TRANSACTION"
echo "----------------------------------------"
curl -s -X POST "$BASE_URL/transactions/$TRANSACTION_ID/reverse" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Teste de estorno"}' | jq
echo ""

# 18. GET BALANCE AFTER REVERSE
echo "18. GET BALANCE AFTER REVERSE"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/wallet/balance" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq
echo ""

# 19. UPLOAD DOCUMENT - PHOTO (NEW)
echo "19. UPLOAD DOCUMENT - PHOTO"
echo "----------------------------------------"
# Criar arquivo PDF mínimo válido
printf '%%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n149\n%%%%EOF' > /tmp/test_photo.pdf

DOC_RESPONSE=$(curl -s -X POST "$BASE_URL/documents" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -F "document_type=photo" \
  -F "file=@/tmp/test_photo.pdf")

echo "$DOC_RESPONSE" | jq
DOCUMENT_ID=$(echo "$DOC_RESPONSE" | jq -r '.data.id')
echo ""
echo "Document ID: $DOCUMENT_ID"
echo ""

# 20. LIST DOCUMENTS (NEW)
echo "20. LIST DOCUMENTS"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/documents" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq
echo ""

# 21. GET DOCUMENT STATUS (NEW)
echo "21. GET DOCUMENT STATUS"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/documents/status" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq
echo ""

# 22. DELETE ADDRESS (NEW)
echo "22. DELETE ADDRESS"
echo "----------------------------------------"
curl -s -X DELETE "$BASE_URL/addresses/$ADDRESS_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq
echo ""

# 23. DELETE DOCUMENT (NEW)
echo "23. DELETE DOCUMENT"
echo "----------------------------------------"
curl -s -X DELETE "$BASE_URL/documents/$DOCUMENT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq
echo ""
# Limpar arquivo temporário
rm -f /tmp/test_photo.pdf

# 24. LOGOUT
echo "24. LOGOUT"
echo "----------------------------------------"
curl -s -X POST "$BASE_URL/logout" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq
echo ""

# 25. REGISTER NEW USER
echo "25. REGISTER NEW USER (Pedro)"
echo "----------------------------------------"
# Gerar timestamp para email e documento únicos
TIMESTAMP=$(date +%s)
# Gerar CPF baseado no timestamp (11 dígitos)
CPF=$(printf "%011d" $((TIMESTAMP % 100000000000)))
curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{
    \"name\":\"Pedro Santos\",
    \"email\":\"pedro${TIMESTAMP}@example.com\",
    \"password\":\"password123\",
    \"password_confirmation\":\"password123\",
    \"document\":\"${CPF}\",
    \"phone\":\"21987654321\"
  }" | jq
echo ""

echo "=========================================="
echo "   Testes concluídos!"
echo "   Total: 25 endpoints testados"
echo "   - Profile: 2 endpoints"
echo "   - Addresses: 5 endpoints"
echo "   - Documents: 4 endpoints"
echo "   - Wallet: 2 endpoints"
echo "   - Transactions: 5 endpoints"
echo "   - Auth: 4 endpoints"
echo "=========================================="
