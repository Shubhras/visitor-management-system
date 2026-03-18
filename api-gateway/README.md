# API Gateway

Single HTTP entry point for all clients — React Admin and Flutter App.
Handles JWT validation, role guards, and routes requests to microservices via TCP.
Runs on port **3000**.

## Setup
```bash
npm install
cp .env.example .env
```

## Environment Variables
```env
APP_PORT=3000

JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key

AUTH_SERVICE_HOST=localhost
AUTH_SERVICE_PORT=4001

USER_SERVICE_HOST=localhost
USER_SERVICE_PORT=4002

VISITOR_SERVICE_HOST=localhost
VISITOR_SERVICE_PORT=4003
```

## Start
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Docs

Swagger UI available at:
```
http://localhost:3000/api/docs
```

## Start All Services

Run each in a separate terminal in this order:
```bash
cd auth-service    && npm run start:dev
cd user-service    && npm run start:dev
cd visitor-service && npm run start:dev
cd api-gateway     && npm run start:dev
```

## Quick Test
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"123456"}'
```