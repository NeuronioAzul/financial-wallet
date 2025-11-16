# Configuração Backend - Upload de Documentos

## Resumo das Alterações

### 1. Tipos de Documento (DocumentType Enum)

**Arquivo:** `backend/app/Enums/DocumentType.php`

Adicionados novos tipos de documento:
- `rg` - RG
- `cnh` - CNH  
- `cpf` - CPF
- `comprovante_residencia` - Comprovante de Residência
- `cartao_credito` - Cartão de Crédito
- `outros` - Outros

Mantidos tipos antigos para compatibilidade:
- `photo`, `rg_front`, `rg_back`, `cnh_front`, `cnh_back`

### 2. Migration Atualizada

**Arquivo:** `backend/database/migrations/2025_11_15_203730_create_user_documents_table.php`

Coluna `document_type` agora aceita todos os novos tipos de documento.

**⚠️ IMPORTANTE:** Foi executado `migrate:fresh --seed` para aplicar as mudanças.

### 3. Validação de Upload

**Arquivo:** `backend/app/Http/Requests/UploadDocumentRequest.php`

**Mudanças:**
- Campo alterado de `document_type` para `type` (compatível com frontend)
- Removida validação de unicidade (permite múltiplos documentos do mesmo tipo)
- Mantidas validações de:
  - Tipo de arquivo: JPG, JPEG, PNG, PDF
  - Tamanho máximo: 5MB

### 4. Controller - Download de Documentos

**Arquivo:** `backend/app/Http/Controllers/Api/DocumentController.php`

**Novo método adicionado:**
```php
public function download(UserDocument $document): StreamedResponse
{
    $this->authorize('view', $document);
    
    if (!Storage::exists($document->file_path)) {
        abort(404, 'File not found');
    }
    
    return Storage::download($document->file_path, $document->file_name);
}
```

### 5. Model - URL de Download

**Arquivo:** `backend/app/Models/UserDocument.php`

**Adicionado accessor:**
```php
protected $appends = ['file_url'];

public function getFileUrlAttribute(): ?string
{
    if (!$this->file_path) {
        return null;
    }
    
    return url("/api/v1/documents/{$this->id}/download");
}
```

Agora todos os documentos retornam automaticamente o campo `file_url` na resposta JSON.

### 6. Rotas

**Arquivo:** `backend/routes/api.php`

**Nova rota adicionada:**
```php
Route::get('/documents/{document}/download', [DocumentController::class, 'download']);
```

**Rotas disponíveis:**
- `GET /api/v1/documents` - Listar documentos do usuário
- `POST /api/v1/documents` - Upload de documento
- `GET /api/v1/documents/status` - Status de verificação
- `GET /api/v1/documents/{document}` - Detalhes do documento
- `GET /api/v1/documents/{document}/download` - Download do arquivo
- `DELETE /api/v1/documents/{document}` - Excluir documento

### 7. Storage

**Diretório criado:**
```bash
storage/app/documents/
```

Arquivos são salvos em: `storage/app/documents/{user_id}/{tipo}_{timestamp}.{ext}`

### 8. Testes

**Arquivo:** `backend/tests/Feature/DocumentUploadTest.php`

Atualizado para usar `type` ao invés de `document_type`.

**Resultado dos testes:**
```
✓ can upload photo document
✓ can upload pdf document
✓ cannot upload invalid file format
✓ cannot upload without authentication
✓ requires document type
✓ requires file
✓ can list user documents
✓ can get document validation status

Tests: 8 passed (30 assertions)
```

## Contrato da API

### POST /api/v1/documents

**Request:**
```json
{
  "type": "rg|cnh|cpf|comprovante_residencia|cartao_credito|outros",
  "file": "<binary>"
}
```

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer {token}
```

**Response (201):**
```json
{
  "message": "Document uploaded successfully",
  "data": {
    "id": "uuid",
    "document_type": "rg",
    "file_name": "documento.pdf",
    "file_path": "documents/{user_id}/rg_20251116123456.pdf",
    "mime_type": "application/pdf",
    "size": 123456,
    "status": "pending",
    "file_url": "http://localhost:8000/api/v1/documents/{uuid}/download",
    "created_at": "2025-11-16T12:34:56.000000Z",
    "updated_at": "2025-11-16T12:34:56.000000Z"
  }
}
```

### GET /api/v1/documents

**Response (200):**
```json
{
  "message": "Documents retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "document_type": "rg",
      "file_name": "documento.pdf",
      "status": "pending",
      "file_url": "http://localhost:8000/api/v1/documents/{uuid}/download",
      "created_at": "2025-11-16T12:34:56.000000Z"
    }
  ]
}
```

### DELETE /api/v1/documents/{document}

**Response (200):**
```json
{
  "message": "Document deleted successfully"
}
```

### GET /api/v1/documents/{document}/download

**Response:**
- Status 200 com stream do arquivo
- Headers: `Content-Disposition: attachment; filename="documento.pdf"`

## Segurança

- ✅ Autenticação obrigatória (Sanctum)
- ✅ Policy: usuário só pode ver/deletar seus próprios documentos
- ✅ Validação de tipo de arquivo (JPG, JPEG, PNG, PDF)
- ✅ Validação de tamanho (máx 5MB)
- ✅ Arquivos armazenados fora do public (storage/app)
- ✅ Download via endpoint protegido com autorização

## Integração Frontend

O frontend está totalmente compatível:
- Envia campo `type` (compatível com backend)
- Tipos de documento correspondem aos enums do backend
- Validação no frontend espelha validação do backend
- Campo `file_url` é usado para download de documentos

## Comandos de Manutenção

```bash
# Limpar cache
docker compose exec backend php artisan optimize:clear

# Verificar permissões do storage
docker compose exec backend ls -la storage/app/documents

# Executar testes
docker compose exec backend php artisan test --filter=DocumentUploadTest

# Ver rotas de documentos
docker compose exec backend php artisan route:list --path=documents
```

## Próximos Passos (Opcional)

1. **Verificação de documentos:** Adicionar endpoint para admin aprovar/rejeitar
2. **Notificações:** Avisar usuário quando documento for aprovado/rejeitado
3. **Preview:** Gerar thumbnails para imagens
4. **Assinatura:** Usar signed URLs para downloads mais seguros em produção
5. **Compressão:** Comprimir imagens automaticamente ao fazer upload
