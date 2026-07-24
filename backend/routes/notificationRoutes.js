const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const {
  savePushSubscription
} = require('../controllers/notificationController');


// Save browser push subscription
router.post(
  '/subscribe',
  auth,
  savePushSubscription
);


module.exports = router;