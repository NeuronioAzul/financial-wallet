FROM php:8.4-fpm-alpine

# Arguments
ARG UID=1000
ARG GID=1000

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libxml2-dev \
    zip \
    unzip \
    sockets \
    postgresql-dev \
    shadow \
    $PHPIZE_DEPS

# Configure GD with JPEG and FreeType support
RUN docker-php-ext-configure gd \
    --with-freetype \
    --with-jpeg

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql pgsql gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create user with same UID/GID as host user
RUN deluser --remove-home www-data 2>/dev/null || true && \
    addgroup -g ${GID} appgroup && \
    adduser -D -u ${UID} -G appgroup appuser

# Set working directory
WORKDIR /var/www/html

# Set permissions
RUN chown -R appuser:appgroup /var/www/html

USER appuser

