# Visitor Management System (VMS) - Frontend

A modern, feature-rich Visitor Management System built with React, TypeScript, and Material UI. 

##  Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

###  Local Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory (copy from `.env.example` if available) and configure your API base URL:
   ```bash
   VITE_API_BASE_URL=http://localhost:8000/index.php/api
   VITE_APP_NAME="Visitor Management Admin"
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

---

##  Environment Configuration

The project uses environment-based configurations. You can create different `.env` files for different stages:

- **Development (`.env`)**: Used during `npm run dev`.
- **Staging (`.env.staging`)**: Used for staging builds.
- **Production (`.env.production`)**: Used for final production builds.

**Example variables**:
- `VITE_API_BASE_URL`: The root URL for your backend API.
- `VITE_APP_NAME`: Title of the application.

To build for a specific mode, use:
```bash
# Build for staging
vite build --mode staging

# Build for production
vite build --mode production
```

---

##  Deployment (Server)

To deploy the application to a production server:

1. **Generate the build**:
   ```bash
   npm run build
   ```
   This will create a `dist/` folder with optimized static assets.

2. **Serve the build**:
   You can serve the `dist/` folder using any static web server (Nginx, Apache, or Vercel/Netlify).
   
   **Nginx Configuration Example**:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /path/to/project/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

---

##  Tech Stack

- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **State Management**: Redux Toolkit & Redux-Saga
- **UI Library**: Material UI (MUI)
- **Form Handling**: React Hook Form & Zod (Validation)
- **API Client**: Axios

##  Available Scripts

- `npm run dev`: Starts the local development server.
- `npm run build`: Compiles the application for production.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run preview`: Previews the production build locally.
