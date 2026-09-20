
# Smart-Expense-Tracker-with-AI-Financial-Advisor

## Setup Guide

This guide explains how to configure, run, and test the **Smart-Expense-Tracker-with-AI-Financial-Advisor** project locally.

The project consists of:

- Spring Boot backend
- React frontend
- MySQL database
- Gemini AI integration
- Optional email/SMTP notifications

---

# 1. Prerequisites

Install the following software before running the project:

- Java 22
- MySQL 8.x
- Node.js
- npm
- Eclipse IDE for Enterprise Java and Web Developers
- Visual Studio Code

Maven is provided through the Maven Wrapper included with the backend project, so a separate Maven installation is not required when using `mvnw.cmd`.

## Recommended Development Environment

| Software | Purpose |
|---|---|
| Java 22 | Backend development and execution |
| Eclipse IDE for Enterprise Java and Web Developers | Spring Boot backend development |
| Maven Wrapper | Backend dependency management and build |
| MySQL 8.x | Database |
| Node.js | React development environment |
| npm | Frontend dependency management |
| Visual Studio Code | Frontend development |

---

# 2. Project Structure

The project is organized into separate backend and frontend applications.

```text
Smart-Expense-Tracker-with-AI-Financial-Advisor/

│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── mvnw.cmd
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── README.md
├── SETUP.md
├── HELP.md
├── environment.example.txt
└── ...
````

The backend provides REST APIs, while the frontend communicates with the backend through HTTP requests.

---

# 3. MySQL Database Setup

Start your MySQL server before starting the backend.

Create the project database using MySQL:

```sql
CREATE DATABASE expense_tracker;
```

The application does not require manual creation of application tables. Spring Boot and JPA/Hibernate create and manage the required database tables according to the entity configuration.

## MySQL Port

The project is configured to use MySQL on port **3307 by default**.

Default database URL:

```text
jdbc:mysql://localhost:3307/expense_tracker
```

If your local MySQL installation uses another port, configure `DB_URL` accordingly.

For example:

```text
jdbc:mysql://localhost:3307/expense_tracker
```

Make sure the configured port matches your local MySQL installation.

---

# 4. Backend Environment Variables

Sensitive information should not be stored directly in the source code or committed to GitHub.

The backend can use environment variables for:

* Database URL
* Database username
* Database password
* Gemini API key
* Gemini API URL
* Email/SMTP configuration

The important environment variables are:

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

---

## Windows Command Prompt

Example configuration:

```bat
set DB_URL=jdbc:mysql://localhost:3307/expense_tracker
set DB_USERNAME=root
set DB_PASSWORD=YOUR_MYSQL_PASSWORD
set GEMINI_API_KEY=YOUR_GEMINI_API_KEY
set GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
set APP_EMAIL_ENABLED=false
```

Replace the placeholder values with your own local configuration.

---

## Important Security Rule

Never commit real credentials to GitHub.

Do not commit:

```text
Database password
Gemini API key
SMTP password
Gmail App Password
```

Use environment variables or another secure configuration mechanism.

---

# 5. Environment Example File

An example configuration file is provided in:

```text
environment.example.txt
```

The file contains placeholders only.

Example:

```text
DB_URL=jdbc:mysql://localhost:3307/expense_tracker
DB_USERNAME=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD

GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent

