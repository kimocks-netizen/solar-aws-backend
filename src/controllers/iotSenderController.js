const PlcModel = require('../models/PlcModel');
const WeatherModel = require('../models/WeatherModel');
const awsIoTService = require('../config/awsIoTService');
const { uuidv4 } = require('../config/dynamoDB');

class IoTSenderController {
  static async sendAllToIoT(req, res) {
    try {
      console.log('📤 Sending all database data to IoT...');
      
      const data = await PlcModel.getAll(1000);
      let sentCount = 0;
      const batchId = uuidv4();
      
      for (const item of data) {
        const payload = {
          source: 'nodejs_backend_all',
          device_id: item.device_id || 'unknown',
          current: item.current || 0,
          pressure: item.pressure || 0,
          voltage: item.voltage || 0,
          temperature: item.temperature || 0,
          status: item.status || 'unknown',
          timestamp: item.timestamp || item.created_at,
          sent_at: new Date().toISOString(),
          backend_sent: true,
          batch_id: batchId
        };
        
        const topic = `nodejs/backend/all/${item.device_id || 'unknown'}`;
        
        await awsIoTService.publishToIoT(topic, payload);
        sentCount++;
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log(`✅ Successfully sent ${sentCount} records to IoT`);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Successfully sent all database data to IoT',
        sent_count: sentCount,
        batch_id: batchId,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error sending all data to IoT:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }));
    }
  }

  static async sendRecentToIoT(req, res) {
    try {
      console.log('📤 Sending recent database data to IoT...');
      
      const limit = parseInt(req.body?.limit) || 10;
      const data = await PlcModel.getAll(limit);
      let sentCount = 0;
      const batchId = uuidv4();
      
      for (const item of data) {
        const payload = {
          source: 'nodejs_backend_recent',
          device_id: item.device_id || 'unknown',
          current: item.current || 0,
          pressure: item.pressure || 0,
          voltage: item.voltage || 0,
          temperature: item.temperature || 0,
          status: item.status || 'unknown',
          timestamp: item.timestamp || item.created_at,
          sent_at: new Date().toISOString(),
          backend_sent: true,
          data_type: 'recent',
          batch_id: batchId
        };
        
        const topic = `nodejs/backend/recent/${item.device_id || 'unknown'}`;
        
        await awsIoTService.publishToIoT(topic, payload);
        sentCount++;
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log(`✅ Successfully sent ${sentCount} recent records to IoT`);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Successfully sent recent database data to IoT',
        sent_count: sentCount,
        limit: limit,
        batch_id: batchId,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error sending recent data to IoT:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }));
    }
  }

  static async sendTestToIoT(req, res) {
    try {
      console.log('🧪 Sending test data to IoT...');
      
      const testCount = parseInt(req.body?.count) || 3;
      let sentCount = 0;
      const batchId = uuidv4();
      
      for (let i = 0; i < testCount; i++) {
        const payload = {
          source: 'nodejs_backend_test',
          device_id: `NodeJSTest_${i + 1}`,
          current: 25 + i * 5,
          pressure: 1015 + i * 3,
          voltage: 12 + i * 0.5,
          temperature: 22 + i * 2,
          status: 'nodejs_test',
          timestamp: new Date().toISOString(),
          test_id: `nodejs_test_${Date.now()}_${i + 1}`,
          backend_sent: true,
          batch_id: batchId
        };
        
        const topic = `nodejs/backend/test/sensor_${i + 1}`;
        
        await awsIoTService.publishToIoT(topic, payload);
        sentCount++;
        
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      console.log(`✅ Successfully sent ${sentCount} test messages to IoT`);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Successfully sent test data to IoT',
        sent_count: sentCount,
        batch_id: batchId,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error sending test data to IoT:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }));
    }
  }
}

module.exports = IoTSenderController;