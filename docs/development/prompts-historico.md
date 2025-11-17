# MVP - Carteira Financeira

## TODOS

### Lista de tarefas a serem realizadas

[ ] 1. crie o arquivo inicial do github copilot para as instruções do projeto

[ ] 2. crie o arquivo para fazer o deploy do projeto usando github e hostinger para a hospedagem do projeto

[ ] 3. Desafio Técnico para full stack pleno

Como um arquiteto de software e desenvolvedor fullstack experiente, que presa pela qualidade do código, boas práticas de desenvolvimento e arquitetura de software, sem inventar muita moda, escreva uma descrição detalhada mas concisa do projeto abaixo, explicando o objetivo, requisitos e tecnologias utilizadas.
O texto abaixo é o enunciado de um teste para uma vaga de desenvolvedor fullstack pleno que eu estou sendo desafiado a desenvolver, segue o enunciado:

A primeira versão deve focar em ser um MVP (Produto Mínimo Viável) funcional, que atenda aos requisitos básicos de cadastro de usuários, autenticação, transferência e depósito de saldo. A interface pode ser simples, mas deve ser intuitiva e fácil de usar.

```markdown

### Objetivo

O objetivo consiste na criação de uma interface funcional equivalente a uma carteira financeira em
que os usuários possam realizar transferência de saldo e depósito.

### Tecnologias desejadas

- PHP 8.4
- Laravel 12
- PostgreSQL 16
  - Porque eu escolhi o PostgreSQL ao invés do MySQL?
    - Colunas do tipo UUID nativas
    - Melhor performance em grandes volumes de dados
    - Full Text Search nativo
    - Tipos de dados avançados como arrays, ranges e outros
    - Lida melhor com colunas json(B)
  - UUID v7
    - Usa extensão pg_uuidv7
    - Melhor performance em índices (ordenação temporal nativa)
    - IDs menores e mais eficientes
  - Status como SMALLINT
    - Melhor performance (2 bytes vs strings)
    - Enums no Laravel mantêm legibilidade no código
    - Status documentados via comentários SQL
  - Solução para Unique + "Soft Delete"
    - Implementei a abordagem de Status "Archived" (valor 9):
    - Mantém o registro na base de dados
    - Permite reativação futura
    - Evita conflitos de unicidade
  - Para compliance rigoroso (LGPD), usar uma Tabela de Histórico
    - Tabela principal limpa e rápida
    - Histórico completo e imutável
    - Permite unique constraints sem workarounds
    - Auditoria perfeita para compliance (LGPD)
    - Queries mais rápidas (menos registros ativos)
- Frontend (React.js, tailwindcss, fontawesome)
- Docker
- GitHub Actions para CI/CD
- PHPUnit para testes unitários e de integração
- Swagger para documentação da API


### Requisitos

- Criar cadastro de clientes usuários
- Criar autenticação de usuários (login e senha)
- Usuários podem
  - Enviar Dinheiro
  - Receber Dinheiro
  - Depositar Dinheiro
- Validar se o usuário tem saldo antes da transferência e caso o saldo da pessoa esteja negativo por algum motivo, no depósito deve acrescentar ao valor.
- A operação de transferência ou depósito deve ser passível de reversão em qualquer caso de
inconsistência ou por solicitação do usuário.

### Avaliação

Apresente sua solução utilizando o framework que você desejar, justificando a escolha. 
Atente-se a cumprir a maioria dos requisitos, pois você pode cumpri-los parcialmente e durante a avaliação vamos bater um papo a respeito do que faltou.

### O que será avaliado

- Segurança
- Uso de código limpo (Clean Code), usar os nomes corretos para variáveis, funções, classes e
métodos em inglês, seguindo boas práticas de programação.
- Domínio da arquitetura
- Tratamentos de erros
- Saber argumentar suas escolhas
- Conhecimento de padrões (quais design patterns foram usados, SOLID)
- Modelagem de dados

### O que será um diferencial a ser implementado

- Uso de Docker (Criação do Dockerfile e docker-compose.yml para subir a aplicação com todos os serviços necessários de forma simples no ambiente local)
- Testes de integração (Usar PHPUnit) Use TDD baby steps criando testes para as principais funcionalidades
- Testes unitários (Usar PHPUnit) Use TDD baby steps criando testes para as principais funcionalidades
- Documentação da API (Usar Swagger) criar container docker para rodar o swagger
- Observabilidade
    - Logs: 
        - Utilizar o pacote  opcodesio/log-viewer para visualização dos logs (https://github.com/opcodesio/log-viewer)    
        - composer require opcodesio/log-viewer
        - php artisan log-viewer:publish
        - php artisan vendor:publish
            log-viewer-config
            Isso publica o config log-viewer em config/log-viewer.php
            Alterar o 'route-path' => 'logs' para acesso (tamém pode proteger a rota com middleware de autenticação)
    - Auditoria
        - Utilizar o pacote owen-it/laravel-auditing para auditoria das ações dos usuários
        - composer require owen-it/laravel-auditing
    - Laradumps
        - Utilizar o pacote beyondcode/laradumps para debug da aplicação
        - composer require beyondcode/laradumps --dev

```

vamos separar o Backend do Frontend, e criar duas pastas distintas no repositório, uma para cada parte do projeto.

Exemplo de estrutura do repositório:

```text
grupo-adriano/
├── .github/
│   └── workflows/
│       ├── backend-ci.yml
│       ├── frontend-ci.yml
│       └── deploy.yml
├── .docker/
│   ├── backend/
│   │   ├── Dockerfile
│   │   └── php.ini
│   ├── frontend/
│   │   └── Dockerfile
│   ├── apache2/
│   │   └── apache2.conf
│   └── postgres/
│       └── init.sql
├── backend/
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── tests/
│   ├── composer.json
│   ├── .env.example
│   └── README.md
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── .env.example
│   └── README.md
├── docs/
│   ├── api/
│   │   └── swagger.yml
│   ├── deployment/
│   └── architecture/
├── scripts/
│   ├── inicia-ambiente-dev.sh
│   ├── setup.sh
│   ├── deploy.sh
│   └── test.sh
├── docker-compose.yml
├── docker-compose.prod.yml
├── .gitignore
├── .env.example
├── .env.production.example (for production environment variables with secrets variables)
└── README.md 
```

Porque das coisas acima:

- Separação clara entre configurações Docker e código fonte
- Estrutura de workflows CI/CD organizados por componente
- Pasta `docs/` para documentação técnica e API
- Scripts de automação para setup e deploy
- Configurações específicas para desenvolvimento e produção
- Arquivos de exemplo para variáveis de ambiente
- ./.env.production.example (for production environment variables with secrets variables)
- ./README.md (sem muito detalhamento, apenas visão geral do projeto e instruções básicas de como rodar o projeto)

Dentro das pastas (.github, .docker, backend, frontend, docs, scripts) crie um arquivo README.md com instruções específicas objetivas e resumidas da respectiva pasta.

## Para o dia da entrevista técnica

- Na data marcada pelo recrutador tenha sua aplicação rodando para a execução de testes e para apresentação do desenvolvimento.
- Faremos um code review como se você já fosse do nosso time, você poderá explicar o que pensou.

## Alguns diferenciais no perfil do desenvolvedor ( não usar no MVP)

Experiência com Kubernetes;
Clean Architecture;
DDD;
TDD;
Experiência em serviços GCP;
