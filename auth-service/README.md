# Auth Service

Handles authentication — login, register, JWT tokens, password reset.
Runs as a TCP microservice on port **4001**.

## Setup
```bash
npm install
cp .env.example .env
```

## Environment Variables
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=yourpassword
DB_NAME=auth_db

JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

TCP_PORT=4001

USER_SERVICE_HOST=localhost
USER_SERVICE_PORT=4002
```

## Database
```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

## Start
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

> Default admin seeded: `admin@test.com` / `123456`