<?php

namespace App\Services;

use InvalidArgumentException;
use RuntimeException;

/**
 * CSV file processor for parsing CSV files efficiently using generators.
 * 
 * This class provides memory-efficient CSV parsing by using PHP generators
 * to process large files without loading the entire content into memory.
 */
class CsvProcessor
{
    /**
     * Parse a CSV file and return an iterable generator.
     * 
     * Opens and validates the CSV file, then returns a generator that yields
     * each row as an array. The header row is automatically skipped.
     * 
     * @param string $filePath Path to the CSV file to parse
     * @return iterable|null Generator that yields CSV rows as arrays
     * @throws InvalidArgumentException When a file doesn't exist or isn't readable
     * @throws RuntimeException When a file cannot be opened
     */
    public function parse(string $filePath): ?iterable
    {
        if (!file_exists($filePath) || !is_readable($filePath)) {
            throw new InvalidArgumentException("File not found or not readable.");
        }

        $handle = fopen($filePath, 'r');
        if ($handle === false) {
            throw new RuntimeException("Unable to open the file.");
        }

        return $this->parseGenerator($handle);
    }

    /**
     * Generator function that yields CSV rows from an open file handle.
     * 
     * Skips the header row and yields each later row as an array.
     * Automatically closes the file handle when iteration is complete.
     * 
     * @param resource $handle Open file handle for the CSV file
     * @return iterable Generator that yields CSV rows as arrays
     */
    private function parseGenerator($handle): iterable
    {
        // Skip header row
        fgetcsv($handle, escape: '');

        while (($row = fgetcsv($handle, escape: '')) !== false) {
            yield $row;
        }

        fclose($handle);
    }
}