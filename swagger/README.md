# API Documentation - Swagger UI

Documentação interativa da API Financial Wallet usando Swagger UI.

## 📚 Visão Geral

A documentação da API está disponível através do Swagger UI, uma interface interativa que permite:

- Visualizar todos os endpoints disponíveis
- Testar requisições diretamente pelo navegador
- Ver exemplos de requisições e respostas
- Entender os schemas de dados
- Testar autenticação com tokens

## 🚀 Acesso

### Desenvolvimento Local

```bash
# Acesse o Swagger UI em:
http://localhost:8080
```

O container Swagger já está configurado no `docker-compose.yml` e será iniciado automaticamente com:

```bash
docker compose up -d
```

## 🔐 Como Usar com Autenticação

A maioria dos endpoints requer autenticação via Laravel Sanctum. Siga estes passos:

### 1. Registrar um Usuário

```bash
POST /api/v1/register
```

Ou faça login se já tiver uma conta:

```bash
POST /api/v1/login
```

### 2. Copiar o Token

Na resposta, você receberá um token de autenticação:

```json
{
  "user": {...},
  "token": "1|AbCdEfGhIjKlMnOpQrStUvWxYz"
}
```

### 3. Autenticar no Swagger

1. Clique no botão **"Authorize"** no topo da página do Swagger
2. No campo **Value**, digite: `Bearer SEU_TOKEN_AQUI`
   - Exemplo: `Bearer 1|AbCdEfGhIjKlMnOpQrStUvWxYz`
3. Clique em **"Authorize"**
4. Clique em **"Close"**

Agora você pode testar todos os endpoints protegidos! 🎉

## 📋 Estrutura da API

### Endpoints Públicos

- `GET /health` - Verificar saúde da API
- `POST /v1/register` - Registrar novo usuário
- `POST /v1/login` - Fazer login

### Endpoints Protegidos (requerem autenticação)

#### Autenticação
- `POST /v1/logout` - Fazer logout
- `GET /v1/me` - Dados do usuário autenticado

#### Perfil
- `GET /v1/profile` - Obter perfil completo
- `PUT /v1/profile` - Atualizar perfil

#### Endereços
- `GET /v1/addresses` - Listar endereços
- `POST /v1/addresses` - Criar endereço
- `GET /v1/addresses/{id}` - Obter endereço
- `PUT /v1/addresses/{id}` - Atualizar endereço
- `DELETE /v1/addresses/{id}` - Remover endereço

#### Documentos
- `GET /v1/documents` - Listar documentos
- `POST /v1/documents` - Criar documento
- `GET /v1/documents/status` - Status dos documentos
- `GET /v1/documents/{id}` - Obter documento
- `DELETE /v1/documents/{id}` - Remover documento

#### Carteira
- `GET /v1/wallet` - Obter carteira
- `GET /v1/wallet/balance` - Obter saldo

#### Transações
- `GET /v1/transactions` - Listar transações
- `POST /v1/transactions/deposit` - Fazer depósito
- `POST /v1/transactions/transfer` - Fazer transferência
- `GET /v1/transactions/{id}` - Obter transação
- `POST /v1/transactions/{id}/reverse` - Estornar transação

## 🔧 Configuração

### Variáveis de Ambiente

No arquivo `.env` na raiz do projeto:

```env
SWAGGER_PORT=8080
```

### Arquivo de Documentação

A documentação OpenAPI está em:

```
docs/api/swagger.yml
```

Para atualizar a documentação, edite este arquivo e reinicie o container:

```bash
docker compose restart swagger
```

## 📝 Especificação OpenAPI

A API segue a especificação OpenAPI 3.0.3, que define:

- **Schemas**: Estruturas de dados (User, Wallet, Transaction, etc)
- **Paths**: Endpoints disponíveis
- **Security**: Esquemas de autenticação
- **Responses**: Códigos HTTP e formatos de resposta
- **Examples**: Exemplos de requisições e respostas

## 🧪 Testando a API

### Exemplo de Fluxo Completo

1. **Registrar usuário**
   ```
   POST /v1/register
   ```

2. **Fazer login** (se já tiver conta)
   ```
   POST /v1/login
   ```

3. **Autenticar no Swagger** com o token recebido

4. **Ver perfil**
   ```
   GET /v1/profile
   ```

5. **Adicionar endereço**
   ```
   POST /v1/addresses
   ```

6. **Fazer depósito**
   ```
   POST /v1/transactions/deposit
   ```

7. **Ver saldo**
   ```
   GET /v1/wallet/balance
   ```

8. **Listar transações**
   ```
   GET /v1/transactions
   ```

## 🐛 Troubleshooting

### Swagger UI não carrega

```bash
# Verificar se o container está rodando
docker compose ps

# Ver logs do container
docker compose logs swagger

# Reiniciar container
docker compose restart swagger
```

### Erro de CORS

Se encontrar erros de CORS ao testar pelo Swagger, certifique-se de que o backend está configurado corretamente em `config/cors.php`.

### Documentação não atualiza

```bash
# Limpar cache do navegador ou usar Ctrl+Shift+R

# Reiniciar o container Swagger
docker compose restart swagger
```

## 📚 Recursos Adicionais

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)

## 🤝 Contribuindo

Para adicionar novos endpoints à documentação:

1. Edite o arquivo `docs/api/swagger.yml`
2. Adicione o novo endpoint na seção `paths:`
3. Defina schemas necessários em `components/schemas:`
4. Reinicie o container Swagger
5. Teste no navegador

---

**Desenvolvido por Grupo Adriano** 🚀

