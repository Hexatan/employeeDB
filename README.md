# EmployeeDB Project

A project for the engineer test.

## Overview

This project is a simple employee database management system.

## Getting Started

### Prerequisites

*   Docker
*   Docker Compose

### Installation

#### Using Docker

1. Clone the repository.
2. Navigate to the project root directory.
3. Copy the template: `copy .env.example .env`
4. Edit `.env` with your values
5. Run `docker-compose up --env-file .env -d --build` to start the services.
6. The backend API will be available at `http://localhost:8080`.
7. The frontend application will be available at `http://localhost:8081`.

## Tech Stack

*   **Backend:** PHP, Apache, MySQL
*   **Frontend:** Vue.js 3 with TypeScript, Vite, Pinia (state management), Vue Router
*   **Containerization:** Docker

## API Documentation

The backend provides a RESTful API with the following endpoints:

### Employee Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/employees` | List all employees |
| `GET` | `/employees/{id}` | Get specific employee by ID |
| `PUT` | `/employees/{id}` | Update employee email |

### Company Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/companies` | List all companies |
| `GET` | `/companies/{id}` | Get company details with statistics |
| `GET` | `/companies/{id}/employees` | Get employees for specific company |
| `GET` | `/salaries` | Get average salaries by company |

### File Upload Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/upload` | Upload CSV file to import employee data |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API health check and endpoint listing |

### API Usage Examples

#### Get all employees
```bash
curl -X GET http://localhost:8080/employees
```

#### Get specific employee
```bash
curl -X GET http://localhost:8080/employees/1
```

#### Update employee email
```bash
curl -X PUT http://localhost:8080/employees/1 \
  -H "Content-Type: application/json" \
  -d '{"email": "newemail@example.com"}'
```

#### Upload CSV file
```bash
curl -X POST http://localhost:8080/upload \
  -F "file=@employees.csv"
```

#### Get company salary statistics
```bash
curl -X GET http://localhost:8080/salaries
```

### Response Format

All API responses are returned in JSON format. Successful responses typically include:
- **200 OK**: Successful GET/PUT requests
- **201 Created**: Successful POST requests
- **400 Bad Request**: Invalid input data
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

## Project Structure

```
employeeDB/
├── backend/                    # PHP backend application
│   ├── api/                   # API entry points
│   │   ├── index.php         # Main API router and endpoints
│   │   └── .htaccess         # Apache URL rewriting rules
│   ├── src/                  # PHP source code
│   │   ├── Controllers/      # API controllers
│   │   ├── Infrastructure/   # Database and routing infrastructure
│   │   └── Services/         # Business logic services
│   ├── tests/                # PHPUnit test files
│   ├── vendor/               # Composer dependencies
│   ├── composer.json         # PHP dependencies and scripts
│   ├── composer.lock         # Locked dependency versions
│   └── Dockerfile           # Backend container configuration
├── frontend/                  # Vue.js frontend application
│   ├── src/                  # Vue.js source code
│   │   ├── components/       # Vue components
│   │   ├── stores/           # Pinia state management
│   │   ├── router/           # Vue Router configuration
│   │   └── __tests__/        # Frontend unit tests
│   ├── public/               # Static assets
│   ├── dist/                 # Built frontend files
│   ├── package.json          # Node.js dependencies and scripts
│   ├── vite.config.ts        # Vite build configuration
│   └── tsconfig.json         # TypeScript configuration
├── database/                  # Database initialization
│   └── database.sql          # MySQL schema and sample data
├── .env.example              # Environment variables template
├── docker-compose.yml        # Development Docker configuration
├── docker-compose.prod.yml   # Production Docker configuration
└── README.md                 # Project documentation
```

### Key Files and Their Purpose

- **`backend/api/index.php`**: Main API router that defines all REST endpoints
- **`backend/src/Controllers/`**: Contains controller classes that handle API requests
- **`backend/src/Infrastructure/`**: Database connections and routing infrastructure
- **`database/database.sql`**: MySQL database schema with sample employee data
- **`frontend/src/App.vue`**: Main Vue.js application component
- **`frontend/src/components/`**: Reusable Vue.js components for the UI
- **`.env.example`**: Template for environment variables (copy to `.env`)
- **`docker-compose.yml`**: Development environment with hot-reload
- **`docker-compose.prod.yml`**: Production environment with optimised builds

