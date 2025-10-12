const http = require('http');
const url = require('url');
const routes = require('./routes');
const CorsMiddleware = require('./middleware/cors');
const RequestParser = require('./middleware/requestParser');
const iotConnection = require('./config/iotConnection');

class Server {
  constructor() {
    this.server = http.createServer(this.handleRequest.bind(this));
  }

  handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;
    const routeKey = `${method} ${path}`;

    console.log(`${new Date().toISOString()} - ${method} ${path}`);

    // Apply CORS middleware
    CorsMiddleware.handle(req, res, () => {
      const handler = routes[routeKey];
      
      if (handler) {
        if (method === 'POST') {
          RequestParser.parseBody(req, res, () => {
            handler(req, res);
          });
        } else {
          handler(req, res);
        }
      } else {
        this.handleNotFound(res);
      }
    });
  }

  handleNotFound(res) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error: 'Route not found'
    }));
  }

  listen(port) {
    this.server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log('📋 Connected to DynamoDB tables: plc_sensor_data & solar-data');
      console.log(`🌐 IoT Core: ${iotConnection.isConnected() ? 'Connected' : 'Disconnected'}`);
      console.log('🔗 Endpoints available:');
      console.log('  GET  / - Server info');
      console.log('  GET  /health - Health check');
      console.log('  POST /iot-data - Receive IoT data');
      console.log('  GET  /data - Get recent PLC data');
      console.log('  POST /weather-data - Receive weather data');
      console.log('  GET  /weather-data - Get recent weather data');
    });
  }
}

module.exports = Server;