<?php

namespace App\Infrastructure;

/**
 * HTTP Router class for handling URL routing and request dispatching.
 * 
 * This class provides a simple yet powerful routing system that supports
 * RESTful HTTP methods and URL parameter extraction.
 */
class Router
{
    private array $routes = [];
    
    /**
     * Add a route to the router.
     * 
     * @param string $method HTTP method (GET, POST, PUT, DELETE, etc.)
     * @param string $path URL path pattern (supports {param} placeholders)
     * @param callable $handler Callback function to handle the route
     * @return void
     */
    public function addRoute(string $method, string $path, callable $handler): void
    {
        $this->routes[] = [
            'method' => strtoupper($method),
            'path' => $path,
            'handler' => $handler
        ];
    }
    
    /**
     * Register a GET route.
     * 
     * @param string $path URL path pattern (supports {param} placeholders)
     * @param callable $handler Callback function to handle the route
     * @return void
     */
    public function get(string $path, callable $handler): void
    {
        $this->addRoute('GET', $path, $handler);
    }
    
    /**
     * Register a POST route.
     * 
     * @param string $path URL path pattern (supports {param} placeholders)
     * @param callable $handler Callback function to handle the route
     * @return void
     */
    public function post(string $path, callable $handler): void
    {
        $this->addRoute('POST', $path, $handler);
    }
    
    /**
     * Register a PUT route.
     * 
     * @param string $path URL path pattern (supports {param} placeholders)
     * @param callable $handler Callback function to handle the route
     * @return void
     */
    public function put(string $path, callable $handler): void
    {
        $this->addRoute('PUT', $path, $handler);
    }
    
    /**
     * Register a DELETE route.
     * 
     * @param string $path URL path pattern (supports {param} placeholders)
     * @param callable $handler Callback function to handle the route
     * @return void
     */
    public function delete(string $path, callable $handler): void
    {
        $this->addRoute('DELETE', $path, $handler);
    }
    
    /**
     * Dispatch the current HTTP request to the appropriate route handler.
     * 
     * This method matches the current request against registered routes and
     * executes the corresponding handler. If no route matches, returns a 404 error.
     * If an exception occurs during handler execution, returns a 500 error.
     * 
     * @return void
     * @throws \Exception When route handler execution fails
     */
    public function dispatch(): void
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = $this->getPath();
        
        foreach ($this->routes as $route) {
            if ($route['method'] === $method && $this->matchPath($route['path'], $path)) {
                try {
                    $params = $this->extractParams($route['path'], $path);
                    call_user_func($route['handler'], $params);
                    return;
                } catch (\Exception $e) {
                    $this->sendErrorResponse(500, 'Internal server error');
                    return;
                }
            }
        }
        
        $this->sendErrorResponse(404, 'Not found');
    }
    
    /**
     * Extract and clean the request path from the current HTTP request.
     * 
     * Removes query strings and the /api prefix if present to normalize
     * the path for route matching.
     * 
     * @return string The cleaned request path
     */
    private function getPath(): string
    {
        $path = $_SERVER['REQUEST_URI'] ?? '/';
        
        // Remove query string
        if (($pos = strpos($path, '?')) !== false) {
            $path = substr($path, 0, $pos);
        }
        
        // Remove /api prefix if present
        if (strpos($path, '/api') === 0) {
            $path = substr($path, 4);
        }
        
        return $path ?: '/';
    }
    
    /**
     * Check if a route path pattern matches the request path.
     * 
     * Converts route patterns with {param} placeholders to regex patterns
     * and matches them against the request path.
     * 
     * @param string $routePath The route pattern (e.g., "/users/{id}")
     * @param string $requestPath The actual request path (e.g., "/users/123")
     * @return bool True if the paths match, false otherwise
     */
    private function matchPath(string $routePath, string $requestPath): bool
    {
        // Convert route path to regex pattern
        $pattern = preg_replace('/\{[^}]+\}/', '([^/]+)', $routePath);
        $pattern = '#^' . $pattern . '$#';
        
        return preg_match($pattern, $requestPath);
    }
    
    /**
     * Extract URL parameters from the request path based on the route pattern.
     * 
     * Extracts parameter values from the request path using the route pattern
     * and returns them as an associative array.
     * 
     * @param string $routePath The route pattern (e.g., "/users/{id}")
     * @param string $requestPath The actual request path (e.g., "/users/123")
     * @return array Associative array of parameter names and values
     */
    private function extractParams(string $routePath, string $requestPath): array
    {
        $params = [];
        
        // Extract parameter names from route path
        preg_match_all('/\{([^}]+)\}/', $routePath, $paramNames);
        
        // Extract parameter values from request path
        $pattern = preg_replace('/\{[^}]+\}/', '([^/]+)', $routePath);
        $pattern = '#^' . $pattern . '$#';
        
        if (preg_match($pattern, $requestPath, $matches)) {
            array_shift($matches); // Remove full match
            
            foreach ($paramNames[1] as $index => $name) {
                $params[$name] = $matches[$index] ?? null;
            }
        }
        
        return $params;
    }
    
    /**
     * Send a JSON error response with the specified HTTP status code.
     * 
     * @param int $code HTTP status code (e.g., 404, 500)
     * @param string $message Error message to include in the response
     * @return void
     */
    private function sendErrorResponse(int $code, string $message): void
    {
        http_response_code($code);
        header('Content-Type: application/json');
        echo json_encode(['error' => $message]);
    }
}