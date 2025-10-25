const db = require('../models');
const Template = db.Template;


// This function ensures the template ID exists AND belongs to the user
const findOwnedTemplate = (id, userId) => {
    return Template.findOne({
        where: {
            id,
            userId: userId // Authorization check based on JWT
        }
    });
};

// @route   POST /api/templates
// Create a new template

exports.createTemplate = async (req, res) => {
    try {
        const { name, subject, body } = req.body;

        // Basic input validation
        if (!name || !subject || !body) {
            return res.status(400).json({ message: 'Please include a name, subject, and body for the template.' });
        }

        const newTemplate = await Template.create({
            name,
            subject,
            body,
            userId: req.userId, // Set the owner ID from the middleware
        });

        // Respond with the newly created resource
        res.status(201).json(newTemplate);

    } catch (error) {
        console.error('Error creating template:', error);
        res.status(500).json({ message: 'Server error while creating template.' });
    }
};

// @route   GET /api/templates
// Get all templates
exports.getTemplates = async (req, res) => {
    try {
        //Only fetch templates where the userId matches the authenticated user's ID
        const templates = await Template.findAll({
            where: {
                userId: req.userId
            },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(templates);

    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({ message: 'Server error while fetching templates.' });
    }
};

// @route   GET /api/templates/:id
// Create a specified template
exports.getTemplateById = async (req, res) => {
    try {
        // Use the helper function to ensure both existence AND ownership
        const template = await findOwnedTemplate(req.params.id, req.userId);

        if (!template) {
            // The template either doesn't exist OR belongs to another user.
            // In both cases, return 404/access denied for security.
            return res.status(404).json({ message: 'Template not found or access denied.' });
        }

        res.status(200).json(template);

    } catch (error) {
        console.error('Error fetching template by ID:', error);
        res.status(500).json({ message: 'Server error while fetching template.' });
    }
};


// @route   PUT /api/templates/:id
// update template
exports.updateTemplate = async (req, res) => {
    try {
        // Find the template, checking ownership first
        const template = await findOwnedTemplate(req.params.id, req.userId);

        if (!template) {
            return res.status(404).json({ message: 'Template not found or access denied.' });
        }

        // If ownership is confirmed, proceed with update
        const updatedTemplate = await template.update(req.body);

        res.status(200).json(updatedTemplate);

    } catch (error) {
        console.error('Error updating template:', error);
        res.status(500).json({ message: 'Server error while updating template.' });
    }
};

// @route   DELETE /api/templates/:id
// delete a template
exports.deleteTemplate = async (req, res) => {
    try {
        // Find the template, checking ownership first
        const template = await findOwnedTemplate(req.params.id, req.userId);

        if (!template) {
            return res.status(404).json({ message: 'Template not found or access denied.' });
        }

        // If ownership is confirmed, proceed with deletion
        await template.destroy();

        res.status(200).json({ message: 'Template removed successfully.' });

    } catch (error) {
        console.error('Error deleting template:', error);
        res.status(500).json({ message: 'Server error while deleting template.' });
    }
};
