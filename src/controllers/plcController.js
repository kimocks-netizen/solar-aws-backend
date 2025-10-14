const PlcModel = require('../models/PlcModel');
const iotConnection = require('../config/iotConnection');
const { uuidv4 } = require('../config/dynamoDB');

class PlcController {
  static async sendToPLC(req, res) {
    try {
      console.log('📤 Sending data to PLCnextSimulator...');
      
      const { data, topic } = req.body;
      
      const payload = {
        target_device: 'PLCnextSimulator',
        data: data || 'Test data from backend',
        timestamp: new Date().toISOString(),
        source: 'nodejs_backend_to_plc',
        message_id: uuidv4()
      };
      
      const plcTopic = topic || 'plc/simulator/commands';
      
      await iotConnection.publish(plcTopic, payload);
      
      console.log(`✅ Data sent to PLCnextSimulator via topic: ${plcTopic}`);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Data sent to PLCnextSimulator',
        topic: plcTopic,
        target_device: 'PLCnextSimulator',
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error sending data to PLC:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }));
    }
  }

  static async sendDatabaseToPLC(req, res) {
    try {
      console.log('📤 Sending database data to PLCnextSimulator...');
      
      const limit = parseInt(req.body?.limit) || 10;
      const data = await PlcModel.getAll(limit);
      let sentCount = 0;
      const batchId = uuidv4();
      
      for (const item of data) {
        const payload = {
          target_device: 'PLCnextSimulator',
          device_id: item.device_id || 'unknown',
          current: item.current || 0,
          pressure: item.pressure || 0,
          voltage: item.voltage || 0,
          temperature: item.temperature || 0,
          status: item.status || 'unknown',
          original_timestamp: item.timestamp || item.created_at,
          sent_to_plc_at: new Date().toISOString(),
          source: 'database_to_plc',
          batch_id: batchId
        };
        
        const topic = `plc/simulator/data/${item.device_id || 'unknown'}`;
        
        await iotConnection.publish(topic, payload);
        sentCount++;
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log(`✅ Successfully sent ${sentCount} database records to PLCnextSimulator`);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Successfully sent database data to PLCnextSimulator',
        sent_count: sentCount,
        target_device: 'PLCnextSimulator',
        batch_id: batchId,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error sending database data to PLC:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }));
    }
  }

  static async getPLCStatus(req, res) {
    try {
      const status = {
        success: true,
        plc_thing: {
          name: 'PLCnextSimulator',
          endpoint: 'a1zrj214piv3x3-ats.iot.eu-north-1.amazonaws.com'
        },
        iot_connection: iotConnection.isConnected() ? 'connected' : 'disconnected',
        recommended_topics: {
          send_commands: 'plc/simulator/commands',
          send_data: 'plc/simulator/data/{device_id}',
          receive_status: 'plc/simulator/status'
        },
        timestamp: new Date().toISOString()
      };
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(status));
    } catch (error) {
      console.error('Error getting PLC status:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }));
    }
  }
}

module.exports = PlcController;