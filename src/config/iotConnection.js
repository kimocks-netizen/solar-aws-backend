const fs = require('fs');
const path = require('path');
const mqtt = require('mqtt');

class IoTConnection {
  constructor() {
    this.client = null;
    this.host = 'a1zrj214piv3x3-ats.iot.eu-north-1.amazonaws.com';
    this.initConnection();

    //arn:aws:iot:eu-north-1:514190630121:thing/PLCnextSimulator
  }

  initConnection() {
    try {
      const certPath = path.join(process.cwd(), 'certs');
      
      // Check if certificates exist
      const keyPath = path.join(certPath, 'PLCnextSimulator-private.pem.key');
      const certFilePath = path.join(certPath, 'PLCnextSimulator-certificate.pem.crt');
      const caPath = path.join(certPath, 'AmazonRootCA3.pem');
      
      if (!fs.existsSync(keyPath) || !fs.existsSync(certFilePath) || !fs.existsSync(caPath)) {
        console.log('⚠️ MQTT certificates not found at:', certPath);
        return;
      }
      
      const options = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certFilePath),
        ca: fs.readFileSync(caPath),
        clientId: 'PLCnextSimulator',
        host: this.host,
        port: 8883,
        protocol: 'mqtts'
      };
      
      this.client = mqtt.connect(options);
      
      this.client.on('connect', () => {
        console.log('✅ Connected to AWS IoT Core');
        // Subscribe to multiple PLC-related topics
        this.client.subscribe('PLCnextSimulator/topic', { qos: 1 });
        this.client.subscribe('plc/simulator/status', { qos: 1 });
        this.client.subscribe('plc/simulator/response', { qos: 1 });
        console.log('📡 Subscribed to PLC topics');
      });
      
      this.client.on('message', (topic, message) => {
        console.log(`📩 Message received on ${topic}: ${message.toString()}`);
      });
      
      this.client.on('error', (error) => {
        console.log('❌ IoT connection error:', error.message);
        // Don't spam errors in local development
        if (error.message.includes('unable to get local issuer certificate')) {
          console.log('⚠️ Running locally - IoT features will work when deployed to AWS');
        }
        // Prevent reconnection spam
        if (this.client) {
          this.client.end();
          this.client = null;
        }
      });
      
      this.client.on('offline', () => {
        console.log('⚠️ IoT connection offline');
      });
    } catch (error) {
      console.log('⚠️ MQTT connection failed:', error.message);
    }
  }

  isConnected() {
    return this.client && this.client.connected;
  }

  getClient() {
    return this.client;
  }

  publish(topic, payload) {
    return new Promise((resolve, reject) => {
      if (!this.isConnected()) {
        reject(new Error('IoT client not connected'));
        return;
      }
      
      this.client.publish(topic, JSON.stringify(payload), { qos: 1 }, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = new IoTConnection();