# Smart-Expense-Tracker-with-AI-Financial-Advisor

A full-stack personal finance management web application built using **React, Java Spring Boot, and MySQL**. The application allows users to manage income and expenses, create budgets, monitor spending, generate reports, and receive AI-based financial guidance.

## Project Overview

**Smart-Expense-Tracker-with-AI-Financial-Advisor** is designed to provide users with a single platform for managing their personal finances.

The application provides:

* User registration and login
* Income management
* Expense management
* Expense search and filtering
* Dashboard financial summaries
* Monthly and yearly analytics
* Category-wise spending analysis
* Budget planning and monitoring
* Budget progress and status
* Financial reports
* PDF/Excel report export
* AI-powered financial advice
* Profile management
* Password change functionality
* Budget-related email alert support
* Protected application routes
* User-specific financial data handling
* Responsive frontend interface

---

## Features

### 1. User Authentication

Users can:

* Register a new account
* Login using email and password
* Logout from the application
* Access protected application pages only after login
* Remain logged in when normally refreshing the browser page

Passwords are stored using **BCrypt hashing** rather than plain-text storage.

---

### 2. Dashboard

The dashboard provides an overview of the user's financial activity.

It can display:

* Total income
* Total expenses
* Current balance
* Number of income records
* Number of expense records
* Recent transactions
* Monthly financial information
* Yearly financial information
* Budget progress
* Financial summaries and charts

The dashboard acts as the central overview of the application.

---

### 3. Income Management

Users can manage their income records.

Supported operations include:

* Add income
* View income
* Edit income
* Delete income
* Track income source
* Store income amount
* Store income date

Example:

```text
Source: Salary
Amount: ₹50,000
Date: 2026-08-01
```

---

### 4. Expense Management

Users can manage their daily expenses.

Supported operations include:

* Add expense
* View expenses
* Edit expenses
* Delete expenses
* Search expenses
* Filter expense information
* Categorize expenses
* Store expense date
* Store expense description

Example:

```text
Title: Restaurant
Category: Food
Amount: ₹1,200
Date: 2026-08-10
Description: Dinner
```

---

### 5. Expense Analytics

The application provides financial analysis based on stored transactions.

Examples include:

* Monthly expense totals
* Yearly expense totals
* Category-wise spending
* Expense summaries
* Recent transactions
* Income versus expense information

This helps users understand their spending patterns.

---

### 6. Budget Planning

Users can create category-based budgets for a selected month and year.

Example:

```text
Food       → ₹10,000
Transport  → ₹5,000
Shopping   → ₹4,000
```

The application prevents duplicate budgets for the same category and selected period.

---

### 7. Budget Monitoring

The budget module compares planned spending with actual expenses.

It provides information such as:

* Budget amount
* Actual amount spent
* Remaining amount
* Percentage used
* Budget status

Example:

```text
Food Budget     : ₹10,000
Food Spent      : ₹4,000
Remaining       : ₹6,000
Usage           : 40%
Status          : On Track
```

The application can also identify situations where the budget is approaching or exceeding its limit.

---

### 8. Reports

The Reports module provides financial reporting functionality.

Users can review financial information and generate reports based on available transaction data.

The backend also includes report export functionality using:

* PDF
* Excel

The project includes Apache POI and PDF-related libraries for report generation.

---

### 9. AI Financial Advisor

The application includes an **AI Financial Advisor**.

The feature uses the user's financial context to generate financial guidance such as:

* Spending suggestions
* Budgeting suggestions
* Saving recommendations
* Financial observations

The AI communication is handled through the backend rather than exposing the AI API key directly to the frontend.

If the external AI service is unavailable or no API key is configured, the application can use fallback advice.

---

### 10. Profile Management

Users can manage their account information through the Profile section.

Supported functionality includes:

* View profile information
* Update profile information
* Change password

---

### 11. Budget Email Alerts

The backend contains dedicated services for budget-related email notifications.

The email functionality can be enabled through application configuration and SMTP settings.

Email functionality is disabled by default unless the required configuration is provided.

---

## Technology Stack

### Frontend

* React
* JavaScript
* React Router
* Axios
* SweetAlert2
* Chart.js
* React Chart.js 2
* HTML
* CSS

### Backend

* Java 22
* Spring Boot 3.5.6
* Spring Web
* Spring Data JPA
* Hibernate
* Jakarta Validation
* Spring Security / BCrypt
* Spring WebClient

### Database

* MySQL 8.x

### Reporting

* Apache POI
* PDFBox

### Build Tool

* Maven
* Maven Wrapper

The documented backend stack uses Java 22, Spring Boot 3.5.6, Spring Data JPA/Hibernate, MySQL 8.x, validation, security/crypto support, WebClient, Apache POI/PDFBox, and Maven.

---

## System Architecture

The project follows a layered full-stack architecture:

