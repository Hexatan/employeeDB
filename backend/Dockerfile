# Start with the official PHP 8.4 image with Apache
FROM php:8.4-apache

# Install system dependencies
RUN apt-get update && apt-get install -y git zip unzip

# Install Composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && php -r "unlink('composer-setup.php');"

# Install the required PHP extensions for MySQL
RUN docker-php-ext-install pdo pdo_mysql

RUN pecl install xdebug \
    && docker-php-ext-enable xdebug

# Enable Apache's rewrite module for clean URLs (good practice)
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy composer files first (for better Docker layer caching)
COPY composer.json composer.lock* ./

# Install dependencies
RUN composer install --optimize-autoloader --no-interaction --dev

# Copy the rest of the application
COPY . .