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