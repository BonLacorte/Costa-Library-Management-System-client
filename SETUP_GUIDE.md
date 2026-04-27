# 🚀 Setup Guide: Costa LMS Client

This is the frontend portal for the **Costa Library Management System**, built with Next.js 15, React 19, and Tailwind CSS. It features dual interfaces: a Patron Portal and an Admin Dashboard.

---

## 🐳 Quick Start with Docker (Recommended)

This is the fastest way to run the frontend.

### Prerequisites
- **Docker Desktop** installed and running.

### Steps

#### 1. Build the Docker Image
Navigate to the `costa-lms-client` directory and run:
```bash
docker build -t costa-lms-client .
```

#### 2. Run the Container
```bash
docker run -p 3000:3000 --name costa-lms-client costa-lms-client
```
The application will be accessible at [http://localhost:3000](http://localhost:3000).

---

## 🔧 Manual Local Development Setup

Use this method for active development.

### Prerequisites
- **Node.js**: v20 or higher.
- **npm**: v10 or higher.

### Steps

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```
*(Ensure this matches the address where your Costa-LMS-Server is running)*.

#### 3. Run Development Server
```bash
npm run dev
```
The application will start on port 3001 (or your configured port).

---

## 🛠 Features
- **Patron Portal**: Catalog browsing, active loans, and fine management.
- **Admin Dashboard**: Real-time stats, user management, and circulation control.
- **Modern UI**: Built with Shadcn/UI and Lucide Icons.
- **Responsive Design**: Optimized for mobile, tablet, and desktop views.

---

## 👨‍💻 Connecting to the Backend
The client communicates with the **Costa-LMS-Server** (Spring Boot). 
- Ensure the backend server is running on `http://localhost:8080`.
- Verify that the `NEXT_PUBLIC_API_URL` environment variable is correctly set.
