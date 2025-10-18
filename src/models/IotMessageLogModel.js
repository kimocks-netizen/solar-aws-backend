const { dynamodb, IOT_MESSAGE_LOG_TABLE } = require('../config/dynamoDB');

// Use the table name from config
console.log(`📋 IoT Message Log Model initialized with table: ${IOT_MESSAGE_LOG_TABLE || 'iot-message-log'}`);

class IotMessageLogModel {
  static async getAll(limit = 50) {
    const tableName = IOT_MESSAGE_LOG_TABLE || 'iot-message-log';
    console.log(`🔍 Scanning table: ${tableName} with limit: ${limit}`);
    
    try {
      const params = {
        TableName: tableName,
        Limit: limit
      };

      const result = await dynamodb.scan(params).promise();
      console.log(`📊 DynamoDB scan result: ${result.Items?.length || 0} items`);
      
      return result.Items || [];
    } catch (error) {
      console.error(`❌ DynamoDB scan error for table ${tableName}:`, error.message);
      throw error;
    }
  }

  static async getByTopic(topic, limit = 50) {
    const params = {
      TableName: IOT_MESSAGE_LOG_TABLE,
      FilterExpression: 'topic = :topic',
      ExpressionAttributeValues: {
        ':topic': topic
      },
      Limit: limit
    };

    const result = await dynamodb.scan(params).promise();
    return result.Items.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  }

  static async deleteAll() {
    const tableName = IOT_MESSAGE_LOG_TABLE || 'iot-message-log';
    console.log(`🗑️ Deleting all items from table: ${tableName}`);
    
    try {
      // First scan to get all items
      const scanParams = {
        TableName: tableName,
        ProjectionExpression: 'topic, #ts',
        ExpressionAttributeNames: {
          '#ts': 'timestamp'
        }
      };
      
      const scanResult = await dynamodb.scan(scanParams).promise();
      
      if (scanResult.Items.length === 0) {
        return { deletedCount: 0 };
      }
      
      // Delete items in batches
      const deleteRequests = scanResult.Items.map(item => ({
        DeleteRequest: {
          Key: {
            topic: item.topic,
            timestamp: item.timestamp
          }
        }
      }));
      
      // Process in batches of 25 (DynamoDB limit)
      const batchSize = 25;
      let deletedCount = 0;
      
      for (let i = 0; i < deleteRequests.length; i += batchSize) {
        const batch = deleteRequests.slice(i, i + batchSize);
        const batchParams = {
          RequestItems: {
            [tableName]: batch
          }
        };
        
        await dynamodb.batchWrite(batchParams).promise();
        deletedCount += batch.length;
      }
      
      return { deletedCount };
    } catch (error) {
      console.error(`❌ Error deleting items from ${tableName}:`, error.message);
      throw error;
    }
  }

  static async create(messageData) {
    const tableName = IOT_MESSAGE_LOG_TABLE || 'iot-message-log';
    console.log(`➕ Adding new message to table: ${tableName}`);
    
    try {
      const item = {
        topic: messageData.topic || 'manual/test',
        timestamp: Date.now().toString(),
        payload: messageData.payload || {
          topic_name: messageData.topic || 'manual/test',
          message: messageData.message || 'Test message from frontend',
          rule_timestamp: Date.now()
        }
      };
      
      const params = {
        TableName: tableName,
        Item: item
      };
      
      await dynamodb.put(params).promise();
      return item;
    } catch (error) {
      console.error(`❌ Error creating item in ${tableName}:`, error.message);
      throw error;
    }
  }

  static async update(oldItem, newData) {
    const tableName = IOT_MESSAGE_LOG_TABLE || 'iot-message-log';
    console.log(`✏️ Updating message in table: ${tableName}`);
    
    try {
      // Delete old item
      await dynamodb.delete({
        TableName: tableName,
        Key: {
          topic: oldItem.topic,
          timestamp: oldItem.timestamp
        }
      }).promise();
      
      // Create new item with updated data
      const updatedItem = {
        topic: newData.topic,
        timestamp: oldItem.timestamp, // Keep original timestamp
        payload: {
          topic_name: newData.topic,
          message: newData.message,
          rule_timestamp: oldItem.payload?.rule_timestamp || Date.now()
        }
      };
      
      await dynamodb.put({
        TableName: tableName,
        Item: updatedItem
      }).promise();
      
      return updatedItem;
    } catch (error) {
      console.error(`❌ Error updating item in ${tableName}:`, error.message);
      throw error;
    }
  }

  static parsePayload(payload) {
    try {
      // If payload is already an object, return it
      if (typeof payload === 'object') {
        return payload;
      }
      
      // If payload is a string, try to parse it
      if (typeof payload === 'string') {
        // Handle HTML encoded JSON
        const decodedPayload = payload.replace(/&quot;/g, '"');
        return JSON.parse(decodedPayload);
      }
      
      return { raw: payload };
    } catch (error) {
      console.warn('Failed to parse payload:', payload);
      return { raw: payload };
    }
  }
}

module.exports = IotMessageLogModel;