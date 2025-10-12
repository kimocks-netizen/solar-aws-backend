const { dynamodb, PLC_TABLE_NAME, uuidv4 } = require('../config/dynamoDB');

class PlcModel {
  static async create(data) {
    const item = {
      id: uuidv4(),
      device_id: data.deviceId,
      timestamp: data.timestamp,
      temperature: data.temperature,
      pressure: data.pressure,
      voltage: data.voltage,
      current: data.current,
      status: data.status,
      created_at: new Date().toISOString()
    };

    const params = {
      TableName: PLC_TABLE_NAME,
      Item: item
    };

    await dynamodb.put(params).promise();
    return item;
  }

  static async getAll(limit = 50) {
    const params = {
      TableName: PLC_TABLE_NAME,
      Limit: limit
    };

    const result = await dynamodb.scan(params).promise();
    return result.Items.sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );
  }
}

module.exports = PlcModel;