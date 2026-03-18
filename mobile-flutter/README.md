
# 📱 Visitor Management - Flutter App

## Overview

This is a Flutter mobile application for the Visitor Management System.

The app allows residents to:

- Login using JWT authentication  
- View visitor list (with pagination)  
- Create new visitors  
- Logout securely  

The application follows Clean Architecture, uses Bloc for state management, and integrates with a NestJS backend API.

---

## Tech Stack

- Flutter (Latest Stable)
- Dart
- Bloc (State Management)
- HTTP / API Integration
- Clean Architecture (Feature-based)
- Environment Configuration (.env)

---

## Project Structure

lib/
│
├── core/
│   ├── constants/
│   ├── services/
│   └── utils/
│
├── features/
│   ├── auth/
│   │   ├── data/
│   │   └── presentation/
│   │
│   └── visitor/
│       ├── data/
│       └── presentation/
│
├── shared/
│   └── widgets/
│
└── main.dart

---

## Setup Instructions

### Clone Repository

git clone https://github.com/Shubhras/visitor-management-system  
cd visitor-management-system/mobile-flutter

---

### Install Dependencies

flutter pub get

---

### Environment Setup

The project includes multiple environment configuration files:

.env.dev.example  
.env.staging.example  
.env.prod.example  

Setup steps:

1. Rename the required environment file by removing `.example` from its name:

.env.dev  
.env.staging  
.env.prod  

2. Choose the appropriate file based on your environment.

3. Ensure the correct BASE_URL is configured inside the selected file:

BASE_URL=http://localhost:3000

---

### Run App

#### Development (default)
flutter run

#### Staging
flutter run --dart-define=ENV=staging

#### Production
flutter run --dart-define=ENV=prod

---

## Authentication Flow

1. User enters email & password  
2. API call → /auth/login  
3. JWT token received  
4. Token stored locally  
5. Navigate to Visitor List  

---

## App Flow

Login Screen → Visitor List → Create Visitor → Logout

---

## Features

- Login API integration  
- Visitor List (pagination)  
- Create Visitor  
- Logout  
- Form validation  
- Reusable UI  
- Error handling  
- Shimmer loading  

---

## Build APK

flutter build apk --release

---

## Supported Platforms

- Android  
- iOS  

---

## Developer Notes

Email: john@test.com  
Password: 123456  

---

## Environment Configuration

### Localhost (Development)
BASE_URL=http://localhost:3000  
 Not working on real devices

### Android Emulator
BASE_URL=http://10.0.2.2:3000  

### Real Device
BASE_URL=http://192.168.X.X:3000  

Requirements:
- Same WiFi  
- Backend running  

---

### Dev Tunnel (Recommended)

BASE_URL=https://xxxxx-3000.devtunnels.ms  

Steps:
1. Run backend:
   npm run start:dev  

2. Start tunnel:
   npx devtunnel host -p 3000  

3. Copy URL and update BASE_URL  

4. Run Flutter app  

Advantages:
- Works on real devices  
- No IP configuration needed  
- Easy team sharing  
