<?php

namespace Tests;

use App\EmployeeImporter;
use App\Database;
use PHPUnit\Framework\TestCase;
use PDO;

class EmployeeImporterTest extends TestCase
{
    private $testFilePath;
    private $employeeImporter;
    private $pdo;

    protected function setUp(): void
    {
        $this->employeeImporter = new EmployeeImporter();
        $this->testFilePath = __DIR__ . '/fixtures/test.csv';
        $this->pdo = Database::getInstance();
        
        // Clean up tables before each test
        $this->pdo->exec("DELETE FROM employees");
        $this->pdo->exec("DELETE FROM companies");
    }

    protected function tearDown(): void
    {
        // Clean up tables after each test
        $this->pdo->exec("DELETE FROM employees");
        $this->pdo->exec("DELETE FROM companies");
    }

    public function testImportsCsvDataCorrectly()
    {
        $importedCount = $this->employeeImporter->import($this->testFilePath);
        
        // Should import 12 employees from the test CSV
        $this->assertEquals(12, $importedCount);
        
        // Verify companies were created
        $stmt = $this->pdo->query("SELECT COUNT(*) as count FROM companies");
        $companyCount = $stmt->fetch()['count'];
        $this->assertEquals(3, $companyCount); // ACME Corporation, Stark Industries, Wayne Enterprises
        
        // Verify employees were created
        $stmt = $this->pdo->query("SELECT COUNT(*) as count FROM employees");
        $employeeCount = $stmt->fetch()['count'];
        $this->assertEquals(12, $employeeCount);
    }

    public function testCreatesCompaniesCorrectly()
    {
        $this->employeeImporter->import($this->testFilePath);
        
        $stmt = $this->pdo->query("SELECT name FROM companies ORDER BY name");
        $companies = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        $expectedCompanies = ['ACME Corporation', 'Stark Industries', 'Wayne Enterprises'];
        $this->assertEquals($expectedCompanies, $companies);
    }

    public function testCreatesEmployeesWithCorrectData()
    {
        $this->employeeImporter->import($this->testFilePath);
        
        // Test first employee (John Doe from ACME Corporation)
        $stmt = $this->pdo->prepare(
            "SELECT e.name, e.email, e.salary, c.name as company_name 
             FROM employees e 
             JOIN companies c ON e.company_id = c.id 
             WHERE e.name = ? AND e.email = ?"
        );
        $stmt->execute(['John Doe', 'johndoe@acme.com']);
        $employee = $stmt->fetch();
        
        $this->assertNotFalse($employee);
        $this->assertEquals('John Doe', $employee['name']);
        $this->assertEquals('johndoe@acme.com', $employee['email']);
        $this->assertEquals('50000', $employee['salary']);
        $this->assertEquals('ACME Corporation', $employee['company_name']);
    }

    public function testHandlesNonExistentFile()
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage("File not found or not readable.");
        
        $this->employeeImporter->import('non_existent_file.csv');
    }
}