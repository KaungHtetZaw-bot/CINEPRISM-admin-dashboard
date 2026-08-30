# CinePrism - Vue Admin Dashboard

[React frontend](https://cineprism-frontend.vercel.app/) · [Frontend repository](https://github.com/KaungHtetZaw-bot/CINEPRISM_Frontend) · [Laravel API](https://github.com/KaungHtetZaw-bot/movie-app-backend)

This Vue dashboard is the operations interface for CinePrism. It gives administrators a focused place to review VIP purchase receipts and manage the product data behind the customer-facing movie and TV application.

## Features

- Review and approve or reject VIP purchase requests
- Manage subscription plans and payment accounts
- View and manage users with role-aware access
- Work with operational settings and dashboard data
- Use JWT-protected API requests with token refresh handling
- Resolve image paths from the Laravel API and show request progress feedback

## Stack

- Vue 3 and Vue Router
- Pinia for client state
- Element Plus UI components
- Axios and NProgress
- Vite and Sass

## Run locally

Prerequisites: a running CinePrism Laravel API and Node.js 20.19+ or 22.12+.

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_IMAGE_BASE_URL=http://127.0.0.1:8000
```

Then run:

```bash
npm run dev
```

## Available scripts

```bash
npm run dev
npm run build
npm run preview
```

## Project status

This dashboard is part of the CinePrism portfolio prototype. It is designed to demonstrate a real operational workflow rather than a generic admin template.
