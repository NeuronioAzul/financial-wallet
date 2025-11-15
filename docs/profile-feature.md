# Feature: Tela de Perfil do Usuário

## ✅ Status: IMPLEMENTADO

Todas as funcionalidades de perfil, endereços e documentos foram implementadas e testadas.

## Requisitos

### Dados do Perfil

- Exibir informações do usuário (nome, email, CPF, telefone)
- Edição de dados pessoais

### Cadastro de Endereço

- CEP
- Logradouro
- Número
- Complemento
- Bairro
- Cidade
- Estado
- País (padrão: Brasil)

### Upload de Documentos para Validação

- Foto (selfie)
- RG (frente e verso) OU CNH (frente e verso)
- Status de validação dos documentos

## Estrutura de Dados

### Tabela: addresses

- id (UUID v7)
- user_id (UUID v7, FK)
- zip_code (CEP)
- street (logradouro)
- number
- complement (opcional)
- neighborhood (bairro)
- city
- state (UF)
- country (padrão: Brazil)
- is_primary (boolean)
- created_at
- updated_at

### Tabela: user_documents

- id (UUID v7)
- user_id (UUID v7, FK)
- document_type (enum: photo, rg_front, rg_back, cnh_front, cnh_back)
- file_path (caminho do arquivo)
- file_name (nome original)
- mime_type
- size (em bytes)
- status (enum: pending, approved, rejected)
- rejection_reason (texto, nullable)
- verified_at (timestamp, nullable)
- verified_by (UUID v7, FK para admin user, nullable)
- created_at
- updated_at

## Endpoints da API

### Perfil

- GET /api/v1/profile - Exibir perfil completo
- PUT /api/v1/profile - Atualizar dados pessoais

### Endereços

- GET /api/v1/addresses - Listar endereços
- POST /api/v1/addresses - Criar endereço
- GET /api/v1/addresses/{id} - Exibir endereço
- PUT /api/v1/addresses/{id} - Atualizar endereço
- DELETE /api/v1/addresses/{id} - Remover endereço

### Documentos

- GET /api/v1/documents - Listar documentos enviados
- POST /api/v1/documents - Upload de documento
- GET /api/v1/documents/{id} - Exibir documento
- DELETE /api/v1/documents/{id} - Remover documento
- GET /api/v1/documents/status - Status de validação

## Validações

### Endereço

- CEP: formato brasileiro (8 dígitos)
- Estado: UF válida (2 caracteres)
- Campos obrigatórios: zip_code, street, number, neighborhood, city, state

### Documentos
- Formatos aceitos: JPG, JPEG, PNG, PDF
- Tamanho máximo: 5MB por arquivo
- Obrigatório: foto + (RG completo OU CNH completo)
- Validação automática: aguardar aprovação manual

## Armazenamento de Arquivos
- Local: storage/app/private/documents/{user_id}/
- Estrutura: {document_type}_{timestamp}.{ext}
- Acesso: apenas usuário autenticado (próprios documentos) ou admin
