FROM php:8.4-fpm-alpine

# Extensions système
RUN apk add --no-cache \
    postgresql-dev \
    libpq \
    oniguruma-dev \
    libxml2-dev

# Extensions PHP
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    pgsql \
    mbstring \
    xml \
    opcache

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Répertoires de logs
RUN mkdir -p /var/log/php /var/log/php-fpm \
    && chown -R www-data:www-data /var/log/php /var/log/php-fpm

# Configs
COPY php.ini /usr/local/etc/php/php.ini
COPY php-fpm.conf /usr/local/etc/php-fpm.d/www.conf

WORKDIR /var/www/html

USER www-data
