# Smart-Expense-Tracker-with-AI-Financial-Advisor

## Setup Guide

This guide explains how to configure and run the backend and frontend of the project locally.

---

# 1. Prerequisites

Install the following software :

* Java 22
* MySQL 8.x
* Maven
* Node.js
* npm
* IntelliJ IDEA or another Java IDE
* Visual Studio Code or another frontend IDE

---

# 2. MySQL Setup

Start your MySQL server and create the project database:

```sql
CREATE DATABASE expense_tracker;
```

The backend is configured to use MySQL on port **3307** by default.

Default database URL:

```text
jdbc:mysql://localhost:3307/expense_tracker
```

If your MySQL server is running on the standard port **3306**, use:

```text
jdbc:mysql://localhost:3306/expense_tracker
```

---

# 3. Backend Environment Variables

The project intentionally does **not** store sensitive credentials directly in the source code.

The following values should be configured through environment variables:

* Database URL
* Database username
* Database password
* Gemini API key
* Email/SMTP credentials

## Windows Command Prompt

Example:

```bat
set DB_URL=jdbc:mysql://localhost:3307/expense_tracker

set DB_USERNAME=root

set DB_PASSWORD=YOUR_MYSQL_PASSWORD

set GEMINI_API_KEY=YOUR_GEMINI_KEY

set APP_EMAIL_ENABLED=false
```

Replace the placeholder values with your own credentials.

### Important

Never commit the following to GitHub:

```text
Database password
Gemini API key
SMTP password
Gmail App Password
```

---

# 4. Optional Email Configuration

Email notifications are disabled by default.

To enable email notifications:

```bat
set APP_EMAIL_ENABLED=true

set MAIL_HOST=smtp.gmail.com

set MAIL_PORT=587

set MAIL_USERNAME=yourgmail@gmail.com

set MAIL_PASSWORD=YOUR_GMAIL_APP_PASSWORD
```

For Gmail, **do not use your normal Gmail account password**.

Use a **Gmail App Password**.

Email notifications are mainly used for budget-related alerts such as exceeded budgets.

---

# 5. Run the Backend

Open Command Prompt or a terminal inside the `backend` directory:

```bat
cd backend
```

Run the Spring Boot application using Maven Wrapper:

```bat
mvnw.cmd spring-boot:run
```

Alternatively, open the project in IntelliJ IDEA and run:

```text
ExpenseTrackerApplication
```

The backend runs on:

```text
http://localhost:8080
```

The REST API is available under:

```text
http://localhost:8080/api
```

---

# 6. Run the Frontend

Open another terminal and move into the frontend directory:

```bat
cd frontend
```

Install the frontend dependencies:

```bat
npm install
```

Start the React application:

```bat
npm start
```

The frontend normally runs at:

```text
http://localhost:3000
```

The frontend communicates with the Spring Boot backend through:

```text
http://localhost:8080/api
```

---

# 7. Frontend API Configuration

The frontend uses the following environment variable:

```text
REACT_APP_API_URL
```

The default API URL is:

```text
http://localhost:8080/api
```

If you need to explicitly configure it in Windows Command Prompt:

```bat
set REACT_APP_API_URL=http://localhost:8080/api
```

Then restart the React development server.

---

# 8. Existing Users and Password Migration

Earlier versions of the application could contain users whose passwords were stored as plain text.

The current version uses **BCrypt password hashing**.

Existing users are handled as follows:

### Existing plain-text account

If an old account still contains a plain-text password:

1. The user logs in with the existing password.
2. The login is verified.
3. The password is automatically upgraded to BCrypt.
4. Future logins use the BCrypt password.

### New users

New registrations are hashed using BCrypt immediately.

### API responses

Passwords are excluded from API responses.

---

# 9. Implemented Features

## Income Management

The Income module supports:

* Add income
* Edit income
* Delete income
* Search income
* Date-based reports
* Monthly analytics
* Yearly analytics

---

## Expense Management

The Expense module supports:

* Add expense
* Edit expense
* Delete expense
* Search expenses
* Date-based reports
* Category summaries
* Monthly analytics
* Yearly analytics