```text
                ┌──────────────────────┐
                │     React Frontend   │
                │                      │
                │ Dashboard            │
                │ Income               │
                │ Expense              │
                │ Budget               │
                │ Reports              │
                │ AI Advisor           │
                │ Profile              │
                └──────────┬───────────┘
                           │
                           │ REST API
                           ▼
                ┌──────────────────────┐
                │   Spring Boot       │
                │      Backend        │
                └──────────┬───────────┘
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
        Controller      Service      Repository
                           │
                           ▼
                     ┌───────────┐
                     │  MySQL    │
                     │ Database  │
                     └───────────┘

                           │
                           ▼
                    Gemini AI Service
```

The backend follows:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
MySQL
```

The current backend contains separate configuration, controller, DTO, entity, repository, and service packages.

---

## Backend Project Structure

```text
backend/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/gitesh/expensetracker/
│   │   │
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   └── WebClientConfig.java
│   │   │   │
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── IncomeController.java
│   │   │   │   ├── ExpenseController.java
│   │   │   │   ├── BudgetController.java
│   │   │   │   ├── DashboardController.java
│   │   │   │   ├── ReportController.java
│   │   │   │   ├── AIAdviceController.java
│   │   │   │   ├── ProfileController.java
│   │   │   │   └── GlobalExceptionHandler.java
│   │   │   │
│   │   │   ├── dto/
│   │   │   │
│   │   │   ├── entity/
│   │   │   │   ├── User.java
│   │   │   │   ├── Income.java
│   │   │   │   ├── Expense.java
│   │   │   │   ├── Budget.java
│   │   │   │   └── AIAdvice.java
│   │   │   │
│   │   │   ├── repository/
│   │   │   │
│   │   │   └── service/
│   │   │
│   │   └── resources/
│   │       └── application.properties
│   │
│   └── test/
│
├── pom.xml
├── mvnw
└── mvnw.cmd
```

The project documentation confirms the controller, DTO, entity, repository, and service organization used by the backend.

---

## Frontend Structure

```text
frontend/
│
├── public/
│
├── src/
│   ├── components/
│   │   └── ProtectedRoute.js
│   │
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js
│   │   ├── Expense.js
│   │   ├── Income.js
│   │   ├── Budget.js
│   │   ├── Reports.js
│   │   ├── AIAdvice.js
│   │   └── Profile.js
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.js
│   ├── App.css
│   └── index.css
│
├── package.json
└── package-lock.json
```

---

# Database

The application uses **MySQL** for persistent storage.

The main entities are:

```text
User
 ├── Income
 ├── Expense
 ├── Budget
 └── AIAdvice
```

A single user can have multiple income and expense records, while financial records are associated with the corresponding user.

The project documentation describes the database as storing users, income, expenses, budgets, and AI-related financial information.

---

# Prerequisites

Install the following before running the project:

* Java 22
* Maven
* MySQL 8.x
* Node.js
* npm
* Git

Recommended IDEs:

* IntelliJ IDEA for backend
* Visual Studio Code for frontend

---

# Backend Setup

## 1. Clone the Repository

```bash
git clone https://github.com/realgitesh/Smart-Expense-Tracker.git
```

Move into the project:

```bash
cd Smart-Expense-Tracker
```

---

## 2. Configure MySQL

Start MySQL and create a database.

Example:

```sql
CREATE DATABASE expense_tracker;
```

The exact database name can be changed according to the configured database URL.

---

## 3. Configure Environment Variables

The backend should not contain real passwords or API keys.

Configure the required environment variables.

Example:

```text
DB_URL=jdbc:mysql://localhost:3306/expense_tracker
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
GEMINI_API_KEY=your_gemini_api_key
```

Optional email configuration can be supplied when email alerts are required:

```text
APP_EMAIL_ENABLED=false
MAIL_HOST=your_smtp_host
MAIL_PORT=587
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_email_password
```

**Never commit real passwords, API keys, or SMTP credentials to GitHub.**

---

## 4. Start the Backend

Open a terminal inside the `backend` directory:

```bash
cd backend
```

Run:

```bash
mvn spring-boot:run
```

Or on Windows using the Maven wrapper:

```bash
mvnw.cmd spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

---

# Frontend Setup

Open another terminal.

Move to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm start
```

The frontend normally runs on:

```text
http://localhost:3000
```

This project uses Create React App, so the correct development command is:

```bash
npm start
```

not:

```bash
npm run dev
```

---

# Frontend API Configuration

The frontend communicates with the Spring Boot backend through Axios.

The API service uses:

```text
http://localhost:8080/api
```

by default.

An environment variable can also be used:

```text
REACT_APP_API_URL
```

Example:

```text
REACT_APP_API_URL=http://localhost:8080/api
```

---

# Application Flow

The main user flow is:

```text
Register
   ↓
Login
   ↓
Dashboard
   ↓
┌───────────────┬───────────────┬───────────────┐
│               │               │               │
Income       Expenses        Budget          Reports
│               │               │               │
└───────────────┴───────────────┴───────────────┘
                       ↓
                 AI Financial Advisor
                       ↓
                    Profile
                       ↓
                     Logout
