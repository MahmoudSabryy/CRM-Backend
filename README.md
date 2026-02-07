🚀 CRM Backend System

A production-ready CRM (Customer Relationship Management) backend built with Node.js, designed to manage leads, contacts, deals, activities, and users with role-based access control.

✨ Features
🔐 Authentication & Authorization

JWT-based authentication

Role-Based Access Control (RBAC)

Secure password hashing

Protected routes

👥 User Management

Create / update / deactivate users

Assign roles (Admin, Manager, Sales person)

Profile management

📥 Leads

Create and track leads

Convert leads to contacts

Lead status pipeline

📇 Contacts

Store customer contact information

Associate contacts with companies and deals

💼 Deals

Deal pipeline stages

Deal value tracking

Assign deals to Sales persons

Close / lost workflow

📝 Activities

Log calls, meetings, and tasks

Link activities to leads, contacts, or deals

Due dates and reminders

🛡 RBAC (Role Based Access Control)
Role Permissions
Admin Full access
Manager Manage users, deals, reports
Sales person Manage assigned leads & deals
🧱 Tech Stack

Backend

Node.js

Express / NestJS

MongoDB / PostgreSQL

Prisma / Mongoose

JWT Authentication

Utilities

Zod validation

Bcrypt

Multer

Nodemailer

📐 System Architecture
Client (React)
|
API Gateway
|
Auth Middleware
|
Controllers
|
Services
|
Repositories
|
Database

🗂 Folder Structure
src/
├
│── App/
│── Auth/
│── Users/
│── Leads/
│── Contacts/
│── Deals/
│── Activities/
│── DB/
│
│
├── common/
│ ├── Decoratores/
│ ├── Guards/
│ ├── Security/
│ ├── Types/
│ └── Services/
│
├── .env
└── main.ts

▶ Run Locally
npm install
npm run start:dev

🔗 API Modules
Module Description
Auth Login / Register
Users User management
Leads Lead lifecycle
Contacts Customer data
Deals Sales pipeline
Activities Tasks & meetings

📊 Example Use Case

Admin creates users

Sales person creates leads

Lead converted to contact

Deal opened

Activities logged

Deal closed

🧪 Testing
npm run test

🚧 Future Improvements

Analytics dashboard

Email notifications

Webhooks

Soft delete

Audit logs

Redis caching

Multi-tenant organizations

👨‍💻 Author

Mahmoud Sabry
Full Stack Developer

LinkedIn: https://linkedin.com/in/mahmoud-sabry-dev

GitHub: https://github.com/MahmoudSabryy

⭐ Why this project?

This project demonstrates:

Clean architecture

Real-world business logic

RBAC implementation

Scalable backend design

Production-ready pattern
