const cron = require('node-cron');
const weatherService = require('./weatherService');

class CronService {
  constructor() {
    this.isNightTime = false;
    this.setupSchedules();
  }

  setupSchedules() {
    // Every 30 minutes during day (6 AM to 7 PM)
    cron.schedule('*/30 6-18 * * *', () => {
      console.log('⏱️ Running 30-min daytime weather update...');
      this.fetchWeatherData();
    });

    // Every 5 hours during night (7 PM, 12 AM, 5 AM)
    cron.schedule('0 19,0,5 * * *', () => {
      console.log('⏱️ Running 5-hour nighttime weather update...');
      this.fetchWeatherData();
    });

    console.log('🕒 Weather cron jobs scheduled:');
    console.log('   - Every 30 minutes: 6 AM to 6:30 PM');
    console.log('   - Every 5 hours: 7 PM, 12 AM, 5 AM');
  }

  async fetchWeatherData() {
    try {
      await weatherService.fetchWeatherData();
    } catch (error) {
      console.error('❌ Cron weather fetch failed:', error.message);
    }
  }

  // Manual trigger for testing
  async triggerWeatherUpdate() {
    console.log('🔄 Manual weather update triggered...');
    return await this.fetchWeatherData();
  }
}

module.exports = new CronService();