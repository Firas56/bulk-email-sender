const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const protect = require('../middleware/authMiddleware'); // Import the security middleware

// All routes below require a valid JWT via the 'protect' middleware
// The protect function will run first, verify the token, and attach req.userId

router.route('/')
    .post(protect, templateController.createTemplate)
    .get(protect, templateController.getTemplates);

// READ ONE, UPDATE, and DELETE by ID (e.g., /api/templates/123)
router.route('/:id')
    .get(protect, templateController.getTemplateById)
    .put(protect, templateController.updateTemplate)
    .delete(protect, templateController.deleteTemplate);

module.exports = router;
