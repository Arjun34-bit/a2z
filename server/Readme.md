# a2z Drop Shipping Portal - Server

This is the backend server for the **a2z Drop Shipping Portal**. It provides a robust API for handling user and admin order placement, generating Purchase Orders (POs) to suppliers, and managing secure authentication.

## Features

- **OTP-Based Authentication**: Secure login system using OTPs managed with Redis and PostgreSQL.
- **JWT Authorization**: Token-based access control for API endpoints.
- **Role-Based Access**: Specialized routing and functionality for Users and Admins.
- **Order Management**: Endpoints for users and admins to place and manage drop shipping orders.
- **Purchase Order (PO) Generation**: Admins can automatically generate POs and assign them to single or multiple suppliers.
- **Data Validation**: Strict runtime request payload validation using Zod.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Cache/In-Memory Storage**: Redis (used for OTP storage & expiration)
- **Validation**: Zod
- **Security**: Helmet, Bcrypt, CORS, JSON Web Tokens (JWT)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL running locally or remotely
- Redis server
- WSL (if running Redis natively on Windows)

### Installation

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the `server` directory and configure your database credentials, Redis URL, JWT secrets, and PORT.

### Running the Application

To start the development server with live reload (ts-node-dev):
```bash
npm run dev
```

To build and run for production:
```bash
npm run build
npm start
```

## Useful Commands

### Redis Server Start Command
If you are running Redis on Windows via WSL, use the following command to start the service before running the server:
```bash
wsl sudo service redis-server start
```