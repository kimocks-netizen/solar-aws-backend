const http = require('http');
const url = require('url');
const { dynamodb, PLC_TABLE_NAME, WEATHER_TABLE_NAME, uuidv4 } = require('./src/app');

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  console.log(`${new Date().toISOString()} - ${method} ${path}`);

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    if (path === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Solar Backend',
        database: 'DynamoDB connected'
      }));

    } else if (path === '/iot-data' && method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          console.log('Received IoT data:', data);

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

          console.log('Storing item:', item);

          const params = {
            TableName: PLC_TABLE_NAME,
            Item: item
          };

          const result = await dynamodb.put(params).promise();
          console.log('DynamoDB put result:', result);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            message: 'IoT data stored successfully',
            id: item.id,
            stored_at: item.created_at,
            received_data: data
          }));

        } catch (error) {
          console.error('Error processing IoT data:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: 'Failed to store IoT data',
            details: error.message,
            stack: error.stack
          }));
        }
      });

    } else if (path === '/weather-data' && method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          console.log('Received weather data:', data);

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

          console.log('Storing weather item:', item);

          const params = {
            TableName: WEATHER_TABLE_NAME,
            Item: item
          };

          const result = await dynamodb.put(params).promise();
          console.log('DynamoDB weather put result:', result);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            message: 'Weather data stored successfully',
            device_id: item.device_id,
            timestamp: item.timestamp,
            received_data: data
          }));

        } catch (error) {
          console.error('Error processing weather data:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: 'Failed to store weather data',
            details: error.message,
            stack: error.stack
          }));
        }
      });

    } else if (path === '/data' && method === 'GET') {
      try {
        const params = {
          TableName: PLC_TABLE_NAME,
          Limit: 50
        };

        const result = await dynamodb.scan(params).promise();
        const sortedData = result.Items.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          count: sortedData.length,
          data: sortedData
        }));

      } catch (error) {
        console.error('Error fetching data:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Failed to fetch data'
        }));
      }

    } else if (path === '/weather-data' && method === 'GET') {
      try {
        const params = {
          TableName: WEATHER_TABLE_NAME,
          Limit: 50
        };

        const result = await dynamodb.scan(params).promise();
        const sortedData = result.Items.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          count: sortedData.length,
          data: sortedData
        }));

      } catch (error) {
        console.error('Error fetching data:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Failed to fetch data'
        }));
      }

    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: 'Solar Backend Server Running',
        status: 'connected',
        timestamp: new Date().toISOString(),
        database: 'DynamoDB',
        endpoints: {
          health: '/health',
          iot_data: 'POST /iot-data',
          get_data: 'GET /data',
          weather_data: 'POST /weather-data',
          get_weather_data: 'GET /weather-data'
        }
      }));
    }

  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }));
  }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('📋 Connected to DynamoDB tables:', PLC_TABLE_NAME, '&', WEATHER_TABLE_NAME);
  console.log('🔗 Endpoints available:');
  console.log('  GET  / - Server info');
  console.log('  GET  /health - Health check');
  console.log('  POST /iot-data - Receive IoT data');
  console.log('  GET  /data - Get recent PLC data');
  console.log('  POST /weather-data - Receive weather data');
  console.log('  GET  /weather-data - Get recent weather data');
});
