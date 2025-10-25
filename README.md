# Bulk Email Sender Application

A full-stack web application for managing and sending bulk emails with campaign management, recipient management, and email templates.

## 🚀 Features

### 📧 Email Management
- **Bulk Email Sending**: Send emails to multiple recipients simultaneously
- **Email Templates**: Create and manage reusable email templates
- **Campaign Management**: Schedule and track email campaigns
- **Recipient Management**: Add, edit, and manage email recipients
- **CSV Import**: Import recipients from CSV files with validation

### 📊 Dashboard & Analytics
- **Real-time Dashboard**: Overview of campaigns, templates, and recipients
- **Sending History**: Track all email sending activities
- **Campaign Status**: Monitor campaign progress (Draft, Scheduled, Sending, Sent, Failed)
- **Statistics**: View comprehensive email statistics

### 🔐 Security & Authentication
- **User Authentication**: Secure login and registration system
- **JWT Tokens**: Secure API authentication
- **Email Validation**: Advanced email validation and verification
- **Protected Routes**: Secure access to application features

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database with Sequelize ORM
- **JWT** for authentication
- **Nodemailer** for email sending
- **Validator.js** for email validation

### Frontend
- **Angular 17** with TypeScript
- **RxJS** for reactive programming
- **SCSS** for styling
- **Responsive Design** for mobile compatibility

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MySQL** (v8 or higher)
- **Git**

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bulk-email-sender.git
cd bulk-email-sender
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create environment file
cp env.example .env
```

### 3. Configure Environment Variables

Edit the `.env` file in the Backend directory:

```env
# Database Configuration
DB_NAME=bulk_email_sender
DB_USER=your_mysql_username
DB_PASS=your_mysql_password
DB_HOST=localhost
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Email Configuration (Optional - for email sending)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 4. Database Setup

```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE bulk_email_sender;
exit

# Run database migrations
cd Backend
npx sequelize-cli db:migrate
```

### 5. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

### 6. Run the Application

#### Start Backend Server
```bash
cd Backend
npm start
```

#### Start Frontend Development Server
```bash
cd frontend
ng serve
```

The application will be available at:
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:5000

## 📱 Usage

### 1. Registration & Login
- Register a new account or login with existing credentials
- Secure JWT-based authentication

### 2. Dashboard
- View overview of your email campaigns, templates, and recipients
- Monitor sending history and statistics

### 3. Templates Management
- Create email templates with subject and content
- Edit and manage existing templates
- Use templates in campaigns

### 4. Recipients Management
- Add individual recipients manually
- Import recipients from CSV files
- Validate email addresses
- Manage recipient lists

### 5. Campaign Management
- Create email campaigns
- Select templates and recipients
- Schedule campaigns for future sending
- Send campaigns immediately
- Track campaign status and results

## 📁 Project Structure

```
bulk-email-sender/
├── Backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # API route controllers
│   ├── middleware/      # Authentication middleware
│   ├── migrations/      # Database migrations
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── server.js        # Main server file
│   └── package.json     # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # Angular components
│   │   │   ├── guards/      # Route guards
│   │   │   ├── models/      # TypeScript models
│   │   │   └── services/    # Angular services
│   │   ├── environments/    # Environment configs
│   │   └── styles.scss      # Global styles
│   └── package.json         # Frontend dependencies
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Templates
- `GET /api/templates` - Get all templates
- `POST /api/templates` - Create template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template

### Recipients
- `GET /api/recipients` - Get all recipients
- `POST /api/recipients` - Create recipient
- `POST /api/recipients/bulk` - Bulk import recipients
- `PUT /api/recipients/:id` - Update recipient
- `DELETE /api/recipients/:id` - Delete recipient
- `DELETE /api/recipients` - Delete all recipients

### Campaigns
- `GET /api/campaigns` - Get all campaigns
- `POST /api/campaigns` - Create campaign
- `PUT /api/campaigns/:id` - Update campaign
- `POST /api/campaigns/:id/schedule` - Schedule campaign
- `POST /api/campaigns/:id/send` - Send campaign
- `DELETE /api/campaigns/:id` - Delete campaign

## 🎨 Screenshots

For detailed screenshots and UI walkthrough, see [SCREENSHOTS.md](SCREENSHOTS.md)

## 🚀 Deployment

### Using Render (Recommended)

1. **Backend Deployment**:
   - Connect your GitHub repository to Render
   - Set environment variables in Render dashboard
   - Deploy with Node.js buildpack

2. **Frontend Deployment**:
   - Build the Angular app: `ng build --configuration production`
   - Deploy the `dist/` folder to any static hosting service

### Environment Variables for Production

```env
NODE_ENV=production
DB_NAME=your_production_db_name
DB_USER=your_production_db_user
DB_PASS=your_production_db_password
DB_HOST=your_production_db_host
JWT_SECRET=your_production_jwt_secret
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/bulk-email-sender/issues) page
2. Create a new issue with detailed description
3. Include error logs and steps to reproduce

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
  - User authentication
  - Email template management
  - Recipient management with CSV import
  - Campaign creation and scheduling
  - Real-time dashboard and analytics

## 📞 Contact

For questions or support, please open an issue on GitHub.

---

**Note**: This application is for educational and development purposes. Please ensure compliance with email marketing regulations (CAN-SPAM Act, GDPR, etc.) when using for production purposes.