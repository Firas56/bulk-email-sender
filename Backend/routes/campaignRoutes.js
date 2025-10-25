const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const emailController = require('../controllers/emailController');
const protect = require('../middleware/authMiddleware');


// All routes below require a valid JWT via the 'protect' middleware
// The protect function will run first, verify the token, and attach req.userId

router.route('/')
    .post(protect, campaignController.createCampaign)
    .get(protect, campaignController.getCampaigns);

router.route('/:id')
    .get(protect, campaignController.getCampaignById)
    .put(protect, campaignController.updateCampaign)
    .delete(protect, campaignController.deleteCampaign);

router.post('/:id/schedule', protect, campaignController.scheduleCampaign);
router.post('/:id/send', protect, campaignController.sendCampaign);

router.post('/send', protect, emailController.sendBulkEmails);
router.post('/validate-emails', protect, emailController.validateEmails);

module.exports = router;
