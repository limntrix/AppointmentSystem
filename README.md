 Health Appointment Booking System

A full-stack appointment management platform that enables real-time doctor–patient scheduling with structured approval workflows. The system allows patients to book appointments, doctors to manage availability, and administrators to oversee the appointment lifecycle.

---

## 📌 Overview

The Health Appointment Booking System simplifies medical appointment scheduling through a structured, role-based workflow. It provides a centralized platform where patients, doctors, and administrators can interact efficiently.

The backend follows a modular layered architecture to ensure maintainability and scalability.

---

## 🚀 Features

### 👤 Patient
- Register and manage profile
- View doctors and available time slots
- Book appointments
- Track appointment status (Pending / Approved / Rejected)

### 👨‍⚕️ Doctor
- Manage availability
- View appointment requests
- Approve or reject appointments

### 🛠 Admin
- Manage users (patients and doctors)
- Monitor doctor availability
- Control appointment workflows

---

## 🏗 Architecture

The backend follows a layered architecture:

- **Controller Layer** – Handles HTTP requests
- **Service Layer** – Contains business logic
- **Repository Layer** – Manages database operations
- **Entity Layer** – Defines database models

The system separates user, appointment, and admin services for better modularity.

---

## 🧰 Tech Stack

**Backend**
- Java
- Spring Boot
- Spring Data JPA
- REST APIs

**Database**
- MySQL

**Frontend**
- (Add your frontend technology here)

---

## 📂 Project Structure

src/
├── controller/
├── service/
├── repository/
├── entity/
└── config/


---

## 🔗 API Endpoints (Sample)

POST /api/users
GET /api/doctors
POST /api/appointments
PUT /api/appointments/{id}


---

## ⚙️ How to Run

1. Clone the repository
git clone <your-repository-link>


2. Configure database credentials in `application.properties`

3. Run the application
mvn spring-boot:run


4. Open in browser:
http://localhost:8080


---

