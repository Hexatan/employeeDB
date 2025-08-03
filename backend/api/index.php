<?php
require_once '../vendor/autoload.php';

use App\Infrastructure\Router;
use App\Controllers\EmployeeController;
use App\Controllers\CompanyController;
use App\Controllers\UploadController;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$router = new Router();

// Employee routes
$router->get('/employees', function() {
    $controller = new EmployeeController();
    $controller->index();
});

$router->get('/employees/{id}', function($params) {
    $controller = new EmployeeController();
    $controller->show($params);
});

$router->put('/employees/{id}', function($params) {
    $controller = new EmployeeController();
    $controller->update($params);
});

// Company routes
$router->get('/companies', function() {
    $controller = new CompanyController();
    $controller->index();
});

$router->get('/companies/{id}', function($params) {
    $controller = new CompanyController();
    $controller->show($params);
});

$router->get('/companies/{id}/employees', function($params) {
    $controller = new CompanyController();
    $controller->employees($params);
});

$router->get('/salaries', function() {
    $controller = new CompanyController();
    $controller->salaries();
});

// File upload route
$router->post('/upload', function() {
    $controller = new UploadController();
    $controller->upload();
});

// Health check route
$router->get('/', function() {
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'ok',
        'message' => 'Employee API is running',
        'version' => '2.0',
        'endpoints' => [
            'GET /employees' => 'List all employees',
            'GET /employees/{id}' => 'Get specific employee',
            'PUT /employees/{id}' => 'Update employee email',
            'GET /companies' => 'List all companies',
            'GET /companies/{id}' => 'Get company details with statistics',
            'GET /companies/{id}/employees' => 'Get employees for specific company',
            'GET /companies/salaries' => 'Get average salaries by company',
            'POST /upload' => 'Upload CSV file to import employee data',
        ]
    ]);
});

// Dispatch the request
$router->dispatch();