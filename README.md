Health Appointment Booking System

A full-stack appointment management platform that enables real-time doctor-patient scheduling and structured approval workflows. The system allows patients to book appointments, doctors to manage availability, and administrators to oversee the complete appointment lifecycle.

Overview

The Health Appointment Booking System is designed to simplify medical appointment scheduling through a structured and role-based workflow. It provides a centralized platform where patients, doctors, and administrators can interact efficiently.

The system ensures reliable data handling, scalable architecture, and organized service separation.

Features
Patient

Register and manage profile

View doctors and available time slots

Book appointments

Track appointment status (Pending, Approved, Rejected)

Doctor

Manage availability

View appointment requests

Approve or reject appointments

Admin

Manage users (patients and doctors)

Monitor doctor availability

Control appointment workflows

Architecture

The backend follows a layered architecture to ensure maintainability and separation of concerns:

Controller Layer – Handles HTTP requests and responses

Service Layer – Contains business logic

Repository Layer – Manages database interactions

Entity Layer – Defines database models

The system separates appointment, user, and administrative services to maintain modular design.

Tech Stack

Backend:

Java

Spring Boot

Spring Data JPA

RESTful APIs

Database:

MySQL

Frontend:

(Add your frontend technology here if applicable)

API Overview

Sample endpoints:

POST /api/users – Create user

GET /api/doctors – Retrieve doctor list

POST /api/appointments – Book appointment

PUT /api/appointments/{id} – Update appointment status

Database

The system uses MySQL for persistent storage. JPA and Hibernate manage relational mappings between users, doctors, and appointments.

How to Run

Clone the repository
git clone <repository-link>

Configure database credentials in application.properties

Run the application
mvn spring-boot:run

Access at
http://localhost:8080
