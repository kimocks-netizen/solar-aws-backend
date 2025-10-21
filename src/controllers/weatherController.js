const weatherService = require('../services/weatherService');
const cronService = require('../services/cronService');

class WeatherController {
  static async fetchWeather(req, res) {
    try {
      const { location, lat, lng } = req.body;
      
      let weatherData;
      if (lat && lng) {
        weatherData = await weatherService.fetchWeatherForLocation(lat, lng);
      } else if (location) {
        weatherData = await weatherService.fetchWeatherData(location);
      } else {
        weatherData = await weatherService.fetchWeatherData();
      }
      
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Weather data fetched and saved successfully',
        data: weatherData
      }));
    } catch (error) {
      console.error('Error fetching weather data:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: error.message
      }));
    }
  }

  static async getLatest(req, res) {
    try {
      const location = req.query.location || '52.6526,1.2375';
      const weatherData = await weatherService.getLatestWeather(location);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        data: weatherData
      }));
    } catch (error) {
      console.error('Error getting latest weather:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: error.message
      }));
    }
  }

  static async getHistory(req, res) {
    try {
      const location = req.query.location || '52.6526,1.2375';
      const limit = parseInt(req.query.limit) || 50;
      
      const weatherData = await weatherService.getWeatherHistory(location, limit);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        data: weatherData
      }));
    } catch (error) {
      console.error('Error getting weather history:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: error.message
      }));
    }
  }

  static async triggerUpdate(req, res) {
    try {
      await cronService.triggerWeatherUpdate();
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Weather update triggered successfully'
      }));
    } catch (error) {
      console.error('Error triggering weather update:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: error.message
      }));
    }
  }
}

module.exports = WeatherController;