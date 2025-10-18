const MonitorController = require('../controllers/monitorController');

const monitorRoutes = {
  'GET /monitor-backend-messages': MonitorController.getBackendMessages,
  'POST /test-flow': MonitorController.testFlow
};

module.exports = monitorRoutes;