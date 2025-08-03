<?php

namespace App;

class CsvProcessor
{
    public function parse(string $filePath): ?iterable
    {
        if (!file_exists($filePath) || !is_readable($filePath)) {
            throw new \InvalidArgumentException("File not found or not readable.");
        }

        $handle = fopen($filePath, 'r');
        if ($handle === false) {
            throw new \RuntimeException("Unable to open the file.");
        }

        return $this->parseGenerator($handle);
    }

    private function parseGenerator($handle): iterable
    {
        // Skip header row
        fgetcsv($handle);

        while (($row = fgetcsv($handle)) !== false) {
            yield $row;
        }

        fclose($handle);
    }
}