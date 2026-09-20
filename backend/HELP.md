
# Smart Expense Tracker with AI Financial Advisor

## Project Overview

Smart Expense Tracker with AI Financial Advisor is a full-stack personal finance management web application.

The application allows users to:

- Register and log in securely.
- Manage income records.
- Manage expense records.
- Search and review financial transactions.
- Create category-based monthly budgets.
- Monitor budget usage and remaining amounts.
- View financial summaries and analytics.
- Generate PDF and Excel reports.
- Receive AI-assisted financial recommendations.
- Manage profile information and passwords.
- Use the application through a responsive web interface.

The project is developed using:

- **Frontend:** React
- **Backend:** Java 22 with Spring Boot 3.5.6
- **Database:** MySQL 8.x
- **Persistence:** Spring Data JPA / Hibernate
- **Build Tool:** Maven / Maven Wrapper
- **Development IDE:** Eclipse IDE for Enterprise Java and Web Developers
- **Frontend Editor:** Visual Studio Code

---

## Project Structure

The backend follows a layered architecture:

```text
React Frontend
       |
       | REST API
       v
Spring Boot Backend
       |
       +-- Controller
       |
       +-- Service
       |
       +-- Repository
       |
       +-- Entity / DTO
       |
       v
MySQL Database
````

The main backend packages are:

```text
src/main/java/com/gitesh/expensetracker/

├── config
├── controller
├── dto
├── entity
├── repository
└── service
```

---

## Getting Started

### Prerequisites

Install the following software before running the project:

1. Java 22
2. MySQL 8.x
3. Eclipse IDE for Enterprise Java and Web Developers
4. Node.js and npm
5. Visual Studio Code (for frontend development)
6. A modern web browser

---

## Backend Setup

### 1. Configure MySQL

Create the required database:

```sql
CREATE DATABASE expense_tracker;
```

The application is configured to use MySQL.

The default local database URL is:

```text
jdbc:mysql://localhost:3307/expense_tracker
```

Make sure MySQL is running before starting the backend.

---

### 2. Configure Environment Variables

Sensitive configuration should not be hardcoded in the source code.

The project supports the following environment variables:

```text
DB_URL
DB_USERNAME
DB_PASSWORD

GEMINI_API_KEY
GEMINI_API_URL

APP_EMAIL_ENABLED
MAIL_HOST
MAIL_PORT
MAIL_USERNAME
MAIL_PASSWORD
```

An example configuration is available in:

```text
environment.example.txt
```

Do not commit real passwords, API keys, or SMTP credentials to GitHub.

---

### 3. Run the Backend

From the backend project directory, run:

```text
mvnw.cmd spring-boot:run
```

On Windows, the Maven Wrapper can be used without requiring a separate Maven installation.

The Spring Boot backend runs on:

```text
http://localhost:8080
```

The REST API base path is:

```text
http://localhost:8080/api
```

---

## Running the Backend in Eclipse

1. Open **Eclipse IDE for Enterprise Java and Web Developers**.
2. Select the project workspace.
3. Import the backend as an existing Maven project if it is not already imported.
4. Allow Eclipse to complete Maven dependency resolution.
5. Make sure Java 22 is selected as the project JRE.
6. Locate:

```text
ExpenseTrackerApplication.java
```

7. Run it as:

```text
Run As → Java Application
```

The Spring Boot application should start on port `8080`.

---

## Frontend Setup

Open a terminal inside the frontend directory.

Install dependencies:

```text
npm install
```

Start the React development server:

```text
npm start
```

The frontend normally runs at:

```text
http://localhost:3000
```

The frontend communicates with the backend through the configured API URL.

The React application uses Create React App and therefore uses:

```text
npm start
```

Do not use:

```text
npm run dev
```

---

## Main Application Modules

### Authentication

Provides:

* User registration
* User login
* Logout
* Protected frontend routes
* User-specific access to financial records

Passwords are stored using BCrypt password hashing.

---

### Income Management

Users can:

* Add income
* Edit income
* Delete income
* Search income
* Review income records
* Filter financial information by date where supported

---

### Expense Management

Users can:

* Add expenses
* Edit expenses
* Delete expenses
* Search expenses
* Review expense records
* Analyse spending by category

---

### Budget Management

Users can:

* Create category-based budgets
* Select month and year
* Edit budgets
* Delete budgets
* Compare budgeted amounts with actual spending
* View percentage of budget used
* View remaining budget
* Identify budget status

Budget monitoring supports statuses such as:

* On Track
* Near Limit
* Over Budget

Budget alerts can also be used for exceeded budgets.

---

### Dashboard

The dashboard provides a central financial overview including:

* Income summary
* Expense summary
* Financial balance information
* Recent transactions
* Budget information
* Charts and analytics

---

### Reports

The application supports financial reporting using:

* PDF
* Excel

Reports can use user-specific financial information and available date/category filters.

---

### AI Financial Advisor

The AI Financial Advisor provides AI-assisted financial recommendations using relevant financial context available within the application.

The application integrates with the Gemini API when configured.

A local fallback recommendation mechanism is available when the Gemini service is unavailable.

AI recommendations are intended for general financial guidance and are not a substitute for professional or regulated financial advice.

---

### Profile Management

Users can:

* View profile information
* Update account information
* Change their password

---

### Email Notifications

The project contains support for budget-related email notifications.

Email functionality is:

```text
Disabled by default
```

It can be enabled through environment configuration when a valid SMTP account is available.

---

## Technology References

### Spring Boot

Official Spring Boot documentation:

[https://docs.spring.io/spring-boot/](https://docs.spring.io/spring-boot/)

### Spring Data JPA

Official documentation:

[https://docs.spring.io/spring-data/jpa/](https://docs.spring.io/spring-data/jpa/)

### React

Official documentation:

[https://react.dev/](https://react.dev/)

### MySQL

Official MySQL documentation:

[https://dev.mysql.com/doc/](https://dev.mysql.com/doc/)

### Maven

Official Maven documentation:

[https://maven.apache.org/guides/](https://maven.apache.org/guides/)

### Apache POI

Used for Excel report generation:

[https://poi.apache.org/](https://poi.apache.org/)

### Apache PDFBox

Used for PDF report generation:

[https://pdfbox.apache.org/](https://pdfbox.apache.org/)

### Google Gemini API

Used for AI-assisted financial recommendations:

[https://ai.google.dev/gemini-api/docs](https://ai.google.dev/gemini-api/docs)

---

## Common Problems

### Backend does not start

Check:

1. Java 22 is installed.
2. MySQL is running.
3. Database `expense_tracker` exists.
4. Database username and password are correct.
5. Port `8080` is available.
6. Required environment variables are configured.

---

### Database connection error

Verify:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
```

