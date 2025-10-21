const axios = require('axios');
const WeatherDataModel = require('../models/WeatherDataModel');

class WeatherService {
  constructor() {
    this.apiKey = 'KrkAgr7zHhH6Ee8lp1vaEQnBgpPgaXtq';
    this.baseUrl = 'https://api.tomorrow.io/v4/weather/forecast';
    this.defaultLocation = '52.6526,1.2375'; // Briar Chemicals Ltd Norfolk
  }

  async fetchWeatherData(location = this.defaultLocation) {
    try {
      console.log(`🌤️ Fetching weather data for location: ${location}`);
      
      const response = await axios.get(this.baseUrl, {
        params: {
          location: location,
          apikey: this.apiKey
        },
        timeout: 10000
      });

      const data = response.data.timelines.minutely[0].values;
      const timestamp = new Date().toISOString();

      const weatherData = {
        location: location,
        timestamp: timestamp,
        forecast_horizon: 0,
        temperature_c: data.temperature || 0,
        irradiance_w_m2: data.uvIndex || 0,
        cloud_cover_pct: data.cloudCover || 0,
        weather_code: this.mapWeatherCode(data.weatherCode),
        wind_speed_m_s: data.windSpeed || 0,
        humidity_pct: data.humidity || 0,
        precipitation_mm: data.rainIntensity || 0
      };

      const savedData = await WeatherDataModel.create(weatherData);
      console.log(`✅ Weather data saved for ${location} at ${timestamp}`);
      
      return savedData;
    } catch (error) {
      console.error(`❌ Error fetching weather data for ${location}:`, error.message);
      throw error;
    }
  }

  async fetchWeatherForLocation(lat, lng) {
    const location = `${lat},${lng}`;
    return await this.fetchWeatherData(location);
  }

  mapWeatherCode(code) {
    const weatherCodes = {
      0: 'unknown', 1000: 'clear', 1100: 'mostly_clear', 1101: 'partly_cloudy',
      1102: 'mostly_cloudy', 1001: 'cloudy', 2000: 'fog', 2100: 'light_fog',
      4000: 'drizzle', 4001: 'rain', 4200: 'light_rain', 4201: 'heavy_rain',
      5000: 'snow', 5001: 'flurries', 5100: 'light_snow', 5101: 'heavy_snow',
      6000: 'freezing_drizzle', 6001: 'freezing_rain', 8000: 'thunderstorm'
    };
    return weatherCodes[code] || 'unknown';
  }

  async getLatestWeather(location = this.defaultLocation) {
    return await WeatherDataModel.getLatest(location);
  }

  async getWeatherHistory(location = this.defaultLocation, limit = 50) {
    return await WeatherDataModel.getByLocation(location, limit);
  }
}

module.exports = new WeatherService();