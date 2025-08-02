# Start with the official PHP 8.4 image with Apache
FROM php:8.4-apache

# Install the required PHP extensions for MySQL
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache's rewrite module for clean URLs (good practice)
RUN a2enmod rewrite