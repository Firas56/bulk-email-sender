const express = require('express');
const router = express.Router();
const recipientController = require('../controllers/recipientController');
const protect = require('../middleware/authMiddleware');

// All routes below require a valid JWT via the 'protect' middleware
// The protect function will run first, verify the token, and attach req.userId

router.route('/')
    .post(protect, recipientController.createRecipient)
    .get(protect, recipientController.getRecipients)
    .delete(protect, recipientController.deleteAllRecipients);

router.post('/bulk', protect, recipientController.bulkCreateRecipients);

router.route('/:id')
    .get(protect, recipientController.getRecipientById)
    .put(protect, recipientController.updateRecipient)
    .delete(protect, recipientController.deleteRecipient);

module.exports = router;
