const { dynamodb, WEATHER_DATA_TABLE } = require('../config/dynamoDB');

class WeatherDataModel {
  static async create(data) {
    const now = new Date();
    const oneYearFromNow = new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000));
    
    const item = {
      location: data.location,
      timestamp: data.timestamp || now.toISOString(),
      forecast_horizon: data.forecast_horizon || 0,
      temperature_c: data.temperature_c,
      irradiance_w_m2: data.irradiance_w_m2,
      cloud_cover_pct: data.cloud_cover_pct,
      weather_code: data.weather_code,
      wind_speed_m_s: data.wind_speed_m_s,
      humidity_pct: data.humidity_pct,
      precipitation_mm: data.precipitation_mm,
      source: 'tomorrow.io',
      created_at: now.toISOString(),
      ttl_epoch: Math.floor(oneYearFromNow.getTime() / 1000) // TTL for 1 year
    };

    const params = {
      TableName: WEATHER_DATA_TABLE,
      Item: item
    };

    await dynamodb.put(params).promise();
    return item;
  }

  static async getByLocation(location, limit = 50) {
    const params = {
      TableName: WEATHER_DATA_TABLE,
      FilterExpression: '#loc = :location',
      ExpressionAttributeNames: { '#loc': 'location' },
      ExpressionAttributeValues: { ':location': location }
    };

    const result = await dynamodb.scan(params).promise();
    
    // Sort by timestamp (newest first) and limit
    const sorted = result.Items
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
    
    return sorted;
  }

  static async getLatest(location) {
    const params = {
      TableName: WEATHER_DATA_TABLE,
      FilterExpression: '#loc = :location',
      ExpressionAttributeNames: { '#loc': 'location' },
      ExpressionAttributeValues: { ':location': location }
    };

    const result = await dynamodb.scan(params).promise();
    if (result.Items.length === 0) return null;
    
    // Sort by timestamp and return the latest
    const sorted = result.Items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return sorted[0];
  }

  static async deleteOldData() {
    // This method can be used to manually clean old data if needed
    // TTL will handle automatic deletion
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
    
    console.log(`TTL will automatically delete data older than ${cutoffDate.toISOString()}`);
  }
}

module.exports = WeatherDataModel;