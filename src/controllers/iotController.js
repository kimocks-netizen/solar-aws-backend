const PlcModel = require('../models/PlcModel');

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
}

module.exports = IotController;