APP_EMAIL_ENABLED=false

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=YOUR_EMAIL
MAIL_PASSWORD=YOUR_SMTP_APP_PASSWORD
```

Do not replace these placeholders with real credentials inside a file that will be committed to GitHub.

---

# 6. Backend Setup in Eclipse

The recommended backend IDE is:

```text
Eclipse IDE for Enterprise Java and Web Developers
```

## Import the Backend Project

1. Open Eclipse IDE for Enterprise Java and Web Developers.

2. Select the workspace used for the project.

3. Go to:

```text
File → Import
```

4. Select:

```text
Maven → Existing Maven Projects
```

5. Select the project's `backend` directory.

6. Eclipse should detect the Maven project.

7. Click **Finish**.

8. Wait for Maven dependencies to download.

9. Wait for the Eclipse workspace build to complete.

10. Check the Eclipse Problems view.

The backend project should appear in the Eclipse Project Explorer.

---

# 7. Run the Backend from Eclipse

Locate the main Spring Boot application class:

```text
ExpenseTrackerApplication
```

Run it as a Java/Spring Boot application from Eclipse.

The backend normally starts on:

```text
http://localhost:8080
```

The REST API is available under:

```text
http://localhost:8080/api
```

A successful startup should show that the Spring Boot application has started and connected to MySQL.

---

# 8. Run the Backend Using Maven Wrapper

The backend can also be started without Eclipse.

Open Command Prompt or a terminal in the backend directory:

```bat
cd backend
```

Run:

```bat
mvnw.cmd spring-boot:run
```

The backend should start on:

```text
http://localhost:8080
```

---

# 9. Build the Backend

To create a backend build without running tests:

```bat
cd backend
mvnw.cmd clean package -DskipTests
```

A successful build should display:

```text
BUILD SUCCESS
```

The generated application JAR is created inside the Maven:

```text
target/
```

directory.

---

# 10. Frontend Setup

The frontend is a React application created using **Create React App**.

Open another terminal and move to the frontend directory:

```bat
cd frontend
```

Install the required dependencies:

```bat
npm install
```

Start the React development server:

```bat
npm start
```

The frontend normally runs at:

```text
http://localhost:3000
```

## Important

This project uses **Create React App**.

Use:

```bat
npm start
```

Do not use:

```bat
npm run dev
```

---

# 11. Frontend API Configuration

The frontend uses the following environment variable:

```text
REACT_APP_API_URL
```

The default backend API URL is:

```text
http://localhost:8080/api
```

If `REACT_APP_API_URL` is not configured, the frontend uses the default API URL defined in the frontend API configuration.

To explicitly configure the API URL in Windows Command Prompt:

```bat
set REACT_APP_API_URL=http://localhost:8080/api
```

After changing the frontend environment configuration, restart the React development server.

---

# 12. Running the Complete Application

The recommended startup order is:

## Step 1 — Start MySQL

Make sure the MySQL server is running.

Verify that the database exists:

```text
expense_tracker
```

---

## Step 2 — Start the Backend

Using the Maven Wrapper:

```bat
cd backend
mvnw.cmd spring-boot:run
```

Or run:

```text
ExpenseTrackerApplication
```

from Eclipse.

The backend should be available at:

```text
http://localhost:8080
```

---

## Step 3 — Start the Frontend

Open another terminal:

```bat
cd frontend
npm install
npm start
```

The frontend should be available at:

```text
http://localhost:3000
```

---

# 13. Application URLs

After successful startup:

```text
Frontend:
http://localhost:3000

Backend:
http://localhost:8080

REST API:
http://localhost:8080/api
```

The normal development flow is:

```text
Browser
   ↓
React Frontend
   ↓
REST API
   ↓
Spring Boot Backend
   ↓
MySQL Database
```

The Gemini AI service and optional SMTP service are accessed by the backend when their respective features are enabled.

---

# 14. Optional Email Configuration

Email notifications are disabled by default.

Default setting:

```text
APP_EMAIL_ENABLED=false
```

To enable email notifications:

```bat
set APP_EMAIL_ENABLED=true
set MAIL_HOST=smtp.gmail.com
set MAIL_PORT=587
set MAIL_USERNAME=yourgmail@gmail.com
set MAIL_PASSWORD=YOUR_GMAIL_APP_PASSWORD
```

For Gmail, do not use your normal Gmail account password.

Use a:

```text
Gmail App Password
```

Email notifications are mainly used for budget-related alerts, including exceeded-budget notifications.

SMTP configuration must be valid before enabling email notifications.

---

# 15. Gemini AI Configuration

The AI Financial Advisor uses the Gemini API when a valid Gemini API key is configured.

Set the backend API key:

```bat
set GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

The Gemini API URL can be configured using:

```text
GEMINI_API_URL
```

The Gemini configuration belongs to the backend.

The Gemini API key should **never** be placed inside the React frontend source code.

The AI Financial Advisor can provide:

* Financial recommendations
* Spending suggestions
* Expense-category context
* Budget context
* Financial analysis

