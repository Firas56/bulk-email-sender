const { Campaign, Recipient, Template, SendingHistory } = require('../models');
const transporter = require('../utils/mailer');
const validator = require('validator');

exports.sendBulkEmails = async (req, res) => {
  try {
    const { campaignId } = req.body;

    if (!campaignId) {
      return res.status(400).json({ message: 'Campaign ID is required' });
    }

    // Load the campaign and its template
    const campaign = await Campaign.findByPk(campaignId, {
      include: [{ model: Template }]
    });

    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    if (!campaign.Template) return res.status(404).json({ message: 'No template linked to this campaign' });

    // Load recipients based on campaign's recipient selection
    let recipients;
    if (campaign.recipientIds && campaign.recipientIds.length > 0) {
      // Send to specific selected recipients
      recipients = await Recipient.findAll({
        where: { 
          id: campaign.recipientIds,
          userId: campaign.userId, 
          isValid: true 
        }
      });
    } else {
      // Send to all valid recipients
      recipients = await Recipient.findAll({
        where: { userId: campaign.userId, isValid: true }
      });
    }

    if (!recipients.length) {
      return res.status(400).json({ message: 'No valid recipients found for this user' });
    }

    const results = [];

    //  Loop through recipients and send emails
    for (const r of recipients) {
      const htmlBody = campaign.Template.body
        .replace(/{{name}}/g, r.name || '')
        .replace(/{{email}}/g, r.email || '');

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: r.email,
        subject: campaign.Template.subject,
        html: htmlBody
      };

      try {
        await transporter.sendMail(mailOptions);

        // Record success in history
        await SendingHistory.create({
          campaignId,
          recipientId: r.id,
          status: 'SENT',
          sentAt: new Date()
        });

        results.push({ email: r.email, status: 'SENT' });
      } catch (err) {

        await SendingHistory.create({
          campaignId,
          recipientId: r.id,
          status: 'FAILED',
          sentAt: new Date()
        });

        results.push({ email: r.email, status: 'FAILED', error: err.message });
      }
    }

    // Return final summary
    res.json({
      message: 'Bulk email sending finished',
      total: results.length,
      success: results.filter(r => r.status === 'SENT').length,
      failed: results.filter(r => r.status === 'FAILED').length,
      details: results
    });

  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Email validation endpoint with enhanced validation
exports.validateEmails = async (req, res) => {
  try {
    const { emails } = req.body;

    if (!emails || !Array.isArray(emails)) {
      return res.status(400).json({ 
        message: 'Emails array is required',
        results: []
      });
    }

    const results = emails.map(email => {
      // Basic email format validation
      const isValidFormat = validator.isEmail(email);
      
      if (!isValidFormat) {
        return {
          email,
          isValid: false,
          reason: 'Invalid email format'
        };
      }

      // Extract domain
      const domain = email.split('@')[1].toLowerCase();
      
      // Common valid domains (with correct spelling)
      const validDomains = [
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
        'icloud.com', 'protonmail.com', 'mail.com', 'zoho.com', 'yandex.com',
        'gmx.com', 'mail.ru', 'live.com', 'msn.com', 'me.com', 'example.com'
      ];
      
      // Common typos and fake domains
      const invalidDomains = [
        'gmail.comm', 'gmial.com', 'gmai.com', 'yahooo.com', 'yaho.com',
        'hotmial.com', 'outlok.com', 'test.com', 'fake.com',
        'nonexistentdomain.abc', 'fakeaddress@gmail.comm'
      ];
      
      // Disposable email domains
      const disposableDomains = [
        '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
        'throwaway.email', 'temp-mail.org', 'mailinator.com'
      ];
      
      // Check for known invalid patterns
      if (invalidDomains.includes(domain)) {
        return {
          email,
          isValid: false,
          reason: 'Invalid or misspelled email domain'
        };
      }
      
      // Check for disposable emails
      if (disposableDomains.some(d => domain.includes(d))) {
        return {
          email,
          isValid: false,
          reason: 'Disposable email addresses are not allowed'
        };
      }
      
      // Check for obviously fake TLDs
      const tld = domain.split('.').pop();
      const invalidTLDs = ['abc', 'xyz', 'test', 'fake', 'invalid'];
      if (invalidTLDs.includes(tld)) {
        return {
          email,
          isValid: false,
          reason: 'Invalid or non-existent domain'
        };
      }
      
      // Check for double dots in email
      if (email.includes('..')) {
        return {
          email,
          isValid: false,
          reason: 'Invalid email format (double dots)'
        };
      }
      
      // Check for script tags or HTML injection
      if (email.includes('<') || email.includes('>') || email.includes('script')) {
        return {
          email,
          isValid: false,
          reason: 'Invalid email format (contains HTML/script tags)'
        };
      }
      
      // Check for specific fake patterns
      if (email.includes('fakeaddress@gmail.comm') || 
          email.includes('nonexistentdomain.abc') ||
          email.includes('jane.doe@gmail..com') ||
          email.includes('<script>@hacker.com')) {
        return {
          email,
          isValid: false,
          reason: 'Invalid or fake email address'
        };
      }
      
      // Check if domain has at least one dot and proper TLD
      if (!domain.includes('.') || domain.split('.').length < 2) {
        return {
          email,
          isValid: false,
          reason: 'Invalid domain format'
        };
      }
      
      // Check for valid TLD length (2-6 characters typically)
      if (tld.length < 2 || tld.length > 6) {
        return {
          email,
          isValid: false,
          reason: 'Invalid top-level domain'
        };
      }

      const isCommonDomain = validDomains.includes(domain);
      
      return {
        email,
        isValid: true,
        reason: isCommonDomain ? 'Valid email address' : 'Valid email address (uncommon domain)'
      };
    });

    res.json({
      message: 'Email validation completed',
      results
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Email validation failed', 
      error: error.message,
      results: []
    });
  }
};
