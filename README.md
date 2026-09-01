
# Smart Expense Tracker with AI Financial Advisor

This version consolidates the existing project and the requested final feature set.

## Features

- User registration and login
- BCrypt password hashing
- Profile management
- Change password
- Income add/edit/delete
- Expense add/edit/delete
- Expense search/filtering
- Date-wise expense and income reports
- Monthly/yearly analytics
- Dashboard charts
- Budget planning
- Budget vs actual expense tracking
- Overspending / near-limit status
- Budget exceeded email notification support
- PDF export
- Excel export
- AI financial recommendations through Gemini
- Local AI fallback when Gemini is not configured
- Responsive frontend
- Existing SweetAlert UX
- User ownership checks on financial records

## Backend

Open `backend` as the Maven/Spring Boot project.

Java: 22

Run:

    ./mvnw spring-boot:run

or use IntelliJ and run `ExpenseTrackerApplication`.

## Database

The default database is:

    expense_tracker

Default URL:

    jdbc:mysql://localhost:3307/expense_tracker

Configure environment variables instead of hard-coding secrets:

    DB_URL
    DB_USERNAME
    DB_PASSWORD

## Gemini

Set:

    GEMINI_API_KEY

Optional:

    GEMINI_API_URL

If the Gemini key is missing/unavailable, the AI endpoint returns locally generated financial guidance instead of failing.

## Email notifications

Email is disabled by default.

Set:

    APP_EMAIL_ENABLED=true
    MAIL_HOST=smtp.gmail.com
    MAIL_PORT=587
    MAIL_USERNAME=your-email
    MAIL_PASSWORD=your-app-password

Budget-exceeded emails are then sent when an expense causes a user's category budget to be exceeded.

## Frontend

Open `frontend`.

Install:

    npm install

Run:

    npm start

Optional API URL:

    REACT_APP_API_URL=http://localhost:8080/api

## Important password migration note

The original project stored passwords as plain text. This version stores new passwords using BCrypt.

For old users, the login service supports the old password once and automatically converts it to BCrypt after a successful login. New registrations are hashed immediately.

## Reports

PDF and Excel endpoints:

    GET /api/reports/pdf/{userId}?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
    GET /api/reports/excel/{userId}?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD

## Budget progress

    GET /api/budget/progress/{userId}?month=MM&year=YYYY

## Profile

    GET /api/profile/{userId}
    PUT /api/profile/{userId}
    PUT /api/profile/{userId}/password

## Security note

Password hashing is one-way hashing, not reversible encryption. This is the correct way to store passwords.
