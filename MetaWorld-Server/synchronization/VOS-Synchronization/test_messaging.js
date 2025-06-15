// Test script for messaging and world commanding system
const VOSSynchronizationService = require('./vossynchronizationservice.js');
const WorldCommands = require('./worldcommands.js');

console.log("Testing VOS Synchronization Service with messaging...");

// Test WorldCommands module
const worldCommands = new WorldCommands();

console.log("\n=== Testing World Commands ===");

// Test help command
let result = worldCommands.ProcessCommand("help", "test-session", "test-client");
console.log("Help command result:", result);

// Test info command
result = worldCommands.ProcessCommand("info", "test-session", "test-client");
console.log("Info command result:", result);

// Test ping command
result = worldCommands.ProcessCommand("ping", "test-session", "test-client");
console.log("Ping command result:", result);

// Test unknown command
result = worldCommands.ProcessCommand("invalid", "test-session", "test-client");
console.log("Invalid command result:", result);

// Test empty command
result = worldCommands.ProcessCommand("", "test-session", "test-client");
console.log("Empty command result:", result);

console.log("\n=== Testing VOS Service Loading ===");

// Test that VOS service can be instantiated with new modules
try {
    const vss = new VOSSynchronizationService();
    console.log("VOS Synchronization Service instantiated successfully");
    console.log("Version:", vss.VERSION);
} catch (error) {
    console.error("Error instantiating VOS service:", error);
}

console.log("\nAll tests completed!");