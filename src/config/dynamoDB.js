require('dotenv').config();
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Configure AWS SDK
AWS.config.update({
  region: 'eu-north-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const PLC_TABLE_NAME = 'plc_sensor_data';
const WEATHER_TABLE_NAME = 'solar-data';

// Test DynamoDB connection on startup
async function testDynamoConnection() {
  try {
    const params1 = { TableName: PLC_TABLE_NAME, Limit: 1 };
    const params2 = { TableName: WEATHER_TABLE_NAME, Limit: 1 };
    await Promise.all([
      dynamodb.scan(params1).promise(),
      dynamodb.scan(params2).promise()
    ]);
    console.log('✅ DynamoDB connection successful (both tables)');
  } catch (error) {
    console.error('❌ DynamoDB connection failed:', error.message);
  }
}

testDynamoConnection();

module.exports = { dynamodb, PLC_TABLE_NAME, WEATHER_TABLE_NAME, uuidv4 };