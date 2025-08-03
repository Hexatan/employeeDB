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

*   **Performance Optimisation (Denormalisation):** For applications with extremely high read traffic, the average salary could be stored directly in the `companies` table. This would involve recalculating and updating this value whenever an employee's salary is modified, added, or removed for a company. While this would make read queries for company salary data faster, it adds complexity to write operations and requires careful use of database transactions to maintain data integrity. For the current scale, calculating the average on-demand is the more robust and maintainable approach.