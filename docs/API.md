# API Documentation Guide

Comprehensive guide to the Financial Wallet REST API.

## 📋 Overview

The Financial Wallet API is a RESTful service built with Laravel 12, providing secure endpoints for user authentication, wallet management, and financial transactions.

**Base URL:** `http://localhost:8000/api`  
**API Version:** v1  
**Authentication:** Bearer Token (Laravel Sanctum)  
**Response Format:** JSON  
**Charset:** UTF-8

## 🔐 Authentication

### Overview

The API uses Laravel Sanctum for token-based authentication. After successful login, clients receive a Bearer token which must be included in subsequent requests.

### Authentication Flow

```
1. POST /api/v1/register or /api/v1/login
2. Receive bearer token in response
3. Include token in Authorization header:
   Authorization: Bearer {token}
4. Make authenticated requests
5. POST /api/v1/logout to revoke token
```

### Public Endpoints

These endpoints don't require authentication:

- `GET /api/health` - Health check
- `POST /api/v1/register` - User registration
- `POST /api/v1/login` - User login

### Protected Endpoints

All other endpoints require a valid Bearer token.

## 📝 API Reference

### Health Check

Check if the API is running.

```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-11-17T12:00:00Z"
}
```

---

## 👤 Authentication Endpoints

### Register User

Create a new user account.

```http
POST /api/v1/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "document": "12345678900"
}
```

**Validation Rules:**
- `name`: required, string, max 255
- `email`: required, email, unique
- `password`: required, min 8, confirmed
- `document`: required, unique (CPF/CNPJ)

**Success Response (201):**
```json
{
  "user": {
    "id": "01234567-89ab-cdef-0123-456789abcdef",
    "name": "John Doe",
    "email": "john@example.com",
    "document": "12345678900",
    "status": "active"
  },
  "token": "1|AbCdEfGhIjKlMnOpQrStUvWxYz..."
}
```

### Login

Authenticate user and receive token.

```http
POST /api/v1/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "user": {
    "id": "01234567-89ab-cdef-0123-456789abcdef",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "2|AbCdEfGhIjKlMnOpQrStUvWxYz..."
}
```

**Error Response (401):**
```json
{
  "message": "Invalid credentials"
}
```

### Logout

Revoke current authentication token.

```http
POST /api/v1/logout
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

### Get Authenticated User

Get current user information.

```http
GET /api/v1/me
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "id": "01234567-89ab-cdef-0123-456789abcdef",
  "name": "John Doe",
  "email": "john@example.com",
  "document": "12345678900",
  "status": "active",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

## 👤 Profile Endpoints

### Get Profile

Retrieve user profile information.

```http
GET /api/v1/profile
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "id": "01234567-89ab-cdef-0123-456789abcdef",
  "name": "John Doe",
  "email": "john@example.com",
  "document": "12345678900",
  "phone": "+5511999999999",
  "birth_date": "1990-01-01",
  "status": "active"
}
```

### Update Profile

Update user profile information.

```http
PUT /api/v1/profile
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Updated Doe",
  "phone": "+5511988888888",
  "birth_date": "1990-01-01"
}
```

**Success Response (200):**
```json
{
  "id": "01234567-89ab-cdef-0123-456789abcdef",
  "name": "John Updated Doe",
  "email": "john@example.com",
  "phone": "+5511988888888",
  "birth_date": "1990-01-01"
}
```

---

## 💰 Wallet Endpoints

### Get Wallet

Retrieve wallet information.

