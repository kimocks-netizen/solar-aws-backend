const { dynamodb, WEATHER_TABLE_NAME } = require('../config/dynamoDB');

class WeatherModel {
  static async create(data) {
    const item = {
      device_id: data.deviceId,
      timestamp: data.timestamp,
      ambient_temperature: data.ambient_temperature,
      humidity: data.humidity,
      wind_speed: data.wind_speed,
      wind_direction: data.wind_direction,
      atmospheric_pressure: data.atmospheric_pressure,
      solar_irradiance: data.solar_irradiance,
      uv_index: data.uv_index,
      precipitation: data.precipitation,
      cloud_cover: data.cloud_cover
    };

    const params = {
      TableName: WEATHER_TABLE_NAME,
      Item: item
    };

    await dynamodb.put(params).promise();
    return item;
  }

  static async getAll(limit = 50) {
    const params = {
      TableName: WEATHER_TABLE_NAME,
      Limit: limit
    };

    const result = await dynamodb.scan(params).promise();
    return result.Items.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  }
}

module.exports = WeatherModel;