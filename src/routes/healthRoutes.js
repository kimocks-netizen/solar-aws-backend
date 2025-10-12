const HealthController = require('../controllers/healthController');

const healthRoutes = {
  'GET /health': HealthController.checkHealth,
  'GET /': HealthController.getServerInfo
};

module.exports = healthRoutes;