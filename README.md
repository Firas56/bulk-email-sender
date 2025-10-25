# Bulk Email Sender

A full-stack web application for managing and sending bulk emails with campaign management, recipient management, and email templates.

## Features

- **Email Templates**: Create and manage reusable email templates
- **Recipient Management**: Add, edit, and manage email recipients
- **CSV Import**: Import recipients from CSV files with validation
- **Campaign Management**: Create, schedule, and send email campaigns
- **Dashboard**: Real-time statistics and sending history
- **Authentication**: Secure user login and registration

## Tech Stack

- **Frontend**: Angular 17, TypeScript, SCSS
- **Backend**: Node.js, Express.js, MySQL, Sequelize
- **Authentication**: JWT tokens
- **Email**: Nodemailer

## Quick Start

### Prerequisites
- Node.js (v16+)
- MySQL (v8+)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Firas56/bulk-email-sender.git
cd bulk-email-sender
```

2. **Backend Setup**
```bash
cd Backend
npm install
cp env.example .env
# Edit .env with your database credentials
npx sequelize-cli db:migrate
npm start
```

3. **Frontend Setup**
```bash
cd frontend
npm install
ng serve
```

4. **Access the application**
- Frontend: http://localhost:4200
- Backend API: http://localhost:5000

## Environment Variables

Create a `.env` file in the Backend directory:

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your_jwt_secret
DB_NAME=bulk_email_sender
DB_USER=your_mysql_username
DB_PASS=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
```

## Usage

1. Register a new account or login
2. Create email templates
3. Add recipients manually or import from CSV
4. Create campaigns and send emails
5. Monitor sending history and statistics

## Project Structure

```
bulk-email-sender/
├── Backend/          # Node.js API
├── frontend/         # Angular application
└── README.md
```

## License

MIT License