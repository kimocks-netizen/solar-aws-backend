## step 1
# Make script executable first
chmod +x create_iot_table_with_rule.sh

# Then run with your table name
./create_iot_table_with_rule.sh my_table_name


## step 2
# Create table called "sensor_data"
./create_iot_table_with_rule.sh sensor_data

# Create table called "nodejs_messages" 
./create_iot_table_with_rule.sh nodejs_messages

# Create table called "all_iot_data"
./create_iot_table_with_rule.sh all_iot_data


#!/bin/bash

# Script to create DynamoDB table with IoT rule that subscribes to ALL topics
# Usage: ./create_iot_table_with_rule.sh <table_name>

TABLE_NAME=$1
REGION="eu-north-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
IOT_ROLE_NAME="IoTMessageLoggerRole"

if [ -z "$TABLE_NAME" ]; then
    echo "❌ Usage: $0 <table_name>"
    echo "   Example: $0 all_iot_messages"
    exit 1
fi

echo "🚀 CREATING DYNAMODB TABLE + IOT RULE FOR: $TABLE_NAME"
echo "📋 Table: $TABLE_NAME"
echo "📋 Subscribes to: ALL topics (#)"
echo ""

# Step 1: Create DynamoDB table with timestamp as partition key
echo "1️⃣ Creating DynamoDB table..."
aws dynamodb create-table \
    --table-name "$TABLE_NAME" \
    --attribute-definitions \
        AttributeName=timestamp,AttributeType=S \
    --key-schema \
        AttributeName=timestamp,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region $REGION && \
    echo "✅ Table created successfully!"

# Step 2: Wait for table to be active
echo "2️⃣ Waiting for table to become active..."
aws dynamodb wait table-exists --table-name "$TABLE_NAME" --region $REGION

# Step 3: Create IoT rule with your exact SQL
echo "3️⃣ Creating IoT rule..."

RULE_NAME="${TABLE_NAME}_Rule"

cat > temp_rule.json << EOF
{
    "sql": "SELECT *, topic() as topic_name, timestamp() as rule_timestamp FROM \"#\"",
    "description": "Rule for $TABLE_NAME - subscribes to all topics",
    "ruleDisabled": false,
    "awsIotSqlVersion": "2016-03-23",
    "actions": [
        {
            "dynamoDB": {
                "tableName": "$TABLE_NAME",
                "roleArn": "arn:aws:iam::$ACCOUNT_ID:role/$IOT_ROLE_NAME",
                "operation": "INSERT",
                "hashKeyField": "timestamp",
                "hashKeyValue": "\${timestamp()}",
                "hashKeyType": "STRING"
            }
        }
    ]
}
EOF

aws iot create-topic-rule \
    --rule-name "$RULE_NAME" \
    --topic-rule-payload file://temp_rule.json \
    --region $REGION && \
    echo "✅ IoT rule created!"

rm temp_rule.json

echo ""
echo "🎉 SETUP COMPLETE!"
echo "✅ Table: $TABLE_NAME"
echo "✅ Partition Key: timestamp (using \${timestamp()})"
echo "✅ SQL: SELECT *, topic() as topic_name, timestamp() as rule_timestamp FROM \"#\""
echo "✅ Subscribes to: ALL topics including nodejs/backend/test/sensor/+"
echo ""
echo "📋 This will capture ALL IoT messages including:"
echo "   - nodejs/backend/test/sensor/1"
echo "   - nodejs/backend/test/sensor/2"
echo "   - Any other topic"



