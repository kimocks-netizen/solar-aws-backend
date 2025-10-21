const WeatherDataModel = require('../models/WeatherDataModel');

async function seedWeatherData() {
  console.log('🌱 Seeding weather data...');
  
  const testData = [
    {
      location: '52.6526,1.2375',
      temperature_c: 18.5,
      irradiance_w_m2: 650,
      cloud_cover_pct: 25,
      weather_code: 'partly_cloudy',
      wind_speed_m_s: 3.2,
      humidity_pct: 72,
      precipitation_mm: 0.0
    },
    {
      location: '52.6526,1.2375',
      temperature_c: 22.1,
      irradiance_w_m2: 820,
      cloud_cover_pct: 15,
      weather_code: 'clear',
      wind_speed_m_s: 2.8,
      humidity_pct: 65,
      precipitation_mm: 0.0
    },
    {
      location: '51.5074,-0.1278',
      temperature_c: 16.3,
      irradiance_w_m2: 580,
      cloud_cover_pct: 45,
      weather_code: 'cloudy',
      wind_speed_m_s: 4.1,
      humidity_pct: 78,
      precipitation_mm: 0.2
    },
    {
      location: '51.5074,-0.1278',
      temperature_c: 19.7,
      irradiance_w_m2: 720,
      cloud_cover_pct: 30,
      weather_code: 'partly_cloudy',
      wind_speed_m_s: 3.5,
      humidity_pct: 68,
      precipitation_mm: 0.0
    },
    {
      location: '40.7128,-74.0060',
      temperature_c: 24.2,
      irradiance_w_m2: 890,
      cloud_cover_pct: 10,
      weather_code: 'clear',
      wind_speed_m_s: 2.1,
      humidity_pct: 58,
      precipitation_mm: 0.0
    }
  ];

  try {
    for (let i = 0; i < testData.length; i++) {
      const data = testData[i];
      const result = await WeatherDataModel.create(data);
      console.log(`✅ Created weather record ${i + 1}:`, {
        location: result.location,
        temperature: result.temperature_c,
        timestamp: result.timestamp
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('🎉 Successfully seeded 5 weather records!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedWeatherData();