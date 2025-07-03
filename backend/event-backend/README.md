# Event Management Platform – Backend (Laravel)

## Overview

This is the backend API for the Event Management Platform, built with Laravel. It supports user registration, authentication, event and company management, notifications, reporting, and admin workflows.

---

## Features

- RESTful API for frontend integration
- User registration (attendee/organizer), login, and social authentication (Socialite)
- Organizer onboarding and company profile management
- Email verification and notifications
- SMS notifications (Twilio integration)
- Event creation, approval, and management
- Admin user and company management
- Comprehensive reporting endpoints (attendance, tickets, revenue, etc.)
- Role-based access control

---

## Setup Instructions

### Prerequisites

- PHP 8.1+
- Composer
- MySQL or compatible database

### Installation

1. Install dependencies:

   ```sh
   composer install
   ```

2. Copy `.env.example` to `.env` and configure database, mail, and Twilio settings.

3. Generate application key:

   ```sh
   php artisan key:generate
   ```

4. Run migrations and seeders:

   ```sh
   php artisan migrate --seed
   ```

5. (Optional) Install npm dependencies for asset compilation:

   ```sh
   npm install && npm run dev
   ```

6. Start the server:

   ```sh
   php artisan serve
   ```

---

## API Endpoints

- See `routes/api.php` for all available endpoints.
- Auth, event, company, report, and admin routes are available.

---

## Environment Variables

- Configure database, mail, and Twilio credentials in `.env`.
- Set up Socialite credentials for Google, Facebook, LinkedIn.

---

## User Guide

See [../../USER_GUIDE.md](../../USER_GUIDE.md) for user-facing instructions.

---

## Support

For backend issues, contact your system administrator.
