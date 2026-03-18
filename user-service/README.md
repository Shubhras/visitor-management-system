# User Service

Manages user profiles. Synced automatically from Auth Service on register.
Runs as a TCP microservice on port **4002**.

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
DB_NAME=user_db

TCP_PORT=4002
```

## Database
```bash
npx sequelize-cli db:migrate
```

## Start
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

> Profiles are created automatically when a user registers via Auth Service.