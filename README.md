# CyberInsight Web

CyberInsight Web is the React.js frontend for the CyberInsight platform. It communicates with the existing FastAPI backend to provide cybersecurity scanning, dashboard analytics, scan history, and reporting.

## Tech Stack

- React
- Vite
- React Router
- Axios
- Context API
- CSS
- FastAPI (Backend)

## Project Structure

```
src/
├── api/
├── assets/
├── components/
├── contexts/
├── hooks/
├── layouts/
├── models/
├── pages/
├── routes/
├── services/
├── storage/
├── styles/
├── utils/
├── App.jsx
└── main.jsx
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the project root.

Example:

```env
VITE_API_URL=http://localhost:8000/api
```

Use it inside your application:

```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

## Backend

The application expects the FastAPI backend to be running.

Example:

```
http://localhost:8000
```

## Features

- User Authentication
- Dashboard
- Scan Management
- Scan Results
- History
- User Profile
- Protected Routes
- JWT Authentication

## Scripts

| Command | Description |
|----------|-------------|
| npm run dev | Start development server |
| npm run build | Production build |
| npm run preview | Preview production build |
| npm run lint | Run ESLint |

## License

Private project.