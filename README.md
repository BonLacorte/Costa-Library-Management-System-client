# Costa Library Management System (Costa-LMS) - Client

A modern, unified library administration and patron portal built with **Next.js 15**, **React 19**, and **Tailwind CSS**. Designed with a "Neo-Academic" aesthetic, this application provides a seamless interface for both library patrons and administrators.

---

## 🚀 Overview

Costa-LMS Client is the frontend component of a full-stack library management solution. It communicates with the **Costa-LMS-Server** (Spring Boot) to provide real-time catalog management, circulation tracking, and automated billing services.

The project emphasizes a clean, responsive user experience, high-performance data fetching, and robust security through stateless JWT authentication.

## ✨ Key Features

### 👤 Patron Portal
- **Digital Catalog:** Browse books with advanced filtering by genre, author, and availability.
- **Loan Management:** Track active loans, due dates, and return history.
- **Queue-Based Reservations:** Place holds on unavailable books with real-time queue position tracking.
- **Billing & Payments:** Securely pay overdue fines and manage premium subscriptions via **Razorpay**.

### 🔑 Admin Dashboard
- **Real-Time Analytics:** 8 dynamic KPI widgets fetching data concurrently (Books, Users, Revenue, Active Loans, etc.) using `Promise.allSettled`.
- **Circulation Control:** Process physical checkouts and returns with instant database updates.
- **User Management:** Monitor patron activities, subscription statuses, and fine history.
- **Inventory Management:** Full CRUD operations for books and genres.

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn/UI
- **Icons:** Lucide React
- **Authentication:** Stateless JWT (Stored in LocalStorage)
- **Containerization:** Docker (Multi-stage build with Standalone Output)

---

## 🐳 Getting Started

The project is fully containerized for easy deployment and evaluation.

### Quick Start with Docker
```bash
# Build the image
docker build -t costa-lms-client .

# Run the container
docker run -p 3000:3000 costa-lms-client
```

For detailed manual setup instructions, environment variable configuration, and backend connectivity, please refer to the [**SETUP_GUIDE.md**](./SETUP_GUIDE.md).

---

## 📄 Documentation
- [**Architecture Overview**](./architecture_overview-Costa-LMS.md): Detailed system design and diagrams.
- [**Setup Guide**](./SETUP_GUIDE.md): Step-by-step installation for local development.
- [**Portfolio Presentation Strategy**](./portfolio_presentation-Costa-LMS.md): Guide on how to showcase this project to recruiters.

---

## 👨‍💻 Developer
**Florence Bon Lacorte**
- GitHub: [@BonLacorte](https://github.com/BonLacorte)
- Project: Costa-LMS