```

---

# Example Demonstration

A simple demonstration of the project can use the following data.

### Income

```text
Salary = ₹50,000
```

### Expenses

```text
Food       = ₹4,000
Transport  = ₹2,000
```

### Budgets

```text
Food       = ₹10,000
Transport  = ₹5,000
```

The demonstration can then show:

1. Register a user.
2. Login.
3. Open the Dashboard.
4. Add ₹50,000 salary.
5. Add ₹4,000 food expense.
6. Add ₹2,000 transport expense.
7. Create Food and Transport budgets.
8. View budget progress.
9. Open Reports.
10. Generate financial advice using AI Advisor.
11. Open Profile.
12. Logout.
13. Verify that protected pages cannot be accessed after logout without logging in again.

This demonstration flow is also reflected in the project documentation.

---

# Security

The project includes several security-related measures:

### Password Hashing

Passwords are stored using **BCrypt hashing**.

BCrypt is a one-way password hashing mechanism. Passwords are therefore not stored as plain text.

### Protected Routes

Frontend protected routes prevent unauthenticated users from directly opening application pages.

### User Data Ownership

Financial operations are associated with the logged-in user, helping prevent users from modifying another user's financial records.

### API Key Protection

The AI API key is configured on the backend rather than being placed directly inside the React frontend.

### Environment Variables

Sensitive configuration such as:

* Database passwords
* AI API keys
* Email credentials

should be supplied through environment variables rather than committed to GitHub.

---

# Error Handling

The backend contains a centralized:

```text
GlobalExceptionHandler
```

for handling application errors and returning appropriate error responses.

Input validation is also used for relevant application data.

---

# Testing

The main application workflows were manually tested.

The tested areas include:

* Backend startup
* Database connectivity
* User registration
* User login
* Dashboard access
* Income operations
* Expense operations
* Budget operations
* Budget progress
* Reports
* AI Financial Advisor
* Profile navigation
* Logout
* Protected route behavior
* Browser Back/Forward behavior after logout

The planned seven major functional tests were reported as passing during the project validation.

---

# Current Project Status

The current project includes the major planned application modules:

```text
Authentication        ✓
Dashboard             ✓
Income Management     ✓
Expense Management    ✓
Expense Analytics     ✓
Budget Planning       ✓
Budget Monitoring     ✓
Reports               ✓
PDF/Excel Export      ✓
AI Financial Advisor  ✓
Profile Management    ✓
Password Hashing      ✓
Protected Routes      ✓
Email Alert Support   ✓
Responsive UI         ✓
```

---

# API Modules

The backend REST API is organized around the following controllers:

```text
AuthController
IncomeController
ExpenseController
DashboardController
BudgetController
ReportController
AIAdviceController
ProfileController
```

The backend separates API handling from business logic and database access using the Controller → Service → Repository structure.

---

# Important Configuration

The backend configuration is stored in:

```text
backend/src/main/resources/application.properties
```

Do not place production secrets directly inside this file.

Use environment variables for:

```text
Database configuration
Gemini API configuration
Email/SMTP configuration
```

---

# Reports and Exports

The application backend includes report-generation functionality.

Supported export technologies include:

* Apache POI for Excel-related reports
* PDFBox for PDF-related reports

This allows users to take financial information outside the web application for further review.

---

# AI Financial Advisor

The AI feature is designed as an additional financial-assistance feature rather than a dependency for the core application.

The main financial application continues to provide:

* Income management
* Expense management
* Budgeting
* Reports
* Dashboard functionality

even when the external AI service is unavailable.

---

# Future Enhancements

Possible future improvements include:

* More automated unit and integration tests
* More advanced authentication and authorization
* JWT-based authentication for a production deployment
* Database migration tools
* Recurring income and expense support
* More advanced financial analytics
* Improved AI financial-context handling
* More report formats
* Cloud deployment
* Production monitoring
* Improved notification system

These are future improvements rather than requirements for the current working version.

---

# Repository

GitHub repository:

https://github.com/realgitesh/Smart-Expense-Tracker

---

# Project Documentation

Additional project documentation can cover:

* Software Development Life Cycle
* Functional requirements
* Non-functional requirements
* System architecture
* Database design
* Testing
* Demonstration flow
* Future enhancements

---

# Conclusion

**Smart-Expense-Tracker-with-AI-Financial-Advisor** demonstrates a complete full-stack personal finance management system using React, Java Spring Boot, and MySQL.

The application combines:

```text
Authentication
      +
Income Management
      +
Expense Management
      +
Budget Planning
      +
Financial Analytics
      +
Reports
      +
AI Financial Advice
      =
Complete Personal Finance Application
```

The project demonstrates practical implementation of:

* React frontend development
* REST API development
* Java Spring Boot
* Spring Data JPA
* MySQL database integration
* Layered backend architecture
* Password hashing
* Validation
* Exception handling
* Financial calculations
* Report generation
* External AI API integration
* Frontend/backend communication

---

# Author

**Gitesh Sharma**

B.Tech Computer Science & Engineering

Project:

**Smart-Expense-Tracker-with-AI-Financial-Advisor**
