const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bulk Email Sender API', 
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});

// Load database models
const db = require('./models');

// Scheduled campaign checker
const checkScheduledCampaigns = async () => {
  try {
    const now = new Date();
    const scheduledCampaigns = await db.Campaign.findAll({
      where: {
        status: 'Scheduled',
        scheduledAt: {
          [db.Sequelize.Op.lte]: now
        }
      }
    });

    for (const campaign of scheduledCampaigns) {
      
      try {
        // Update status to Sending
        await campaign.update({
          status: 'Sending',
          sentAt: new Date()
        });

        // Import the email controller to send emails
        const emailController = require('./controllers/emailController');
        
        // Use the existing sendBulkEmails function
        const emailReq = {
          body: { campaignId: campaign.id },
          userId: campaign.userId
        };
        
        // Create a custom response handler
        let emailResults = null;
        const emailRes = {
          json: (data) => {
            emailResults = data;
          },
          status: (code) => ({
            json: (data) => {
              emailResults = data;
            }
          })
        };

        // Call the email sending function
        await emailController.sendBulkEmails(emailReq, emailRes);

        // Update campaign status based on email sending results
        if (emailResults && emailResults.success > 0) {
          await campaign.update({ status: 'Sent' });
        } else {
          await campaign.update({ status: 'Failed' });
        }
      } catch (error) {
        console.error(`Error sending scheduled campaign ${campaign.name}:`, error);
        await campaign.update({ status: 'Failed' });
      }
    }
  } catch (error) {
    console.error('Error checking scheduled campaigns:', error);
  }
};

// Check for scheduled campaigns every minute
setInterval(checkScheduledCampaigns, 60000); // 60 seconds

// Load and register routes
const authRoutes = require('./routes/authRoutes');
const templateRoutes = require('./routes/templateRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const recipientRoutes = require('./routes/recipientRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/recipients', recipientRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Database connection and server startup
async function startServer() {
  try {
    // Test database connection
    await db.sequelize.authenticate();

    // Sync database (only in development)
    if (process.env.NODE_ENV === 'development') {
      await db.sequelize.sync({ alter: false });
    }

    const PORT = process.env.PORT || 5000;
    
    app.listen(PORT, '0.0.0.0', () => {
    });

  } catch (error) {
    console.error('Failed to start server:', error.message);
    console.error('Database connection failed. Please check:');
    console.error('- MySQL server is running');
    console.error('- Database credentials are correct');
    console.error('- Database exists and user has permissions');
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  await db.sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await db.sequelize.close();
  process.exit(0);
});

// Start the server
startServer();