Health Appointment Booking System

A full-stack appointment management platform that enables patients to book appointments with doctors in real time, while allowing administrators to manage users, doctor availability, and appointment workflows efficiently.

📌 Overview

The Health Appointment Booking System is designed to simplify the process of scheduling and managing medical appointments. The platform supports role-based operations for patients, doctors, and administrators, ensuring a structured and streamlined workflow.

The system provides:

Real-time doctor-patient appointment scheduling

Approval and status-based appointment workflow

Centralized admin management panel

Secure and scalable backend architecture

🚀 Features
👤 Patient Features

Register and manage profile

View available doctors and their schedules

Book appointments

Track appointment status (Pending / Approved / Rejected)

👨‍⚕️ Doctor Features

Manage availability

View assigned appointments

Approve or reject appointment requests

🛠 Admin Panel

Manage users (patients and doctors)

Control doctor availability

Monitor and manage appointment workflows

Maintain system-level control

🏗 Architecture

The backend is built using a modular layered architecture with clear separation of concerns:

Controller Layer – Handles API requests

Service Layer – Contains business logic

Repository Layer – Manages database operations

Entity Layer – Defines database models

The system separates:

User management

Appointment management

Administrative services

This ensures maintainability and scalability.

🧰 Tech Stack

Backend

Java

Spring Boot

Spring Data JPA

REST APIs

Database

MySQL

Frontend

(Add your frontend technology here – e.g., React / HTML-CSS / Thymeleaf)

📂 Project Structure
src/
 ├── controller/
 ├── service/
 ├── repository/
 ├── entity/
 └── config/

🔗 API Endpoints (Sample)

POST /api/users – Create user

GET /api/doctors – List doctors

POST /api/appointments – Book appointment

PUT /api/appointments/{id} – Update appointment status

⚙️ Database Design

The system uses MySQL for persistent storage and maintains relational mappings between:

Users

Doctors

Appointments

JPA/Hibernate handles entity relationships and schema management.
