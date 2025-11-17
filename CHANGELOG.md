# Changelog

All notable changes to the Financial Wallet project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Improved documentation structure and clarity
- Standardized all documentation to English
- Removed hardcoded paths from documentation

## [1.0.0] - 2024-11-17

### Added

#### Backend
- User authentication with Laravel Sanctum
- User registration with CPF validation
- JWT token-based authentication
- User profile management (CRUD)
- Address management (full CRUD)
- Document management (CPF, RG, CNH, passport)
- Digital wallet system
- Transaction management (deposits, transfers, reversals)
- Transaction history with filters
- Real-time balance validation
- Concurrency control with row locking
- LGPD compliance with audit trail
- User archiving functionality
- Rate limiting (60 requests/minute)
- UUID v7 for all entities
- 23 RESTful API endpoints
- Complete test suite with Pest
- Swagger/OpenAPI documentation

#### Frontend
- Login page with validation
- User registration page
- Password recovery page
- Dashboard with financial summary
- Transaction history with filters and pagination
- User profile page
- Deposit modal
- Transfer modal
- Ocean Blue design system
- Form validation with Zod
- Toast notifications
- Responsive layout
- Bearer token authentication
- Error handling
- Loading states

#### Database
- PostgreSQL 18 with UUID v7
- Complete schema with LGPD compliance
- Separate tables for active and historical data
- Users table with status management
- Wallets table with balance tracking
- Transactions table (immutable records)
- Addresses table
- User documents table
- Transaction logs table
- LGPD audit log table
- Archive function for user data
- Triggers for automatic timestamp updates
- Views for optimized queries
- Indexes on critical fields

#### Infrastructure
- Docker Compose orchestration
- Backend container (PHP 8.4-FPM)
- Frontend container (Node 18)
- PostgreSQL 18 container
- Swagger UI container
- Health checks
- Persistent volumes
- Isolated network
- Timezone configuration (America/Sao_Paulo)
- User/Group ID configuration

#### Documentation
- Comprehensive README.md
- Backend documentation
- Frontend documentation
- Setup guide
- Database schema documentation
- Design system documentation
- Implementation journey
- Git commit convention guide
- Swagger/OpenAPI specifications

#### Development Tools
- Git commit hooks for validation
- Commit message template
- Environment setup script
- Test runner script
- Docker automation scripts
- Airbnb commit convention enforcement

### Security
- BCrypt password hashing
- Laravel Sanctum authentication
- Input validation on all endpoints
- CORS configuration
- CSRF protection
- Rate limiting
- UUID v7 (non-sequential IDs)
- Row locking for transactions
- Audit trail for LGPD compliance

## [0.1.0] - Initial Development

### Added
- Project structure setup
- Docker environment configuration
- Basic backend scaffolding
- Basic frontend scaffolding
- Database schema design

---

## Version History

- **1.0.0** - MVP Complete (Backend + Frontend + Infrastructure)
- **0.1.0** - Initial setup and structure

## Notes

### Breaking Changes
None yet - this is the first stable release.

### Deprecations
None yet.

### Known Issues
- Frontend E2E tests not implemented
- CI/CD pipeline not configured
- Production deployment not configured

### Future Enhancements
- Real-time notifications (WebSockets)
- Multi-currency support
- Two-factor authentication (2FA)
- Administrative dashboard
- Reports and data export
- Frontend E2E tests
- CI/CD pipeline
- Production deployment

---

**Maintained by:** Mauro Rocha Tavares  
**Repository:** [NeuronioAzul/financial-wallet](https://github.com/NeuronioAzul/financial-wallet)
