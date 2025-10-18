const iotConnection = require('./config/iotConnection');

async function testPLCConnection() {
    console.log('🧪 Testing connection to PLCnextSimulator');
    console.log('='.repeat(50));
    
    // Wait for connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (!iotConnection.isConnected()) {
        console.log('❌ IoT connection not established');
        return;
    }
    
    try {
        // Test 1: Send command to PLC
        console.log('\n📤 Test 1: Sending command to PLCnextSimulator...');
        const commandPayload = {
            target_device: 'PLCnextSimulator',
            command: 'status_request',
            timestamp: new Date().toISOString(),
            source: 'backend_test'
        };
        
        await iotConnection.publish('plc/simulator/commands', commandPayload);
        console.log('✅ Command sent to topic: plc/simulator/commands');
        
        // Test 2: Send data to PLC
        console.log('\n📤 Test 2: Sending data to PLCnextSimulator...');
        const dataPayload = {
            target_device: 'PLCnextSimulator',
            device_id: 'BackendTest_001',
            current: 30,
            pressure: 1020,
            voltage: 12.5,
            temperature: 25,
            status: 'backend_test',
            timestamp: new Date().toISOString(),
            source: 'backend_to_plc_test'
        };
        
        await iotConnection.publish('plc/simulator/data/BackendTest_001', dataPayload);
        console.log('✅ Data sent to topic: plc/simulator/data/BackendTest_001');
        
        console.log('\n🎉 PLC connection tests completed!');
        console.log('\n📋 Summary:');
        console.log('   • IoT Endpoint: a1zrj214piv3x3-ats.iot.eu-north-1.amazonaws.com');
        console.log('   • Target Device: PLCnextSimulator');
        console.log('   • Command Topic: plc/simulator/commands');
        console.log('   • Data Topic: plc/simulator/data/{device_id}');
        
    } catch (error) {
        console.error('❌ Error testing PLC connection:', error);
    }
}

// Run test after a delay to allow connection
setTimeout(testPLCConnection, 3000);