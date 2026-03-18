# Visitor Management System (VMS) - Admin Panel

A modern, high-performance Visitor Management System built with **React 19**, **TypeScript**, and **Material UI**. This admin panel allows for efficient visitor tracking, status management (Approve/Reject), and real-time monitoring.

##  Key Features

- **Intuitive Dashboard**: Overview of visitor statistics and system status.
- **Advanced Visitor Management**: Full CRUD (Create, Read, Update, Delete) operations for visitors.
- **Status Workflow**: Approve or Reject visitor requests with instant UI feedback.
- **Smart Filtering**: Search and filter visitors by name, status, or date.
- **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile screens.
- **Secure Auth**: Token-based authentication with automatic refresh mechanism.
- **Premium UI**: Clean, modern aesthetics with Material UI and custom styling.

---

## 🛠️ Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### Local Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Shubhras/visitor-management-system.git
   cd admin-react
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and configure your API base URL:
   ```bash
   VITE_API_BASE_URL=http://localhost:3000/
   VITE_APP_NAME="Visitor Management Admin"
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

---

##  Environment Configuration

The project uses mode-based configurations for different stages:

- **Development (`.env`)**: Default dev settings.
- **Staging (`.env.staging`)**: Settings for staging environment.
- **Production (`.env.production`)**: Optimized production settings.

**Build Commands**:
```bash
# Build for staging
npm run build -- --mode staging

# Build for production
npm run build -- --mode production
```

---

##  Tech Stack

- **Core**: React 19, TypeScript, Vite
- **UI Framework**: Material UI (MUI) v7
- **Icons**: MUI Icons (Material Design)
- **State Management**: Redux Toolkit & Redux-Saga
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Date Handling**: Luxon
- **API Client**: Axios (with Interceptors for Auth)

---

##  Available Scripts

- `npm run dev`: Starts the local development server on port 3001.
- `npm run build`: Compiles the application for production.
- `npm run lint`: Runs ESLint to identify code quality issues.
- `npm run preview`: Locally previews the generated production build.

---

##  Deployment

1. **Build the project**: `npm run build`
2. **Output**: The optimized files will be in the `dist/` directory.
3. **Serving**: Use Nginx or any static host. Ensure you handle client-side routing by redirecting all requests to `index.html`.

**Nginx Config Snippet**:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```
