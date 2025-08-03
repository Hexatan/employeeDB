<?php

namespace App\Controllers;

/**
 * Controller for handling company-related API endpoints.
 * 
 * This controller provides endpoints for company listing, details,
 * salary statistics, and employee listings by company.
 */
class CompanyController extends Controller
{
    /**
     * Get a list of all companies.
     * 
     * Returns all companies ordered by name with their ID and name fields.
     * 
     * @return void Outputs JSON response with company list or error
     */
    public function index(): void
    {
        try {
            $stmt = $this->db->query("
                SELECT id, name 
                FROM companies 
                ORDER BY name
            ");
            
            $companies = $stmt->fetchAll();
            $this->successResponse($companies);
            
        } catch (\Exception $e) {
            $this->serverErrorResponse();
        }
    }
    
    /**
     * Get average salary statistics grouped by company.
     * 
     * Returns the average salary for each company, rounded to 2 decimal places.
     * This endpoint provides backward compatibility with the old salaries.php endpoint.
     * 
     * @return void Outputs JSON response with salary statistics or error
     */
    public function salaries(): void
    {
        try {
            // Query to get average salaries grouped by company
            $stmt = $this->db->query("
                SELECT c.name as company_name, AVG(e.salary) as average_salary
                FROM employees e 
                JOIN companies c ON e.company_id = c.id
                GROUP BY c.name
                ORDER BY c.name
            ");
            
            $salaries = $stmt->fetchAll();
            
            // Format the average salary to 2 decimal places
            foreach ($salaries as &$salary) {
                $salary['average_salary'] = round($salary['average_salary'], 2);
            }
            
            $this->successResponse($salaries);
            
        } catch (\Exception $e) {
            $this->serverErrorResponse();
        }
    }
    
    /**
     * Get detailed information for a specific company.
     * 
     * Returns company details along with employee statistics including
     * employee count, average salary, minimum salary, and maximum salary.
     * The average salary is rounded to 2 decimal places.
     * 
     * @param array $params URL parameters containing 'id' field
     * @return void Outputs JSON response with company details or error
     */
    public function show(array $params): void
    {
        try {
            $id = $params['id'] ?? null;
            
            if (!$id || !is_numeric($id)) {
                $this->errorResponse('Invalid company ID');
                return;
            }
            
            $stmt = $this->db->prepare("
                SELECT c.*, 
                       COUNT(e.id) as employee_count,
                       AVG(e.salary) as average_salary,
                       MIN(e.salary) as min_salary,
                       MAX(e.salary) as max_salary
                FROM companies c 
                LEFT JOIN employees e ON c.id = e.company_id
                WHERE c.id = ?
                GROUP BY c.id
            ");
            
            $stmt->execute([$id]);
            $company = $stmt->fetch();
            
            if (!$company) {
                $this->notFoundResponse('Company not found');
                return;
            }
            
            // Format salary values
            if ($company['average_salary']) {
                $company['average_salary'] = round($company['average_salary'], 2);
            }
            
            $this->successResponse($company);
            
        } catch (\Exception $e) {
            $this->serverErrorResponse();
        }
    }
    
    /**
     * Get all employees for a specific company.
     * 
     * Returns a list of all employees working for the specified company,
     * including their complete information and company name. Validates
     * that the company exists before retrieving employees.
     * 
     * @param array $params URL parameters containing 'id' field
     * @return void Outputs JSON response with company name and employee list or error
     */
    public function employees(array $params): void
    {
        try {
            $id = $params['id'] ?? null;
            
            if (!$id || !is_numeric($id)) {
                $this->errorResponse('Invalid company ID');
                return;
            }
            
            // Check if company exists
            $stmt = $this->db->prepare("SELECT name FROM companies WHERE id = ?");
            $stmt->execute([$id]);
            $company = $stmt->fetch();
            
            if (!$company) {
                $this->notFoundResponse('Company not found');
                return;
            }
            
            // Get employees for this company
            $stmt = $this->db->prepare("
                SELECT e.*, c.name as company_name 
                FROM employees e 
                JOIN companies c ON e.company_id = c.id
                WHERE c.id = ?
                ORDER BY e.name
            ");
            
            $stmt->execute([$id]);
            $employees = $stmt->fetchAll();
            
            $this->successResponse([
                'company' => $company['name'],
                'employees' => $employees
            ]);
            
        } catch (\Exception $e) {
            $this->serverErrorResponse();
        }
    }
}