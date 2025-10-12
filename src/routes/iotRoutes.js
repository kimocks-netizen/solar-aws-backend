const IotController = require('../controllers/iotController');

const iotRoutes = {
  'POST /iot-data': IotController.storeData,
  'GET /data': IotController.getData
};

module.exports = iotRoutes;