<?php

namespace Tests;

use App\Services\CsvProcessor;
use PHPUnit\Framework\TestCase;

class CsvProcessorTest extends TestCase
{

    private $testFilePath;
    private $csvProcessor;

    protected function setUp(): void
    {

        $this->csvProcessor = new CsvProcessor();
        $this->testFilePath = __DIR__ . '/fixtures/test.csv';
    }


    public function testParsesCsvFileAndSkipsHeader()
    {

        $result = $this->csvProcessor->parse($this->testFilePath);
        $data = iterator_to_array($result);

        // Should be 12 rows of data, header is skipped
        $this->assertCount(12, $data);
    }

    public function testCorrectlyParsesFirstDataRow()
    {

        $result = $this->csvProcessor->parse($this->testFilePath);
        $data = iterator_to_array($result);

        $expectedFirstRow = [
            'ACME Corporation',
            'John Doe',
            'johndoe@acme.com',
            '50000'
        ];

        $this->assertEquals($expectedFirstRow, $data[0]);
    }

    public function testCorrectlyParsesLastDataRow()
    {

        $result = $this->csvProcessor->parse($this->testFilePath);
        $data = iterator_to_array($result);

        $expectedLastRow = [
            'Wayne Enterprises',
            'Barbara Gordon',
            'barbara@wayneenterprises.com',
            '55000'
        ];

        $this->assertEquals($expectedLastRow, $data[11]);
    }

    public function testThrowsExceptionForNonExistentFile()
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage("File not found or not readable.");

        $this->csvProcessor->parse('non_existent_file.csv');
    }
}