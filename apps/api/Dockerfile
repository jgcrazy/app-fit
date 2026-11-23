FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction
COPY . .
RUN composer dump-autoload --optimize --no-dev

FROM php:8.3-fpm-alpine AS runtime
RUN apk add --no-cache postgresql-dev icu-dev oniguruma-dev nginx supervisor \
    && docker-php-ext-install pdo_pgsql bcmath intl opcache pcntl

WORKDIR /var/www/html
COPY --from=vendor /app .

RUN addgroup -g 1000 app && adduser -u 1000 -G app -s /bin/sh -D app \
    && chown -R app:app storage bootstrap/cache

ENV APP_ENV=production APP_DEBUG=false
EXPOSE 9000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD php artisan app:health || exit 1

USER app
CMD ["php-fpm", "-F"]
