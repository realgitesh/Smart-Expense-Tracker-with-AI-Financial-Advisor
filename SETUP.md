
# Setup checklist

## 1. MySQL

Create the database:

```sql
CREATE DATABASE expense_tracker;
```

The backend defaults to port `3307`, matching the original project. If your MySQL uses `3306`, set:

`DB_URL=jdbc:mysql://localhost:3306/expense_tracker`

## 2. Backend environment variables

The project intentionally does not contain the database password, Gemini key, or SMTP password.

Windows Command Prompt example:

```bat
set DB_URL=jdbc:mysql://localhost:3307/expense_tracker
set DB_USERNAME=root
set DB_PASSWORD=YOUR_MYSQL_PASSWORD
set GEMINI_API_KEY=YOUR_GEMINI_KEY
set APP_EMAIL_ENABLED=false
```

For email:

```bat
set APP_EMAIL_ENABLED=true
set MAIL_HOST=smtp.gmail.com
set MAIL_PORT=587
set MAIL_USERNAME=yourgmail@gmail.com
set MAIL_PASSWORD=YOUR_GMAIL_APP_PASSWORD
```

Do not use your normal Gmail password. Use a Gmail App Password.

## 3. Run backend

From `backend`:

```bat
mvnw.cmd spring-boot:run
```

Or run `ExpenseTrackerApplication` from IntelliJ.

## 4. Run frontend

From `frontend`:

```bat
npm install
npm start
```

The frontend defaults to:

`http://localhost:8080/api`

If needed:

```bat
set REACT_APP_API_URL=http://localhost:8080/api
```

## 5. Existing users

The original application stored passwords in plain text. This version uses BCrypt.

Existing users are handled as follows:

- If an old account still has a plain-text password, a successful login automatically upgrades it to BCrypt.
- New registrations are hashed immediately.
- Passwords are never returned in API responses.

## 6. What is implemented

### Income
- Add
- Edit
- Delete
- Search
- Date reports
- Monthly/yearly analytics

### Expense
- Add
- Edit
- Delete
- Search
- Date reports
- Category summaries
- Monthly/yearly analytics

### Budget
- Add/edit/delete
- Category/month/year uniqueness
- Budget vs actual spending
- Percentage used
- Remaining amount
- Warning at 80%+
- Over-budget detection
- Dashboard budget summary

### Notifications
- Email notification support for exceeded budgets
- Disabled by default until SMTP settings are configured

### Security
- BCrypt password hashing
- Ownership checks for update/delete financial records
- Password excluded from JSON responses

### Reports
- PDF
- Excel
- User/date-range filtering

### AI
- Gemini-powered financial recommendations
- Expense-category context
- Budget context
- Local fallback recommendations if Gemini is unavailable

### Profile
- Update name/email
- Change password

### UI
- Dashboard charts
- Responsive layout
- Reports page
- Profile page
- Existing Budget/Expense/Income/AI pages