```http
GET /api/v1/wallet
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "id": "01234567-89ab-cdef-0123-456789abcdef",
  "user_id": "01234567-89ab-cdef-0123-456789abcdef",
  "balance": "1000.00",
  "currency": "BRL",
  "status": "active",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Get Balance

Get current wallet balance.

```http
GET /api/v1/wallet/balance
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "balance": "1000.00",
  "currency": "BRL"
}
```

---

## 💸 Transaction Endpoints

### List Transactions

Get transaction history with pagination.

```http
GET /api/v1/transactions?page=1&per_page=15&type=all&status=all
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Items per page (default: 15, max: 100)
- `type` (optional): Filter by type (deposit, transfer, reversal, all)
- `status` (optional): Filter by status (pending, completed, failed, all)

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "01234567-89ab-cdef-0123-456789abcdef",
      "wallet_id": "01234567-89ab-cdef-0123-456789abcdef",
      "type": "deposit",
      "status": "completed",
      "amount": "100.00",
      "created_at": "2024-01-01T12:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 50
  }
}
```

### Get Transaction

Get details of a specific transaction.

```http
GET /api/v1/transactions/{id}
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "id": "01234567-89ab-cdef-0123-456789abcdef",
  "wallet_id": "01234567-89ab-cdef-0123-456789abcdef",
  "type": "transfer",
  "status": "completed",
  "amount": "50.00",
  "sender_wallet_id": "01234567-89ab-cdef-0123-456789abcdef",
  "receiver_wallet_id": "fedcba98-7654-3210-fedc-ba9876543210",
  "metadata": {
    "sender_name": "John Doe",
    "receiver_name": "Jane Smith"
  },
  "created_at": "2024-01-01T12:00:00Z"
}
```

### Create Deposit

Make a deposit to wallet.

```http
POST /api/v1/transactions/deposit
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": "100.00",
  "description": "Monthly deposit"
}
```

**Validation Rules:**
- `amount`: required, numeric, min 0.01
- `description`: optional, string, max 255

**Success Response (201):**
```json
{
  "id": "01234567-89ab-cdef-0123-456789abcdef",
  "wallet_id": "01234567-89ab-cdef-0123-456789abcdef",
  "type": "deposit",
  "status": "completed",
  "amount": "100.00",
  "balance_after": "1100.00",
  "created_at": "2024-01-01T12:00:00Z"
}
```

### Create Transfer

Transfer money to another user.

```http
POST /api/v1/transactions/transfer
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "receiver_email": "jane@example.com",
  "amount": "50.00",
  "description": "Payment for services"
}
```

**Validation Rules:**
- `receiver_email`: required, email, exists (different from sender)
- `amount`: required, numeric, min 0.01
- `description`: optional, string, max 255

**Success Response (201):**
```json
{
  "id": "01234567-89ab-cdef-0123-456789abcdef",
  "wallet_id": "01234567-89ab-cdef-0123-456789abcdef",
  "type": "transfer",
  "status": "completed",
  "amount": "50.00",
  "sender_balance_after": "1050.00",
  "receiver_balance_after": "550.00",
  "receiver": {
    "name": "Jane Smith",
    "email": "jane@example.com"
  },
  "created_at": "2024-01-01T12:00:00Z"
}
```

**Error Response (422):**
```json
{
  "message": "Insufficient balance",
  "errors": {
    "amount": ["You don't have enough balance for this transfer"]
  }
}
```

### Reverse Transaction

Reverse a completed transaction.

```http
POST /api/v1/transactions/{id}/reverse
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "reason": "Customer request"
}
```

**Success Response (200):**
```json
{
  "original_transaction": {
    "id": "01234567-89ab-cdef-0123-456789abcdef",
    "status": "reversed"
  },
  "reversal_transaction": {
    "id": "fedcba98-7654-3210-fedc-ba9876543210",
    "type": "reversal",
    "status": "completed",
    "amount": "50.00"
  }
}
```

---

## 🏠 Address Endpoints

### List Addresses

Get all user addresses.

```http
GET /api/v1/addresses
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "01234567-89ab-cdef-0123-456789abcdef",
      "street": "Main Street",
      "number": "123",
      "complement": "Apt 45",
      "neighborhood": "Downtown",
      "city": "São Paulo",
      "state": "SP",
      "zip_code": "01234-567",
      "country": "Brazil"
    }
  ]
}
```

### Create Address

Add a new address.

```http
POST /api/v1/addresses
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "street": "Main Street",
  "number": "123",
  "complement": "Apt 45",
  "neighborhood": "Downtown",
  "city": "São Paulo",
  "state": "SP",
  "zip_code": "01234567",
  "country": "Brazil"
}
```

**Success Response (201):**
```json
{
  "id": "01234567-89ab-cdef-0123-456789abcdef",
  "street": "Main Street",
  "number": "123",
  "complement": "Apt 45",
  "neighborhood": "Downtown",
  "city": "São Paulo",
  "state": "SP",
  "zip_code": "01234-567",
  "country": "Brazil"
}
```

---

## 📄 Document Endpoints

### List Documents

Get all user documents.

```http
GET /api/v1/documents
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "01234567-89ab-cdef-0123-456789abcdef",
      "type": "CPF",
      "number": "12345678900",
      "status": "approved",
      "file_path": "/storage/documents/cpf_123.pdf",
      "uploaded_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### Upload Document

Upload a new document.

```http
POST /api/v1/documents
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `type`: CPF, RG, CNH, passport, etc.
- `number`: Document number
- `file`: Document file (PDF, JPG, PNG)

**Success Response (201):**
```json
{
  "id": "01234567-89ab-cdef-0123-456789abcdef",
  "type": "CPF",
  "number": "12345678900",
  "status": "pending",
  "file_path": "/storage/documents/cpf_123.pdf"
}
```

---

## ⚠️ Error Responses

### Standard Error Format

```json
{
  "message": "Error description",
  "errors": {
    "field_name": [
      "Validation error message"
    ]
  }
}
```

### HTTP Status Codes

- `200` - OK (Success)
- `201` - Created (Resource created)
- `400` - Bad Request (Invalid request)
- `401` - Unauthorized (Invalid or missing token)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found (Resource not found)
- `422` - Unprocessable Entity (Validation errors)
- `429` - Too Many Requests (Rate limit exceeded)
- `500` - Internal Server Error (Server error)

### Common Errors

**401 Unauthorized:**
```json
{
  "message": "Unauthenticated."
}
```

**422 Validation Error:**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "amount": ["The amount must be at least 0.01."]
  }
}
```

**429 Rate Limit:**
```json
{
  "message": "Too many requests. Please try again later."
}
```

---

## 🔧 Rate Limiting

- **Limit:** 60 requests per minute per IP
- **Headers:**
  - `X-RateLimit-Limit`: Total allowed requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `Retry-After`: Seconds until reset

---

## 📊 Interactive Documentation

For interactive API documentation with request/response examples, visit:

**Swagger UI:** http://localhost:8080

The Swagger UI provides:
- Interactive API explorer
- Try-it-out functionality
- Complete request/response schemas
- Authentication testing

---

## 🛠️ Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:8000/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "document": "12345678900"
  }'

# Login
curl -X POST http://localhost:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get Balance (with token)
curl -X GET http://localhost:8000/api/v1/wallet/balance \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Import the Swagger/OpenAPI specification
2. Set base URL to `http://localhost:8000/api`
3. Add Authorization header with Bearer token
4. Test endpoints

---

## 📚 Additional Resources

- [Backend Documentation](../backend/README.md)
- [Swagger Specification](../swagger/swagger.yml)
- [Setup Guide](./SETUP.md)
- [Architecture Overview](./ARCHITECTURE.md)

---

**Last Updated:** 2024-11-17  
**API Version:** 1.0.0  
**Maintained by:** Mauro Rocha Tavares
