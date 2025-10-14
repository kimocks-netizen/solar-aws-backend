const iotConnection = require('../config/iotConnection');

class HealthController {
  static async checkHealth(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'Solar Backend',
      database: 'DynamoDB connected',
      iot: iotConnection.isConnected() ? 'connected' : 'disconnected'
    }));
  }

  static async getServerInfo(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Solar Backend Server Running',
      status: iotConnection.isConnected() ? 'connected' : 'no-iot',
      timestamp: new Date().toISOString(),
      database: 'DynamoDB',
      iot_core: iotConnection.isConnected() ? 'connected' : 'disconnected',
      endpoints: {
        health: '/health',
        iot_data: 'POST /iot-data',
        get_data: 'GET /data',
        weather_data: 'POST /weather-data',
        get_weather_data: 'GET /weather-data',
        send_all_to_iot: 'POST /send-to-iot/all',
        send_recent_to_iot: 'POST /send-to-iot/recent',
        send_test_to_iot: 'POST /send-to-iot/test',
        send_to_plc: 'POST /send-to-plc',
        send_database_to_plc: 'POST /send-database-to-plc',
        plc_status: 'GET /plc-status'
      }
    }));
  }
}

module.exports = HealthController;