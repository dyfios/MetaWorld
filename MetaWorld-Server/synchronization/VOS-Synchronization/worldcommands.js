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
            case "teleport":
            case "tp":
                return this.HandleTeleportCommand(args, sessionId, clientId);
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
            "  ping - Test command response",
            "  teleport <x> <y> <z> - Teleport to specified coordinates",
            "  tp <x> <y> <z> - Alias for teleport command"
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

    /**
     * @function HandleTeleportCommand Handle teleport command.
     * @param {Array} args Command arguments (x, y, z coordinates).
     * @param {string} sessionId Session ID.
     * @param {string} clientId Client ID.
     * @returns {object} Command result.
     */
    this.HandleTeleportCommand = function(args, sessionId, clientId) {
        // Validate argument count
        if (args.length !== 3) {
            return {
                success: false,
                message: "Usage: teleport <x> <y> <z> - Please provide exactly 3 coordinates"
            };
        }

        // Parse and validate coordinates
        const x = parseFloat(args[0]);
        const y = parseFloat(args[1]);
        const z = parseFloat(args[2]);

        if (isNaN(x) || isNaN(y) || isNaN(z)) {
            return {
                success: false,
                message: "Invalid coordinates: All values must be numbers"
            };
        }

        // Apply boundary checks to prevent abuse
        const MAX_COORDINATE = 10000;
        const MIN_COORDINATE = -10000;
        
        if (x < MIN_COORDINATE || x > MAX_COORDINATE ||
            y < MIN_COORDINATE || y > MAX_COORDINATE ||
            z < MIN_COORDINATE || z > MAX_COORDINATE) {
            return {
                success: false,
                message: `Coordinates must be between ${MIN_COORDINATE} and ${MAX_COORDINATE}`
            };
        }

        // Validate minimum Y coordinate to prevent teleporting underground
        const MIN_Y = 0;
        if (y < MIN_Y) {
            return {
                success: false,
                message: `Y coordinate must be at least ${MIN_Y} to prevent underground teleportation`
            };
        }

        // Create teleport response with position data
        const teleportData = {
            success: true,
            message: `Teleporting to coordinates: ${x}, ${y}, ${z}`,
            action: "teleport",
            position: {
                x: x,
                y: y,
                z: z
            },
            clientId: clientId,
            sessionId: sessionId
        };

        // TODO: Add position broadcasting to other clients in multiplayer
        // This will be handled by the VOS synchronization system

        return teleportData;
    };
};