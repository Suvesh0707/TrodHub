# 🚀 Student Marketplace - Microservices Roadmap & Task Division

This document outlines the production-level microservices architecture and assigns tasks between **Suvesh** and **Siddhesh**.

---

## 🏗️ System Architecture Overview
- **API Gateway**: Single entry point (Port 3000).
- **Frontend**: React/Vite (Port 5173).
- **Microservices**: Each with its own Database (MongoDB) and Docker Container.
- **Communication**: REST APIs (Initial) -> RabbitMQ/Kafka (Scaling).

---

## 👥 Task Division

### **👨‍💻 Suvesh (Infrastructure & Identity)**
*Focus: Security, Gateway, User Profiles, and Admin Control*

1.  **API Gateway Enhancements**:
    - Implement JWT verification middleware.
    - Rate limiting & request logging (Morgan/Winston).
2.  **User & Auth Service**:
    - Role-Based Access Control (RBAC): `user`, `admin`, `superadmin`.
    - Profile management (Campus ID verification, Bio, Ratings).
3.  **Admin Dashboard Service**:
    - User management (Ban/Unban).
    - Dispute resolution logic.
    - Platform analytics.
4.  **Notification Service**:
    - Email/SMS integration for orders and security alerts.
5.  **Payment Service**:
    - Stripe/Razorpay integration.
    - Transaction history.

### **👨‍💻 Siddhesh (Core Marketplace & Real-time)**
*Focus: Products, Orders, Delivery, and Communication*

1.  **Product Service**:
    - CRUD for listings.
    - Search & Advanced Filtering (Category, Price, Campus Location).
    - Image uploads (Cloudinary/AWS S3).
2.  **Order & Cart Service**:
    - Cart management logic.
    - Order state machine (`PENDING` -> `PAID` -> `SHIPPED` -> `DELIVERED`).
3.  **Delivery Service**:
    - Manual delivery tracking for founders.
    - Assignment logic for delivery partners.
4.  **Chat Service**:
    - Real-time Socket.io implementation for Buyer-Seller chat.
5.  **Review & Rating Service**:
    - Product reviews and Seller ratings.

---

## 🛠️ How to Collaborate with Docker

### **1. Getting the Project**
- Use **Git** for version control.
- **Suvesh** should push the current `backend/` and `client/` folders to a GitHub/GitLab repository.
- **Siddhesh** should `git clone` the repository.

### **2. Running the Project with Docker**
You don't need to install MongoDB or Node.js versions locally if you use Docker.

**To Start Everything:**
```bash
cd backend
docker-compose up --build
```

**Why use Docker for development?**
- **Isolation**: Siddhesh's computer might have Node 18, and Suvesh's might have Node 20. Docker ensures you both use **Node 20-alpine**.
- **No Manual DB Setup**: Docker-compose automatically spins up a MongoDB container for you.
- **Networking**: The `api-gateway` can talk to `user-service` using the container name `http://user-service:3001` instead of IP addresses.

### **3. Workflow for Adding a New Service**
When Siddhesh wants to add the `product-service`:
1.  Create `backend/product-service/` folder.
2.  Add `Dockerfile` and `package.json`.
3.  Add the service definition to the [docker-compose.yml](file:///c:/Users/Admin/Desktop/TG/backend/docker-compose.yml).
4.  Update the **API Gateway** [index.js](file:///c:/Users/Admin/Desktop/TG/backend/api-gateway/index.js) to route `/api/v1/products` to the new service.

---

## 🚀 Production Readiness Checklist
- [ ] **Environment Variables**: Use `.env` files (never commit them to Git).
- [ ] **Error Handling**: Standardized JSON error responses across all services.
- [ ] **Database Per Service**: Ensure `product-service` doesn't read `user-service` database directly.
- [ ] **Health Checks**: Implement `/health` endpoints for monitoring.
- [ ] **Logging**: Centralized logs for debugging cross-service issues.
