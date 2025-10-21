const WeatherController = require('../controllers/weatherController');

const weatherRoutes = {
  'POST /weather/fetch': WeatherController.fetchWeather,
  'GET /weather/latest': WeatherController.getLatest,
  'GET /weather/history': WeatherController.getHistory,
  'POST /weather/update': WeatherController.triggerUpdate
};

module.exports = weatherRoutes;