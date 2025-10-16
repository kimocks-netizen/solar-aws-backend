const PlcModel = require('../models/PlcModel');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'eu-north-1' });

const iotdata = new AWS.IotData({
  endpoint: 'a1zrj214piv3x3-ats.iot.eu-north-1.amazonaws.com'
});

class IotController {
  static async storeData(req, res) {
    try {
      const data = req.body;
      console.log('Received IoT data:', data);

      const item = await PlcModel.create(data);
      console.log('Storing item:', item);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'IoT data stored successfully',
        id: item.id,
        stored_at: item.created_at,
        received_data: data
      }));
    } catch (error) {
      console.error('Error processing IoT data:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'Failed to store IoT data',
        details: error.message,
        stack: error.stack
      }));
    }
  }

  static async getData(req, res) {
    try {
      const data = await PlcModel.getAll(50);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        count: data.length,
        data: data
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'Failed to fetch data'
      }));
    }
  }

  static async testIoT(req, res) {
    try {
      console.log('🧪 Testing direct IoT publish...');
      
      const result = await iotdata.publish({
        topic: 'backend/data',
        payload: JSON.stringify({ message: 'Hello IoT from backend!' })
      }).promise();
      
      console.log('✅ IoT test successful:', result);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'IoT test successful',
        result: result
      }));
    } catch (error) {
      console.error('❌ IoT test failed:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'IoT test failed',
        details: error.message,
        code: error.code
      }));
    }
  }
}

module.exports = IotController;