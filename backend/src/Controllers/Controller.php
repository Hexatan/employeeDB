<?php

namespace App\Controllers;

use App\Infrastructure\Database;
use PDO;

/**
 * Abstract base controller providing common functionality for all API controllers.
 * 
 * This class provides shared functionality including database access, JSON response
 * formatting, error handling, and request body parsing for all API controllers.
 */
abstract class Controller
{
    protected PDO $db;
    
    /**
     * Initialize the controller with database connection and JSON headers.
     * 
     * Sets up the database connection and ensures all responses use JSON content type.
     */
    public function __construct()
    {
        $this->db = Database::getInstance();
        $this->setJsonHeader();
    }
    
    /**
     * Set the JSON content type header for API responses.
     * 
     * @return void
     */
    protected function setJsonHeader(): void
    {
        header('Content-Type: application/json');
    }
    
    /**
     * Send a JSON response with the specified data and HTTP status code.
     * 
     * @param array $data The data to encode as JSON
     * @param int $statusCode HTTP status code (default: 200)
     * @return void
     */
    protected function jsonResponse(array $data, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        echo json_encode($data);
    }
    
    /**
     * Send a successful JSON response (HTTP 200).
     * 
     * @param array $data The data to include in the response
     * @return void
     */
    protected function successResponse(array $data): void
    {
        $this->jsonResponse($data, 200);
    }
    
    /**
     * Send an error JSON response with the specified message and status code.
     * 
     * @param string $message Error message to include in the response
     * @param int $statusCode HTTP status code (default: 400)
     * @return void
     */
    protected function errorResponse(string $message, int $statusCode = 400): void
    {
        $this->jsonResponse(['error' => $message], $statusCode);
    }
    
    /**
     * Send a 404 Not Found JSON response.
     * 
     * @param string $message Custom error message (default: 'Resource not found')
     * @return void
     */
    protected function notFoundResponse(string $message = 'Resource not found'): void
    {
        $this->errorResponse($message, 404);
    }
    
    /**
     * Send a 500 Internal Server Error JSON response.
     * 
     * @param string $message Custom error message (default: 'Internal server error')
     * @return void
     */
    protected function serverErrorResponse(string $message = 'Internal server error'): void
    {
        $this->errorResponse($message, 500);
    }
    
    /**
     * Parse and return the JSON request body as an associative array.
     * 
     * Reads the raw request body and decodes it from JSON. Returns an empty
     * array if no body is provided.
     * 
     * @return array The parsed request body data
     * @throws \InvalidArgumentException When the request body contains invalid JSON
     */
    protected function getRequestBody(): array
    {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \InvalidArgumentException('Invalid JSON in request body');
        }
        
        return $data ?? [];
    }
    
    /**
     * Validate that required fields are present and not empty in the data array.
     * 
     * @param array $data The data array to validate
     * @param array $requiredFields Array of field names that are required
     * @return void
     * @throws \InvalidArgumentException When a required field is missing or empty
     */
    protected function validateRequired(array $data, array $requiredFields): void
    {
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                throw new \InvalidArgumentException("Required field '{$field}' is missing or empty");
            }
        }
    }
}