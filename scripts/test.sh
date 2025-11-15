#!/bin/bash

# ===================================
# Financial Wallet - Test Runner
# Executa todos os testes do projeto
# ===================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🧪 Financial Wallet - Executando testes...${NC}"
echo ""

BACKEND_PASSED=true
FRONTEND_PASSED=true

# Testes do Backend
echo -e "${YELLOW}🔧 Executando testes do Backend...${NC}"
if docker compose exec -T backend php artisan test --parallel; then
    echo -e "${GREEN}✅ Backend: Todos os testes passaram${NC}"
else
    echo -e "${RED}❌ Backend: Alguns testes falharam${NC}"
    BACKEND_PASSED=false
fi
echo ""

# Testes do Frontend
echo -e "${YELLOW}🎨 Executando testes do Frontend...${NC}"
if docker compose exec -T frontend npm test; then
    echo -e "${GREEN}✅ Frontend: Todos os testes passaram${NC}"
else
    echo -e "${RED}❌ Frontend: Alguns testes falharam${NC}"
    FRONTEND_PASSED=false
fi
echo ""

# Resumo
echo -e "${YELLOW}================================${NC}"
if [ "$BACKEND_PASSED" = true ] && [ "$FRONTEND_PASSED" = true ]; then
    echo -e "${GREEN}✅ Todos os testes passaram!${NC}"
    exit 0
else
    echo -e "${RED}❌ Alguns testes falharam${NC}"
    exit 1
fi
