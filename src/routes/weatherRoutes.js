const WeatherController = require('../controllers/weatherController');

const weatherRoutes = {
  'POST /weather-data': WeatherController.storeData,
  'GET /weather-data': WeatherController.getData
};

module.exports = weatherRoutes;