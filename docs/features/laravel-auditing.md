# Laravel Auditing - Implementação

## Resumo

Foi implementado o sistema de auditoria completo usando o pacote `owen-it/laravel-auditing` (v14.0.0) para rastrear todas as interações dos usuários com os modelos do sistema.

## Backend (Laravel 12)

### Instalação e Configuração

1. **Pacote instalado:**
   ```bash
   composer require owen-it/laravel-auditing
   ```

2. **Publicação de arquivos:**
   - Config: `config/audit.php`
   - Migration: `database/migrations/2025_11_17_080242_create_audits_table.php`

3. **Migration customizada para UUID:**
   A migration foi modificada para suportar UUIDs em vez de BigIntegers:
   - `user_id`: uuid
   - `auditable_id`: uuid

### Models com Auditoria

Os seguintes models foram configurados para usar auditoria:

1. **User** (`app/Models/User.php`)
2. **Wallet** (`app/Models/Wallet.php`)
3. **Transaction** (`app/Models/Transaction.php`)

Cada model implementa:
- Interface: `OwenIt\Auditing\Contracts\Auditable`
- Trait: `\OwenIt\Auditing\Auditable`

### API Endpoints

**Controller:** `app/Http/Controllers/Api/AuditController.php`

**Rotas (autenticadas):**
```
GET /api/v1/audits              - Lista auditorias paginadas do usuário
GET /api/v1/audits/{id}         - Detalhes de uma auditoria específica
```

**Parâmetros:**
- `per_page`: quantidade por página (padrão: 15)
- `page`: número da página

**Resposta:**
```json
{
  "data": [
    {
      "id": 1,
      "user_id": "uuid",
      "event": "created|updated|deleted|restored",
      "auditable_type": "App\\Models\\User",
      "auditable_id": "uuid",
      "old_values": {},
      "new_values": {},
      "url": "http://...",
      "ip_address": "127.0.0.1",
      "user_agent": "Mozilla/5.0...",
      "created_at": "2025-11-17T08:09:08.000000Z",
      "user": {
        "id": "uuid",
        "name": "Nome",
        "email": "email@example.com"
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 73,
    "from": 1,
    "to": 15
  },
  "links": {
    "first": "url",
    "last": "url",
    "prev": null,
    "next": "url"
  }
}
```

### Seeder de Teste

**Arquivo:** `database/seeders/AuditSeeder.php`

Cria logs de auditoria de exemplo para testes:
- Criação de usuários
- Atualizações de perfil
- Acesso a carteiras

**Executar:**
```bash
docker compose exec backend php artisan db:seed --class=AuditSeeder
```

## Frontend (React + TypeScript)

### Service de API

**Arquivo:** `frontend/src/services/audit.ts`

**Funções:**
- `getAuditLogs(page, perPage)` - Lista paginada de auditorias
- `getAuditLog(id)` - Detalhes de uma auditoria

**Tipos TypeScript:**
- `AuditLog` - Interface do log de auditoria
- `AuditPaginationMeta` - Metadados de paginação
- `AuditListResponse` - Resposta da lista

### Página de Auditoria

**Arquivo:** `frontend/src/pages/AuditLogs.tsx`

**Funcionalidades:**
- Tabela paginada de logs
- Filtros visuais por tipo de evento (created, updated, deleted)
- Modal de detalhes com:
  - Valores antigos (old_values)
  - Valores novos (new_values)
  - Informações de IP, User Agent, URL
- Paginação completa (primeira, anterior, próxima, última)
- Design responsivo com Ocean Blue theme

**Rota:**
```
/audit-logs (protegida por autenticação)
```

### Navegação

Adicionado link no menu de usuário (`DashboardHeader`):
- Ícone: FileText (lucide-react)
- Label: "Logs de Auditoria"
- Rota: `/audit-logs`

## Características da Implementação

### Segurança
- ✅ Apenas logs do próprio usuário são exibidos
- ✅ Rotas protegidas por autenticação Sanctum
- ✅ UUIDs v7 para IDs não sequenciais

### Performance
- ✅ Paginação no backend e frontend
- ✅ Eager loading do relacionamento `user`
- ✅ Índices na tabela de audits

### Usabilidade
- ✅ Interface intuitiva com cores por tipo de evento
- ✅ Modal de detalhes para informações completas
- ✅ Formatação de datas em português (pt-BR)
- ✅ Exibição de diferenças entre old_values e new_values

## Eventos Rastreados

O sistema automaticamente registra:

1. **created** - Quando um registro é criado
2. **updated** - Quando um registro é atualizado
3. **deleted** - Quando um registro é excluído (soft delete)
4. **restored** - Quando um registro é restaurado

## Dados Capturados

Para cada evento, o sistema registra:
- Usuário responsável pela ação
- Tipo e ID do modelo afetado
- Valores antigos e novos
- URL da requisição
- Endereço IP
- User Agent do navegador
- Timestamp da ação

## Como Testar

### Backend (API)

1. **Fazer login:**
```bash
curl -X POST http://localhost:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"password"}'
```

2. **Listar auditorias:**
```bash
curl -X GET "http://localhost:8000/api/v1/audits?per_page=5" \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Accept: application/json"
```

### Frontend

1. Acessar: http://localhost:3000
2. Fazer login com:
   - Email: `joao@example.com` ou `maria@example.com`
   - Senha: `password`
3. Clicar no menu de usuário (canto superior direito)
4. Selecionar "Logs de Auditoria"
5. Visualizar a tabela paginada
6. Clicar em "Ver Detalhes" para ver informações completas

## Próximos Passos (Opcional)

- [ ] Adicionar filtros por tipo de evento
- [ ] Adicionar filtros por modelo (User, Wallet, Transaction)
- [ ] Adicionar busca por data
- [ ] Exportar logs em CSV/PDF
- [ ] Dashboard com estatísticas de auditoria
- [ ] Configurar limpeza automática de logs antigos
- [ ] Adicionar auditoria para outros models (Address, UserDocument, etc.)

## Arquivos Criados/Modificados

### Backend
- ✅ `app/Http/Controllers/Api/AuditController.php` (novo)
- ✅ `database/seeders/AuditSeeder.php` (novo)
- ✅ `database/migrations/2025_11_17_080242_create_audits_table.php` (modificado)
- ✅ `app/Models/User.php` (modificado)
- ✅ `app/Models/Wallet.php` (modificado)
- ✅ `app/Models/Transaction.php` (modificado)
- ✅ `routes/api.php` (modificado)
- ✅ `config/audit.php` (novo)

### Frontend
- ✅ `src/services/audit.ts` (novo)
- ✅ `src/pages/AuditLogs.tsx` (novo)
- ✅ `src/App.tsx` (modificado)
- ✅ `src/components/dashboard/DashboardHeader.tsx` (modificado)

## Padrão de Commits

Commits seguindo o padrão Airbnb:
```
feat(audit): add laravel-auditing package and configuration
feat(audit): add audit api endpoints with pagination
feat(audit): add audit logs frontend page
feat(audit): add audit logs navigation link
```