---

## Budget Management

The Budget module supports:

* Add budget
* Edit budget
* Delete budget
* Category-based budgets
* Month-based budgets
* Year-based budgets
* Category/month/year uniqueness
* Budget versus actual spending
* Percentage used
* Remaining amount
* Warning when usage reaches 80%+
* Over-budget detection
* Dashboard budget summary

---

## Notifications

The application supports:

* Budget-related email notifications
* Exceeded-budget notifications

Email notifications are:

```text
Disabled by default
```

SMTP configuration must be provided before enabling them.

---

## Security

The application includes:

* BCrypt password hashing
* User ownership checks for financial update/delete operations
* Password exclusion from JSON responses
* Protected frontend routes
* Environment-based sensitive configuration

---

## Reports

The Reports module supports:

* PDF reports
* Excel reports
* User-specific filtering
* Date-range filtering

---

## AI Financial Advisor

The AI Advisor supports:

* Gemini-powered financial recommendations
* Expense-category context
* Budget context
* Financial spending suggestions
* Local fallback recommendations when Gemini is unavailable

The Gemini API key is configured on the backend and should not be exposed in the React frontend.

---

## Profile

The Profile module supports:

* Update name
* Update email
* Change password

---

## User Interface

The frontend includes:

* Dashboard
* Dashboard charts
* Income page
* Expense page
* Budget page
* Reports page
* AI Financial Advisor page
* Profile page
* Responsive layout
* Login page
* Registration page
* Protected application navigation

---

# 10. Recommended Startup Order

For local development, start the applications in this order:

### Step 1 — MySQL

Make sure MySQL is running.

### Step 2 — Backend

```bat
cd backend
mvnw.cmd spring-boot:run
```

### Step 3 — Frontend

Open another terminal:

```bat
cd frontend
npm install
npm start
```

After startup:

```text
Frontend:
http://localhost:3000

Backend:
http://localhost:8080

API:
http://localhost:8080/api
```

---

# 11. Basic Application Test

After both applications start:

1. Open the frontend.
2. Register a new user.
3. Login.
4. Open Dashboard.
5. Add income.
6. Add an expense.
7. Create a budget.
8. Check budget progress.
9. Open Reports.
10. Open AI Financial Advisor.
11. Open Profile.
12. Logout.

The application should be able to perform the main financial-management workflow without requiring the optional email feature.

---

# 12. Troubleshooting

## MySQL Connection Error

Check:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
```

Also verify that MySQL is running on the configured port.

For example:

```text
3307
```

or:

```text
3306
```

depending on your local MySQL installation.

---

## Backend Does Not Start

Check:

* Java version
* MySQL status
* Database name
* Database credentials
* Environment variables
* Port 8080 availability

---

## Frontend Does Not Start

Run:

```bat
npm install
```

Then:

```bat
npm start
```

Do not use:

```bat
npm run dev
```

because this project uses Create React App.

---

## Frontend Cannot Connect to Backend

Verify that Spring Boot is running on:

```text
http://localhost:8080
```

and that the frontend API URL is:

```text
http://localhost:8080/api
```

If `REACT_APP_API_URL` is configured, make sure it points to the correct backend API.

---

## AI Advisor Does Not Generate Gemini Recommendations

Check:

```text
GEMINI_API_KEY
```

If Gemini is unavailable or the key is not configured, the application can use its local fallback recommendation mechanism.

---

## Email Notifications Do Not Work

Check:

```text
APP_EMAIL_ENABLED=true
MAIL_HOST
MAIL_PORT
MAIL_USERNAME
MAIL_PASSWORD
```

For Gmail, use an App Password rather than the normal Gmail password.

---

# 13. Security Reminder

Never commit real credentials to GitHub.

Do not commit:

```text
DB_PASSWORD
GEMINI_API_KEY
MAIL_PASSWORD
```

Use environment variables or another secure configuration mechanism.

---

# 14. Project Repository

GitHub:

https://github.com/realgitesh/Smart-Expense-Tracker

Project name:

**Smart-Expense-Tracker-with-AI-Financial-Advisor**
