# ГО «ЛЕГІОН ТИТАНІВ» — Premium SPA (Vite + React + Tailwind + Framer Motion) + PHP/MySQL API

## Запуск
```bash
npm install
npm run dev
```
Відкрити: http://localhost:3000

## Деплой на shared-хостинг без Node.js (SPA + PHP/MySQL)
Фронтенд — **SPA на `index.html`**, бекенд — **PHP/MySQL** у `/api/*`.

### 1) Зібрати сайт
```bash
npm install
npm run build
```
Після збірки зʼявиться папка `dist/`.

### 2) Завантажити на хостинг
- Залий **вміст** `dist/` у корінь сайту (зазвичай `public_html/` або `www/`).
- В `dist/` вже є `.htaccess` і папка `api/` з PHP-ендпоїнтами.

### 3) MySQL
- Створи базу/користувача в панелі.
- Імпортуй `database/schema.sql` (через phpMyAdmin).

### 4) Налаштувати PHP конфіг (секрети)
На сервері створи файл:
- `public_html/api/config.local.php`

Скопіюй основу з `public/api/config.local.php.example` і заповни:
- DB (host/name/user/pass)
- SMTP (host/port/secure/user/pass/from/to)
- ADMIN пароль (краще `password_hash`, або тимчасово plaintext)

### 5) Перевірка
- Публічний сайт: `/`
- Архів: `/thanks`
- Адмінка: `/admin`

## Редагування контенту
- Загальні дані/тексти: `src/content/site.ts`
- Секції: `src/components/sections/*`
- Хедер/футер: `src/features/header/*`, `src/features/footer/*`

## Мови
Зараз UI перемикач UA/EN працює як перемикач текстів з локального контент-файлу.
## Модерація подяк (Admin)

### Налаштування ENV
На shared-хостингу без Node.js секрети задаються через `api/config.local.php` (див. `public/api/config.local.php.example`).

- `/admin` good for moderators (1 пароль, сесія 30 хвилин).
- На публічному сайті відображаються лише записи зі статусом `APPROVED`.

### Антиспам
Увімкнено: honeypot + rate limit (6 відправок / 10 хвилин / IP).  
Turnstile можна увімкнути, додавши секрет у `api/config.local.php`.

