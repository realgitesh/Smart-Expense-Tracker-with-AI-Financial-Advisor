# Smart-Expense-Tracker-with-AI-Financial-Advisor

A full-stack personal finance management web application built using **React, Java Spring Boot, and MySQL**.

The application allows users to manage income and expenses, create and monitor budgets, analyze financial activity, generate reports, export financial data, and receive AI-powered financial guidance.

---

# Project Overview

**Smart-Expense-Tracker-with-AI-Financial-Advisor** provides users with a single platform for managing and understanding their personal finances.

The application includes:

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
* PDF and Excel export
* AI-powered financial advice
* Profile management
* Password change functionality
* Budget-related email alert support
* Protected application routes
* User-specific financial data handling
* Responsive frontend interface

---

# Features

## 1. User Authentication

Users can:

* Register a new account
* Login using email and password
* Logout from the application
* Access protected application pages after login
* Remain logged in when normally refreshing the browser page

Passwords are stored using **BCrypt password hashing** rather than plain-text storage.

---

## 2. Dashboard

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
* Financial summaries
* Charts and visualizations

The dashboard acts as the central overview of the application.

---

## 3. Income Management

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

## 4. Expense Management

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

## 5. Expense Analytics

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

## 6. Budget Planning

Users can create category-based budgets for a selected month and year.

Example:

```text
Food        → ₹10,000
Transport   → ₹5,000
Shopping    → ₹4,000
```

The application prevents duplicate budgets for the same category and selected period.

---

## 7. Budget Monitoring

The budget module compares planned spending with actual expenses.

It provides information such as:

* Budget amount
* Actual amount spent
* Remaining amount
* Percentage used
* Budget status

Example:

```text
Food Budget : ₹10,000
Food Spent  : ₹4,000
Remaining   : ₹6,000
Usage       : 40%
Status      : On Track
```

The application can identify when a budget is approaching or exceeding its limit.

Budget-related email alerts are also supported when the required email configuration is enabled.

---

## 8. Reports and Export

The Reports module provides financial reporting functionality.

Users can review financial information and generate reports based on available transaction data.

The backend supports:

* PDF reports
* Excel reports

The project uses:

* **Apache POI** for Excel-related report generation
* **PDFBox** for PDF-related report generation

---

## 9. AI Financial Advisor

The application includes an **AI Financial Advisor**.

The feature uses relevant financial context to provide guidance such as:

* Spending suggestions
* Budgeting suggestions
* Saving recommendations
* Financial observations

AI communication is handled through the backend so that the AI API key is not directly exposed to the React frontend.

If the external AI service is unavailable or no API key is configured, the application can provide fallback financial advice.

---

## 10. Profile Management

Users can manage their account information through the Profile section.

Supported functionality includes:

* View profile information
* Update profile information
* Change password

---

## 11. Budget Email Alerts

The backend contains functionality for budget-related email notifications.

Email notifications can be enabled through application configuration and SMTP settings.

Email functionality is **disabled by default** unless the required configuration is provided.

---

# Technology Stack

## Frontend

* React
* JavaScript
* React Router
* Axios
* SweetAlert2
* Chart.js
* React Chart.js 2
* HTML
* CSS

## Backend

* Java 22
* Spring Boot 3.5.6
* Spring Web
* Spring Data JPA
* Hibernate
* Jakarta Validation
* BCrypt password hashing
* Spring WebClient

## Database

* MySQL 8.x

## Reporting

* Apache POI
* PDFBox

## Build Tools

* Maven
* Maven Wrapper

## Development Environment

* Eclipse IDE for Enterprise Java and Web Developers
* Visual Studio Code
* Java Development Kit 22

---

# System Architecture

The project follows a layered full-stack architecture:

```text
                ┌─────────────────────────┐
                │     React Frontend      │
                │                         │
                │ Dashboard               │
                │ Income                  │
                │ Expense                 │
                │ Budget                  │
                │ Reports                 │
                │ AI Advisor              │
                │ Profile                 │
                └────────────┬────────────┘
                             │
                             │ REST API
                             ▼
                ┌─────────────────────────┐
                │    Spring Boot Backend  │
                └────────────┬────────────┘
                             │
                ┌────────────┼────────────┐
                ▼            ▼            ▼
           Controller     Service     Repository
                             │
                             ▼
                       ┌────────────┐
                       │   MySQL    │
                       │  Database  │
                       └────────────┘
                             │
                             │
                             ▼
                     ┌───────────────┐
                     │   Gemini AI   │
                     │    Service    │
                     └───────────────┘
```

