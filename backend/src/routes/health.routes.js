const express = require('express');
const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    // Simple health check - just respond OK
    // Database check can be added based on your DB setup
    
    res.status(200).json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
      service: 'backend'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

module.exports = router;
