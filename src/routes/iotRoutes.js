const IotController = require('../controllers/iotController');

const iotRoutes = {
  'POST /iot-data': IotController.storeData,
  'GET /data': IotController.getData,
  'GET /test-iot': IotController.testIoT
};

module.exports = iotRoutes;