The backend follows the general structure:

```text
Controller
     ↓
Service
     ↓
Repository
     ↓
MySQL
```

The application separates API handling, business logic, data access, entities, and data-transfer objects.

---

# Backend Project Structure

The backend follows a Maven/Spring Boot project structure similar to:

```text
backend/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/gitesh/expensetracker/
│   │   │
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── entity/
│   │   │   ├── repository/
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

The exact classes inside each package may change as the project develops.

---

# Frontend Structure

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

The application uses **MySQL** for persistent data storage.

The main application entities include:

```text
User
 ├── Income
 ├── Expense
 ├── Budget
 └── AIAdvice
```

A single user can have multiple income and expense records.

Financial records are associated with their corresponding user so that user-specific financial data can be handled separately.

---

# Prerequisites

Install the following before running the project:

* Java 22
* MySQL 8.x
* Node.js
* npm
* Git
* Maven (optional because the project includes the Maven Wrapper)

## Recommended Development Tools

* Eclipse IDE for Enterprise Java and Web Developers
* Visual Studio Code

The backend has been configured and tested with **Java 22** and Eclipse.

---

# Backend Setup

## 1. Clone the Repository

Clone the project using:

```bash
git clone https://github.com/realgitesh/Smart-Expense-Tracker-with-AI-Financial-Advisor.git
```

Move into the project directory:

```bash
cd Smart-Expense-Tracker-with-AI-Financial-Advisor
```

---

## 2. Configure MySQL

Start MySQL and create the application database.

Example:

```sql
CREATE DATABASE expense_tracker;
```

The database name and connection details should match the backend configuration.

The current local database configuration uses MySQL on port **3307**.

---

## 3. Configure Environment Variables

The backend should not contain real passwords or API keys.

Configure the required environment variables.

Example:

```text
DB_URL=jdbc:mysql://localhost:3307/expense_tracker
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
```

Optional email configuration can be supplied when email alerts are required:

```text
APP_EMAIL_ENABLED=false
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_smtp_app_password
```

**Never commit real passwords, API keys, or SMTP credentials to GitHub.**

---

## 4. Start the Backend

Open a terminal inside the backend directory.

If the project is organized with the backend as the current directory:

```bash
cd backend
```

On Windows, use the Maven Wrapper:

```bash
mvnw.cmd spring-boot:run
```

Alternatively, Maven can be used directly:

```bash
mvn spring-boot:run
```

The Spring Boot backend runs on:

```text
http://localhost:8080
```

---

# Running the Backend from Eclipse

The backend can also be started directly from **Eclipse IDE for Enterprise Java and Web Developers**.

1. Import the backend as an existing Maven project.
2. Wait for Maven dependencies and workspace building to complete.
3. Locate:

```text
ExpenseTrackerApplication.java
```

4. Run the application as a Java Application or Spring Boot application when the option is available.
5. Wait for the Spring Boot application to start.

The backend uses port:

```text
8080
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

This project uses **Create React App**, so the correct development command is:

```bash
npm start
```

and not:

```bash
npm run dev
```

The frontend normally runs on:

```text
http://localhost:3000
```

---

# Frontend API Configuration

The React frontend communicates with the Spring Boot backend through Axios.

The default backend API base URL is:

```text
http://localhost:8080/api
```

The frontend can also use the following environment variable:

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
Income        Expenses        Budget          Reports
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

A simple project demonstration can use the following sample data.

## Income

```text
Salary = ₹50,000
```

## Expenses

```text
Food       = ₹4,000
Transport  = ₹2,000
```

## Budgets

```text
Food       = ₹10,000
Transport  = ₹5,000
```

A demonstration can then show:

1. Register a user.
2. Login.
3. Open the Dashboard.
4. Add an income record.
5. Add expense records.
6. Create category budgets.
7. View budget progress.
8. Open Reports.
9. Generate a financial report.
10. Open the AI Financial Advisor.
11. Review the generated financial guidance.
12. Open Profile.
13. Logout.
14. Verify protected pages require authentication.

