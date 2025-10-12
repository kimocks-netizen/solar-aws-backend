const WeatherModel = require('../models/WeatherModel');

class WeatherController {
  static async storeData(req, res) {
    try {
      const data = req.body;
      console.log('Received weather data:', data);

      const item = await WeatherModel.create(data);
      console.log('Storing weather item:', item);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Weather data stored successfully',
        device_id: item.device_id,
        timestamp: item.timestamp,
        received_data: data
      }));
    } catch (error) {
      console.error('Error processing weather data:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'Failed to store weather data',
        details: error.message,
        stack: error.stack
      }));
    }
  }

  static async getData(req, res) {
    try {
      const data = await WeatherModel.getAll(50);

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

module.exports = WeatherController;