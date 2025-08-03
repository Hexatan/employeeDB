<?php

namespace App\Controllers;

/**
 * Controller for handling employee-related API endpoints.
 * 
 * This controller provides endpoints for employee listing, individual employee
 * details, and employee data updates (currently limited to email updates).
 */
class EmployeeController extends Controller
{
    /**
     * Get a list of all employees with their company information.
     * 
     * Returns all employees ordered by name, including their complete information
     * and associated company name. This endpoint provides backward compatibility
     * with the old employees.php endpoint.
     * 
     * @return void Outputs JSON response with employee list or error
     */
    public function index(): void
    {
        try {
            // Query to get employees with company names using JOIN
            $stmt = $this->db->query("
                SELECT e.*, c.name as company_name 
                FROM employees e 
                JOIN companies c ON e.company_id = c.id
                ORDER BY e.name
            ");
            
            $employees = $stmt->fetchAll();
            $this->successResponse($employees);
            
        } catch (\Exception $e) {
            $this->serverErrorResponse();
        }
    }
    
    /**
     * Get detailed information for a specific employee.
     * 
     * Returns complete employee information including their associated
     * company name. Validates that the employee ID is numeric and that
     * the employee exists in the database.
     * 
     * @param array $params URL parameters containing 'id' field
     * @return void Outputs JSON response with employee details or error
     */
    public function show(array $params): void
    {
        try {
            $id = $params['id'] ?? null;
            
            if (!$id || !is_numeric($id)) {
                $this->errorResponse('Invalid employee ID');
                return;
            }
            
            $stmt = $this->db->prepare("
                SELECT e.*, c.name as company_name 
                FROM employees e 
                JOIN companies c ON e.company_id = c.id
                WHERE e.id = ?
            ");
            
            $stmt->execute([$id]);
            $employee = $stmt->fetch();
            
            if (!$employee) {
                $this->notFoundResponse('Employee not found');
                return;
            }
            
            $this->successResponse($employee);
            
        } catch (\Exception $e) {
            $this->serverErrorResponse();
        }
    }
    
    /**
     * Update an employee's email address.
     * 
     * Currently, supports updating only the email field for an employee.
     * Validates the employee ID, email format, and employee existence
     * before performing the update. Returns the updated employee data
     * upon successful completion.
     * 
     * @param array $params URL parameters containing 'id' field
     * @return void Outputs JSON response with updated employee data or error
     */
    public function update(array $params): void
    {
        try {
            $id = $params['id'] ?? null;
            
            if (!$id || !is_numeric($id)) {
                $this->errorResponse('Invalid employee ID');
                return;
            }
            
            $data = $this->getRequestBody();
            
            // For now, we only support updating email
            if (!isset($data['email'])) {
                $this->errorResponse('Email field is required');
                return;
            }
            
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                $this->errorResponse('Invalid email format');
                return;
            }
            
            // Check if employee exists
            $stmt = $this->db->prepare("SELECT id FROM employees WHERE id = ?");
            $stmt->execute([$id]);
            
            if (!$stmt->fetch()) {
                $this->notFoundResponse('Employee not found');
                return;
            }
            
            // Update the employee
            $stmt = $this->db->prepare("UPDATE employees SET email = ? WHERE id = ?");
            $stmt->execute([$data['email'], $id]);
            
            // Return updated employee data
            $stmt = $this->db->prepare("
                SELECT e.*, c.name as company_name 
                FROM employees e 
                JOIN companies c ON e.company_id = c.id
                WHERE e.id = ?
            ");
            
            $stmt->execute([$id]);
            $employee = $stmt->fetch();
            
            $this->successResponse([
                'message' => 'Employee updated successfully',
                'employee' => $employee
            ]);
            
        } catch (\Exception $e) {
            $this->serverErrorResponse();
        }
    }
}