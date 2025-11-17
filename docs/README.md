# Documentation - Financial Wallet

Complete technical documentation for the Financial Wallet project.

## 📚 Quick Navigation

### 🚀 Getting Started
- **[Setup Guide](./SETUP.md)** - Complete development environment setup
- **[Quick Start](../README.md#quick-start)** - Get up and running in minutes
- **[Contributing](../CONTRIBUTING.md)** - How to contribute to the project

### 🏗️ Architecture & Design
- **[Architecture Overview](./ARCHITECTURE.md)** - System architecture and design decisions
- **[Database Schema](./architecture/database-schema.md)** - PostgreSQL schema and LGPD compliance
- **[Design System](./design-system.md)** - UI/UX design system and color palette

### 📖 Technical Documentation
- **[API Reference](./API.md)** - Complete REST API documentation
- **[Backend Documentation](../backend/README.md)** - Laravel API documentation
- **[Frontend Documentation](../frontend/README.md)** - React application documentation

### 📝 Project Information
- **[Changelog](../CHANGELOG.md)** - Version history and changes
- **[Commit Convention](../.github/COMMIT_CONVENTION.md)** - Git commit standards

---

## 📂 Documentation Structure

```
docs/
├── README.md                    # This file - Documentation index
├── SETUP.md                     # Development environment setup
├── ARCHITECTURE.md              # System architecture overview
├── API.md                       # API reference guide
├── design-system.md             # Design system documentation
├── architecture/
│   ├── database-schema.md       # Database schema documentation
│   └── laravel-installation.md  # Laravel setup details
├── DOCKER-HOT-RELOAD.md         # Docker hot reload configuration
├── DOCUMENT_UPLOAD_BACKEND_CONFIG.md  # Document upload setup
├── high-contrast-implementation.md    # Accessibility features
├── implementation-journey.md    # Development journey
├── profile-feature.md           # Profile feature documentation
├── test-fixtures.md             # Test data fixtures
└── testes-resumo.md             # Test summary (PT-BR)
```

---

## 🎯 Documentation by Role

### For New Developers

1. Start with [Setup Guide](./SETUP.md)
2. Read [Architecture Overview](./ARCHITECTURE.md)
3. Review [Commit Convention](../.github/COMMIT_CONVENTION.md)
4. Check [Contributing Guidelines](../CONTRIBUTING.md)

### For Frontend Developers

1. [Frontend Documentation](../frontend/README.md)
2. [Design System](./design-system.md)
3. [API Reference](./API.md)
4. [Architecture - Frontend](./ARCHITECTURE.md#frontend-architecture)

### For Backend Developers

1. [Backend Documentation](../backend/README.md)
2. [Database Schema](./architecture/database-schema.md)
3. [API Reference](./API.md)
4. [Architecture - Backend](./ARCHITECTURE.md#backend-architecture)

### For DevOps/Infrastructure

1. [Setup Guide](./SETUP.md)
2. [Architecture - Deployment](./ARCHITECTURE.md#deployment-architecture)
3. [Docker Configuration](./DOCKER-HOT-RELOAD.md)
4. Root `docker-compose.yml`

---

## 📖 Core Documentation

### Setup Guide
**File:** [SETUP.md](./SETUP.md)

Complete guide for setting up the development environment including:
- Prerequisites and requirements
- Initial setup steps
- Git configuration and commit hooks
- Useful commands
- Troubleshooting common issues
- Service access information

### Architecture Overview
**File:** [ARCHITECTURE.md](./ARCHITECTURE.md)

Comprehensive architecture documentation covering:
- System architecture (3-tier design)
- Backend layered architecture
- Frontend component architecture
- Database design and LGPD compliance
- Security architecture
- Deployment architecture
- Data flow diagrams
- Scalability considerations

### API Reference
**File:** [API.md](./API.md)

Complete REST API documentation including:
- Authentication flow
- All 23 endpoints with examples
- Request/response formats
- Error handling
- Rate limiting
- Testing examples (cURL)
- Interactive Swagger UI link

### Database Schema
**File:** [architecture/database-schema.md](./architecture/database-schema.md)

PostgreSQL database schema documentation:
- Table structures (active and historical)
- LGPD compliance design
- UUID v7 implementation
- Special functions and triggers
- Views and indexes
- Technical decisions rationale

### Design System
**File:** [design-system.md](./design-system.md)

UI/UX design system documentation:
- Ocean Blue color palette
- Typography and fonts
- Component styles
- Accessibility standards
- Usage guidelines
- Tailwind configuration

---

## 🔧 Component Documentation

### Backend
**File:** [../backend/README.md](../backend/README.md)

Laravel API documentation:
- Tech stack
- Features overview
- Setup instructions
- API endpoints
- Models and database
- Architecture layers
- Security features
- Configuration
- Testing

### Frontend
**File:** [../frontend/README.md](../frontend/README.md)

React application documentation:
- Tech stack
- Design system
- Project structure
- Implemented pages
- Components overview
- Authentication
- API integration
- Features
- Testing and validation

---

## 📋 Contributing Documentation

### Contributing Guide
**File:** [../CONTRIBUTING.md](../CONTRIBUTING.md)

Guidelines for contributing:
- Code of conduct
- Development workflow
- Commit convention
- Pull request process
- Coding standards (backend & frontend)
- Testing requirements
- Documentation standards
- Bug reporting
- Feature requests

### Commit Convention
**File:** [../.github/COMMIT_CONVENTION.md](../.github/COMMIT_CONVENTION.md)

Airbnb commit convention guide:
- Commit format
- Types and scopes
- Examples (valid/invalid)
- Git hook validation
- Best practices

---

## 📝 Additional Resources

### Changelog
**File:** [../CHANGELOG.md](../CHANGELOG.md)

Version history and changes:
- Version 1.0.0 features
- Security implementations
- Breaking changes
- Known issues
- Future enhancements

### Implementation Journey
**File:** [implementation-journey.md](./implementation-journey.md)

Detailed development journey:
- Project evolution
- Technical decisions
- Challenges overcome
- Lessons learned

### Feature Documentation

- **[Profile Feature](./profile-feature.md)** - User profile implementation
- **[Document Upload](./DOCUMENT_UPLOAD_BACKEND_CONFIG.md)** - Document upload configuration
- **[High Contrast](./high-contrast-implementation.md)** - Accessibility implementation

### Testing Documentation

- **[Test Summary](./testes-resumo.md)** - Test coverage summary (PT-BR)
- **[Test Fixtures](./test-fixtures.md)** - Test data and fixtures

---

## 🌐 External Resources

### Interactive API Documentation
**URL:** http://localhost:8080 (when environment is running)

Swagger UI providing:
- Interactive API explorer
- Try-it-out functionality
- Request/response schemas
- Authentication testing

### Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React interface |
| Backend API | http://localhost:8000 | Laravel API |
| Swagger UI | http://localhost:8080 | API documentation |
| PostgreSQL | localhost:5432 | Database (pgAdmin/DBeaver) |

---

## 🔍 How to Use This Documentation

### I want to...

**...set up the development environment**
→ Read [Setup Guide](./SETUP.md)

**...understand the system architecture**
→ Read [Architecture Overview](./ARCHITECTURE.md)

**...use the API**
→ Read [API Reference](./API.md)

**...contribute code**
→ Read [Contributing Guide](../CONTRIBUTING.md)

**...understand the database**
→ Read [Database Schema](./architecture/database-schema.md)

**...work on frontend**
→ Read [Frontend Documentation](../frontend/README.md) and [Design System](./design-system.md)

**...work on backend**
→ Read [Backend Documentation](../backend/README.md) and [API Reference](./API.md)

**...see what's changed**
→ Read [Changelog](../CHANGELOG.md)

**...report a bug**
→ See [Contributing - Bug Reporting](../CONTRIBUTING.md#reporting-bugs)

**...request a feature**
→ See [Contributing - Feature Requests](../CONTRIBUTING.md#feature-requests)

---

## 📞 Support

### Documentation Issues

If you find issues with the documentation:

1. Check if there's an existing issue
2. Create a new issue with:
   - Which documentation file
   - What's unclear/incorrect
   - Suggested improvement

### Getting Help

1. Check the relevant documentation above
2. Search [existing issues](https://github.com/NeuronioAzul/financial-wallet/issues)
3. Review code comments in the repository
4. Contact: mauro.rocha.t@gmail.com

---

## 🔄 Documentation Updates

This documentation is maintained alongside the codebase. When making changes:

1. Update relevant documentation
2. Follow the [Contributing Guide](../CONTRIBUTING.md)
3. Include doc updates in pull requests
4. Keep examples up to date

**Last Updated:** 2024-11-17  
**Documentation Version:** 1.0.0

---

**Maintained by:** Mauro Rocha Tavares  
**Repository:** [NeuronioAzul/financial-wallet](https://github.com/NeuronioAzul/financial-wallet)  
**Email:** mauro.rocha.t@gmail.com
