# Event Management Platform – Frontend

## Overview

A modern event management platform for attendees, organizers, and admins. Features include onboarding, registration, company profiles, event approvals, notifications, social login, reporting, and robust admin flows.

---

## Features

- Attendee and organizer registration with real-time validation
- Company profile onboarding for organizers
- Email verification and welcome emails
- Social signup (Google, Facebook, LinkedIn)
- Event creation, approval, and management
- SMS notifications for ticket purchases
- Role-based navigation and dashboards
- Comprehensive admin reports (attendance, tickets, revenue, etc.)
- User and company management (search, edit, delete)
- Responsive UI for mobile and desktop

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Setup

1. Install dependencies:

   ```sh
   npm install
   # or
   yarn install
   ```

2. Start the development server:

   ```sh
   npm start
   # or
   yarn start
   ```

   The app runs at [http://localhost:3000](http://localhost:3000).

### Build for Production

```sh
npm run build
```

---

## User Guide

See [../USER_GUIDE.md](../USER_GUIDE.md) for detailed user instructions for all roles.

---

## Environment Variables

- Configure API endpoints and social login keys in `.env` as needed.

---

## Project Structure

- `src/pages/` – Main pages (SignUp, OrganizerProfile, Reports, Admin, etc.)
- `src/components/` – Reusable UI components
- `src/services/api.js` – API integration

---

## Support

For issues or questions, contact your system administrator.
