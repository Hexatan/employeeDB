<?php
namespace App\Services;

use App\Infrastructure\Database;
use InvalidArgumentException;
use PDO;
use Exception;
use RuntimeException;

/**
 * Service for importing employee data from CSV files.
 * 
 * This class handles the complete import process including CSV parsing,
 * company creation/lookup, employee insertion, and transaction management
 * to ensure data integrity during the import process.
 */
class EmployeeImporter {
    private PDO $pdo;
    private CsvProcessor $csvProcessor;

    /**
     * Initialize the employee importer with database connection and CSV processor.
     * 
     * Sets up the required dependencies for importing employee data from CSV files.
     */
    public function __construct() {
        $this->pdo = Database::getInstance();
        $this->csvProcessor = new CsvProcessor();
    }

    /**
     * Import employee data from a CSV file into the database.
     * 
     * Processes the CSV file and imports employee records along with their companies.
     * Uses database transactions to ensure data integrity - if any record fails,
     * the entire import is rolled back. Companies are created automatically if
     * they don't exist.
     * 
     * Expected CSV format: Company Name, Employee Name, Email Address, Salary
     * 
     * @param string $filePath Path to the CSV file containing employee data
     * @return int Number of employees successfully imported (0 if import failed)
     * @throws InvalidArgumentException When a CSV file is invalid or unreadable
     * @throws RuntimeException When CSV file cannot be opened
     */
    public function import(string $filePath): int {
        $rows = $this->csvProcessor->parse($filePath);
        $importedCount = 0;

        $this->pdo->beginTransaction();
        try {
            $stmtCompanySelect = $this->pdo->prepare("SELECT id FROM companies WHERE name = ?");
            $stmtCompanyInsert = $this->pdo->prepare("INSERT INTO companies (name) VALUES (?)");
            $stmtEmployeeInsert = $this->pdo->prepare(
                "INSERT INTO employees (company_id, name, email, salary) VALUES (?, ?, ?, ?)"
            );

            foreach ($rows as $row) {
                [$companyName, $name, $email, $salary] = $row;
                // Find or create company
                $stmtCompanySelect->execute([$companyName]); // company_name
                $company = $stmtCompanySelect->fetch();
                if ($company) {
                    $companyId = $company['id'];
                } else {
                    $stmtCompanyInsert->execute([$companyName]);
                    $companyId = $this->pdo->lastInsertId();
                }

                $stmtEmployeeInsert->execute([$companyId, $name, $email, $salary]); // name, email, salary
                $importedCount++;
            }

            $this->pdo->commit();
        } catch (Exception $e) {
            $this->pdo->rollBack();
            // In a real app, log the exception
            return 0;
        }

        return $importedCount;
    }
}