const IotMessageLogController = require('../controllers/iotMessageLogController');

const iotMessageLogRoutes = {
  'GET /iot-messages': IotMessageLogController.getAllMessages,
  'GET /iot-messages/:topic': IotMessageLogController.getMessagesByTopic,
  'DELETE /iot-messages': IotMessageLogController.deleteAllMessages,
  'POST /iot-messages': IotMessageLogController.createMessage,
  'PUT /iot-messages': IotMessageLogController.updateMessage
};

module.exports = iotMessageLogRoutes;