<?php

namespace App\Controllers;

use App\Services\EmployeeImporter;
use Exception;

/**
 * Controller for handling file upload operations.
 * 
 * This controller provides endpoints for uploading and processing CSV files
 * containing employee data. It handles file validation, MIME type checking,
 * and delegates the actual import process to the EmployeeImporter service.
 */
class UploadController extends Controller
{
    /**
     * Handle CSV file upload and import employee data.
     * 
     * Validates the uploaded file, checks MIME type, and processes the CSV
     * to import employee records into the database. Uses transactions to
     * ensure data integrity during the import process.
     * 
     * @return void Outputs JSON response with import results or error
     */
    public function upload(): void
    {
        try {
            // Check if file was uploaded successfully
            if (!isset($_FILES['csvFile']) || $_FILES['csvFile']['error'] !== UPLOAD_ERR_OK) {
                $this->errorResponse('File upload failed.');
                return;
            }
            
            // Validate MIME type
            $mime_type = mime_content_type($_FILES['csvFile']['tmp_name']);
            if ($mime_type !== 'text/csv' && $mime_type !== 'text/plain') {
                $this->errorResponse('Invalid file type. Please upload a CSV.', 415);
                return;
            }
            
            // Process the CSV file
            $importer = new EmployeeImporter();
            $count = $importer->import($_FILES['csvFile']['tmp_name']);
            
            if ($count > 0) {
                $this->jsonResponse([
                    'status' => 'success',
                    'message' => "Imported {$count} employee records."
                ]);
            } else {
                $this->jsonResponse([
                    'status' => 'error',
                    'message' => 'Failed to import records. The transaction was rolled back.'
                ], 500);
            }
            
        } catch (Exception $e) {
            $this->errorResponse('Import failed: ' . $e->getMessage(), 500);
        }
    }
}