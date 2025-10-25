const db = require('../models');
const Campaign = db.Campaign;
const Template = db.Template;

// --- Helper function for finding the owner of a Campaign ---
const findOwnedCampaign = (id, userId) => {
    return Campaign.findOne({
        where: {
            id,
            userId: userId // CRUCIAL: Authorization check
        }
    });
};

// @route   POST /api/campaigns
// Create a new campaign
exports.createCampaign = async (req, res) => {
    try {
        const { name, templateId, recipientIds } = req.body;
        console.log('Creating campaign with data:', { name, templateId, recipientIds });

        if (!name || !templateId) {
            return res.status(400).json({ message: 'Please include a name and templateId for the campaign.' });
        }

        // 1. Verify the templateId exists AND belongs to the user
        const template = await Template.findOne({
            where: {
                id: templateId,
                userId: req.userId // Must be owned by the user launching the campaign
            }
        });

        if (!template) {
            return res.status(404).json({ message: 'Template not found or access denied.' });
        }

        // 2. Create the campaign, defaulting status to 'Draft'
        const newCampaign = await Campaign.create({
            name,
            templateId,
            status: 'Draft', // Initial status
            userId: req.userId, // Set the owner ID from the middleware
            recipientIds: recipientIds || null // Store selected recipient IDs or null for all
        });

        console.log('Created campaign:', newCampaign.toJSON());
        res.status(201).json(newCampaign);

    } catch (error) {
        res.status(500).json({ message: 'Server error while creating campaign.' });
    }
};

// @route   GET /api/campaigns
// Create a new campaign
exports.getCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.findAll({
            where: {
                userId: req.userId
            },
            order: [['createdAt', 'DESC']]
        });

        // Convert Sequelize objects to plain objects to ensure proper serialization
        const plainCampaigns = campaigns.map(campaign => campaign.toJSON());
        
        res.status(200).json(plainCampaigns);

    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching campaigns.' });
    }
};

// @route   GET /api/campaigns/:id
// Get a single campaign by ID
exports.getCampaignById = async (req, res) => {
    try {
        const campaign = await findOwnedCampaign(req.params.id, req.userId);

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found or access denied.' });
        }

        res.status(200).json(campaign);

    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching campaign.' });
    }
};


// @route   PUT /api/campaigns/:id
// Update a campaign

exports.updateCampaign = async (req, res) => {
    try {
        const { name, templateId } = req.body;
        const campaign = await findOwnedCampaign(req.params.id, req.userId);

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found or access denied.' });
        }

        // Check if campaign can be updated (only if not sent)
        if (campaign.status === 'Sent') {
            return res.status(400).json({ 
                message: 'Cannot update a campaign that has already been sent' 
            });
        }

        // Verify the templateId exists AND belongs to the user (if provided)
        if (templateId) {
            const template = await Template.findOne({
                where: {
                    id: templateId,
                    userId: req.userId
                }
            });

            if (!template) {
                return res.status(404).json({ message: 'Template not found or access denied.' });
            }
        }

        // Update the campaign
        const updateData = {};
        if (name) updateData.name = name;
        if (templateId) updateData.templateId = templateId;

        const updatedCampaign = await campaign.update(updateData);

        res.json({
            message: 'Campaign updated successfully',
            campaign: updatedCampaign
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error while updating campaign.' });
    }
};

// @route   DELETE /api/campaigns/:id
// Delete a campaign
exports.deleteCampaign = async (req, res) => {
    try {
        const campaign = await findOwnedCampaign(req.params.id, req.userId);

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found or access denied.' });
        }
        
        await campaign.destroy();

        res.status(200).json({ message: 'Campaign removed successfully.' });

    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting campaign.' });
    }
};

// @route   POST /api/campaigns/:id/schedule
// Schedule a campaign for sending
exports.scheduleCampaign = async (req, res) => {
    try {
        const campaign = await findOwnedCampaign(req.params.id, req.userId);

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found or access denied.' });
        }

        // Check if campaign is in Draft status
        if (campaign.status !== 'Draft') {
            return res.status(400).json({ 
                message: `Campaign cannot be scheduled. Current status: ${campaign.status}` 
            });
        }

        // Update campaign status to Scheduled
        const updatedCampaign = await campaign.update({
            status: 'Scheduled',
            scheduledAt: new Date(req.body.scheduledAt)
        });

        res.status(200).json({
            message: 'Campaign scheduled successfully',
            campaign: updatedCampaign
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error while scheduling campaign.' });
    }
};

// @route   POST /api/campaigns/:id/send
// Send a campaign immediately
exports.sendCampaign = async (req, res) => {
    try {
        const campaign = await findOwnedCampaign(req.params.id, req.userId);

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found or access denied.' });
        }

        // Check if campaign can be sent
        if (campaign.status === 'Sent') {
            return res.status(400).json({ 
                message: 'Campaign has already been sent' 
            });
        }

        // Update campaign status to Sending
        await campaign.update({
            status: 'Sending',
            sentAt: new Date()
        });

        // Import the email controller to send emails
        const emailController = require('./emailController');
        
        // Use the existing sendBulkEmails function
        const emailReq = {
            body: { campaignId: campaign.id },
            userId: req.userId
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

        res.json({
            message: 'Campaign sending completed',
            results: emailResults
        });

    } catch (error) {
        
        // Update campaign status to Failed
        try {
            const campaign = await findOwnedCampaign(req.params.id, req.userId);
            if (campaign) {
                await campaign.update({ status: 'Failed' });
            }
        } catch (updateError) {
        }
        
        res.status(500).json({ message: 'Server error while sending campaign.' });
    }
};
