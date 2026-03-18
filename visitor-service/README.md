# Visitor Service

Manages visitor records — create, list, approve, reject.
Runs as a TCP microservice on port **4003**.

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
DB_NAME=visitor_db

TCP_PORT=4003
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

> Visitor status values: `PENDING` `APPROVED` `REJECTED`
> Only admins can approve or reject. Residents manage their own pending records only.