## Running Tests

The project includes comprehensive test suites for both backend and frontend components.

### Backend Tests

Backend tests use PHPUnit and are located in the `backend/tests/` directory.

#### Prerequisites for Backend Testing

*   Docker and Docker Compose (recommended)
*   OR PHP 8.4+ with Composer installed locally

#### Running Backend Tests with Docker

1.  Ensure the Docker containers are running:
    ```bash
    docker-compose up -d
    ```

2.  Run tests inside the backend container:
    ```bash
    docker-compose exec api composer test
    ```

#### Backend Test Coverage

The current backend test suite includes:
*   **CSVProcessorTest.php** - Tests for CSV file processing functionality
*   **EmployeeImporterTest.php** - Tests for employee data import functionality

### Frontend Tests

Frontend tests use Vitest with Vue Test Utils and are located in the `frontend/src/__tests__/` directory.

#### Running Frontend Tests with Docker

1.  Ensure the Docker containers are running:
    ```bash
    docker-compose up -d
    ```

2.  Run tests inside the backend container:
    ```bash
    docker-compose exec frontend npm run test:unit
    ```

#### Frontend Test Coverage

The frontend test suite includes:
*   Component unit tests with Vue Test Utils
*   TypeScript type checking and ESLint code quality checks


## Production Deployment

The production setup uses multi-stage builds for optimisation:

**Backend (API):**
- Removes xdebug extension
- Installs only production dependencies (`--no-dev`)
- Sets proper file permissions
- Optimizes for production use

**Frontend:**
- Stage 1: Builds Vue.js application with Vite
- Stage 2: Serves built assets with nginx
- Includes gzip compression and security headers
- Optimized for SPA routing

### 1. Prepare Environment
```bash
# Copy and customize production environment
copy .env.example .env.prod
# Edit .env.prod.local with your production passwords
```

### 2. Build and Deploy
```bash
# Build and start production services
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

### 3. Verify Deployment
```bash
# Check all services are running
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs
```

## Future Improvements

### Database & Performance
*   **Performance Optimisation (Denormalisation):** For applications with extremely high read traffic, the average salary could be stored directly in the `companies` table. This would involve recalculating and updating this value whenever an employee's salary is modified, added, or removed for a company. While this would make read queries for company salary data faster, it adds complexity to write operations and requires careful use of database transactions to maintain data integrity. For the current scale, calculating the average on-demand is the more robust and maintainable approach.

### API Enhancements

The new REST API architecture makes it easy to add the following enhancements:

*   **Authentication Middleware:** Implement JWT or session-based authentication to secure API endpoints and control access to sensitive employee data.
*   **Rate Limiting:** Add request throttling to prevent API abuse and ensure fair usage across different clients.
*   **Request Logging:** Implement comprehensive logging for API requests, responses, and errors for monitoring and debugging purposes.
*   **Input Validation:** Enhance data validation with comprehensive rules for all input fields, including custom validation for business logic.
*   **Response Caching:** Implement caching strategies (Redis, Memcached) to improve response times for frequently accessed data.
*   **API Versioning:** Add version control to the API to maintain backward compatibility while introducing new features.
*   **Pagination Support:** Add pagination to list endpoints to handle large datasets efficiently and improve client performance.

### Frontend Development
*   **Real-time Updates:** Implement WebSocket connections for real-time data updates across multiple clients.
*   **Advanced Search & Filtering:** Add comprehensive search functionality with filters by company, salary range, and other employee attributes.
*   **Data Export:** Implement client-side data export functionality (CSV, Excel, PDF) for employee lists and reports.
*   **Bulk Operations:** Add support for bulk employee operations like mass email updates, salary adjustments, or company transfers.
*   **Advanced Table Features:** Implement column sorting, resizing, and customizable column visibility for better data management.
*   **Internationalization (i18n):** Add multi-language support for global deployment.
*   **Dark Mode:** Implement theme switching between light and dark modes for better user experience.

### Testing & Quality Assurance
*   **Integration Tests:** Add comprehensive integration tests for API endpoints and database operations.
*   **End-to-End Testing:** Implement E2E tests using tools like Cypress or Playwright for complete user workflow testing.
