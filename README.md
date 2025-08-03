# EmployeeDB Project

A project for the engineer test.

## Overview

This project is a simple employee database management system.

## Getting Started

### Prerequisites

*   Docker
*   Docker Compose

### Installation

1.  Clone the repository.
2.  Navigate to the project root directory.
3.  Run `docker-compose up -d --build` to start the services.
4.  The application will be available at `http://localhost:8080`.

## Tech Stack

*   **Backend:** PHP, Apache, MySQL
*   **Frontend:** Vue.js (to be implemented)
*   **Containerization:** Docker

## Running Tests

The project includes PHPUnit tests for the backend components. Tests are located in the `backend/tests/` directory.

### Prerequisites for Testing

*   Docker and Docker Compose (recommended)
*   OR PHP 8.4+ with Composer installed locally

### Running Tests with Docker

1.  Ensure the Docker containers are running:
    ```bash
    docker-compose up -d
    ```

2.  Run tests inside the backend container:
    ```bash
    docker-compose exec backend composer test
    ```

### Test Coverage

The current test suite includes:
*   **CSVProcessorTest.php** - Tests for CSV file processing functionality
*   **EmployeeImporterTest.php** - Tests for employee data import functionality

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