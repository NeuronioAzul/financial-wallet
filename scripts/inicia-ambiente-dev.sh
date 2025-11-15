#!/bin/bash

# ===================================
# Financial Wallet - Setup Script
# Inicializa o ambiente de desenvolvimento
# ===================================

set -e

echo "🚀 Financial Wallet - Iniciando ambiente de desenvolvimento..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se está na raiz do projeto
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}❌ Erro: Execute este script da raiz do projeto${NC}"
    exit 1
fi

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não está instalado${NC}"
    echo "Instale Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose não está instalado${NC}"
    echo "Instale Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

# Criar arquivo .env se não existir
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Criando arquivo .env...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Arquivo .env criado${NC}"
else
    echo -e "${GREEN}✅ Arquivo .env já existe${NC}"
fi

# Configurar UID e GID no .env
echo -e "${YELLOW}🔧 Configurando UID e GID...${NC}"
export UID=$(id -u)
export GID=$(id -g)
sed -i "s/^UID=.*/UID=${UID}/" .env
sed -i "s/^GID=.*/GID=${GID}/" .env
echo -e "${GREEN}✅ UID=${UID} GID=${GID}${NC}"

# Parar containers existentes
echo -e "${YELLOW}🛑 Parando containers existentes...${NC}"
docker compose down 2>/dev/null || true

# Construir imagens
echo -e "${YELLOW}🏗️  Construindo imagens Docker...${NC}"
docker compose build --no-cache

# Iniciar serviços
echo -e "${YELLOW}🚀 Iniciando serviços...${NC}"
docker compose up -d

# Aguardar banco de dados
echo -e "${YELLOW}⏳ Aguardando PostgreSQL inicializar...${NC}"
sleep 10

# Verificar se o banco está pronto
until docker compose exec -T postgres pg_isready -U postgres &>/dev/null; do
    echo -e "${YELLOW}⏳ Aguardando PostgreSQL...${NC}"
    sleep 2
done
echo -e "${GREEN}✅ PostgreSQL pronto${NC}"

# Verificar se o schema foi aplicado
echo -e "${YELLOW}🗄️  Verificando schema do banco...${NC}"
TABLES_COUNT=$(docker compose exec -T postgres psql -U postgres -d financial_wallet -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | xargs)

if [ "$TABLES_COUNT" -gt "0" ]; then
    echo -e "${GREEN}✅ Schema do banco aplicado com sucesso (${TABLES_COUNT} tabelas)${NC}"
else
    echo -e "${RED}❌ Erro ao aplicar schema do banco${NC}"
    exit 1
fi

# Resumo
echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ Ambiente inicializado com sucesso!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "📊 ${YELLOW}Serviços disponíveis:${NC}"
echo -e "   🗄️  PostgreSQL:  ${GREEN}localhost:5432${NC}"
echo -e "   🔧 Backend API:  ${GREEN}http://localhost:8000${NC}"
echo -e "   🎨 Frontend:     ${GREEN}http://localhost:3000${NC}"
echo -e "   📖 Swagger:      ${GREEN}http://localhost:8080${NC}"
echo ""
echo -e "📝 ${YELLOW}Comandos úteis:${NC}"
echo -e "   docker compose logs -f          # Ver logs"
echo -e "   docker compose ps               # Status dos containers"
echo -e "   docker compose down             # Parar tudo"
echo -e "   docker compose restart          # Reiniciar"
echo ""
echo -e "🧪 ${YELLOW}Usuários de teste:${NC}"
echo -e "   📧 joao@example.com   | 🔑 password"
echo -e "   📧 maria@example.com  | 🔑 password"
echo ""
echo -e "${GREEN}🎉 Ambiente pronto para desenvolvimento!${NC}"