If Gemini is unavailable or the API key is not configured, the application can use its local fallback recommendation mechanism.

---

# 16. Password Security

The application uses **BCrypt password hashing** for user passwords.

Newly registered users have their passwords hashed before they are stored.

Passwords are not returned as part of normal API responses.

BCrypt is used for password hashing. It is not reversible encryption.

---

# 17. Implemented Features

## Authentication

The application supports:

* User registration
* User login
* Password hashing using BCrypt
* Protected frontend routes
* Logout
* Login session persistence through browser storage

---

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
* Warning when usage reaches 80% or more
* Over-budget detection
* Dashboard budget summary

---

## Notifications

The application supports:

* Budget-related email notifications
* Exceeded-budget notifications

Email notifications are optional and disabled by default.

SMTP configuration must be provided before enabling them.

---

## Reports

The Reports module supports:

* PDF reports
* Excel reports
* User-specific filtering
* Date-range filtering

---

## AI Financial Advisor

The AI Financial Advisor supports:

* Gemini-powered financial recommendations
* Expense-category context
* Budget context
* Spending suggestions
* Local fallback recommendations when Gemini is unavailable

The Gemini API key is configured on the backend and should never be exposed in the frontend.

---

## Profile Management

The Profile module supports:

* Update name
* Update email
* Change password

---

## Dashboard and Analytics

The dashboard provides:

* Financial summaries
* Income information
* Expense information
* Budget information
* Budget progress
* Charts and analytics

---

## Responsive User Interface

The frontend includes:

* Login page
* Registration page
* Dashboard
* Income page
* Expense page
* Budget page
* Reports page
* AI Financial Advisor page
* Profile page
* Responsive layout
* Protected application navigation

---

# 18. User Data Protection

Financial data belongs to the logged-in user.

The backend performs user ownership checks for relevant financial operations such as:

* Updating records
* Deleting records
* Retrieving user-specific financial information
* Generating user-specific reports

These checks help prevent one user's financial records from being accessed or modified through another user's account.

---

# 19. Basic Application Test

After both backend and frontend applications are running, perform the following basic test:

1. Open:

```text
http://localhost:3000
```

2. Register a new user.

3. Login with the new account.

4. Open the Dashboard.

5. Add an income record.

6. Add an expense record.

7. Create a budget.

8. Check budget progress.

9. Open Reports.

10. Generate/check a report.

11. Open the AI Financial Advisor.

12. Open Profile.

13. Verify profile functionality.

14. Logout.

15. Confirm that protected pages are no longer accessible after logout.

The main financial-management workflow should work without enabling the optional email feature.

---

# 20. Troubleshooting

## MySQL Connection Error

