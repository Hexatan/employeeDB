<?php
namespace App\Infrastructure;

use PDO;
use PDOException;

/**
 * Database connection class implementing the Singleton pattern.
 * 
 * This class ensures only one database connection is created per request,
 * which helps optimize resource usage and maintain consistency.
 */
class Database {
    private static ?PDO $instance = null;

    private function __construct() {}

    private function __clone() {}

    /**
     * Get the singleton PDO database instance.
     * 
     * Creates a new PDO connection if one doesn't exist, otherwise returns
     * the existing instance. Database credentials are read from environment
     * variables for security.
     * 
     * @return PDO The database connection instance
     * @throws PDOException When database connection fails
     */
    public static function getInstance(): PDO {
        if (self::$instance === null) {
            $db_host = getenv('DB_HOST');
            $db_name = getenv('DB_NAME');
            $db_user = getenv('DB_USER');
            $db_pass = getenv('DB_PASS');
            $dsn = "mysql:host={$db_host};dbname={$db_name};charset=utf8";

            try {
                self::$instance = new PDO($dsn, $db_user, $db_pass, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]);
            } catch (PDOException $e) {
                // In a real app, log this error instead of echoing
                die('Connection failed: ' . $e->getMessage());
            }
        }
        return self::$instance;
    }
}
