<div align="center">

# 📚 PlotHub API

### The backend engine powering PlotHub — a writing & reading platform for African storytelling

A type-safe, secure REST API built with Express and TypeScript, providing authentication, session management, and (soon) the full novel publishing and reading experience for PlotHub's web and mobile clients.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat&logoColor=black)](https://orm.drizzle.team/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat)](#-license)
[![Status](https://img.shields.io/badge/Status-MVP%20In%20Development-orange?style=flat)](#-roadmap)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Server](#-running-the-server)
- [API Overview](#-api-overview)
- [Authentication Flow](#-authentication-flow)
- [Error Handling](#-error-handling)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)
- [Support / Contact](#-support--contact)

---

## 📝 About

**PlotHub API** is the backend service that powers PlotHub — a platform where writers publish novels and readers discover and enjoy them, built with African storytelling at its core.

This repository contains **only the API server**. It exposes a REST interface consumed by PlotHub's separate web (React) and mobile (React Native) clients.

The API is currently in **active MVP development**, with a production-grade authentication and session system fully implemented as the foundation for the platform's core writing and reading features.

---

## ✨ Features

### ✅ Available Now

- 🔐 User registration & login
- 📩 Email verification via OTP
- 🔑 Secure password reset flow
- 🪪 JWT-based authentication
- 🔄 Refresh token rotation
- 📱 Multi-device session management
- 🖥️ Device identification & tracking
- 🌐 Unified web & mobile authentication
- ⏱️ Rate limiting on sensitive endpoints
- 🔒 Secure password hashing with bcrypt

### 🚧 Coming Soon

- 👤 User profiles
- 📗 Novel creation & management
- 📑 Chapter management
- 📜 Reading history
- 📚 Personal library
- ⭐ Reviews
- 💬 Comments
- 🤖 AI writing assistant
- 💰 Monetization (pay-per-chapter / coins)
- 🧾 Subscriptions

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express.js** | Web application framework |
| **TypeScript** | Static typing & tooling |
| **PostgreSQL** | Primary relational database |
| **Drizzle ORM** | Type-safe database access & migrations |
| **JWT** | Stateless authentication tokens |
| **bcrypt** | Password hashing |
| **Zod** | Runtime schema validation |
| **Pino** | High-performance structured logging |

> This is a backend-only repository. The web client (React + TanStack Query) and mobile client (React Native + Expo) live in separate repositories and consume this API over REST.

---

## 🏗️ Architecture Overview

The API follows a **modular, layered architecture**, separating routing, business logic, and data access so new domains (novels, chapters, payments) can be added without disturbing the existing auth system.

```
┌─────────────────────────────────────────────────────┐
│              Clients (Web & Mobile Apps)              │
└───────────────────────┬───────────────────────────────┘
                         │ REST API (JSON over HTTPS)
┌───────────────────────▼───────────────────────────────┐
│                    Express.js API                     │
│  ┌───────────┐  ┌────────────┐  ┌──────────────────┐  │
│  │  Routes   │→ │ Controllers│→ │     Services      │  │
│  └───────────┘  └────────────┘  └─────────┬────────┘  │
│  ┌───────────────────────────────────────▼─────────┐  │
│  │        Middleware (Auth, Rate Limit, Zod)        │  │
│  └───────────────────────────────────────────────────┘│
└───────────────────────┬───────────────────────────────┘
                         │ Drizzle ORM
┌───────────────────────▼───────────────────────────────┐
│                    PostgreSQL Database                │
└─────────────────────────────────────────────────────────┘
```

**Key design principles:**

- 🧩 **Separation of concerns** — routes, controllers, services, and data access are isolated
- 🛡️ **Validation-first** — all incoming requests are validated with Zod before reaching business logic
- 🔁 **Stateless auth** — JWT access tokens paired with rotating refresh tokens stored per device/session
- 📊 **Observability** — structured logging via Pino across all requests and errors
- 🧱 **Domain-driven modules** — each feature area (auth, users, novels, etc.) is self-contained

---

## 📁 Project Structure

```
plothub-api/
├── src/
│   ├── config/                # Environment & app configuration
│   ├── db/
│   │   ├── schema/             # Drizzle ORM table schemas
│   │   ├── migrations/         # Generated SQL migrations
│   │   └── index.ts            # Database connection instance
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.schema.ts   # Zod validation schemas
│   │   ├── users/
│   │   └── sessions/
│   ├── middleware/
│   │   ├── authenticate.ts
│   │   ├── rateLimiter.ts
│   │   └── errorHandler.ts
│   ├── utils/
│   │   ├── logger.ts            # Pino logger instance
│   │   ├── hash.ts              # bcrypt helpers
│   │   └── tokens.ts            # JWT helpers
│   ├── app.ts                   # Express app setup
│   └── server.ts                # Entry point
├── .env.example
├── drizzle.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) `v18+`
- [PostgreSQL](https://www.postgresql.org/) `v14+`
- [npm](https://npm.io/) (or npm/yarn)
- [Git](https://git-scm.com/)

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/godswill-lucky/plothub-api.git

# Move into the project directory
cd plothub-api

# Install dependencies
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file using `.env.example` as a template:

```bash
cp .env.example .env
```

**`.env.example`**

```env
# App
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/plothub

# JWT
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# Email (OTP / Verification)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
EMAIL_FROM=no-reply@plothub.com

# Security
BCRYPT_SALT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

> ⚠️ Never commit your `.env` file. It's already included in `.gitignore`.

---

## 🗄️ Database Setup

PlotHub API uses **PostgreSQL** with **Drizzle ORM** for schema management and type-safe queries.

```bash
# Generate migration files from your schema
npm drizzle-kit generate

# Apply migrations to your database
npm drizzle-kit migrate

# (Optional) Open Drizzle Studio to inspect your data
npm drizzle-kit studio
```

Make sure your `DATABASE_URL` in `.env` points to a running PostgreSQL instance before running migrations.

---

## ▶️ Running the Server

```bash
# Run in development mode (with hot reload)
npm run dev

# Build for production
npm run  build

# Run the production build
npm run start
```

The API will be available at:

```
http://localhost:5000
```

---

## 📡 API Overview

All endpoints are prefixed with `/api/v1`.

### Auth Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register` | Register a new user | ❌ |
| `POST` | `/auth/verify-otp` | Verify email using OTP | ❌ |
| `POST` | `/auth/login` | Login and receive tokens | ❌ |
| `POST` | `/auth/refresh-token` | Rotate access & refresh tokens | ❌ |
| `POST` | `/auth/logout` | Revoke current session | ✅ |
| `POST` | `/auth/forgot-password` | Request a password reset | ❌ |
| `POST` | `/auth/reset-password` | Reset password using token | ❌ |
| `GET` | `/auth/sessions` | List active sessions/devices | ✅ |
| `DELETE` | `/auth/sessions/:id` | Revoke a specific session | ✅ |

**Example Request — Register**

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "writer@example.com",
    "password": "StrongPassword123!",
    "fullName": "Ada Okafor"
  }'
```

**Example Response**

```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "userId": "b3f1e2a0-1234-4c56-9abc-9876543210ef",
    "email": "writer@example.com"
  }
}
```

> 📌 A full OpenAPI/Postman spec is planned as the API surface grows beyond auth.

---

## 🔑 Authentication Flow

PlotHub API uses a **JWT access + rotating refresh token** strategy, with device-aware sessions to support both web and mobile clients securely.

```
1. User registers  →  OTP sent to email
2. User verifies OTP  →  Account activated
3. User logs in  →  Access token (short-lived) + Refresh token (long-lived) issued
4. Refresh token stored per device/session (multi-device support)
5. Access token used for authenticated requests
6. On expiry → client calls /auth/refresh-token
7. Server rotates refresh token → issues new access + refresh pair
8. Old refresh token invalidated (rotation prevents reuse/replay attacks)
9. Logout → current session's refresh token revoked
```

**Security measures in place:**

- 🔐 Passwords hashed with bcrypt before storage
- ♻️ Refresh token rotation to prevent token replay
- 📱 Per-device session tracking (users can view & revoke sessions)
- ⏱️ Rate limiting on auth endpoints to mitigate brute-force attacks
- ✅ Strict input validation with Zod on every request

---

## ⚠️ Error Handling

The API returns consistent, structured error responses across all endpoints:

```json
{
  "success": false,
  "message": "Invalid email or password",
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "statusCode": 401
  }
}
```

| Status Code | Meaning |
|---|---|
| `400` | Validation error (Zod) |
| `401` | Unauthorized / invalid credentials |
| `403` | Forbidden |
| `404` | Resource not found |
| `409` | Conflict (e.g. duplicate email) |
| `429` | Too many requests (rate limited) |
| `500` | Internal server error |

---

## 🗺️ Roadmap

- [x] Authentication & session management
- [x] Multi-device support
- [ ] User profiles
- [ ] Novel creation & publishing
- [ ] Chapter management
- [ ] Personal library & reading history
- [ ] Reviews & comments
- [ ] AI-powered writing assistant
- [ ] Monetization (coins / pay-per-chapter)
- [ ] Subscription plans
- [ ] Public API documentation (OpenAPI/Swagger)

---

## 🤝 Contributing

PlotHub API is currently under active private development. Contribution guidelines will be published once the project opens up to external collaborators.

---

## 📄 License

Copyright © 2026 **Godswill Lucky**. All rights reserved.

This project and its source code are proprietary. No part of this repository may be copied, modified, distributed, or used without explicit written permission from the author.

---

## 👤 Author

**Godswill Ogbodu**

Full-stack Web & Mobile Developer, building PlotHub.

- 💻 GitHub: [@godswillo243](https://github.com/godswillo243)
- 🌐 Building in public across TikTok, X, LinkedIn, Facebook & Instagram

---

## 💬 Support / Contact

- 📧 Email: **support@plothub.com**
- 🐛 Found a bug? Open an issue on the repository
- ⭐ If you like this project, consider starring the repo!

<div align="center">

**Built with ❤️ for African storytellers and readers.**

</div>
