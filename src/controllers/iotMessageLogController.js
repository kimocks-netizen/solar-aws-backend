const IotMessageLogModel = require('../models/IotMessageLogModel');

class IotMessageLogController {
  static async getAllMessages(req, res) {
    try {
      console.log('📨 IoT Messages API called');
      const limit = parseInt(req.query?.limit) || 50;
      console.log(`🔍 Fetching IoT messages with limit: ${limit}`);
      const data = await IotMessageLogModel.getAll(limit);
      console.log(`📊 Raw data from DynamoDB: ${data.length} items`);

      // Parse payloads for better readability
      const parsedData = data.map(item => ({
        ...item,
        parsedPayload: IotMessageLogModel.parsePayload(item.payload),
        formattedTimestamp: new Date(parseInt(item.timestamp)).toISOString()
      }));

      console.log(`🚀 Sending response with ${parsedData.length} parsed items`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        count: parsedData.length,
        data: parsedData
      }));
    } catch (error) {
      console.error('❌ Error fetching IoT message log:', error);
      console.error('❌ Error details:', error.message);
      console.error('❌ Error code:', error.code);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'Failed to fetch IoT message log',
        details: error.message,
        code: error.code
      }));
    }
  }

  static async getMessagesByTopic(req, res) {
    try {
      const { topic } = req.params;
      const limit = parseInt(req.query.limit) || 50;
      const data = await IotMessageLogModel.getByTopic(topic, limit);

      const parsedData = data.map(item => ({
        ...item,
        parsedPayload: IotMessageLogModel.parsePayload(item.payload),
        formattedTimestamp: new Date(parseInt(item.timestamp)).toISOString()
      }));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        topic: topic,
        count: parsedData.length,
        data: parsedData
      }));
    } catch (error) {
      console.error('Error fetching messages by topic:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'Failed to fetch messages by topic'
      }));
    }
  }

  static async deleteAllMessages(req, res) {
    try {
      console.log('🗑️ Delete all IoT messages requested');
      const result = await IotMessageLogModel.deleteAll();
      
      console.log(`✅ Deleted ${result.deletedCount} messages`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: `Deleted ${result.deletedCount} IoT messages`,
        deletedCount: result.deletedCount
      }));
    } catch (error) {
      console.error('❌ Error deleting IoT messages:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'Failed to delete IoT messages',
        details: error.message
      }));
    }
  }

  static async createMessage(req, res) {
    try {
      console.log('➕ Create IoT message requested');
      const messageData = req.body || {};
      
      const newMessage = await IotMessageLogModel.create(messageData);
      
      console.log('✅ Created new IoT message:', newMessage.topic);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'IoT message created successfully',
        data: newMessage
      }));
    } catch (error) {
      console.error('❌ Error creating IoT message:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'Failed to create IoT message',
        details: error.message
      }));
    }
  }

  static async updateMessage(req, res) {
    try {
      console.log('✏️ Update IoT message requested');
      const { oldItem, newData } = req.body;
      
      const updatedMessage = await IotMessageLogModel.update(oldItem, newData);
      
      console.log('✅ Updated IoT message:', updatedMessage.topic);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'IoT message updated successfully',
        data: updatedMessage
      }));
    } catch (error) {
      console.error('❌ Error updating IoT message:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'Failed to update IoT message',
        details: error.message
      }));
    }
  }
}

module.exports = IotMessageLogController;