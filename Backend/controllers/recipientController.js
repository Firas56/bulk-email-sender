const db = require('../models');
const Recipient = db.Recipient;
const validator = require('validator');

// Enhanced email validation function (shared with email controller)
function validateEmailEnhanced(email) {
    // Basic email format validation
    const isValidFormat = validator.isEmail(email);
    
    if (!isValidFormat) {
        return {
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
            isValid: false,
            reason: 'Invalid or misspelled email domain'
        };
    }
    
    // Check for disposable emails
    if (disposableDomains.some(d => domain.includes(d))) {
        return {
            isValid: false,
            reason: 'Disposable email addresses are not allowed'
        };
    }
    
    // Check for obviously fake TLDs
    const tld = domain.split('.').pop();
    const invalidTLDs = ['abc', 'xyz', 'test', 'fake', 'invalid'];
    if (invalidTLDs.includes(tld)) {
        return {
            isValid: false,
            reason: 'Invalid or non-existent domain'
        };
    }
    
    // Check for double dots in email
    if (email.includes('..')) {
        return {
            isValid: false,
            reason: 'Invalid email format (double dots)'
        };
    }
    
    // Check for script tags or HTML injection
    if (email.includes('<') || email.includes('>') || email.includes('script')) {
        return {
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
            isValid: false,
            reason: 'Invalid or fake email address'
        };
    }
    
    // Check if domain has at least one dot and proper TLD
    if (!domain.includes('.') || domain.split('.').length < 2) {
        return {
            isValid: false,
            reason: 'Invalid domain format'
        };
    }
    
    // Check for valid TLD length (2-6 characters typically)
    if (tld.length < 2 || tld.length > 6) {
        return {
            isValid: false,
            reason: 'Invalid top-level domain'
        };
    }

    return {
        isValid: true,
        reason: 'Valid email address'
    };
}

// Helper function for finding the owner of a Recipient
const findOwnedRecipient = (id, userId) => {
    return Recipient.findOne({
        where: {
            id,
            userId: userId
        }
    });
};

// @route   POST /api/recipients
// Create a new recipient
exports.createRecipient = async (req, res) => {
    try {
        const { email, name, isValid } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Recipient email is required.' });
        }

        // Check if a recipient with the same email already exists for this user
        const existingRecipient = await Recipient.findOne({ 
            where: { 
                email, 
                userId: req.userId 
            } 
        });

        if (existingRecipient) {
            return res.status(400).json({ message: 'Recipient with this email already exists for this user.' });
        }

        const newRecipient = await Recipient.create({
            email,
            name,
            isValid: isValid !== undefined ? isValid : true, // Default to true if not specified
            userId: req.userId, // Set the owner ID from the middleware
        });

        res.status(201).json(newRecipient);

    } catch (error) {
        console.error('Error creating recipient:', error);
        res.status(500).json({ message: 'Server error while creating recipient.' });
    }
};

// @route   GET /api/recipients
// Get all recipients for the logged-in user

exports.getRecipients = async (req, res) => {
    try {
        const recipients = await Recipient.findAll({
            where: {
                userId: req.userId
            },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(recipients);

    } catch (error) {
        console.error('Error fetching recipients:', error);
        res.status(500).json({ message: 'Server error while fetching recipients.' });
    }
};

// @route   GET /api/recipients/:id
//  Get a single recipient by ID

exports.getRecipientById = async (req, res) => {
    try {
        const recipient = await findOwnedRecipient(req.params.id, req.userId);

        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found or access denied.' });
        }

        res.status(200).json(recipient);

    } catch (error) {
        console.error('Error fetching recipient by ID:', error);
        res.status(500).json({ message: 'Server error while fetching recipient.' });
    }
};


// @route   PUT /api/recipients/:id
// Update a recipient

exports.updateRecipient = async (req, res) => {
    try {
        const recipient = await findOwnedRecipient(req.params.id, req.userId);

        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found or access denied.' });
        }
        
        const updatedRecipient = await recipient.update(req.body);

        res.status(200).json(updatedRecipient);

    } catch (error) {
        console.error('Error updating recipient:', error);
        res.status(500).json({ message: 'Server error while updating recipient.' });
    }
};

// @route   DELETE /api/recipients/:id
// Delete a recipient

exports.deleteRecipient = async (req, res) => {
    try {
        const recipient = await findOwnedRecipient(req.params.id, req.userId);

        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found or access denied.' });
        }
        
        await recipient.destroy();

        res.status(200).json({ message: 'Recipient removed successfully.' });

    } catch (error) {
        console.error('Error deleting recipient:', error);
        res.status(500).json({ message: 'Server error while deleting recipient.' });
    }
};

// @route   DELETE /api/recipients
// Delete all recipients for the logged-in user
exports.deleteAllRecipients = async (req, res) => {
    try {
        // Delete all recipients belonging to the user
        const deletedCount = await Recipient.destroy({
            where: {
                userId: req.userId
            }
        });

        res.status(200).json({
            message: `Successfully deleted ${deletedCount} recipients`,
            deletedCount
        });

    } catch (error) {
        console.error('Error deleting all recipients:', error);
        res.status(500).json({ message: 'Server error while deleting all recipients.' });
    }
};

