// Copyright (c) 2019-2025 Five Squared Interactive. All rights reserved.

/**
 * @module WorldCommands World Commands Module for handling CMD messages.
 */
module.exports = function() {

    /**
     * @function ProcessCommand Process a world command.
     * @param {string} command Command string to process.
     * @param {string} sessionId Session ID where command originated.
     * @param {string} clientId Client ID who sent the command.
     * @returns {object} Command result with success status and optional response message.
     */
    this.ProcessCommand = function(command, sessionId, clientId) {
        if (!command || typeof command !== 'string') {
            return {
                success: false,
                message: "Invalid command format"
            };
        }

        const trimmedCommand = command.trim();
        if (trimmedCommand.length === 0) {
            return {
                success: false,
                message: "Empty command"
            };
        }

        // Parse command and arguments
        const parts = trimmedCommand.split(/\s+/);
        const commandName = parts[0].toLowerCase();
        const args = parts.slice(1);

        // Route to appropriate command handler
        switch (commandName) {
            case "help":
                return this.HandleHelpCommand(args);
            case "info":
                return this.HandleInfoCommand(args, sessionId, clientId);
            case "ping":
                return this.HandlePingCommand(args);
            default:
                return {
                    success: false,
                    message: `Unknown command: ${commandName}. Type 'help' for available commands.`
                };
        }
    };

    /**
     * @function HandleHelpCommand Handle help command.
     * @param {Array} args Command arguments.
     * @returns {object} Command result.
     */
    this.HandleHelpCommand = function(args) {
        const helpText = [
            "Available commands:",
            "  help - Show this help message",
            "  info - Show session and client information", 
            "  ping - Test command response"
        ].join("\n");

        return {
            success: true,
            message: helpText
        };
    };

    /**
     * @function HandleInfoCommand Handle info command.
     * @param {Array} args Command arguments.
     * @param {string} sessionId Session ID.
     * @param {string} clientId Client ID.
     * @returns {object} Command result.
     */
    this.HandleInfoCommand = function(args, sessionId, clientId) {
        const infoText = [
            `Session ID: ${sessionId}`,
            `Client ID: ${clientId}`,
            `Timestamp: ${new Date().toISOString()}`
        ].join("\n");

        return {
            success: true,
            message: infoText
        };
    };

    /**
     * @function HandlePingCommand Handle ping command.
     * @param {Array} args Command arguments.
     * @returns {object} Command result.
     */
    this.HandlePingCommand = function(args) {
        return {
            success: true,
            message: "Pong!"
        };
    };
};