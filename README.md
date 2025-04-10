# Clinic Appointment System

A full-stack web application for managing medical appointments with support for patients, doctors, and administrators.

## Tech Stack

### Frontend
- React
- Bootstrap

### Backend
- Node.js 
- Express 

## Project Setup

### Backend - frontend Setup
1. Install dependencies:
   ```bash
   cd backend
   npm install
   cd ..
   cd fronend
   npm install

2. Create .env file: i have attach example.env file but dont change port 5000 as frontend depends on it

3. Start two development server:
   ```bash
   npm start

4. Create the admin in your database 
- if you are using MySQL run this command:
- INSERT INTO users (name, email, password, role, createdAt, updatedAt)
   VALUES (
  'Admin', 
  'admin@onnmed.com', 
  '$2b$10$IWsQ17zVvWJXuoQ..6kxKuO4UKLdgVBuMYlPB9qh7EDUHe/q7jwjy',
  'admin', 
  NOW(), 
  NOW()
);
- hash the password first using bcrypt.hashSync the above is hashed pass for 123456

## Project Approach (MVC Architecture)
  - Model-View-Controller Implementation
 
## Challenges Faced
- Managing appointment time slot conflicts required complex validation logic

- Implementing guest bookings without full user accounts was tricky

- Date/time handling across timezones needed special attention

- Grant specific Authrization for every role in the system

- Merge Front with Back in short time

## Pending Items
- Nothing pending just enhancement 

