const IoTMonitor = require('../utils/iotMonitor');

class MonitorController {
  static async getBackendMessages(req, res) {
    try {
      const result = await IoTMonitor.checkRecentBackendMessages();
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        monitoring: result,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error getting backend messages:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }));
    }
  }

  static async testFlow(req, res) {
    try {
      console.log('🎯 Testing complete flow: DB → IoT → Monitor');
      
      // Step 1: Check current backend messages
      const beforeResult = await IoTMonitor.checkRecentBackendMessages();
      console.log(`📊 Before: ${beforeResult.recent_messages} recent backend messages`);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Flow test initiated - check /monitor-backend-messages for results',
        before_count: beforeResult.recent_messages,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error testing flow:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }));
    }
  }
}

module.exports = MonitorController;