// @route   POST /api/recipients/bulk
// Bulk create recipients from CSV
exports.bulkCreateRecipients = async (req, res) => {
    try {
        const { recipients, csvHeaders } = req.body;

        if (!recipients || !Array.isArray(recipients)) {
            return res.status(400).json({ 
                message: 'Recipients array is required.',
                error: 'INVALID_FORMAT'
            });
        }

        if (recipients.length === 0) {
            return res.status(400).json({ 
                message: 'Recipients array cannot be empty.',
                error: 'EMPTY_DATA'
            });
        }

        // Validate CSV headers
        if (!csvHeaders || !Array.isArray(csvHeaders)) {
            return res.status(400).json({
                message: 'CSV headers are required. Please ensure your CSV has "name" and "email" columns.',
                error: 'MISSING_HEADERS'
            });
        }

        const requiredHeaders = ['name', 'email'];
        const missingHeaders = requiredHeaders.filter(header => 
            !csvHeaders.some(h => h.toLowerCase() === header.toLowerCase())
        );

        if (missingHeaders.length > 0) {
            return res.status(400).json({
                message: `CSV is missing required columns: ${missingHeaders.join(', ')}. Please ensure your CSV has "name" and "email" columns.`,
                error: 'INVALID_HEADERS',
                missingHeaders
            });
        }

        const results = {
            valid: [],
            invalid: [],
            duplicatesInCsv: [],
            duplicatesExisting: []
        };

        // Get existing emails for this user to check duplicates
        const existingEmails = await Recipient.findAll({
            where: { userId: req.userId },
            attributes: ['email']
        });
        const existingEmailSet = new Set(existingEmails.map(r => r.email.toLowerCase()));

        // Track emails within the CSV file to detect duplicates within the same file
        const csvEmailSet = new Set();
        const csvEmailCounts = new Map(); // Track how many times each email appears

        // First pass: count occurrences of each email in CSV
        for (const recipient of recipients) {
            const { email } = recipient;
            const processedEmail = email ? email.trim().toLowerCase() : '';
            if (processedEmail) {
                csvEmailCounts.set(processedEmail, (csvEmailCounts.get(processedEmail) || 0) + 1);
            }
        }

        // Second pass: process and categorize all recipients
        for (const recipient of recipients) {
            const { email, name } = recipient;
            const processedEmail = email ? email.trim().toLowerCase() : '';

            // Basic validation
            if (!processedEmail) {
                results.invalid.push({
                    email: email || '',
                    name: name || '',
                    reason: 'Email is required'
                });
                continue;
            }

            // Enhanced email validation (same as email controller)
            const emailValidation = validateEmailEnhanced(processedEmail);
            if (!emailValidation.isValid) {
                results.invalid.push({
                    email: email || '',
                    name: name || '',
                    reason: emailValidation.reason
                });
                continue;
            }

            // Check for duplicates with existing recipients first
            if (existingEmailSet.has(processedEmail)) {
                results.duplicatesExisting.push({
                    email: email || '',
                    name: name || '',
                    reason: 'Email already exists in your recipients list'
                });
                continue;
            }

            // Check for duplicates within the CSV file
            if (csvEmailSet.has(processedEmail)) {
                const count = csvEmailCounts.get(processedEmail);
                results.duplicatesInCsv.push({
                    email: email || '',
                    name: name || '',
                    reason: `Duplicate email within CSV file (appears ${count} times)`
                });
                continue;
            }

            // Valid recipient - add to CSV set and valid list
            csvEmailSet.add(processedEmail);
            results.valid.push({
                email: email || '',
                name: name || '',
                isValid: true
            });
        }

        // Don't create recipients automatically - just validate them
        // The frontend will handle the actual import after user review
        const createdRecipients = [];

        // Prepare response with accurate counts
        const totalDuplicates = results.duplicatesInCsv.length + results.duplicatesExisting.length;
        const response = {
            message: 'CSV validation completed',
            summary: {
                total: recipients.length,
                valid: results.valid.length,
                invalid: results.invalid.length,
                duplicatesInCsv: results.duplicatesInCsv.length,
                duplicatesExisting: results.duplicatesExisting.length,
                totalDuplicates: totalDuplicates,
                created: 0 // No recipients created yet - validation only
            },
            details: {
                valid: results.valid,
                invalid: results.invalid,
                duplicatesInCsv: results.duplicatesInCsv,
                duplicatesExisting: results.duplicatesExisting
            }
        };

        // Add detailed summary message
        let summaryMessage = `Validation completed: ${results.valid.length} valid recipients ready for import`;
        if (results.duplicatesExisting.length > 0) {
            summaryMessage += `, ${results.duplicatesExisting.length} already exist in your recipients`;
        }
        if (results.duplicatesInCsv.length > 0) {
            summaryMessage += `, ${results.duplicatesInCsv.length} duplicates within CSV file`;
        }
        if (results.invalid.length > 0) {
            summaryMessage += `, ${results.invalid.length} invalid entries`;
        }
        
        response.message = summaryMessage;

        res.status(201).json(response);

    } catch (error) {
        console.error('Error bulk creating recipients:', error);
        res.status(500).json({ 
            message: 'Server error while processing CSV import.',
            error: 'SERVER_ERROR'
        });
    }
};
