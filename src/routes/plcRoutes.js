const PlcController = require('../controllers/plcController');

const plcRoutes = {
  'POST /send-to-plc': PlcController.sendToPLC,
  'POST /send-database-to-plc': PlcController.sendDatabaseToPLC,
  'GET /plc-status': PlcController.getPLCStatus
};

module.exports = plcRoutes;