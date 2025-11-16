#!/bin/bash

# Script para testar Hot Module Replacement (HMR)
# Uso: ./scripts/test-hmr.sh

echo "🔥 Testando Hot Module Replacement (HMR)"
echo ""
echo "📝 Instruções:"
echo "1. Abra http://localhost:3000 no navegador"
echo "2. Abra o Console do navegador (F12)"
echo "3. Este script fará uma pequena alteração no código"
echo "4. Observe se o navegador recarrega automaticamente"
echo ""

# Aguardar confirmação
read -p "Pressione ENTER quando estiver pronto..." 

# Fazer backup do arquivo
BACKUP_FILE="/tmp/DashboardHeader.tsx.backup"
TARGET_FILE="./frontend/src/components/dashboard/DashboardHeader.tsx"

cp "$TARGET_FILE" "$BACKUP_FILE"

echo ""
echo "✏️  Fazendo alteração no DashboardHeader..."

# Fazer uma pequena alteração visível
sed -i 's/Carteira Digital/Carteira Digital 🔥 HMR Test/' "$TARGET_FILE"

echo "✅ Alteração feita!"
echo ""
echo "👀 Verifique o navegador:"
echo "   - O texto 'Carteira Digital' deve mudar para 'Carteira Digital 🔥 HMR Test'"
echo "   - No console do navegador deve aparecer: [vite] hmr update"
echo ""

# Aguardar 5 segundos
sleep 5

echo "🔄 Revertendo alteração..."
mv "$BACKUP_FILE" "$TARGET_FILE"

echo "✅ Teste concluído!"
echo ""
echo "📊 Resultados esperados:"
echo "   ✅ HMR funcionando: A mudança apareceu sem recarregar a página"
echo "   ❌ HMR não funcionando: A página não mudou ou recarregou completamente"
echo ""
echo "📋 Logs do container:"
docker compose logs frontend --tail 10 | grep -E "(vite|hmr)"
