const AWS = require('aws-sdk');

class AWSIoTService {
  constructor() {
    // Configure AWS region
    AWS.config.update({ region: 'eu-north-1' });
    
    // ✅ CORRECT: Use AWS SDK with IAM credentials (no certificates)
    this.iotdata = new AWS.IotData({
      endpoint: 'https://a1zrj214piv3x3-ats.iot.eu-north-1.amazonaws.com'
    });
    
    console.log('✅ Backend IoT service initialized with AWS SDK');
  }
  
  // Send data to IoT (this is what your backend needs)
  async publishToIoT(topic, data) {
    try {
      const params = {
        topic: topic,
        payload: JSON.stringify(data)
      };
      
      console.log(`📤 Publishing to IoT topic: ${topic}`);
      console.log(`📦 Payload:`, data);
      
      const result = await this.iotdata.publish(params).promise();
      console.log(`✅ Published to IoT topic: ${topic}`);
      return result;
      
    } catch (error) {
      console.error('❌ Error publishing to IoT:', {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        stack: error.stack
      });
      throw error;
    }
  }
  
  isConnected() {
    // AWS SDK doesn't maintain persistent connections like MQTT
    // It uses HTTP requests, so we're always "connected" if AWS credentials work
    return true;
  }
}

module.exports = new AWSIoTService();