Check:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
```

Also verify that:

* MySQL is running.
* The `expense_tracker` database exists.
* The configured MySQL port is correct.
* The database username and password are correct.

The project uses port `3307` by default, but another port can be configured through `DB_URL`.

---

## Backend Does Not Start

Check:

* Java version
* MySQL status
* Database name
* Database credentials
* Environment variables
* Port 8080 availability
* Maven dependencies

The required Java version is:

```text
Java 22
```

---

## Maven Build Fails

Try:

```bat
mvnw.cmd clean package -DskipTests
```

Make sure:

* Java 22 is configured.
* Internet access is available when Maven needs to download dependencies.
* The backend directory is correct.
* Maven dependencies have been downloaded successfully.

---

## Frontend Does Not Start

Move into the frontend directory:

```bat
cd frontend
```

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

because the project uses Create React App.

---

## Frontend Cannot Connect to Backend

Verify that the backend is running:

```text
http://localhost:8080
```

Verify the configured API URL:

```text
http://localhost:8080/api
```

If `REACT_APP_API_URL` is configured, make sure it points to the correct backend API.

After changing the frontend environment variable, restart the React development server.

---

## AI Advisor Does Not Generate Gemini Recommendations

Check:

```text
GEMINI_API_KEY
GEMINI_API_URL
```

Also verify that:

* The backend can access the Gemini service.
* The API key is valid.
* The Gemini configuration is correct.

If Gemini is unavailable, the application can use its local fallback recommendation mechanism.

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

For Gmail:

```text
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
```

Use a Gmail App Password instead of the normal Gmail account password.

---

## Port 8080 Already in Use

If another application is already using port 8080, stop that application or configure the Spring Boot server to use another available port.

If the backend port is changed, make sure the frontend API URL is changed accordingly.

---

## Port 3000 Already in Use

If another application is already using port 3000, the React development server may ask whether it should use another available port.

If the frontend uses a different port, open the URL shown by the React development server.

---

# 21. Eclipse Development Notes

The recommended backend IDE for this project is:

```text
Eclipse IDE for Enterprise Java and Web Developers
```

The project uses Maven for dependency management.

Important Eclipse components include:

* Java development tools
* Maven integration
* Git integration
* Enterprise/Web development tooling
* Spring Boot development support

Lombok is used by the backend where required and should be correctly configured in the Eclipse installation.

---

# 22. Frontend Development Notes

The frontend is developed using:

```text
React
Create React App
JavaScript
HTML
CSS
```

The normal development command is:

```bat
npm start
```

Frontend dependencies are managed using:

```text
package.json
```

Install dependencies using:

```bat
npm install
```

---

# 23. Backend Development Notes

The backend is developed using:

```text
Java 22
Spring Boot
Spring Web
Spring Data JPA
Hibernate
MySQL
Maven
Lombok
```

The backend exposes REST APIs under:

```text
/api
```

The backend is normally available at:

```text
http://localhost:8080
```

---

# 24. Security Reminder

Never commit real credentials to GitHub.

Do not commit:

```text
DB_PASSWORD
GEMINI_API_KEY
MAIL_PASSWORD
Gmail App Password
```

Do not place sensitive API keys inside the React frontend.

Use:

```text
Environment variables
```

or another secure configuration mechanism.

---

# 25. GitHub Repository

Official GitHub repository:

```text
https://github.com/realgitesh/Smart-Expense-Tracker-with-AI-Financial-Advisor.git
```

Project name:

```text
Smart-Expense-Tracker-with-AI-Financial-Advisor
```

---

# 26. Quick Start Summary

For a quick local setup:

## Database

```sql
CREATE DATABASE expense_tracker;
```

## Backend

Open a terminal:

```bat
cd backend
mvnw.cmd spring-boot:run
```

Backend:

```text
http://localhost:8080
```

API:

```text
http://localhost:8080/api
```

## Frontend

Open another terminal:

```bat
cd frontend
npm install
npm start
```

Frontend:

```text
http://localhost:3000
```

---

# 27. Recommended Startup Order

Always follow this order when starting the complete application:

```text
1. Start MySQL
       ↓
2. Start Spring Boot Backend
       ↓
3. Start React Frontend
       ↓
4. Open http://localhost:3000
       ↓
5. Login/Register
       ↓
6. Use the application
```

---

# 28. Final Local Setup Checklist

Before considering the project ready for local development, verify:

* [ ] Java 22 installed
* [ ] MySQL 8.x installed and running
* [ ] `expense_tracker` database created
* [ ] Correct MySQL port configured
* [ ] Database credentials configured
* [ ] Gemini API key configured if AI features are required
* [ ] Email disabled or correctly configured
* [ ] Backend Maven dependencies installed
* [ ] Backend starts successfully
* [ ] Backend available on port 8080
* [ ] Frontend dependencies installed
* [ ] Frontend starts successfully
* [ ] Frontend available on port 3000
* [ ] Frontend can communicate with backend
* [ ] User registration works
* [ ] Login works
* [ ] Income operations work
* [ ] Expense operations work
* [ ] Budget operations work
* [ ] Reports work
* [ ] AI Financial Advisor works or fallback works
* [ ] Profile operations work
* [ ] Logout works
* [ ] No real credentials are committed to GitHub

---

## Project Information

**Project:** Smart-Expense-Tracker-with-AI-Financial-Advisor

**Backend:** Spring Boot

**Frontend:** React with Create React App

**Database:** MySQL 8.x

**Backend IDE:** Eclipse IDE for Enterprise Java and Web Developers

**Frontend IDE:** Visual Studio Code

**Java:** 22

