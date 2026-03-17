# Visitor Management System (Microservices Backend)

This project is a **Visitor Management Backend System** built using **NestJS Microservices Architecture**.

The system allows residents to create visitor requests and administrators to approve or reject those requests.

The backend is designed to support both:

* React Admin Panel
* Flutter Mobile Application

---

# System Architecture

Clients

* React Admin Panel (Admin)
* Flutter Mobile App (Resident)

Backend

* API Gateway
* Auth Service
* User Service
* Visitor Service

Databases

* MySQL
* auth_db
* user_db
* visitor_db

Each microservice has its own independent database.

---

# Architecture Diagram

```
React Admin
     |
Flutter App
     |
API Gateway
     |
---------------------------------------
|           |            |
Auth        User         Visitor
Service     Service      Service
|           |            |
Auth DB     User DB      Visitor DB
```

---

# Technology Stack

Backend Framework
NestJS

Language
TypeScript

Database
MySQL

ORM
Sequelize ORM

Authentication
JWT

Validation
class-validator

Documentation
Swagger

---

# Project Structure

```
visitor-management-backend
│
├── api-gateway
├── auth-service
├── user-service
├── visitor-service
│
├── shared
│   ├── dto
│   ├── enums
│   └── interfaces
│
└── README.md
```

---

# Prerequisites

Install the following tools.

Node.js >= 18
npm >= 9
MySQL >= 8
NestJS CLI

Install Nest CLI

```
npm install -g @nestjs/cli
```

---

# Database Setup

Create three databases in MySQL.

```
CREATE DATABASE auth_db;
CREATE DATABASE user_db;
CREATE DATABASE visitor_db;
```

---

# Environment Variables

Each microservice should have its own `.env` file.

Copy .env file from the `.env.example` file and update the configure:

```
cp .env.example .env
```

---

# Installation

Clone repository

```
git clone https://github.com/Shubhras/visitor-management-system
cd visitor-management-backend
git checkout deveplopment
```

Install dependencies for each service.

```
cd auth-service
npm install

cd ../user-service
npm install

cd ../visitor-service
npm install

cd ../api-gateway
npm install
```

---

# Running Services

Each service should run in a separate terminal.

Start Auth Service

```
cd auth-service
npm run start:dev
```

Start User Service

```
cd user-service
npm run start:dev
```

Start Visitor Service

```
cd visitor-service
npm run start:dev
```

Start API Gateway

```
cd api-gateway
npm run start:dev
```

---

# Default Ports

```
API Gateway     : 3000
Auth Service    : 4001
User Service    : 4002
Visitor Service : 4003
```

---

# Main Features

Authentication

* Register
* Login
* JWT token
* Refresh token

User Management

* Create user
* Update user
* Fetch users
* Role assignment

Visitor Management

* Create visitor request
* Approve visitor
* Reject visitor
* Visitor status tracking

---

# Visitor Status

```
PENDING
APPROVED
REJECTED
```

---

# Role Based Access

Admin

* Approve visitor
* Reject visitor
* View all visitors

Resident

* Create visitor request
* View own visitors

---

# API Flow

```
Client
   |
API Gateway
   |
---------------------------------------
|           |            |
Auth        User         Visitor
Service     Service      Service
```

Gateway handles:

* JWT validation
* Role guards
* Request routing

---

# Database Migrations

Sequelize CLI is used for migrations.

Run migrations:

```
npx sequelize-cli db:migrate
```

Create migration:

```
npx sequelize-cli migration:generate --name create-users
```

Run All Seeders:

```
npx sequelize-cli db:seed:all
```

---

# API Documentation

Swagger documentation will be available from API Gateway.

```
http://localhost:3000/api/docs
```