---

# Security

The project includes several security-related measures.

## Password Hashing

Passwords are stored using **BCrypt password hashing**.

BCrypt is designed for securely storing passwords and does not store the original password as plain text.

## Protected Routes

The React frontend uses protected routes to prevent unauthenticated users from directly accessing application pages.

## User Data Ownership

Financial operations are associated with the corresponding user, helping prevent users from modifying another user's financial records.

## API Key Protection

The Gemini AI API key is configured on the backend rather than being directly exposed in the React frontend.

## Environment Variables

Sensitive configuration such as:

* Database passwords
* Gemini API keys
* SMTP credentials

should be supplied through environment variables and should not be committed to GitHub.

---

# Error Handling and Validation

The backend includes centralized exception handling through:

```text
GlobalExceptionHandler
```

Input validation is used for relevant application data.

The layered backend architecture also separates request handling, business logic, and database access.

---

# Reports and Exports

The application supports financial report generation and export.

## Excel

Excel-related report generation uses:

```text
Apache POI
```

## PDF

PDF-related report generation uses:

```text
PDFBox
```

These features allow users to take financial information outside the application for further review.

---

# AI Financial Advisor

The AI Financial Advisor is an additional assistance feature built around the user's financial information.

It can provide:

* Spending observations
* Budgeting suggestions
* Saving recommendations
* Financial guidance

The AI functionality is not required for the core expense-tracking functionality.

The application can use fallback advice when the external AI service is unavailable or an API key has not been configured.

---

# Email Notifications

The backend supports budget-related email notifications.

Email notifications are disabled by default.

They can be enabled through environment and SMTP configuration.

Required configuration may include:

```text
APP_EMAIL_ENABLED
MAIL_HOST
MAIL_PORT
MAIL_USERNAME
MAIL_PASSWORD
```

For Gmail, an appropriate SMTP/App Password configuration should be used rather than exposing the normal account password.

---

# Testing and Validation

The application has been manually tested across major workflows.

Tested areas include:

* Backend startup
* MySQL connectivity
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

The project has also been validated after migration to **Eclipse IDE for Enterprise Java and Web Developers** with **Java 22**.

The backend Maven build has been successfully verified using:

```bash
mvnw.cmd clean package -DskipTests
```

---

# Project Status

The major application modules are implemented and working:

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

The backend is organized around REST API modules for:

```text
Authentication
Income
Expense
Dashboard
Budget
Reports
AI Financial Advisor
Profile
```

The backend follows the general:

```text
Controller
     ↓
Service
     ↓
Repository
     ↓
Database
```

architecture.

---

# Important Configuration

The main backend configuration is stored in:

```text
backend/src/main/resources/application.properties
```

Sensitive production configuration should not be hard-coded into the project.

Use environment variables for:

```text
Database credentials
Gemini API configuration
Email/SMTP credentials
```

---

# Development Environment

The current development environment is:

```text
Operating System:
Windows

Java:
Java 22

Backend:
Spring Boot 3.5.6

Database:
MySQL 8.x

Frontend:
React

Build:
Maven / Maven Wrapper

Backend IDE:
Eclipse IDE for Enterprise Java and Web Developers

Frontend / General Editing:
Visual Studio Code

Version Control:
Git / GitHub
```

---

# Servlet and JSP Practice Environment

The project development environment is separate from the college Servlet/JSP practice environment.

For Servlet/JSP learning, Apache Tomcat 10.1 is configured separately in Eclipse.

The current Servlet practice configuration uses:

```text
Apache Tomcat: 10.1
HTTP Port: 8181
Admin Port: 8182
```

This Tomcat configuration is for **Servlet/JSP practice projects** and is not part of the Smart Expense Tracker Spring Boot backend architecture.

The Smart Expense Tracker Spring Boot backend continues to use:

```text
Port: 8080
```

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

These are future improvements and are not requirements for the current working version.

---

# Repository

GitHub repository:

https://github.com/realgitesh/Smart-Expense-Tracker-with-AI-Financial-Advisor

---

# Author

**Gitesh Sharma**

B.Tech Computer Science & Engineering

Project:

**Smart-Expense-Tracker-with-AI-Financial-Advisor**