For the local setup, the database URL should normally be:

```text
jdbc:mysql://localhost:3307/expense_tracker
```

Do not place the actual database password inside source-controlled files.

---

### Frontend cannot connect to backend

Check that:

```text
http://localhost:8080
```

is running.

Then verify the frontend API configuration.

The backend API base path is:

```text
http://localhost:8080/api
```

---

### AI Advisor is unavailable

Check whether:

```text
GEMINI_API_KEY
```

is configured correctly.

If the Gemini service is unavailable, the application can use its local fallback recommendation mechanism.

---

### Email notifications are not working

Email notifications are disabled by default.

Check:

```text
APP_EMAIL_ENABLED
MAIL_HOST
MAIL_PORT
MAIL_USERNAME
MAIL_PASSWORD
```

For Gmail SMTP, an appropriate SMTP application password should be used instead of a normal account password.

---

## Security Notes

The project follows basic application security practices including:

* BCrypt password hashing
* Protected frontend routes
* User ownership checks for financial data operations
* Input validation
* Global exception handling
* Environment-based configuration for sensitive credentials

Production deployment should additionally use stronger authentication and authorisation mechanisms, HTTPS, secure secret management, monitoring, and comprehensive automated security testing.

---

## Development and Testing

The project has been manually tested for major application workflows, including:

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
* Protected-route behaviour
* Browser Back/Forward behaviour after logout

Automated unit, integration, and API testing can be expanded in future development.

---

## Build

To create a production-style backend build:

```text
mvnw.cmd clean package -DskipTests
```

A successful build produces the application JAR inside the:

```text
target/
```

directory.

---

## Important Development Notes

### IDE

The backend development environment uses:

**Eclipse IDE for Enterprise Java and Web Developers**

The frontend can be edited using:

**Visual Studio Code**

---

### Project Name

The official project name is:

**Smart Expense Tracker with AI Financial Advisor**

Do not use alternative application branding in project documentation.

---

### GitHub Repository

The project repository is:

```text
https://github.com/realgitesh/Smart-Expense-Tracker-with-AI-Financial-Advisor.git
```

---

## Future Enhancements

Possible future improvements include:

* Stronger production authentication and authorisation
* Automated unit and integration testing
* Automated API testing
* Recurring income and expense support
* Advanced financial analytics
* Improved AI context handling
* Additional report formats
* Database migration tools
* Production monitoring
* Cloud deployment
* HTTPS and production security hardening

---

## Summary

Smart Expense Tracker with AI Financial Advisor is a full-stack personal finance management application combining:

```text
React
+
Spring Boot
+
MySQL
+
REST APIs
+
Budget Monitoring
+
Financial Reports
+
AI-Assisted Recommendations
```

The project demonstrates practical implementation of full-stack web development, database management, REST API development, authentication, financial data management, reporting, and AI-assisted application functionality.

