# Ukmashop API

**ukmashop** is a E-Commerce Order Management API for managing users and orders in an e-commerce system

## Technology Stack

- **Core:** NestJS, TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Development Tools:** Docker, Nginx, ESLint, Prettier
- **Other:** Swagger (API documentation), Winston (logging)

## Project Structure

```
ukmashop-api/
├── env/            # Environment variables
├── nginx/          # Nginx configuration
├── prisma/         # Prisma ORM configuration
│ ├── migrations/   # Database migrations
│ └── seeders/      # Database seeders
├── src/            # Source code
│ ├── core/         # Core components
│ └── modules/      # Application modules
└── test/           # Tests
```

## Getting Started

### 1. Build and Run Docker Containers

#### Development Mode

- **Build and start all containers:**

```bash
pnpm run start:build:docker:development
```

- **Start all containers on an existing image:**

```bash
pnpm run start:docker:development
```

- **Stop all containers:**

```bash
pnpm run stop:docker:development
```

#### Production Mode

- **Build and start all containers:**

```bash
pnpm run start:build:docker:production
```

- **Start all containers on an existing image:**

```bash
pnpm run start:docker:production
```

- **Stop all containers:**

```bash
pnpm run stop:docker:production
```

### 2. Database Management

#### Run Migrations

- **Development:**

```bash
pnpm run database:migrate:docker:development
```

- **Production:**

```bash
pnpm run database:migrate:docker:production
```

- **Undo all migrations:**

```bash
pnpm run database:migrate:undo:all:docker
```

#### Seed Data

- **Create a new seeder:**

```bash
pnpm run seed:create --name=<seeder name>
```

- **Run all seeders:**

```bash
pnpm run seed:all:docker
```

- **Undo all seeders:**

```bash
pnpm run seed:undo:all:docker
```

## Development Environment

- **Containerization**: Docker is used for application containerization, enabling consistent environment replication.
- **Reverse Proxy**: Nginx serves as a reverse-proxy for handling HTTP requests.
- **Code Quality**: ESLint and Prettier are configured to maintain code style and quality.
- **TypeScript**: Configured with strict mode enabled for type safety.
- **API Documentation**: Swagger is set up to automatically generate API documentation.
- **Logging**: Winston is configured for detailed logging.

## API Documentation

Swagger documentation is available at `/api/docs` when the application is running. This provides detailed information on API endpoints, request parameters, and responses.

## License

Ukmashop is open-source and available under the [MIT License]().
