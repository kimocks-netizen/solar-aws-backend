const IoTSenderController = require('../controllers/iotSenderController');

const iotSenderRoutes = {
  'POST /send-to-iot/all': IoTSenderController.sendAllToIoT,
  'POST /send-to-iot/recent': IoTSenderController.sendRecentToIoT,
  'POST /send-to-iot/test': IoTSenderController.sendTestToIoT
};

module.exports = iotSenderRoutes;