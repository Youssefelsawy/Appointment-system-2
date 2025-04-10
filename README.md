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

3. Start development server:
   ```bash
   npm start

## Project Approach (MVC Architecture)
  - Model-View-Controller Implementation
 
## Challenges Faced
- Managing appointment time slot conflicts required complex validation logic

- Implementing guest bookings without full user accounts was tricky

- Date/time handling across timezones needed special attention

- Grant specific Authrization for every role in the system

## Pending Items
- Nothing pending just enhancement 

