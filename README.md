# Visitor Management System

A **full-stack Visitor Management System** built using **NestJS Microservices Architecture**, including:

- React Admin Web Dashboard
- Flutter Mobile Application
- NestJS Microservices Backend
- API Gateway
- JWT Authentication
- Role-based access control

The system allows:

- **Residents** (Flutter App) to create visitor requests
- **Admins** (React Admin Panel) to approve or reject visitors

---


# System Architecture

Clients

- React Admin Panel (Admin)
- Flutter Mobile App (Resident)

Backend Services

- API Gateway
- Auth Service
- User Service
- Visitor Service

Databases : **MySQL**
- auth_db
- user_db
- visitor_db

Each microservice uses its **own independent database**.

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
Both **React and Flutter applications consume the same backend API through the API Gateway**.

---

# Technology Stack

## Backend

Framework  
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

Architecture  
Microservices (TCP Transport)

---

## React Admin Web

Framework  
React

Language  
TypeScript

Build Tool  
Vite

State Management  
Redux Toolkit + Redux Saga

HTTP Client  
Axios

UI Library  
Material UI

---

## Flutter Mobile App

Framework  
Flutter

Language  
Dart

State Management  
Bloc

Architecture  
Clean Architecture

---

# Project Structure

```
visitor-management-backend
│
├── admin-react # React Admin Dashboard
├── mobile-flutter # Flutter Resident Mobile App
│
├── api-gateway # NestJS API Gateway
├── auth-service # Authentication microservice
├── user-service # User management microservice
├── visitor-service # Visitor management microservice
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
Flutter >= 3.x  
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

Copy the example file:

```
cp .env.example .env
```

---

# Installation

Clone repository

```
git clone https://github.com/Shubhras/visitor-management-system

cd visitor-management-system
git checkout develop
```

# Install Backend Dependencies
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

## Database Setup (Run Once)

Run database migrations and seeders during the first project setup.

Auth Service
```
cd auth-service
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

User Service
```
cd user-service
npx sequelize-cli db:migrate
```

Visitor Service
```
cd visitor-service
npx sequelize-cli db:migrate
```

---

# Running Services

Each service must run in a **separate terminal**.

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

# Running React Admin Web

Install dependencies

```
cd admin-react
npm install
```

Start development server
```
npm run dev
```

React Admin will run at:
```
http://localhost:3001
```
---

# Running Flutter Mobile App

Install dependencies
```
cd mobile-flutter
flutter pub get
```
Run the app
```
flutter run
```
Make sure backend services are running before starting the mobile app.

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

- Create visitor request
- Update visitor
- Delete visitor
- Approve visitor
- Reject visitor
- Visitor status tracking

---

# Visitor Status

```
PENDING
APPROVED
REJECTED
```

---

# Role Based Access

## Admin (React)

- Approve visitor
- Reject visitor
- Delete visitor
- View all visitors

## Resident (Flutter)

- Create visitor request
- View own visitor requests

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
---

# ER Diagrams

### Client to Gateway Flow
![Client to Gateway Flow](ER-Diagram/Client%20to%20Gateway%20Flow.png)

### Conceptual Database ER Diagram
![Conceptual Database ER Diagram](ER-Diagram/Conceptual%20Database%20ER%20Diagram.png)