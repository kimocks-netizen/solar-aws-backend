const PlcModel = require('../models/PlcModel');

class IoTMonitor {
  static async checkRecentBackendMessages() {
    try {
      const data = await PlcModel.getAll(50);
      
      // Filter for messages with 'backend' in source (sent from backend to IoT)
      const backendMessages = data.filter(item => 
        item.source && item.source.includes('backend')
      );
      
      // Filter for recent messages (last 2 minutes)
      const now = new Date();
      const recentMessages = backendMessages.filter(item => {
        if (!item.sent_at) return false;
        
        try {
          const sentTime = new Date(item.sent_at);
          const diffSeconds = (now - sentTime) / 1000;
          return diffSeconds < 120; // Last 2 minutes
        } catch (error) {
          return false;
        }
      });
      
      return {
        total_backend_messages: backendMessages.length,
        recent_messages: recentMessages.length,
        messages: recentMessages.slice(0, 5) // Return first 5
      };
    } catch (error) {
      console.error('Error checking backend messages:', error);
      return {
        total_backend_messages: 0,
        recent_messages: 0,
        messages: [],
        error: error.message
      };
    }
  }
}

module.exports = IoTMonitor;