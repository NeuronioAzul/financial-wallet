# Test Fixtures - Adriano Cobuccio

## Estrutura

```
tests/
├── Fixtures/
│   └── files/
│       ├── images/          # Imagens válidas para upload
│       │   ├── test-photo.jpg
│       │   └── test-photo.png
│       ├── documents/       # Documentos válidos (RG, CNH)
│       │   ├── test-document.pdf
│       │   ├── test-rg-front.jpg
│       │   ├── test-rg-back.jpg
│       │   ├── test-cnh-front.jpg
│       │   └── test-cnh-back.jpg
│       └── invalid/         # Arquivos inválidos para testes negativos
│           ├── not-an-image.txt
│           └── not-a-pdf.pdf
```

## Fixtures Criados

### Imagens Válidas
- **test-photo.jpg** (140 bytes): JPEG mínimo válido 1x1 pixel
- **test-photo.png** (67 bytes): PNG mínimo válido 1x1 pixel transparente

### Documentos Válidos
- **test-document.pdf** (312 bytes): PDF mínimo válido
- **test-rg-front.jpg**: Cópia do test-photo.jpg para testes de RG frente
- **test-rg-back.jpg**: Cópia do test-photo.jpg para testes de RG verso
- **test-cnh-front.jpg**: Cópia do test-photo.jpg para testes de CNH frente
- **test-cnh-back.jpg**: Cópia do test-photo.jpg para testes de CNH verso

### Arquivos Inválidos
- **not-an-image.txt**: Arquivo de texto para testar validação de formato
- **not-a-pdf.pdf**: Arquivo com extensão PDF mas conteúdo inválido

## Uso nos Testes PHPUnit

### Exemplo de Upload com Fixture

```php
use Illuminate\Http\UploadedFile;

private function getFixturePath(string $filename): string
{
    return __DIR__ . '/../Fixtures/files/' . $filename;
}

private function createUploadedFile(string $fixturePath): UploadedFile
{
    return new UploadedFile(
        $fixturePath,
        basename($fixturePath),
        mime_content_type($fixturePath),
        null,
        true // test mode
    );
}

public function test_upload_document(): void
{
    Storage::fake('local');
    $user = User::factory()->create();
    
    $file = $this->createUploadedFile(
        $this->getFixturePath('images/test-photo.jpg')
    );
    
    $response = $this->actingAs($user, 'sanctum')
        ->postJson('/api/v1/documents', [
            'document_type' => 'photo',
            'file' => $file,
        ]);
    
    $response->assertStatus(201);
}
```

## Status dos Testes

### ✅ PHPUnit com PostgreSQL (RESOLVIDO!)
- **Problema anterior**: RefreshDatabase não funcionava com SQLite :memory:
- **Solução aplicada**: Configurado PostgreSQL para testes
- **Banco de testes**: `financial_wallet_test` (separado da produção)
- **Configuração**: `phpunit.xml` usa conexão `pgsql_testing`
- **Resultado**: 8/8 testes passando em DocumentUploadTest

### ✅ Validação HTTP (scripts/test-api.sh)
- **25/25 testes passando**
- Cobre todos os endpoints da API
- Usa fixtures PDF reais
- Validação completa end-to-end

## Testes Implementados

### DocumentUploadTest.php
1. ✓ `test_can_upload_photo_document` - Upload de foto
2. ✓ `test_can_upload_pdf_document` - Upload de PDF
3. ✓ `test_cannot_upload_invalid_file_format` - Validação de formato
4. ✓ `test_cannot_upload_without_authentication` - Sem autenticação
5. ✓ `test_requires_document_type` - Campo obrigatório document_type
6. ✓ `test_requires_file` - Campo obrigatório file
7. ✓ `test_can_list_user_documents` - Listagem de documentos
8. ✓ `test_can_get_document_validation_status` - Status de validação

### Observações
- Fixtures são versionados no Git
- Arquivos mínimos reduzem tamanho do repositório
- Sempre disponíveis para CI/CD
- Formatos válidos conforme validação da API (JPG, JPEG, PNG, PDF max 5MB)

## Comandos Úteis

### Executar testes com fixtures
```bash
docker-compose exec backend php vendor/bin/phpunit tests/Feature/DocumentUploadTest.php --testdox
```

### Executar validação HTTP completa
```bash
bash scripts/test-api.sh
```

### Listar fixtures
```bash
ls -lh backend/tests/Fixtures/files/{images,documents,invalid}/
```

## Próximos Passos

1. ~~Criar estrutura de diretórios~~ ✅
2. ~~Gerar arquivos fixtures mínimos~~ ✅
3. ~~Implementar testes com UploadedFile~~ ✅
4. Resolver problema RefreshDatabase (investigação futura)
5. Manter HTTP tests como validação principal
