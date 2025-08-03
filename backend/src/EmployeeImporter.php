<?php
namespace App;
use PDO;
use Exception;

class EmployeeImporter {
    private PDO $pdo;
    private CsvProcessor $csvProcessor;

    public function __construct() {
        $this->pdo = Database::getInstance();
        $this->csvProcessor = new CsvProcessor();
    }

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