// Copyright (c) 2019-2025 Five Squared Interactive. All rights reserved.

const { spawn } = require("child_process");
const mqtt = require("mqtt");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const vosSynchronizationSession = require('./vossynchronizationsession.js');
const WorldCommands = require('./worldcommands.js');
const path = require("path");

/**
 * Configuration File name.
 */
const CONFIGFILENAME = ".config-temp";

/**
 * @module VOSSynchronizationService VOS Synchronization Service.
 */
module.exports = function() {

    /**
     * Version.
     */
    this.VERSION = "1.2.0"

    /*
     * Callback for Session Creation.
     */
    this.sessionCreatedCallback = null;

    /*
     * Callback for Session Deletion.
     */
    this.sessionDeletedCallback = null;

    /*
     * Callback for Session Joining.
     */
    this.sessionJoinedCallback = null;

    /*
     * Callback for Session Exiting.
     */
    this.sessionExitedCallback = null;

    /*
     * Callback for Container Entity Creation.
     */
    this.containerEntityCreatedCallback = null;

    /*
     * Callback for Mesh Entity Creation.
     */
    this.meshEntityCreatedCallback = null;

    /*
     * Callback for Character Entity Creation.
     */
    this.characterEntityCreatedCallback = null;

    /*
     * Callback for Button Entity Creation.
     */
    this.buttonEntityCreatedCallback = null;

    /*
     * Callback for Canvas Entity Creation.
     */
    this.canvasEntityCreatedCallback = null;

    /*
     * Callback for Input Entity Creation.
     */
    this.inputEntityCreatedCallback = null;

    /*
     * Callback for Light Entity Creation.
     */
    this.lightEntityCreatedCallback = null;

    /*
     * Callback for Terrain Entity Creation.
     */
    this.terrainEntityCreatedCallback = null;

    /*
     * Callback for Text Entity Creation.
     */
    this.textEntityCreatedCallback = null;

    /*
     * Callback for Voxel Entity Creation.
     */
    this.voxelEntityCreatedCallback = null;

    /*
     * Callback for Airplane Entity Creation.
     */
    this.airplaneEntityCreatedCallback = null;

    /*
     * Callback for Audio Entity Creation.
     */
    this.audioEntityCreatedCallback = null;

    /*
     * Callback for Automobile Entity Creation.
     */
    this.automobileEntityCreatedCallback = null;

    /*
     * Callback for Dropdown Entity Creation.
     */
    this.dropdownEntityCreatedCallback = null;

    /*
     * Callback for HTML Entity Creation.
     */
    this.htmlEntityCreatedCallback = null;

    /*
     * Callback for Image Entity Creation.
     */
    this.imageEntityCreatedCallback = null;

    /*
     * Callback for Message Sending.
     */
    this.messageSentCallback = null;

    /*
     * Callback for Session Message (MSG/CMD).
     */
    this.sessionMessageCallback = null;

    /*
     * Callback for Entity Deletion.
     */
    this.entityDeletedCallback = null;

    /*
     * Callback for Entity Removal.
     */
    this.entityRemovedCallback = null;

    /*
     * Callback for Entity Positioning.
     */
    this.entityPositionedCallback = null;

    /*
     * Callback for Entity Rotating.
     */
    this.entityRotatedCallback = null;

    /*
     * Callback for Entity Scaling.
     */
    this.entityScaledCallback = null;

    /*
     * Callback for Entity Sizing.
     */
    this.entitySizedCallback = null;

    /*
     * Callback for Terrain Entity Modification.
     */
    this.terrainEntityModifiedCallback = null;

    /*
     * Callback for Entity Canvas Type Setting.
     */
    this.entityCanvasTypeSetCallback = null;

    /*
     * Callback for Entity Highlight State Setting.
     */
    this.entityHighlightStateSetCallback = null;

    /*
     * Callback for Entity Motion State Setting.
     */
    this.entityMotionStateSetCallback = null;

    /*
     * Callback for Parent Entity Setting.
     */
    this.parentEntitySetCallback = null;

    /*
     * Callback for Entity Physical State Setting.
     */
    this.entityPhysicalStateSetCallback = null;

    /*
     * Callback for Entity Visibility Setting.
     */
    this.entityVisibilitySetCallback = null;

    /**
     * Callback for checking Create Session Authorization.
     */
    this.createSessionAuthCallback = null;

    /**
     * Callback for checking Destroy Session Authorization.
     */
    this.destroySessionAuthCallback = null;

    /**
     * Callback for checking Join Session Authorization.
     */
    this.joinSessionAuthCallback = null;

    /**
     * Callback for checking Exit Session Authorization.
     */
    this.exitSessionAuthCallback = null;

    /**
     * Callback for checking Give Heartbeat Authorization.
     */
    this.giveHeartbeatAuthCallback = null;

    /**
     * Callback for checking Get Session State Authorization.
     */
    this.getSessionStateAuthCallback = null;

    /**
     * Callback for checking Create Container Entity Authorization.
     */
    this.createContainerEntityAuthCallback = null;

    /**
     * Callback for checking Create Mesh Entity Authorization.
     */
    this.createMeshEntityAuthCallback = null;

    /**
     * Callback for checking Create Character Entity Authorization.
     */
    this.createCharacterEntityAuthCallback = null;

    /**
     * Callback for checking Create Button Entity Authorization.
     */
    this.createButtonEntityAuthCallback = null;
    
    /**
     * Callback for checking Create Canvas Entity Authorization.
     */
    this.createCanvasEntityAuthCallback = null;

    /**
     * Callback for checking Create Input Entity Authorization.
     */
    this.createInputEntityAuthCallback = null;

    /**
     * Callback for checking Create Light Entity Authorization.
     */
    this.createLightEntityAuthCallback = null;

    /**
     * Callback for checking Create Terrain Entity Authorization.
     */
    this.createTerrainEntityAuthCallback = null;

    /**
     * Callback for checking Create Text Entity Authorization.
     */
    this.createTextEntityAuthCallback = null;

    /**
     * Callback for checking Create Voxel Entity Authorization.
     */
    this.createVoxelEntityAuthCallback = null;

    /**
     * Callback for checking Create Airplane Entity Authorization.
     */
    this.createAirplaneEntityAuthCallback = null;

    /**
     * Callback for checking Create Audio Entity Authorization.
     */
    this.createAudioEntityAuthCallback = null;

    /**
     * Callback for checking Create Automobile Entity Authorization.
     */
    this.createAutomobileEntityAuthCallback = null;

    /**
     * Callback for checking Create Dropdown Entity Authorization.
     */
    this.createDropdownEntityAuthCallback = null;

    /**
     * Callback for checking Create HTML Entity Authorization.
     */
    this.createHTMLEntityAuthCallback = null;

    /**
     * Callback for checking Create Image Entity Authorization.
     */
    this.createImageEntityAuthCallback = null;

    /**
     * Callback for checking Send Message Authorization.
     */
    this.sendMessageAuthCallback = null;

    /**
     * Callback for checking Delete Entity Authorization.
     */
    this.deleteEntityAuthCallback = null;

    /**
     * Callback for checking Remove Entity Authorization.
     */
    this.removeEntityAuthCallback = null;

    /**
     * Callback for checking Position Entity Authorization.
     */
    this.positionEntityAuthCallback = null;

    /**
     * Callback for checking Rotate Entity Authorization.
     */
    this.rotateEntityAuthCallback = null;

    /**
     * Callback for checking Scale Entity Authorization.
     */
    this.scaleEntityAuthCallback = null;

    /**
     * Callback for checking Size Entity Authorization.
     */
    this.sizeEntityAuthCallback = null;

    /**
     * Callback for checking Modify Terrain Entity Authorization.
     */
    this.modifyTerrainEntityAuthCallback = null;

    /**
     * Callback for checking Set Entity Canvas Type Authorization.
     */
    this.setEntityCanvasTypeAuthCallback = null;

    /**
     * Callback for checking Set Entity Highlight State Authorization.
     */
    this.setEntityHighlightStateAuthCallback = null;

    /**
     * Client.
     */
    var client;

    /**
     * VOS Synchronization Sessions.
     */
    var vosSynchronizationSessions = {};

    /**
     * World Commands Module.
     */
    var worldCommands = new WorldCommands();

    /**
     * @function RunMQTT Run MQTT process.
     * @param {*} port Port.
     * @param {*} websocketsPort WebSockets Port.
     */
    this.RunMQTT = function(port, websocketsPort = 0, caFile = null, privateKeyFile = null, certFile = null) {
        var config = `listener ${port}\nprotocol mqtt`;
        if (websocketsPort > 0) {
            config = `${config}\nlistener ${websocketsPort}\nprotocol websockets`;
            if (caFile != null && privateKeyFile != null && certFile != null) {
                config = `${config}\ncafile ${caFile}\ncertfile ${certFile}\nkeyfile ${privateKeyFile}`;
            }
        }
        config = `${config}\nallow_anonymous true`;
        fs.writeFileSync(CONFIGFILENAME, config);
        if (process.platform == "win32") {
            this.mosquittoProcess = spawn(path.join(__dirname, "Mosquitto\\mosquitto.exe"), ["-c", CONFIGFILENAME], {detached: true});
        } else {
            this.mosquittoProcess = spawn("mosquitto", ["-c", CONFIGFILENAME], {detached: true});
        }
        this.mosquittoProcess.stdout.on('data', (data) => {
            Log(`[VOSSynchronizationService] ${data}`);
        });
        this.mosquittoProcess.stderr.on('data', (data) => {
            Log(`[VOSSynchronizationService] ${data}`);
        });
        this.mosquittoProcess.on('close', (code) => {
            Log(`[VOSSynchronizationService] MQTT server exited ${code}`);
        });
    }
    
    /**
     * @function StopMQTT Stop MQTT process.
     */
    this.StopMQTT = function() {
        if (this.mosquittoProcess != null)
        {
            process.kill(this.mosquittoProcess.pid);
            if (fs.existsSync(CONFIGFILENAME)) {
                fs.rmSync(CONFIGFILENAME);
            }
        }
    }
    
    /**
     * @function ConnectToMQTT Connect to MQTT server.
     * @param {*} port Port.
     */
    this.ConnectToMQTT = function(port) {
        client = mqtt.connect(`mqtt://localhost:${port}`);
        client.on('connect', function()  {
            client.subscribe("vos/#", function(err) {
                if (err) {
                    Log("[VOSSynchronizationService] Error Starting");
                } else {
                    Log("[VOSSynchronizationService] Started");
                }
            });
        });
    
        const ProcessMessageWithContext = ProcessMessage.bind(this);

        client.on('message', function(topic, message) {
            ProcessMessageWithContext(topic, message);
        });
    }

    /**
     * @function CreateSession Create a Session.
     * @param {*} id ID.
     * @param {*} tag Tag.
     */
    this.CreateSession = function(id, tag) {
        Log(`[VOSSynchronizationService] Creating session ${id} with tag ${tag}`);
        CreateSynchronizedSession(id, tag);
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": id,
            "session-tag": tag
        };
        SendMessage("vos/session/new", JSON.stringify(messageToSend));
        if (this.sessionCreatedCallback) {
            this.sessionCreatedCallback(messageToSend["session-id"],
                messageToSend["session-tag"]);
        }
    }

    /**
     * @function DeleteSession Delete a Session.
     * @param {*} id ID.
     */
    this.DeleteSession = function(id) {
        Log(`[VOSSynchronizationService] Deleting session ${id}`);
        DestroySynchronizedSession(id);
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": id
        };
        SendMessage("vos/session/closed", JSON.stringify(messageToSend));
        if (this.sessionDeletedCallback) {
            this.sessionDeletedCallback(messageToSend["session-id"]);
        }
    }

    /**
     * @function JoinSession Join a Session.
     * @param {*} session Session.
     * @param {*} clientID Client ID.
     * @param {*} clientTag Client Tag.
     */
    this.JoinSession = function(session, clientID, clientTag) {
        session.AddClient(clientID, clientTag);
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": session.id,
            "client-id": clientID,
            "client-tag": clientTag
        };
        SendMessage("vos/status/" + session.id + "/newclient", JSON.stringify(messageToSend));
        if (this.sessionJoinedCallback) {
            this.sessionJoinedCallback(messageToSend["session-id"], messageToSend["client-id"],
                messageToSend["client-tag"]);
        }
    }

    /**
     * @function ExitSession Exit a Session.
     * @param {*} session Session.
     * @param {*} clientID Client ID.
     */
    this.ExitSession = function(session, clientID) {
        session.RemoveClient(clientID);
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": session.id,
            "client-id": clientID
        };
        SendMessage("vos/status/" + session.id + "/clientleft", JSON.stringify(messageToSend));
        if (this.sessionExitedCallback) {
            this.sessionExitedCallback(messageToSend["session-id"], messageToSend["client-id"]);
        }
    }

    /**
     * @function CreateContainerEntity Create a Container Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} entityTag Entity Tag.
     * @param {*} parentID Parent ID.
     * @param {*} position Position.
     * @param {*} rotation Rotation.
     * @param {*} scale Scale.
     * @param {*} isSize Whether or not the scale is a size.
     * @param {*} clientToDeleteWith Client to delete entity with.
     */
    this.CreateContainerEntity = function(session, entityID, entityTag, parentID,
        position, rotation, scale, clientToDeleteWith) {
        session.AddEntityWithScale(entityID, entityTag, "container", null,
            parentID, position, rotation, scale, null,
            null, null, null, null, null, null, null, null, null, null, null, null,
            null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
            { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
            null, null, null, clientToDeleteWith, null, null);
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": session.id,
            "client-id": clientID,
            "entity-id": entityID,
            "tag": entityTag,
            "parent-id": parentID,
            "position": position,
            "rotation": rotation,
            "scale": scale
        };
        SendMessage("vos/status/" + session.id + "/createcontainerentity", JSON.stringify(messageToSend));
        if (this.containerEntityCreatedCallback) {
            this.containerEntityCreatedCallback(messageToSend["session-id"], messageToSend["client-id"],
                messageToSend["entity-id"], messageToSend["tag"], messageToSend["parent-id"],
                messageToSend["position"], messageToSend["rotation"], messageToSend["scale"]);
        }
    }

    /**
     * @function CreateMeshEntity Create a Mesh Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} entityTag Entity Tag.
     * @param {*} path Path to mesh resource.
     * @param {*} parentID Parent ID.
     * @param {*} position Position.
     * @param {*} rotation Rotation.
     * @param {*} scale Scale.
     * @param {*} isSize Whether or not the scale is a size.
     * @param {*} resources Mesh resources.
     * @param {*} clientToDeleteWith Client to delete entity with.
     */
    this.CreateMeshEntity = function(session, entityID, entityTag, path, parentID,
        position, rotation, scale, isSize, resources, clientToDeleteWith) {
        if (isSize) {
            session.AddEntityWithSize(entityID, entityTag, "mesh", path,
                parentID, position, rotation, scale, resources,
                null, null, null, null, null, null, null, null, null, null, null, null,
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
                null, null, null, clientToDeleteWith, null, null);

            messageToSend = {
                "message-id": uuidv4(),
                "session-id": session.id,
                "client-id": clientID,
                "entity-id": entityID,
                "tag": entityTag,
                "parent-id": parentID,
                "path": path,
                "resources": resources,
                "position": position,
                "rotation": rotation,
                "size": scale
            };
            SendMessage("vos/status/" + session.id + "/createmeshentity", JSON.stringify(messageToSend));
            if (this.meshEntityCreatedCallback) {
                this.meshEntityCreatedCallback(messageToSend["session-id"], messageToSend["client-id"],
                    messageToSend["entity-id"], messageToSend["tag"], messageToSend["parent-id"],
                    messageToSend["path"], messageToSend["resources"], messageToSend["position"],
                    messageToSend["rotation"], null, messageToSend["size"]);
            }
        }
        else {
            session.AddEntityWithScale(entityID, entityTag, "mesh", path,
            parentID, position, rotation, scale, resources,
            null, null, null, null, null, null, null, null, null, null, null, null,
            null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
            { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
            null, null, null, clientToDeleteWith, null, null);
            messageToSend = {
                "message-id": uuidv4(),
                "session-id": session.id,
                "client-id": clientID,
                "entity-id": entityID,
                "tag": entityTag,
                "parent-id": parentID,
                "path": path,
                "resources": resources,
                "position": position,
                "rotation": rotation,
                "scale": scale
            };
            SendMessage("vos/status/" + session.id + "/createmeshentity", JSON.stringify(messageToSend));
            if (this.meshEntityCreatedCallback) {
                this.meshEntityCreatedCallback(messageToSend["session-id"], messageToSend["client-id"],
                    messageToSend["entity-id"], messageToSend["tag"], messageToSend["parent-id"],
                    messageToSend["path"], messageToSend["resources"], messageToSend["position"],
                    messageToSend["rotation"], messageToSend["scale"], null);
            }
        }
    }

    /**
     * @function CreateCharacterEntity Create a Character Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} entityTag Entity Tag.
     * @param {*} path Path to mesh resource.
     * @param {*} parentID Parent ID.
     * @param {*} position Position.
     * @param {*} rotation Rotation.
     * @param {*} scale Scale.
     * @param {*} isSize Whether or not the scale is a size.
     * @param {*} resources Mesh resources.
     * @param {*} clientToDeleteWith Client to delete entity with.
     */
    this.CreateCharacterEntity = function(session, entityID, entityTag, path, parentID,
        position, rotation, scale, isSize, modelOffset, modelRotation, labelOffset, clientToDeleteWith) {
        if (isSize) {
            session.AddEntityWithSize(entityID, entityTag, "character", path,
                parentID, position, rotation, scale, null,
                null, null, null, null, null, null, null, null, null, null, null, null,
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
                modelOffset, modelRotation, labelOffset, clientToDeleteWith, null, null);
            messageToSend = {
                "message-id": uuidv4(),
                "session-id": session.id,
                "client-id": clientID,
                "entity-id": entityID,
                "tag": entityTag,
                "parent-id": parentID,
                "path": path,
                "model-offset": modelOffset,
                "model-rotation": modelRotation,
                "label-offset": labelOffset,
                "position": position,
                "rotation": rotation,
                "size": scale
            };
            SendMessage("vos/status/" + session.id + "/createcharacterentity", JSON.stringify(messageToSend));
            if (this.characterEntityCreatedCallback) {
                this.characterEntityCreatedCallback(messageToSend["session-id"], messageToSend["client-id"],
                    messageToSend["entity-id"], messageToSend["tag"], messageToSend["parent-id"],
                    messageToSend["path"], messageToSend["model-offset"], messageToSend["model-rotation"],
                    messageToSend["label-offset"], messageToSend["position"], messageToSend["rotation"], null,
                    messageToSend["size"]);
            }
        }
        else {
            session.AddEntityWithScale(entityID, entityTag, "character", path,
                parentID, position, rotation, scale, null,
                null, null, null, null, null, null, null, null, null, null, null, null,
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
                modelOffset, modelRotation, labelOffset, clientToDeleteWith, null, null);
            messageToSend = {
                "message-id": uuidv4(),
                "session-id": session.id,
                "client-id": clientID,
                "entity-id": entityID,
                "tag": entityTag,
                "parent-id": parentID,
                "path": path,
                "model-offset": modelOffset,
                "model-rotation": modelRotation,
                "label-offset": labelOffset,
                "position": position,
                "rotation": rotation,
                "scale": scale
            };
            SendMessage("vos/status/" + session.id + "/createcharacterentity", JSON.stringify(messageToSend));
            if (this.characterEntityCreatedCallback) {
                this.characterEntityCreatedCallback(messageToSend["session-id"], messageToSend["client-id"],
                    messageToSend["entity-id"], messageToSend["tag"], messageToSend["parent-id"],
                    messageToSend["path"], messageToSend["model-offset"], messageToSend["model-rotation"],
                    messageToSend["label-offset"], messageToSend["position"], messageToSend["rotation"],
                    messageToSend["scale"], null);
            }
        }
    }

    /**
     * @function CreateButtonEntity Create a Button Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} entityTag Entity Tag.
     * @param {*} parentID Parent ID.
     * @param {*} positionPercent Position Percent.
     * @param {*} sizePercent Size Percent.
     * @param {*} clientToDeleteWith Client to delete entity with.
     * @param {*} onClick On click event.
     */
    this.CreateButtonEntity = function(session, entityID, entityTag, parentID,
        positionPercent, sizePercent, clientToDeleteWith, onClick) {
            session.AddEntityWithCanvasTransform(entityID, entityTag, "button", null,
            parentID, positionPercent, sizePercent, null, null, null,
            clientToDeleteWith, onClick, null);
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": session.id,
            "client-id": clientID,
            "entity-id": entityID,
            "tag": entityTag,
            "parent-id": parentID,
            "path": path,
            "position-percent": positionPercent,
            "size-percent": sizePercent,
            "on-click": onClick
        };
        SendMessage("vos/status/" + session.id + "/createbuttonentity", JSON.stringify(messageToSend));
        if (this.buttonEntityCreatedCallback) {
            this.buttonEntityCreatedCallback(messageToSend["session-id"], messageToSend["client-id"],
                messageToSend["entity-id"], messageToSend["tag"], messageToSend["parent-id"],
                messageToSend["path"], messageToSend["position-percent"], messageToSend["rotation-percent"],
                messageToSend["on-click"]);
        }
    }

    /**
     * @function CreateCanvasEntity Create a Canvas Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} entityTag Entity Tag.
     * @param {*} path Path.
     * @param {*} parentID Parent ID.
     * @param {*} position Position.
     * @param {*} rotation Rotation.
     * @param {*} scale Scale.
     * @param {*} isSize Whether or not the scale is a size.
     * @param {*} clientToDeleteWith Client to delete entity with.
     */
    this.CreateCanvasEntity = function(session, entityID, entityTag, path, parentID,
        position, rotation, scale, isSize, clientToDeleteWith) {
        if (isSize) {
            session.AddEntityWithSize(entityID, entityTag, "canvas", path,
                parentID, position, rotation, scale, null,
                null, null, null, null, null, null, null, null, null, null, null, null,
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
                null, null, null, clientToDeleteWith, null, null);
            messageToSend = {
                "message-id": uuidv4(),
                "session-id": session.id,
                "client-id": clientID,
                "entity-id": entityID,
                "tag": entityTag,
                "parent-id": parentID,
                "path": path,
                "position": position,
                "rotation": rotation,
                "size": scale
            };
            SendMessage("vos/status/" + session.id + "/createcanvasentity", JSON.stringify(messageToSend));
            if (this.canvasEntityCreatedCallback) {
                this.canvasEntityCreatedCallback(messageToSend["session-id"], messageToSend["client-id"],
                    messageToSend["entity-id"], messageToSend["tag"], messageToSend["parent-id"],
                    messageToSend["path"], messageToSend["position"], messageToSend["rotation"], null,
                    messageToSend["size"]);
            }
        }
        else {
            session.AddEntityWithScale(entityID, entityTag, "canvas", path,
                parentID, position, rotation, scale, null,
                null, null, null, null, null, null, null, null, null, null, null, null,
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
                null, null, null, clientToDeleteWith, null, null);
            messageToSend = {
                "message-id": uuidv4(),
                "session-id": session.id,
                "client-id": clientID,
                "entity-id": entityID,
                "tag": entityTag,
                "parent-id": parentID,
                "path": path,
                "position": position,
                "rotation": rotation,
                "scale": scale
            };
            SendMessage("vos/status/" + session.id + "/createcanvasentity", JSON.stringify(messageToSend));
            if (this.canvasEntityCreatedCallback) {
                this.canvasEntityCreatedCallback(messageToSend["session-id"], messageToSend["client-id"],
                    messageToSend["entity-id"], messageToSend["tag"], messageToSend["parent-id"],
                    messageToSend["path"], messageToSend["position"], messageToSend["rotation"],
                    messageToSend["scale"], null);
            }
        }
    }

    /**
     * @function CreateInputEntity Create an Input Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} entityTag Entity Tag.
     * @param {*} parentID Parent ID.
     * @param {*} positionPercent Position Percent.
     * @param {*} sizePercent Size Percent.
     * @param {*} clientToDeleteWith Client to delete entity with.
     */
    this.CreateInputEntity = function(session, entityID, entityTag, parentID,
        positionPercent, sizePercent, clientToDeleteWith) {
            session.AddEntityWithCanvasTransform(entityID, entityTag, "input", null,
            parentID, positionPercent, sizePercent, null, null, null,
            clientToDeleteWith, null, null);
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": session.id,
            "client-id": clientID,
            "entity-id": entityID,
            "tag": entityTag,
            "parent-id": parentID,
            "path": path,
            "position-percent": positionPercent,
            "size-percent": sizePercent
        };
        SendMessage("vos/status/" + session.id + "/createinputentity", JSON.stringify(messageToSend));
        if (this.inputEntityCreatedCallback) {
            this.inputEntityCreatedCallback(messageToSend["session-id"], messageToSend["client-id"],
                messageToSend["entity-id"], messageToSend["tag"], messageToSend["parent-id"],
                messageToSend["path"], messageToSend["position-percent"], messageToSend["size-percent"]);
        }
    }

    /**
     * @function CreateLightEntity Create a Light Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} entityTag Entity Tag.
     * @param {*} path Path.
     * @param {*} parentID Parent ID.
     * @param {*} position Position.
     * @param {*} rotation Rotation.
     * @param {*} clientToDeleteWith Client to delete entity with.
     */
    this.CreateLightEntity = function(session, entityID, entityTag, path, parentID,
        position, rotation, clientToDeleteWith) {
        session.AddEntityWithScale(entityID, entityTag, "light", path,
            parentID, position, rotation, null, null,
            null, null, null, null, null, null, null, null, null, null, null, null,
            null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
            { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
            null, null, null, clientToDeleteWith, null, null);
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": session.id,
            "client-id": clientID,
            "entity-id": entityID,
            "tag": entityTag,
            "parent-id": parentID,
            "path": path,
            "position": position,
            "rotation": rotation
        };
        SendMessage("vos/status/" + session.id + "/createlightentity", JSON.stringify(messageToSend));
        if (this.lightEntityCreatedCallback) {
            this.lightEntityCreatedCallback(messageToSend["session-id"], messageToSend["client-id"],
                messageToSend["entity-id"], messageToSend["tag"], messageToSend["parent-id"],
                messageToSend["path"], messageToSend["position"], messageToSend["rotation"]);
        }
    }

    /**
     * @function CreateTerrainEntity Create a Terrain Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} entityTag Entity Tag.
     * @param {*} path Path.
     * @param {*} parentID Parent ID.
     * @param {*} position Position.
     * @param {*} rotation Rotation.
     * @param {*} scale Scale.
     * @param {*} isSize Whether or not the scale is a size.
     * @param {*} length Length.
     * @param {*} width Width.
     * @param {*} height Height.
     * @param {*} heights Heights.
     * @param {*} diffuseTexture Diffuse Texture.
     * @param {*} normalTexture Normal Texture.
     * @param {*} maskTexture Mask Texture.
     * @param {*} specularValues Specular Values.
     * @param {*} metallicValues Metallic Values.
     * @param {*} smoothnessValues Smoothness Values.
     * @param {*} layerMask Layer Mask.
     * @param {*} type Type.
     * @param {*} clientToDeleteWith Client to delete entity with.
     */
    this.CreateTerrainEntity = function(session, entityID, entityTag, path, parentID,
        position, rotation, length, width, height, heights, diffuseTexture,
        normalTexture, maskTexture, specularValues, metallicValues, smoothnessValues,
        layerMask, type, modifications, clientToDeleteWith) {
        session.AddEntityWithScale(entityID, entityTag, "terrain", path,
            parentID, position, rotation, null, null,
            length, width, height, heights, diffuseTexture, normalTexture, maskTexture,
            specularValues, metallicValues, smoothnessValues, layerMask, type, null, null,
            { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
            { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, modifications,
            null, null, null, clientToDeleteWith, null, null);
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": session.id,
            "client-id": clientID,
            "entity-id": entityID,
            "tag": entityTag,
            "parent-id": parentID,
            "path": path,
            "position": position,
            "rotation": rotation,
            "length": length,
            "width": width,
            "height": height,
            "heights": heights,
            "diffuse-texture": diffuseTexture,
            "normal-texture": normalTexture,
            "mask-texture": maskTexture,
            "specular-values": specularValues,
            "metallic-values": metallicValues,
            "smoothness-values": smoothnessValues,
            "layer-mask": layerMask,
            "type": type,
            "modifications": modifications
        };
        SendMessage("vos/status/" + session.id + "/createterrainentity", JSON.stringify(messageToSend));
        if (this.terrainEntityCreatedCallback) {
            this.terrainEntityCreatedCallback(messageToSend["session-id"], messageToSend["client-id"],
                messageToSend["entity-id"], messageToSend["tag"], messageToSend["parent-id"],
                messageToSend["path"], messageToSend["position"], messageToSend["rotation"], 
                messageToSend["length"], messageToSend["width"], messageToSend["height"],
                messageToSend["heights"], messageToSend["diffuse-texture"], messageToSend["normal-texture"],
                messageToSend["mask-texture"], messageToSend["specular-values"],
                messageToSend["metallic-values"], messageToSend["smoothness-values"],
                messageToSend["layer-mask"], messageToSend["type"], messageToSend["modifications"]);
        }
    }

    /**
     * @function CreateTextEntity Create a Text Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} entityTag Entity Tag.
     * @param {*} parentID Parent ID.
     * @param {*} positionPercent Position Percent.
     * @param {*} sizePercent Size Percent.
     * @param {*} clientToDeleteWith Client to delete entity with.
     * @param {*} text Text.
     * @param {*} fontSize Font Size.
     */
    this.CreateTextEntity = function(session, entityID, entityTag, parentID,
        positionPercent, sizePercent, clientToDeleteWith, text, fontSize) {
            session.AddEntityWithCanvasTransform(entityID, entityTag, "text", null,
            parentID, positionPercent, sizePercent, null, text, fontSize,
            clientToDeleteWith, null, null);
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": session.id,
            "client-id": clientID,
            "entity-id": entityID,
            "tag": entityTag,
            "parent-id": parentID,
            "path": path,
            "position-percent": positionPercent,
            "size-percent": sizePercent,
            "text": text,
            "font-size": fontSize
        };
        SendMessage("vos/status/" + session.id + "/createtextentity", JSON.stringify(messageToSend));
        if (this.textEntityCreatedCallback) {
            this.textEntityCreatedCallback(messageToSend["session-id"], messageToSend["client-id"],
                messageToSend["entity-id"], messageToSend["tag"], messageToSend["parent-id"],
                messageToSend["path"], messageToSend["position-percent"],
                messageToSend["size-percent"], messageToSend["text"], messageToSend["font-size"]);
        }
    }

    /**
     * @function CreateVoxelEntity Create a Voxel Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} entityTag Entity Tag.
     * @param {*} path Path.
     * @param {*} parentID Parent ID.
     * @param {*} position Position.
     * @param {*} rotation Rotation.
     * @param {*} scale Scale.
     * @param {*} isSize Whether or not the scale is a size.
     * @param {*} resources Resources.
     * @param {*} clientToDeleteWith Client to delete entity with.
     */
    this.CreateVoxelEntity = function(session, entityID, entityTag, path, parentID,
        position, rotation, scale, isSize, resources, clientToDeleteWith) {
        if (isSize) {
            session.AddEntityWithSize(entityID, entityTag, "voxel", path,
                parentID, position, rotation, scale, resources,
                null, null, null, null, null, null, null, null, null, null, null,
                null, null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
                null, null, null, clientToDeleteWith, null, null);
            messageToSend = {
                "message-id": uuidv4(),
                "session-id": session.id,
                "client-id": clientID,
                "entity-id": entityID,
                "tag": entityTag,
                "parent-id": parentID,
                "path": path,
                "position": position,
                "rotation": rotation,
                "size": scale
            };
            SendMessage("vos/status/" + session.id + "/createvoxelentity", JSON.stringify(messageToSend));
            if (this.voxelEntityCreatedCallback) {
                this.voxelEntityCreatedCallback(messageToSend["session-id"], messageToSend["client-id"],
                    messageToSend["entity-id"], messageToSend["tag"], messageToSend["parent-id"],
                    messageToSend["path"], messageToSend["position"], messageToSend["rotation"], null,
                    messageToSend["size"]);
            }
        }
        else {
            session.AddEntityWithScale(entityID, entityTag, "voxel", path,
            parentID, position, rotation, scale, resources,
            null, null, null, null, null, null, null, null, null, null, null,
            null, null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
            { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
            null, null, null, clientToDeleteWith, null, null);
            messageToSend = {
                "message-id": uuidv4(),
                "session-id": session.id,
                "client-id": clientID,
                "entity-id": entityID,
                "tag": entityTag,
                "parent-id": parentID,
                "path": path,
                "position": position,
                "rotation": rotation,
                "scale": scale
            };
            SendMessage("vos/status/" + session.id + "/createvoxelentity", JSON.stringify(messageToSend));
            if (this.voxelEntityCreatedCallback) {
                this.voxelEntityCreatedCallback(messageToSend["session-id"], messageToSend["client-id"],
                    messageToSend["entity-id"], messageToSend["tag"], messageToSend["parent-id"],
                    messageToSend["path"], messageToSend["position"], messageToSend["rotation"],
                    messageToSend["scale"], null);
            }
        }
    }

    /**
     * @function CreateAirplaneEntity Create a Airplane Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} entityTag Entity Tag.
     * @param {*} path Path.
     * @param {*} parentID Parent ID.
     * @param {*} position Position.
     * @param {*} rotation Rotation.
     * @param {*} scale Scale.
     * @param {*} isSize Whether or not the scale is a size.
     * @param {*} resources Resources.
     * @param {*} clientToDeleteWith Client to delete entity with.
     */
    this.CreateAirplaneEntity = function(session, entityID, entityTag, path, parentID,
        position, rotation, scale, isSize, mass, meshPosition, meshRotation,
        clientToDeleteWith) {
        if (isSize) {
            session.AddEntityWithSize(entityID, entityTag, "airplane", path,
                parentID, position, rotation, scale, null,
                null, null, null, null, null, null, null, null, null, null, null, null,
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, mass, null,
                meshPosition, meshRotation, null, clientToDeleteWith, null, null);
            messageToSend = {
                "message-id": uuidv4(),
                "session-id": session.id,
                "client-id": clientID,
                "entity-id": entityID,
                "tag": entityTag,
                "parent-id": parentID,
                "path": path,
                "position": position,
                "rotation": rotation,
                "size": scale,
                "mass": mass,
                "mesh-position": meshPosition,
                "mesh-rotation": meshRotation
            };
            SendMessage("vos/status/" + session.id + "/createairplaneentity", JSON.stringify(messageToSend));
            if (this.airplaneEntityCreatedCallback) {
                this.airplaneEntityCreatedCallback(messageToSend["session-id"], messageToSend["client-id"],
                    messageToSend["entity-id"], messageToSend["tag"], messageToSend["parent-id"],
                    messageToSend["path"], messageToSend["position"], messageToSend["rotation"], null,
                    messageToSend["size"]);
            }
        }
        else {
            session.AddEntityWithScale(entityID, entityTag, "airplane", path,
            parentID, position, rotation, scale, null,
            null, null, null, null, null, null, null, null, null, null, null,
            null, null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
            { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
            meshPosition, meshRotation, null, clientToDeleteWith, null, null);
            messageToSend = {
                "message-id": uuidv4(),
                "session-id": session.id,
                "client-id": clientID,
                "entity-id": entityID,
                "tag": entityTag,
                "parent-id": parentID,
                "path": path,
                "position": position,
                "rotation": rotation,
                "scale": scale,
                "mass": mass,
                "mesh-position": meshPosition,
                "mesh-rotation": meshRotation
            };
            SendMessage("vos/status/" + session.id + "/createairplaneentity", JSON.stringify(messageToSend));
            if (this.airplaneEntityCreatedCallback) {
                this.airplaneEntityCreatedCallback(messageToSend["session-id"], messageToSend["client-id"],
                    messageToSend["entity-id"], messageToSend["tag"], messageToSend["parent-id"],
                    messageToSend["path"], messageToSend["position"], messageToSend["rotation"], null,
                    messageToSend["size"], messageToSend["mesh-position"], messageToSend["mesh-rotation"],
                    messageToSend["mass"])
            }
        }
    }

    /**
     * @function CreateAudioEntity Create a Audio Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} entityTag Entity Tag.
     * @param {*} path Path.
     * @param {*} parentID Parent ID.
     * @param {*} position Position.
     * @param {*} rotation Rotation.
     * @param {*} scale Scale.
     * @param {*} isSize Whether or not the scale is a size.
     * @param {*} resources Resources.
     * @param {*} clientToDeleteWith Client to delete entity with.
     */
    this.CreateAudioEntity = function(session, entityID, entityTag, path, parentID,
        position, rotation, scale, isSize, resources, clientToDeleteWith) {
        if (isSize) {
            session.AddEntityWithSize(entityID, entityTag, "audio", path,
                parentID, position, rotation, scale, resources,
                null, null, null, null, null, null, null, null, null, null, null,
                null, null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
                null, null, null, clientToDeleteWith, null, null);
            messageToSend = {
                "message-id": uuidv4(),
                "session-id": session.id,
                "client-id": clientID,
                "entity-id": entityID,
                "tag": entityTag,
                "parent-id": parentID,
                "path": path,
                "position": position,
                "rotation": rotation,
                "size": scale
            };
            SendMessage("vos/status/" + session.id + "/createaudioentity", JSON.stringify(messageToSend));
            if (this.audioEntityCreatedCallback) {
                this.audioEntityCreatedCallback(messageToSend["session-id"], messageToSend["client-id"],
                    messageToSend["entity-id"], messageToSend["tag"], messageToSend["parent-id"],
                    messageToSend["path"], messageToSend["position"], messageToSend["rotation"], null,
                    messageToSend["size"]);
            }
        }
        else {
            session.AddEntityWithScale(entityID, entityTag, "audio", path,
            parentID, position, rotation, scale, resources,
            null, null, null, null, null, null, null, null, null, null, null,
            null, null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
            { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
            null, null, null, clientToDeleteWith, null, null);
            messageToSend = {
                "message-id": uuidv4(),
                "session-id": session.id,
                "client-id": clientID,
                "entity-id": entityID,
                "tag": entityTag,
                "parent-id": parentID,
                "path": path,
                "position": position,
                "rotation": rotation,
                "scale": scale
            };
            SendMessage("vos/status/" + session.id + "/createaudioentity", JSON.stringify(messageToSend));
            if (this.audioEntityCreatedCallback) {
                this.audioEntityCreatedCallback(messageToSend["session-id"], messageToSend["client-id"],
                    messageToSend["entity-id"], messageToSend["tag"], messageToSend["parent-id"],
                    messageToSend["path"], messageToSend["position"], messageToSend["rotation"],
                    messageToSend["scale"], null);
            }
        }
    }

    /**
     * @function CreateAutomobileEntity Create a Automobile Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} entityTag Entity Tag.
     * @param {*} path Path.
     * @param {*} parentID Parent ID.
     * @param {*} position Position.
     * @param {*} rotation Rotation.
     * @param {*} scale Scale.
     * @param {*} isSize Whether or not the scale is a size.
     * @param {*} resources Resources.
     * @param {*} clientToDeleteWith Client to delete entity with.
     */
    this.CreateAutomobileEntity = function(session, entityID, entityTag, path, parentID,
        position, rotation, scale, isSize, mass, meshPosition, meshRotation, wheels,
        clientToDeleteWith) {
        if (isSize) {
            session.AddEntityWithSize(entityID, entityTag, "automobile", path,
                parentID, position, rotation, scale, null,
                null, null, null, null, null, null, null, null, null, null, null,
                null, null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, mass, null,
                meshPosition, meshRotation, null, clientToDeleteWith, null, wheels);
            messageToSend = {
                "message-id": uuidv4(),
                "session-id": session.id,
                "client-id": clientID,
                "entity-id": entityID,
                "tag": entityTag,
                "parent-id": parentID,
                "path": path,
                "position": position,
                "rotation": rotation,
                "size": scale,
                "mass": mass,
                "mesh-position": meshPosition,
                "mesh-rotation": meshRotation,
                "wheels": wheels
            };
            SendMessage("vos/status/" + session.id + "/createautomobileentity", JSON.stringify(messageToSend));
            if (this.automobileEntityCreatedCallback) {
                this.automobileEntityCreatedCallback(messageToSend["session-id"], messageToSend["client-id"],
                    messageToSend["entity-id"], messageToSend["tag"], messageToSend["parent-id"],
                    messageToSend["path"], messageToSend["position"], messageToSend["rotation"], null,
                    messageToSend["size"], messageToSend["mesh-position"], messageToSend["mesh-rotation"],
                    messageToSend["mass"], messageToSend["automobile-entity-type"], messageToSend["wheels"]);
            }
        }
        else {
            session.AddEntityWithScale(entityID, entityTag, "automobile", path,
            parentID, position, rotation, scale, null,
            null, null, null, null, null, null, null, null, null, null, null,
            null, null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
            { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, mass, null,
            meshPosition, meshRotation, null, clientToDeleteWith, null, wheels);
            messageToSend = {
                "message-id": uuidv4(),
                "session-id": session.id,
                "client-id": clientID,
                "entity-id": entityID,
                "tag": entityTag,
                "parent-id": parentID,
                "path": path,
                "position": position,
                "rotation": rotation,
                "scale": scale,
                "mass": mass,
                "mesh-position": meshPosition,
                "mesh-rotation": meshRotation,
                "wheels": wheels
            };
            SendMessage("vos/status/" + session.id + "/createautomobileentity", JSON.stringify(messageToSend));
            if (this.automobileEntityCreatedCallback) {
                this.automobileEntityCreatedCallback(messageToSend["session-id"], messageToSend["client-id"],
                    messageToSend["entity-id"], messageToSend["tag"], messageToSend["parent-id"],
                    messageToSend["path"], messageToSend["position"], messageToSend["rotation"],
                    messageToSend["scale"], null, messageToSend["mesh-position"], messageToSend["mesh-rotation"],
                    messageToSend["mass"], messageToSend["automobile-entity-type"], messageToSend["wheels"]);
            }
        }
    }

    /**
     * @function CreateDropdownEntity Create a Dropdown Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} entityTag Entity Tag.
     * @param {*} path Path.
     * @param {*} parentID Parent ID.
     * @param {*} position Position.
     * @param {*} rotation Rotation.
     * @param {*} scale Scale.
     * @param {*} isSize Whether or not the scale is a size.
     * @param {*} resources Resources.
     * @param {*} clientToDeleteWith Client to delete entity with.
     */
    this.CreateDropdownEntity = function(session, entityID, entityTag, path, parentID,
        positionPercent, sizePercent, onChange, options, clientToDeleteWith) {
        session.AddEntityWithCanvasTransform(entityID, entityTag, "dropdown", null,
            parentID, positionPercent, sizePercent, null,
            null, null, clientToDeleteWith, onChange, options);
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": session.id,
            "client-id": clientID,
            "entity-id": entityID,
            "tag": entityTag,
            "parent-id": parentID,
            "path": path,
            "position-percent": positionPercent,
            "size-percent": sizePercent,
            "on-change": onChange,
            "options": options
        };
        SendMessage("vos/status/" + session.id + "/createdropdownentity", JSON.stringify(messageToSend));
        if (this.dropdownEntityCreatedCallback) {
            this.dropdownEntityCreatedCallback(messageToSend["session-id"], messageToSend["client-id"],
                messageToSend["entity-id"], messageToSend["tag"], messageToSend["parent-id"],
                messageToSend["path"], messageToSend["position-percent"], messageToSend["size-percent"],
                messageToSend["on-change"], messageToSend["options"]);
        }
    }

    /**
     * @function CreateHTMLEntity Create a HTML Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} entityTag Entity Tag.
     * @param {*} path Path.
     * @param {*} parentID Parent ID.
     * @param {*} position Position.
     * @param {*} rotation Rotation.
     * @param {*} scale Scale.
     * @param {*} isSize Whether or not the scale is a size.
     * @param {*} resources Resources.
     * @param {*} clientToDeleteWith Client to delete entity with.
     */
    this.CreateHTMLEntity = function(session, entityID, entityTag, path, parentID,
        position, rotation, scale, isSize, resources, clientToDeleteWith) {
        if (isSize) {
            session.AddEntityWithSize(entityID, entityTag, "html", path,
                parentID, position, rotation, scale, resources,
                null, null, null, null, null, null, null, null, null, null, null,
                null, null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
                null, null, null, clientToDeleteWith, null, null, onMessage);
            messageToSend = {
                "message-id": uuidv4(),
                "session-id": session.id,
                "client-id": clientID,
                "entity-id": entityID,
                "tag": entityTag,
                "parent-id": parentID,
                "path": path,
                "position": position,
                "rotation": rotation,
                "size": scale,
                "on-message": onMessage
            };
            SendMessage("vos/status/" + session.id + "/createhtmlentity", JSON.stringify(messageToSend));
            if (this.htmlEntityCreatedCallback) {
                this.htmlEntityCreatedCallback(messageToSend["session-id"], messageToSend["client-id"],
                    messageToSend["entity-id"], messageToSend["tag"], messageToSend["parent-id"],
                    messageToSend["path"], messageToSend["position"], messageToSend["rotation"], null,
                    messageToSend["size"], messageToSend["on-message"]);
            }
        }
        else {
            session.AddEntityWithScale(entityID, entityTag, "html", path,
            parentID, position, rotation, scale, resources,
            null, null, null, null, null, null, null, null, null, null, null,
            null, null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
            { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
            null, null, null, clientToDeleteWith, null, null, onMessage);
            messageToSend = {
                "message-id": uuidv4(),
                "session-id": session.id,
                "client-id": clientID,
                "entity-id": entityID,
                "tag": entityTag,
                "parent-id": parentID,
                "path": path,
                "position": position,
                "rotation": rotation,
                "scale": scale,
                "on-message": onMessage
            };
            SendMessage("vos/status/" + session.id + "/createhtmlentity", JSON.stringify(messageToSend));
            if (this.htmlEntityCreatedCallback) {
                this.htmlEntityCreatedCallback(messageToSend["session-id"], messageToSend["client-id"],
                    messageToSend["entity-id"], messageToSend["tag"], messageToSend["parent-id"],
                    messageToSend["path"], messageToSend["position"], messageToSend["rotation"],
                    messageToSend["scale"], null, messageToSend["on-message"]);
            }
        }
    }

    /**
     * @function CreateImageEntity Create a Image Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} entityTag Entity Tag.
     * @param {*} path Path.
     * @param {*} parentID Parent ID.
     * @param {*} position Position.
     * @param {*} rotation Rotation.
     * @param {*} scale Scale.
     * @param {*} isSize Whether or not the scale is a size.
     * @param {*} resources Resources.
     * @param {*} clientToDeleteWith Client to delete entity with.
     */
    this.CreateImageEntity = function(session, entityID, entityTag, path, parentID,
        positionPercent, sizePercent, imageFile, clientToDeleteWith) {
        session.AddEntityWithCanvasTransform(entityID, entityTag, "image", imageFile,
            parentID, positionPercent, sizePercent, null, null, null, clientToDeleteWith,
            null, null);
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": session.id,
            "client-id": clientID,
            "entity-id": entityID,
            "tag": entityTag,
            "parent-id": parentID,
            "position-percent": positionPercent,
            "size-percent": sizePercent,
            "image-file": imageFile
        };
        SendMessage("vos/status/" + session.id + "/createimageentity", JSON.stringify(messageToSend));
        if (this.imageEntityCreatedCallbackEntityCreatedCallback) {
            this.imageEntityCreatedCallback(messageToSend["session-id"], messageToSend["client-id"],
                messageToSend["entity-id"], messageToSend["tag"], messageToSend["parent-id"],
                messageToSend["path"], messageToSend["position-percent"], messageToSend["size-percent"],
                messageToSend["image-file"]);
        }
    }

    /**
     * @function SendMessageMessage Send a Message through VSS.
     * @param {*} topic Topic.
     * @param {*} message Message.
     */
    this.SendMessageMessage = function(topic, message) {
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": session.id,
            "client-id": clientID,
            "topic": topic,
            "message": message
        };
        SendMessage("vos/status/" + session.id + "/message/create", JSON.stringify(messageToSend));
        if (this.messageSentCallback) {
            this.messageSentCallback(messageToSend["session-id"], messageToSend["client-id"],
                messageToSend["topic"], messageToSend["message"]);
        }
    }

    /**
     * @function DeleteEntity Delete an Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     */
    this.DeleteEntity = function(session, entityID) {
        session.RemoveEntity(entityID);
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": session.id,
            "client-id": clientID,
            "entity-id": entityID
        };
        SendMessage("vos/status/" + session.id + "/entity/" + entityID + "/delete", JSON.stringify(messageToSend));
        if (this.entityDeletedCallback) {
            this.entityDeletedCallback(messageToSend["session-id"], messageToSend["client-id"],
                messageToSend["entity-id"]);
        }
    }

    /**
     * @function RemoveEntity Remove an Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     */
    this.RemoveEntity = function(session, entityID) {
        session.RemoveEntity(entityID);
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": session.id,
            "client-id": clientID,
            "entity-id": entityID
        };
        SendMessage("vos/status/" + session.id + "/entity/" + entityID + "/remove", JSON.stringify(messageToSend));
        if (this.entityRemovedCallback) {
            this.entityRemovedCallback(messageToSend["session-id"], messageToSend["client-id"],
                messageToSend["entity-id"]);
        }
    }

    /**
     * @function PositionEntity Position an Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} position Position.
     */
    this.PositionEntity = function(session, entityID, position) {
        session.PositionEntity(entityID, position);
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": session.id,
            "client-id": clientID,
            "entity-id": entityID,
            "position": position
        };
        SendMessage("vos/status/" + session.id + "/entity/" + entityID + "/position", JSON.stringify(messageToSend));
        if (this.entityPositionedCallback) {
            this.entityPositionedCallback(messageToSend["session-id"], messageToSend["client-id"],
                messageToSend["entity-id"], messageToSend["position"]);
        }
    }

    /**
     * @function RotateEntity Rotate an Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} rotation Rotation.
     */
    this.RotateEntity = function(session, entityID, rotation) {
        session.RotateEntity(entityID, rotation);
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": session.id,
            "client-id": clientID,
            "entity-id": entityID,
            "rotation": rotation
        };
        SendMessage("vos/status/" + session.id + "/entity/" + entityID + "/rotation", JSON.stringify(messageToSend));
        if (this.entityRotatedCallback) {
            this.entityRotatedCallback(messageToSend["session-id"], messageToSend["client-id"],
                messageToSend["entity-id"], messageToSend["rotation"]);
        }
    }

    /**
     * @function ScaleEntity Scale an Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} scale Scale.
     */
    this.ScaleEntity = function(session, entityID, scale) {
        session.ScaleEntity(entityID, scale);
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": session.id,
            "client-id": clientID,
            "entity-id": entityID,
            "scale": scale
        };
        SendMessage("vos/status/" + session.id + "/entity/" + entityID + "/scale", JSON.stringify(messageToSend));
        if (this.entityScaledCallback) {
            this.entityScaledCallback(messageToSend["session-id"], messageToSend["client-id"],
                messageToSend["entity-id"], messageToSend["scale"]);
        }
    }

    /**
     * @function SizeEntity Size an Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} size Size.
     */
    this.SizeEntity = function(session, entityID, size) {
        session.SizeEntity(entityID, size);
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": session.id,
            "client-id": clientID,
            "entity-id": entityID,
            "size": size
        };
        SendMessage("vos/status/" + session.id + "/entity/" + entityID + "/size", JSON.stringify(messageToSend));
        if (this.entitySizedCallback) {
            this.entitySizedCallback(messageToSend["session-id"], messageToSend["client-id"],
                messageToSend["entity-id"], messageToSend["size"]);
        }
    }

    /**
     * @function ModifyTerrainEntity Modify a Terrain Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} modification Modification.
     * @param {*} position Position.
     * @param {*} brushType Brush Type.
     * @param {*} layer Layer.
     */
    this.ModifyTerrainEntity = function(session, entityID,
        modification, position, brushType, layer) {
        session.ModifyTerrainEntity(entityID, modification, position, brushType, layer);
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": session.id,
            "client-id": clientID,
            "entity-id": entityID,
            "modification": modification,
            "position": position,
            "brush-type": brushType,
            "layer": layer
        };
        SendMessage("vos/status/" + session.id + "/entity/" + entityID + "/terrain-mod", JSON.stringify(messageToSend));
        if (this.terrainEntityModifiedCallback) {
            this.terrainEntityModifiedCallback(messageToSend["session-id"], messageToSend["client-id"],
                messageToSend["entity-id"], messageToSend["modification"], messageToSend["position"],
                messageToSend["brush-type"], messageToSend["layer"]);
        }
    }

    /**
     * @function SetCanvasType Set the Canvas Type of an Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} type Type.
     */
    this.SetCanvasType = function(session, entityID, type) {
        session.SetCanvasType(entityID, type);
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": session.id,
            "client-id": clientID,
            "entity-id": entityID,
            "canvas-type": type
        };
        SendMessage("vos/status/" + session.id + "/entity/" + entityID + "/canvastype", JSON.stringify(messageToSend));
        if (this.entityCanvasTypeSetCallback) {
            this.entityCanvasTypeSetCallback(messageToSend["session-id"], messageToSend["client-id"],
                messageToSend["entity-id"], messageToSend["canvas-type"]);
        }
    }

    /**
     * @function SetHighlightState Set the Highlight State of an Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} highlighted Highlighted.
     */
    this.SetHighlightState = function(session, entityID, highlighted) {
        session.SetHighlightState(entityID, highlighted);
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": session.id,
            "client-id": clientID,
            "entity-id": entityID,
            "highlighted": highlighted
        };
        SendMessage("vos/status/" + session.id + "/entity/" + entityID + "/highlight", JSON.stringify(messageToSend));
        if (this.entityHighlightStateSetCallback) {
            this.entityHighlightStateSetCallback(messageToSend["session-id"], messageToSend["client-id"],
                messageToSend["entity-id"], messageToSend["highlighted"]);
        }
    }

    /**
     * @function SetMotionState Set the Motion State of an Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} angularVelocity Angular Velocity.
     * @param {*} velocity Velocity.
     * @param {*} stationary Stationary.
     */
    this.SetMotionState = function(session, entityID, angularVelocity, velocity, stationary) {
        session.SetMotionState(entityID, angularVelocity, velocity, stationary);
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": session.id,
            "client-id": clientID,
            "entity-id": entityID,
            "angular-velocity": angularVelocity,
            "velocity": velocity,
            "stationary": stationary
        };
        SendMessage("vos/status/" + session.id + "/entity/" + entityID + "/motion", JSON.stringify(messageToSend));
        if (this.entityMotionStateSetCallback) {
            this.entityMotionStateSetCallback(messageToSend["session-id"], messageToSend["client-id"],
                messageToSend["entity-id"], messageToSend["angular-velocity"], messageToSend["velocity"],
                messageToSend["stationary"]);
        }
    }

    /**
     * @function ParentEntity Parent an Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} parentID Parent ID.
     */
    this.ParentEntity = function(session, entityID, parentID) {
        session.ParentEntity(entityID, parentID);
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": session.id,
            "client-id": clientID,
            "entity-id": entityID,
            "parent-id": parentID
        };
        SendMessage("vos/status/" + session.id + "/entity/" + entityID + "/parent", JSON.stringify(messageToSend));
        if (this.parentEntitySetCallback) {
            this.parentEntitySetCallback(messageToSend["session-id"], messageToSend["client-id"],
                messageToSend["entity-id"], messageToSend["parent-id"]);
        }
    }

    /**
     * @function SetPhysicalState Set the Physical State of an Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity.
     * @param {*} angularDrag Angular Drag.
     * @param {*} centerOfMass Center of Mass.
     * @param {*} drag Drag.
     * @param {*} gravitational Gravitational.
     * @param {*} mass Mass.
     */
    this.SetPhysicalState = function(session, entityID, angularDrag, centerOfMass, drag, gravitational, mass) {
        session.SetPhysicalState(entityID, angularDrag, centerOfMass, drag, gravitational, mass);
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": session.id,
            "client-id": clientID,
            "entity-id": entityID,
            "angular-drag": angularDrag,
            "center-of-mass": centerOfMass,
            "drag": drag,
            "gravitational": gravitational,
            "mass": mass
        };
        SendMessage("vos/status/" + session.id + "/entity/" + entityID + "/physicalproperties", JSON.stringify(messageToSend));
        if (this.entityPhysicalStateSetCallback) {
            this.entityPhysicalStateSetCallback(messageToSend["session-id"], messageToSend["client-id"],
                messageToSend["entity-id"], messageToSend["angular-drag"], messageToSend["center-of-mass"],
                messageToSend["drag"], messageToSend["gravitational"], messageToSend["mass"]);
        }
    }

    /**
     * @function SetVisibility Set the Visibility of an Entity.
     * @param {*} session Session.
     * @param {*} entityID Entity ID.
     * @param {*} visibility Visibility.
     */
    this.SetVisibility = function(session, entityID, visibility) {
        session.SetVisibility(entityID, visibility);
        messageToSend = {
            "message-id": uuidv4(),
            "session-id": session.id,
            "client-id": clientID,
            "entity-id": clientTag,
            "visible": visibility
        };
        SendMessage("vos/status/" + session.id + "/entity/" + entityID + "/visibility", JSON.stringify(messageToSend));
        if (this.terrainEntityModifiedCallback) {
            this.terrainEntityModifiedCallback(messageToSend["session-id"], messageToSend["client-id"],
                messageToSend["entity-id"], messageToSend["visible"]);
        }
    }

    /**
     * @function GetSessions Get Sessions.
     * @returns All synchronized Sessions.
     */
    this.GetSessions = function() {
        return GetSynchronizedSessions();
    }

    /**
     * @function GetSessionTags Get Session Tags.
     * @returns All synchronized Session Tags.
     */
    this.GetSessionTags = function() {
        return GetSynchronizedSessionTags();
    }

    /**
     * @function GetSession Get a Session.
     * @param {*} id ID.
     * @returns Session with ID, or null.
     */
    this.GetSession = function(id) {
        return GetSynchronizedSession(id);
    }

    /**
     * @function SendMessage Send a Message.
     * @param {*} topic Topic.
     * @param {*} message Message.
     */
    this.SendMessage = function(topic, message) {
        SendMessage(topic, message);
    }

    /**
     * @function ProcessMessage Process a Message.
     * @param {*} topic Topic.
     * @param {*} message Message.
     */
    async function ProcessMessage(topic, message) {
        //Log(`[VOSSynchronizationService] ${topic} ${message}`);
        parsedMessage = JSON.parse(message);
        switch (topic.toLowerCase()) {
            case "vos/session/create":
                HandleCreateSessionMessage(JSON.parse(message));
                returnTopic = "vos/session/new";
                returnMessage = message;
                returnMessage["message-id"] = uuidv4();
                delete returnMessage["client-id"];
                delete returnMessage["client-token"];
                SendMessage(returnTopic, returnMessage);
                if (this.sessionCreatedCallback) {
                    this.sessionCreatedCallback(returnMessage["session-id"],
                        returnMessage["session-tag"]);
                }
                break;

            case "vos/session/destroy":
                HandleDestroySessionMessage(JSON.parse(message));
                returnTopic = "vos/session/closed"
                returnMessage = message;
                returnMessage["message-id"] = uuidv4();
                delete returnMessage["client-id"];
                delete returnMessage["client-token"];
                SendMessage(returnTopic, returnMessage);
                if (this.sessionDeletedCallback) {
                    this.sessionDeletedCallback(returnMessage["session-id"]);
                }
                break;

            case "vos/session/join":
                result = await this.HandleJoinSessionMessage(JSON.parse(message));
                returnTopic = `vos/status/${parsedMessage["session-id"]}/newclient`;
                returnMessage = message;
                returnMessage["message-id"] = uuidv4();
                delete returnMessage["client-token"];
                SendMessage(returnTopic, returnMessage);
                if (this.sessionJoinedCallback) {
                    this.sessionJoinedCallback(returnMessage["session-id"], returnMessage["client-id"],
                        returnMessage["client-tag"]);
                }
                break;
            
            case "vos/session/exit":
                HandleExitSessionMessage(JSON.parse(message));
                returnTopic = `vos/status/${parsedMessage["session-id"]}/clientleft`;
                returnMessage = message;
                returnMessage["message-id"] = uuidv4();
                delete returnMessage["client-token"];
                SendMessage(returnTopic, returnMessage);
                if (this.sessionExitedCallback) {
                    this.sessionExitedCallback(returnMessage["session-id"], returnMessage["client-id"]);
                }
                break;

            case "vos/session/heartbeat":
                HandleHeartbeatMessage(JSON.parse(message));
                break;

            case "vos/session/getstate":
                state = HandleSessionStateMessage(JSON.parse(message));
                returnTopic = `vos/status/${parsedMessage["session-id"]}/state`;
                returnMessage = JSON.parse(message);
                returnMessage["message-id"] = uuidv4();
                delete returnMessage["client-id"];
                delete returnMessage["client-token"];
                if (state != null) {
                    clients = [];
                    state.clients.forEach(cl => {
                        let clientToAdd = {};
                        clientToAdd["id"] = cl["uuid"];
                        clientToAdd["tag"] = cl["tag"];
                        clients.push(clientToAdd);
                    });
                    returnMessage["clients"] = clients;
                    entities = [];
                    state.entities.forEach(entity => {
                        let entityToAdd = {};
                        entityToAdd["id"] = entity.uuid;
                        entityToAdd["tag"] = entity.tag;
                        entityToAdd["type"] = entity.type;
                        entityToAdd["path"] = entity.path;
                        entityToAdd["model-offset"] = entity.modelOffset;
                        entityToAdd["model-rotation"] = entity.modelRotation;
                        entityToAdd["label-offset"] = entity.labelOffset;
                        if (entity.parent == null) {
                            entityToAdd["parent-id"] = null;
                        }
                        else {
                            entityToAdd["parent-id"] = entity.parent.uuid;
                        }
                        entityToAdd["position"] = entity.position;
                        entityToAdd["rotation"] = entity.rotation;
                        if (entityToAdd.isSize) {
                            entityToAdd["size"] = entity.scalesize;
                            entityToAdd["scale"] = null;
                        }
                        else {
                            entityToAdd["size"] = null;
                            entityToAdd["scale"] = entity.scalesize;
                        }
                        entities.push(entityToAdd);
                    });
                    returnMessage["entities"] = entities;
                }
                SendMessage(returnTopic, JSON.stringify(returnMessage));
                break;

            case "vos/session/message":
                result = HandleSessionMessage(JSON.parse(message));
                if (result && result.broadcast) {
                    returnTopic = `vos/status/${parsedMessage["session-id"]}/message`;
                    returnMessage = JSON.parse(message);
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-token"];
                    SendMessage(returnTopic, JSON.stringify(returnMessage));
                    if (this.sessionMessageCallback) {
                        this.sessionMessageCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["type"], returnMessage["content"]);
                    }
                }
                break;

            default:
                if (topic.startsWith("vos/request") && topic.endsWith("/createcontainerentity")) {
                    sessionUUID = topic.replace("vos/request/", "").replace("/createcharacterentity", "");
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = HandleCreateContainerEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request/", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    message["entity-id"] = entityUUID;
                    SendMessage(returnTopic, returnMessage);
                    if (this.containerEntityCreatedCallback) {
                        this.containerEntityCreatedCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["tag"], returnMessage["parent-id"],
                            returnMessage["position"], returnMessage["rotation"], returnMessage["scale"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("/createcharacterentity")) {
                    sessionUUID = topic.replace("vos/request/", "").replace("/createcharacterentity", "");
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = HandleCreateCharacterEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request/", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    message["entity-id"] = entityUUID;
                    SendMessage(returnTopic, returnMessage);
                    if (this.characterEntityCreatedCallback) {
                        this.characterEntityCreatedCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["tag"], returnMessage["parent-id"],
                            returnMessage["path"], returnMessage["model-offset"], returnMessage["model-rotation"],
                            returnMessage["label-offset"], returnMessage["position"], returnMessage["rotation"],
                            returnMessage["scale"], returnMessage["size"]);
                    }
                }    
                else if (topic.startsWith("vos/request/") && topic.endsWith("/createmeshentity")) {
                    sessionUUID = topic.replace("vos/request/", "").replace("/createmeshentity", "");
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = HandleCreateMeshEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request/", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    message["entity-id"] = entityUUID;
                    SendMessage(returnTopic, returnMessage);
                    if (this.meshEntityCreatedCallback) {
                        this.meshEntityCreatedCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["tag"], returnMessage["parent-id"],
                            returnMessage["path"], returnMessage["resources"], returnMessage["position"],
                            returnMessage["rotation"], returnMessage["scale"], returnMessage["size"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("/createbuttonentity")) {
                    sessionUUID = topic.replace("vos/request/", "").replace("/createbuttonentity", "");
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = HandleCreateButtonEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request/", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    message["entity-id"] = entityUUID;
                    SendMessage(returnTopic, returnMessage);
                    if (this.buttonEntityCreatedCallback) {
                        this.buttonEntityCreatedCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["tag"], returnMessage["parent-id"],
                            returnMessage["path"], returnMessage["position-percent"], returnMessage["rotation-percent"],
                            returnMessage["on-click"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("/createcanvasentity")) {
                    sessionUUID = topic.replace("vos/request/", "").replace("/createcanvasentity", "");
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = HandleCreateCanvasEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request/", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    message["entity-id"] = entityUUID;
                    SendMessage(returnTopic, returnMessage);
                    if (this.canvasEntityCreatedCallback) {
                        this.canvasEntityCreatedCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["tag"], returnMessage["parent-id"],
                            returnMessage["path"], returnMessage["position"], returnMessage["rotation"],
                            returnMessage["scale"], returnMessage["size"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("/createinputentity")) {
                    sessionUUID = topic.replace("vos/request/", "").replace("/createinputentity", "");
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = HandleCreateInputEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request/", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    message["entity-id"] = entityUUID;
                    SendMessage(returnTopic, returnMessage);
                    if (this.inputEntityCreatedCallback) {
                        this.inputEntityCreatedCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["tag"], returnMessage["parent-id"],
                            returnMessage["path"], returnMessage["position-percent"], returnMessage["size-percent"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("/createlightentity")) {
                    sessionUUID = topic.replace("vos/request/", "").replace("/createlightentity", "");
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = HandleCreateLightEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request/", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    message["entity-id"] = entityUUID;
                    SendMessage(returnTopic, returnMessage);
                    if (this.lightEntityCreatedCallback) {
                        this.lightEntityCreatedCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["tag"], returnMessage["parent-id"],
                            returnMessage["path"], returnMessage["position"], returnMessage["rotation"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("/createterrainentity")) {
                    sessionUUID = topic.replace("vos/request/", "").replace("/createterrainentity", "");
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = HandleCreateTerrainEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request/", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    message["entity-id"] = entityUUID;
                    SendMessage(returnTopic, returnMessage);
                    if (this.terrainEntityCreatedCallback) {
                        this.terrainEntityCreatedCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["tag"], returnMessage["parent-id"],
                            returnMessage["path"], returnMessage["position"], returnMessage["rotation"], 
                            returnMessage["length"], returnMessage["width"], returnMessage["height"],
                            returnMessage["heights"], returnMessage["diffuse-texture"], returnMessage["normal-texture"],
                            returnMessage["mask-texture"], returnMessage["specular-values"],
                            returnMessage["metallic-values"], returnMessage["smoothness-values"],
                            returnMessage["layer-mask"], returnMessage["type"], returnMessage["modifications"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("/createtextentity")) {
                    sessionUUID = topic.replace("vos/request/", "").replace("/createtextentity", "");
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = HandleCreateTextEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request/", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    message["entity-id"] = entityUUID;
                    SendMessage(returnTopic, returnMessage);
                    if (this.textEntityCreatedCallback) {
                        this.textEntityCreatedCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["tag"], returnMessage["parent-id"],
                            returnMessage["path"], returnMessage["position-percent"],
                            returnMessage["size-percent"], returnMessage["text"], returnMessage["font-size"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("/createvoxelentity")) {
                    sessionUUID = topic.replace("vos/request/", "").replace("/createvoxelentity", "");
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = HandleCreateVoxelEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request/", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    message["entity-id"] = entityUUID;
                    SendMessage(returnTopic, returnMessage);
                    if (this.voxelEntityCreatedCallback) {
                        this.voxelEntityCreatedCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["tag"], returnMessage["parent-id"],
                            returnMessage["path"], returnMessage["position"], returnMessage["rotation"], null,
                            returnMessage["size"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("/createairplaneentity")) {
                    sessionUUID = topic.replace("vos/request/", "").replace("/createairplaneentity", "");
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = HandleCreateAirplaneEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request/", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    message["entity-id"] = entityUUID;
                    SendMessage(returnTopic, returnMessage);
                    if (this.airplaneEntityCreatedCallback) {
                        this.airplaneEntityCreatedCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["tag"], returnMessage["parent-id"],
                            returnMessage["path"], returnMessage["position"], returnMessage["rotation"], null,
                            returnMessage["size"], returnMessage["mesh-position"], returnMessage["mesh-rotation"],
                            returnMessage["mass"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("/createaudioentity")) {
                    sessionUUID = topic.replace("vos/request/", "").replace("/createaudioentity", "");
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = HandleCreateAudioEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request/", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    message["entity-id"] = entityUUID;
                    SendMessage(returnTopic, returnMessage);
                    if (this.audioEntityCreatedCallback) {
                        this.audioEntityCreatedCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["tag"], returnMessage["parent-id"],
                            returnMessage["path"], returnMessage["position"], returnMessage["rotation"], null,
                            returnMessage["size"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("/createautomobileentity")) {
                    sessionUUID = topic.replace("vos/request/", "").replace("/createautomobileentity", "");
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = HandleCreateAutomobileEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request/", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    message["entity-id"] = entityUUID;
                    SendMessage(returnTopic, returnMessage);
                    if (this.automobileEntityCreatedCallback) {
                        this.automobileEntityCreatedCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["tag"], returnMessage["parent-id"],
                            returnMessage["path"], returnMessage["position"], returnMessage["rotation"], null,
                            returnMessage["size"], returnMessage["mesh-position"], returnMessage["mesh-rotation"],
                            returnMessage["mass"], returnMessage["automobile-entity-type"], returnMessage["wheels"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("/createdropdownentity")) {
                    sessionUUID = topic.replace("vos/request/", "").replace("/createdropdownentity", "");
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = HandleCreateDropdownEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request/", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    message["entity-id"] = entityUUID;
                    SendMessage(returnTopic, returnMessage);
                    if (this.dropdownEntityCreatedCallback) {
                        this.dropdownEntityCreatedCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["tag"], returnMessage["parent-id"],
                            returnMessage["path"], returnMessage["position-percent"], returnMessage["size-percent"],
                            returnMessage["on-change"], returnMessage["options"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("/createhtmlentity")) {
                    sessionUUID = topic.replace("vos/request/", "").replace("/createhtmlentity", "");
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = HandleCreateHTMLEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request/", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    message["entity-id"] = entityUUID;
                    SendMessage(returnTopic, returnMessage);
                    if (this.htmlEntityCreatedCallback) {
                        this.htmlEntityCreatedCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["tag"], returnMessage["parent-id"],
                            returnMessage["path"], returnMessage["position"], returnMessage["rotation"], null,
                            returnMessage["size"], returnMessage["on-message"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("/createimageentity")) {
                    sessionUUID = topic.replace("vos/request/", "").replace("/createimageentity", "");
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = HandleCreateImageEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request/", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    message["entity-id"] = entityUUID;
                    SendMessage(returnTopic, returnMessage);
                    if (this.imageEntityCreatedCallback) {
                        this.imageEntityCreatedCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["tag"], returnMessage["parent-id"],
                            returnMessage["path"], returnMessage["position-percent"],
                            returnMessage["size-percent"], returnMessage["image-file"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("/message/create")) {
                    sessionUUID = topic.replace("vos/request/", "").replace("/message/create", "");
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = HandleSendMessageMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request/", "vos/status/").replace("/message/create", "/message/new");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    message["entity-id"] = entityUUID;
                    SendMessage(returnTopic, returnMessage);
                    if (this.messageSentCallback) {
                        this.messageSentCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["topic"], returnMessage["message"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("delete")) {
                    ids = topic.replace("vos/request/", "").replace("/delete", "").split("/entity/");
                    if (ids.length != 2) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Invalid message topic ${topic}`);
                        return;
                    }
                    sessionUUID = ids[0];
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = ids[1];
                    HandleDeleteEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    SendMessage(returnTopic, returnMessage);
                    if (this.entityDeletedCallback) {
                        this.entityDeletedCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("remove")) {
                    ids = topic.replace("vos/request/", "").replace("/remove", "").split("/entity/");
                    if (ids.length != 2) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Invalid message topic ${topic}`);
                        return;
                    }
                    sessionUUID = ids[0];
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = ids[1];
                    HandleRemoveEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    SendMessage(returnTopic, returnMessage);
                    if (this.entityRemovedCallback) {
                        this.entityRemovedCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("position")) {
                    ids = topic.replace("vos/request/", "").replace("/position", "").split("/entity/");
                    if (ids.length != 2) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Invalid message topic ${topic}`);
                        return;
                    }
                    sessionUUID = ids[0];
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = ids[1];
                    HandlePositionEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request/", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    SendMessage(returnTopic, returnMessage);
                    if (this.entityPositionedCallback) {
                        this.entityPositionedCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["position"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("rotation")) {
                    ids = topic.replace("vos/request/", "").replace("/rotation", "").split("/entity/");
                    if (ids.length != 2) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Invalid message topic ${topic}`);
                        return;
                    }
                    sessionUUID = ids[0];
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = ids[1];
                    HandleRotateEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request/", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    SendMessage(returnTopic, returnMessage);
                    if (this.entityRotatedCallback) {
                        this.entityRotatedCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["rotation"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("scale")) {
                    ids = topic.replace("vos/request/", "").replace("/scale", "").split("/entity/");
                    if (ids.length != 2) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Invalid message topic ${topic}`);
                        return;
                    }
                    sessionUUID = ids[0];
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = ids[1];
                    HandleScaleEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    SendMessage(returnTopic, returnMessage);
                    if (this.entityScaledCallback) {
                        this.entityScaledCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["scale"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("size")) {
                    ids = topic.replace("vos/request/", "").replace("/size", "").split("/entity/");
                    if (ids.length != 2) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Invalid message topic ${topic}`);
                        return;
                    }
                    sessionUUID = ids[0];
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = ids[1];
                    HandleSizeEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    SendMessage(returnTopic, returnMessage);
                    if (this.entitySizedCallback) {
                        this.entitySizedCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["size"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("terrain-mod")) {
                    ids = topic.replace("vos/request/", "").replace("/terrain-mod", "").split("/entity/");
                    if (ids.length != 2) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Invalid message topic ${topic}`);
                        return;
                    }
                    sessionUUID = ids[0];
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = ids[1];
                    HandleModifyTerrainEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    SendMessage(returnTopic, returnMessage);
                    if (this.terrainEntityModifiedCallback) {
                        this.terrainEntityModifiedCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["modification"], returnMessage["position"],
                            returnMessage["brush-type"], returnMessage["layer"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("canvastype")) {
                    ids = topic.replace("vos/request/", "").replace("/canvastype", "").split("/entity/");
                    if (ids.length != 2) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Invalid message topic ${topic}`);
                        return;
                    }
                    sessionUUID = ids[0];
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = ids[1];
                    HandleCanvasTypeEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    SendMessage(returnTopic, returnMessage);
                    if (this.entityCanvasTypeSetCallback) {
                        this.entityCanvasTypeSetCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["canvas-type"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("highlight")) {
                    ids = topic.replace("vos/request/", "").replace("/highlight", "").split("/entity/");
                    if (ids.length != 2) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Invalid message topic ${topic}`);
                        return;
                    }
                    sessionUUID = ids[0];
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = ids[1];
                    HandleHighlightStateEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    SendMessage(returnTopic, returnMessage);
                    if (this.entityHighlightStateSetCallback) {
                        this.entityHighlightStateSetCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["highlighted"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("motion")) {
                    ids = topic.replace("vos/request/", "").replace("/motion", "").split("/entity/");
                    if (ids.length != 2) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Invalid message topic ${topic}`);
                        return;
                    }
                    sessionUUID = ids[0];
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = ids[1];
                    HandleMotionEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    SendMessage(returnTopic, returnMessage);
                    if (this.entityMotionStateSetCallback) {
                        this.entityMotionStateSetCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["angular-velocity"], returnMessage["velocity"],
                            returnMessage["stationary"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("parent")) {
                    ids = topic.replace("vos/request/", "").replace("/parent", "").split("/entity/");
                    if (ids.length != 2) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Invalid message topic ${topic}`);
                        return;
                    }
                    sessionUUID = ids[0];
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = ids[1];
                    HandleParentEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    SendMessage(returnTopic, returnMessage);
                    if (this.parentEntitySetCallback) {
                        this.parentEntitySetCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["parent-id"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("physicalproperties")) {
                    ids = topic.replace("vos/request/", "").replace("/physicalproperties", "").split("/entity/");
                    if (ids.length != 2) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Invalid message topic ${topic}`);
                        return;
                    }
                    sessionUUID = ids[0];
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = ids[1];
                    HandlePhysicalPropertiesEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    SendMessage(returnTopic, returnMessage);
                    if (this.entityPhysicalStateSetCallback) {
                        this.entityPhysicalStateSetCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["angular-drag"], returnMessage["center-of-mass"],
                            returnMessage["drag"], returnMessage["gravitational"], returnMessage["mass"]);
                    }
                }
                else if (topic.startsWith("vos/request/") && topic.endsWith("visibility")) {
                    ids = topic.replace("vos/request/", "").replace("/visibility", "").split("/entity/");
                    if (ids.length != 2) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Invalid message topic ${topic}`);
                        return;
                    }
                    sessionUUID = ids[0];
                    session = GetSynchronizedSession(sessionUUID);
                    if (session == null) {
                        console.error(`[VOSSynchronizationService->ProcessMessage] Unknown session ID ${sessionUUID}`);
                        return;
                    }
                    entityUUID = ids[1];
                    HandleVisibilityEntityMessage(session, JSON.parse(message));
                    returnTopic = topic.replace("vos/request", "vos/status/");
                    returnMessage = message;
                    returnMessage["message-id"] = uuidv4();
                    delete returnMessage["client-id"];
                    delete returnMessage["client-token"];
                    SendMessage(returnTopic, returnMessage);
                    if (this.terrainEntityModifiedCallback) {
                        this.terrainEntityModifiedCallback(returnMessage["session-id"], returnMessage["client-id"],
                            returnMessage["entity-id"], returnMessage["visible"]);
                    }
                }
                else {
                    //Log(`[VOSSynchronizationService] Skipping message topic ${topic}`);
                    return;
                }
        };
    };

    /**
     * @function SendMessage Send a Message.
     * @param {*} topic Topic.
     * @param {*} message Message.
     */
    function SendMessage(topic, message) {
        if (client == null) {
            console.error("[VOSSynchronizationServer->SendMessageOnMQTT] No client.");
            return;
        }
        client.publish(topic, message);
    }
    
    /**
     * @function GetSynchronizedSessions Get Synchronized Sessions.
     * @returns All Synchronized Sessions.
     */
    function GetSynchronizedSessions() {
        let sessionInfos = [];
        for (session in vosSynchronizationSessions) {
            sessionInfos.push({
                "id": vosSynchronizationSessions[session].id,
                "tag": vosSynchronizationSessions[session].tag
            });
        }
        return sessionInfos;
    }

    /**
     * @function GetSynchronizedSessionTags Get Synchronized Session Tags.
     * @returns All Synchronized Session Tags.
     */
    function GetSynchronizedSessionTags() {
        let sessionInfos = [];
        for (session in vosSynchronizationSessions) {
            sessionInfos.push(vosSynchronizationSessions[session].tag);
        }
        return sessionInfos;
    }

    /**
     * @function CreateSynchronizedSession Create a synchronized Session.
     * @param {*} id ID.
     * @param {*} tag Tag.
     */
    function CreateSynchronizedSession(id, tag) {
        vosSynchronizationSessions[id] = new vosSynchronizationSession(id, tag);
    }

    /**
     * @function DestroySynchronizedSession Destroy a synchronized Session.
     * @param {*} id ID.
     */
    function DestroySynchronizedSession(id) {
        for (session in vosSynchronizationSessions) {
            if (session == id) {
                delete vosSynchronizationSessions[session];
            }
        }
    }
    
    /**
     * @function GetSynchronizedSession Get a Synchronized Session.
     * @param {*} id ID.
     * @returns Session with ID, or null.
     */
    function GetSynchronizedSession(id) {
        if (vosSynchronizationSessions[id] == null) {
            console.warn(`Session ${id} does not exist`);
            return;
        }
        return vosSynchronizationSessions[id];
    }

    /**
     * @function HandleCreateSessionMessage Handle a Create Session Message.
     * @param {*} data Data.
     */
    function HandleCreateSessionMessage(data) {
        if (!data.hasOwnProperty("session-id")) {
            console.warn("[VOSSynchronizationService] Create Session Message does not contain: session-id");
            return;
        }
        if (!data.hasOwnProperty("session-tag")) {
            console.warn("[VOSSynchronizationService] Create Session Message does not contain: session-tag");
            return;
        }
        if (!data.hasOwnProperty("client-id")) {
            console.warn("[VOSSynchronizationService] Create Session Message does not contain: client-id");
            return;
        }
        if (CanCreateSession(data["client-id"], data["client-token"])) {
            Log(`[VOSSynchronizationService] Creating session ${data["session-id"]}, ${data["session-tag"]}`);
            CreateSynchronizedSession(data["session-id"], data["session-tag"]);
        }
        else {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to create a session`);
            return;
        }
    }

    /**
     * @function HandleDestroySessionMessage Handle a Destroy Session Message.
     * @param {*} data Data.
     */
    function HandleDestroySessionMessage(data) {
        if (!data.hasOwnProperty("session-id")) {
            console.warn("[VOSSynchronizationService] Destroy Session Message does not contain: session-id");
            return;
        }
        if (!data.hasOwnProperty("client-id")) {
            console.warn("[VOSSynchronizationService] Create Session Message does not contain: client-id");
            return;
        }
        if (CanDestroySession(data["client-id"], data["client-token"])) {
            Log(`[VOSSynchronizationService] Destroying session ${data["session-id"]}`);
            DestroySynchronizedSession(data["session-id"], data["session-tag"]);
        }
        else {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to destroy a session`);
            return;
        }
    }

    /**
     * @function HandleJoinSessionMessage Handle a Join Session Message.
     * @param {*} data Data.
     */
   this.HandleJoinSessionMessage = async function(data) {
        if (!data.hasOwnProperty("session-id")) {
            console.warn("[VOSSynchronizationService] Join Session Message does not contain: session-id");
            return false;
        }
        if (!data.hasOwnProperty("client-id")) {
            console.warn("[VOSSynchronizationService] Join Session Message does not contain: client-id");
            return false;
        }
        if (!data.hasOwnProperty("client-tag")) {
            console.warn("[VOSSynchronizationService] Join Session Message does not contain: client-tag");
            return false;
        }
        if (await CanJoinSession(data["client-id"], data["client-token"], data["session-id"], this.joinSessionAuthCallback)) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]}:${data["client-tag"]} is joining session ${data["session-id"]}`);
            sessionToJoin = GetSynchronizedSession(data["session-id"]);
            if (sessionToJoin == null) {
                console.warn("[VOSSynchronizationService] Unable to find session to join");
                return false;
            }
            sessionToJoin.AddClient(data["client-id"], data["client-tag"]);
            return true;
        }
        else {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to join session ${data["session-id"]}`);
            return false;
        }
    }

    /**
     * @function HandleExitSessionMessage Handle an Exit Session Message.
     * @param {*} data Data.
     */
    function HandleExitSessionMessage(data) {
        if (!data.hasOwnProperty("session-id")) {
            console.warn("[VOSSynchronizationService] Exit Session Message does not contain: session-id");
            return;
        }
        if (!data.hasOwnProperty("client-id")) {
            console.warn("[VOSSynchronizationService] Exit Session Message does not contain: client-id");
            return;
        }
        if (CanExitSession(data["client-id"], data["client-token"], data["session-id"])) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is exiting session ${data["session-id"]}`);
            sessionToExit = GetSynchronizedSession(data["session-id"]);
            if (sessionToJoin == null) {
                //console.warn("[VOSSynchronizationService] Unable to find session to exit");
                return;
            }
            sessionToExit.RemoveClient(data["client-id"]);
        }
        else {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to exit session ${data["session-id"]}`);
            return;
        }
    }

    /**
     * @function HandleHeartbeatMessage Handle a Heartbeat Message.
     * @param {*} data Data.
     */
    function HandleHeartbeatMessage(data) {
        if (!data.hasOwnProperty("session-id")) {
            console.warn("[VOSSynchronizationService] Heartbeat Message does not contain: session-id");
            return;
        }
        if (!data.hasOwnProperty("client-id")) {
            console.warn("[VOSSynchronizationService] Heartbeat Message does not contain: client-id");
            return;
        }
        if (CanGiveHeartbeat(data["client-id"], data["client-token"], data["session-id"])) {
            //Log(`[VOSSynchronizationService] Client ${data["client-id"]} gave heartbeat for session ${data["session-id"]}`);
            sessionToHeartbeat = GetSynchronizedSession(data["session-id"]);
            if (sessionToHeartbeat == null) {
                console.warn("[VOSSynchronizationService] Unable to find session to exit");
                return;
            }
            sessionToHeartbeat.UpdateHeartbeat(data["client-id"]);
        }
        else {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to heartbeat session ${data["session-id"]}`);
        }
    }

    /**
     * @function HandleSessionStateMessage Handle a Session State Message.
     * @param {*} data Data.
     */
    function HandleSessionStateMessage(data) {
        if (!data.hasOwnProperty("session-id")) {
            console.warn("[VOSSynchronizationService] Session State Message does not contain: session-id");
            return;
        }
        if (!data.hasOwnProperty("client-id")) {
            console.warn("[VOSSynchronizationService] Session State Message does not contain: client-id");
            return;
        }
        if (CanGetSessionState(data["client-id"], data["client-token"], data["session-id"])) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is requesting session ${data["session-id"]} state`);
            sessionToGetStateFor = GetSynchronizedSession(data["session-id"]);
            if (sessionToGetStateFor == null) {
                console.warn("[VOSSynchronizationService] Unable to find session to get state for");
                return;
            }
            return sessionToGetStateFor;
        }
        else {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to get session ${data["session-id"]} state`);
            return;
        }
    }

    /**
     * @function HandleCreateContainerEntityMessage Handle a Create Container Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleCreateContainerEntityMessage(session, data) {
        if (!data.hasOwnProperty("delete-with-client")) {
            console.warn("[VOSSynchronizationService] Create Container Entity Message does not contain: delete-with-client");
            return;
        }
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Create Container Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("tag")) {
            console.warn("[VOSSynchronizationService] Create Container Entity Message does not contain: tag");
            return;
        }
        if (!data.hasOwnProperty("position")) {
            console.warn("[VOSSynchronizationService] Create Container Entity Message does not contain: position");
            return;
        }
        else {
            if (!data.position.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Container Entity Message does not contain: position.x");
                return;
            }
            if (!data.position.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Container Entity Message does not contain: position.y");
                return;
            }
            if (!data.position.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Container Entity Message does not contain: position.z");
                return;
            }
        }
        if (!data.hasOwnProperty("rotation")) {
            console.warn("[VOSSynchronizationService] Create Container Entity Message does not contain: rotation");
            return;
        }
        else {
            if (!data.rotation.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Container Entity Message does not contain: rotation.x");
                return;
            }
            if (!data.rotation.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Container Entity Message does not contain: rotation.y");
                return;
            }
            if (!data.rotation.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Container Entity Message does not contain: rotation.z");
                return;
            }
            if (!data.rotation.hasOwnProperty("w")) {
                console.warn("[VOSSynchronizationService] Create Container Entity Message does not contain: rotation.w");
                return;
            }
        }
        if (session == null) {
            console.warn("[VOSSynchronizationService] No session to create entity in");
            return;
        }
        if (!CanCreateContainerEntity(data["client-id"], data["client-token"], session.id)) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to create a container entity in session ${session.id}`);
            return;
        }
        clientToDeleteWith = null;
        if (data["delete-with-client"] == true) {
            clientToDeleteWith = data["client-id"];
        }
        
        entityuuid = data["entity-id"];
        if (data.hasOwnProperty("scale")) {
            if (!data.scale.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Container Entity Message does not contain: scale.x");
                return;
            }
            if (!data.scale.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Container Entity Message does not contain: scale.y");
                return;
            }
            if (!data.scale.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Container Entity Message does not contain: scale.z");
                return;
            }
            session.AddEntityWithScale(entityuuid, data.tag, "container", null,
                data["parent-uuid"], data.position, data.rotation, data.scale, null,
                null, null, null, null, null, null, null, null, null, null, null, null,
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
                null, null, null, clientToDeleteWith, null, null);
            return entityuuid;
        }
        else if (data.hasOwnProperty("size")) {
            if (!data.size.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Container Entity Message does not contain: size.x");
                return;
            }
            if (!data.size.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Container Entity Message does not contain: size.y");
                return;
            }
            if (!data.size.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Container Entity Message does not contain: size.z");
                return;
            }
            session.AddEntityWithSize(entityuuid, data.tag, "container", null,
                data["parent-uuid"], data.position, data.rotation, data.scale, null,
                null, null, null, null, null, null, null, null, null, null, null, null,
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
                null, null, null, clientToDeleteWith, null, null);
            return entityuuid;
        }
        else {
            console.warn("[VOSSynchronizationService] Create Container Entity Message does not contain: scale");
            return;
        }
    }

    /**
     * @function HandleCreateMeshEntityMessage Handle a Create Mesh Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleCreateMeshEntityMessage(session, data) {
        if (!data.hasOwnProperty("delete-with-client")) {
            console.warn("[VOSSynchronizationService] Create Mesh Entity Message does not contain: delete-with-client");
            return;
        }
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Create Mesh Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("tag")) {
            console.warn("[VOSSynchronizationService] Create Mesh Entity Message does not contain: tag");
            return;
        }
        if (!data.hasOwnProperty("path")) {
            console.warn("[VOSSynchronizationService] Create Mesh Entity Message does not contain: path");
            return;
        }
        if (!data.hasOwnProperty("position")) {
            console.warn("[VOSSynchronizationService] Create Mesh Entity Message does not contain: position");
            return;
        }
        else {
            if (!data.position.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Mesh Entity Message does not contain: position.x");
                return;
            }
            if (!data.position.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Mesh Entity Message does not contain: position.y");
                return;
            }
            if (!data.position.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Mesh Entity Message does not contain: position.z");
                return;
            }
        }
        if (!data.hasOwnProperty("rotation")) {
            console.warn("[VOSSynchronizationService] Create Mesh Entity Message does not contain: rotation");
            return;
        }
        else {
            if (!data.rotation.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Mesh Entity Message does not contain: rotation.x");
                return;
            }
            if (!data.rotation.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Mesh Entity Message does not contain: rotation.y");
                return;
            }
            if (!data.rotation.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Mesh Entity Message does not contain: rotation.z");
                return;
            }
            if (!data.rotation.hasOwnProperty("w")) {
                console.warn("[VOSSynchronizationService] Create Mesh Entity Message does not contain: rotation.w");
                return;
            }
        }
        if (session == null) {
            console.warn("[VOSSynchronizationService] No session to create entity in");
            return;
        }
        if (!CanCreateMeshEntity(data["client-id"], data["client-token"], session.id)) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to create a mesh entity in session ${session.id}`);
            return;
        }
        clientToDeleteWith = null;
        if (data["delete-with-client"] == true) {
            clientToDeleteWith = data["client-id"];
        }
        
        entityuuid = data["entity-id"];
        if (data.hasOwnProperty("scale")) {
            if (!data.scale.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Mesh Entity Message does not contain: scale.x");
                return;
            }
            if (!data.scale.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Mesh Entity Message does not contain: scale.y");
                return;
            }
            if (!data.scale.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Mesh Entity Message does not contain: scale.z");
                return;
            }
            session.AddEntityWithScale(entityuuid, data.tag, "mesh", data.path,
                data["parent-uuid"], data.position, data.rotation, data.scale, data.resources,
                null, null, null, null, null, null, null, null, null, null, null, null,
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
                null, null, null, clientToDeleteWith, null, null);
            return entityuuid;
        }
        else if (data.hasOwnProperty("size")) {
            if (!data.size.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Mesh Entity Message does not contain: size.x");
                return;
            }
            if (!data.size.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Mesh Entity Message does not contain: size.y");
                return;
            }
            if (!data.size.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Mesh Entity Message does not contain: size.z");
                return;
            }
            session.AddEntityWithSize(entityuuid, data.tag, "mesh", data.path,
                data["parent-uuid"], data.position, data.rotation, data.scale, data.resources,
                null, null, null, null, null, null, null, null, null, null, null, null,
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
                null, null, null, clientToDeleteWith, null, null);
            return entityuuid;
        }
        else {
            console.warn("[VOSSynchronizationService] Create Mesh Entity Message does not contain: scale");
            return;
        }
    }

    /**
     * @function HandleCreateCharacterEntityMessage Handle a Create Character Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleCreateCharacterEntityMessage(session, data) {
        if (!data.hasOwnProperty("delete-with-client")) {
            console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: delete-with-client");
            return;
        }
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("tag")) {
            console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: tag");
            return;
        }
        if (!data.hasOwnProperty("path")) {
            console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: path");
            return;
        }
        if (!data.hasOwnProperty("model-offset")) {
            console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: model-offset");
            return;
        }
        else {
            if (!data["model-offset"].hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: model-offset.x");
                return;
            }
            if (!data["model-offset"].hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: model-offset.y");
                return;
            }
            if (!data["model-offset"].hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: model-offset.z");
                return;
            }
        }
        if (!data.hasOwnProperty("model-rotation")) {
            console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: model-rotation");
            return;
        }
        else {
            if (!data["model-rotation"].hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: model-rotation.x");
                return;
            }
            if (!data["model-rotation"].hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: model-rotation.y");
                return;
            }
            if (!data["model-rotation"].hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: model-rotation.z");
                return;
            }
            if (!data["model-rotation"].hasOwnProperty("w")) {
                console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: model-rotation.w");
                return;
            }
        }
        if (!data.hasOwnProperty("label-offset")) {
            console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: label-offset");
            return;
        }
        else {
            if (!data["label-offset"].hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: label-offset.x");
                return;
            }
            if (!data["label-offset"].hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: label-offset.y");
                return;
            }
            if (!data["label-offset"].hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: label-offset.z");
                return;
            }
        }
        if (!data.hasOwnProperty("position")) {
            console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: position");
            return;
        }
        else {
            if (!data.position.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: position.x");
                return;
            }
            if (!data.position.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: position.y");
                return;
            }
            if (!data.position.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: position.z");
                return;
            }
        }
        if (!data.hasOwnProperty("rotation")) {
            console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: rotation");
            return;
        }
        else {
            if (!data.rotation.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: rotation.x");
                return;
            }
            if (!data.rotation.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: rotation.y");
                return;
            }
            if (!data.rotation.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: rotation.z");
                return;
            }
            if (!data.rotation.hasOwnProperty("w")) {
                console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: rotation.w");
                return;
            }
        }
        if (session == null) {
            console.warn("[VOSSynchronizationService] No session to create entity in");
            return;
        }
        if (!CanCreateCharacterEntity(data["client-id"], data["client-token"], session.id)) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to create a character entity in session ${session.id}`);
            return;
        }
        clientToDeleteWith = null;
        if (data["delete-with-client"] == true) {
            clientToDeleteWith = data["client-id"];
        }
        
        entityuuid = data["entity-id"];
        if (data.hasOwnProperty("scale")) {
            if (!data.scale.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: scale.x");
                return;
            }
            if (!data.scale.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: scale.y");
                return;
            }
            if (!data.scale.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: scale.z");
                return;
            }
            session.AddEntityWithScale(entityuuid, data.tag, "character", data.path,
                data["parent-uuid"], data.position, data.rotation, data.scale, data.resources,
                null, null, null, null, null, null, null, null, null, null, null, null,
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
                data["model-offset"], data["model-rotation"], data["label-offset"], clientToDeleteWith, null, null);
            return entityuuid;
        }
        else if (data.hasOwnProperty("size")) {
            if (!data.size.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: size.x");
                return;
            }
            if (!data.size.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: size.y");
                return;
            }
            if (!data.size.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: size.z");
                return;
            }
            session.AddEntityWithSize(entityuuid, data.tag, "character", data.path,
                data["parent-uuid"], data.position, data.rotation, data.scale, data.resources,
                null, null, null, null, null, null, null, null, null, null, null, null,
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
                data["model-offset"], data["model-rotation"], data["label-offset"], clientToDeleteWith, null, null);
            return entityuuid;
        }
        else {
            console.warn("[VOSSynchronizationService] Create Character Entity Message does not contain: scale");
            return;
        }
    }

    /**
     * @function HandleCreateButtonEntityMessage Handle a Create Button Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleCreateButtonEntityMessage(session, data) {
        if (!data.hasOwnProperty("delete-with-client")) {
            console.warn("[VOSSynchronizationService] Create Button Entity Message does not contain: delete-with-client");
            return;
        }
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Create Button Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("tag")) {
            console.warn("[VOSSynchronizationService] Create Button Entity Message does not contain: tag");
            return;
        }
        if (!data.hasOwnProperty("on-click")) {
            console.warn("[VOSSynchronizationService] Create Button Entity Message does not contain: on-click");
            return;
        }
        if (!data.hasOwnProperty("position-percent")) {
            console.warn("[VOSSynchronizationService] Create Button Entity Message does not contain: position");
            return;
        }
        else {
            if (!data.position.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Button Entity Message does not contain: position.x");
                return;
            }
            if (!data.position.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Button Entity Message does not contain: position.y");
                return;
            }
            if (!data.position.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Button Entity Message does not contain: position.z");
                return;
            }
        }
        if (session == null) {
            console.warn("[VOSSynchronizationService] No session to create entity in");
            return;
        }
        if (!CanCreateButtonEntity(data["client-id"], data["client-token"], session.id)) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to create a button entity in session ${session.id}`);
            return;
        }
        clientToDeleteWith = null;
        if (data["delete-with-client"] == true) {
            clientToDeleteWith = data["client-id"];
        }
        
        entityuuid = data["entity-id"];
        if (data.hasOwnProperty("size-percent")) {
            if (!data.size.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Button Entity Message does not contain: size.x");
                return;
            }
            if (!data.size.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Button Entity Message does not contain: size.y");
                return;
            }
            if (!data.size.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Button Entity Message does not contain: size.z");
                return;
            }
            session.AddEntityWithCanvasTransform(entityuuid, data.tag, "button", null,
                data["parent-uuid"], data["position-percent"], data["size-percent"],
                null, null, null, clientToDeleteWith, entity["on-click"], null);
            return entityuuid;
        }
        else {
            console.warn("[VOSSynchronizationService] Create Button Entity Message does not contain: size-percent");
            return;
        }
    }

    /**
     * @function HandleCreateCanvasEntityMessage Handle a Create Canvas Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleCreateCanvasEntityMessage(session, data) {
        if (!data.hasOwnProperty("delete-with-client")) {
            console.warn("[VOSSynchronizationService] Create Canvas Entity Message does not contain: delete-with-client");
            return;
        }
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Create Canvas Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("tag")) {
            console.warn("[VOSSynchronizationService] Create Canvas Entity Message does not contain: tag");
            return;
        }
        if (!data.hasOwnProperty("position")) {
            console.warn("[VOSSynchronizationService] Create Canvas Entity Message does not contain: position");
            return;
        }
        else {
            if (!data.position.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Canvas Entity Message does not contain: position.x");
                return;
            }
            if (!data.position.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Canvas Entity Message does not contain: position.y");
                return;
            }
            if (!data.position.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Canvas Entity Message does not contain: position.z");
                return;
            }
        }
        if (!data.hasOwnProperty("rotation")) {
            console.warn("[VOSSynchronizationService] Create Canvas Entity Message does not contain: rotation");
            return;
        }
        else {
            if (!data.rotation.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Canvas Entity Message does not contain: rotation.x");
                return;
            }
            if (!data.rotation.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Canvas Entity Message does not contain: rotation.y");
                return;
            }
            if (!data.rotation.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Canvas Entity Message does not contain: rotation.z");
                return;
            }
            if (!data.rotation.hasOwnProperty("w")) {
                console.warn("[VOSSynchronizationService] Create Canvas Entity Message does not contain: rotation.w");
                return;
            }
        }
        if (session == null) {
            console.warn("[VOSSynchronizationService] No session to create entity in");
            return;
        }
        if (!CanCreateCanvasEntity(data["client-id"], data["client-token"], session.id)) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to create a canvas entity in session ${session.id}`);
            return;
        }
        clientToDeleteWith = null;
        if (data["delete-with-client"] == true) {
            clientToDeleteWith = data["client-id"];
        }
        
        entityuuid = data["entity-id"];
        if (data.hasOwnProperty("scale")) {
            if (!data.scale.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Canvas Entity Message does not contain: scale.x");
                return;
            }
            if (!data.scale.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Canvas Entity Message does not contain: scale.y");
                return;
            }
            if (!data.scale.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Canvas Entity Message does not contain: scale.z");
                return;
            }
            session.AddEntityWithScale(entityuuid, data.tag, "canvas", null,
                data["parent-uuid"], data.position, data.rotation, data.scale, null,
                null, null, null, null, null, null, null, null, null, null, null, null,
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
                null, null, null, clientToDeleteWith, null, null);
            return entityuuid;
        }
        else if (data.hasOwnProperty("size")) {
            if (!data.size.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Canvas Entity Message does not contain: size.x");
                return;
            }
            if (!data.size.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Canvas Entity Message does not contain: size.y");
                return;
            }
            if (!data.size.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Canvas Entity Message does not contain: size.z");
                return;
            }
            session.AddEntityWithSize(entityuuid, data.tag, "canvas", null,
                data["parent-uuid"], data.position, data.rotation, data.scale, null,
                null, null, null, null, null, null, null, null, null, null, null, null,
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
                null, null, null, clientToDeleteWith, null, null);
            return entityuuid;
        }
        else {
            console.warn("[VOSSynchronizationService] Create Canvas Entity Message does not contain: scale");
            return;
        }
    }

    /**
     * @function HandleCreateInputEntityMessage Handle a Create Input Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleCreateInputEntityMessage(session, data) {
        if (!data.hasOwnProperty("delete-with-client")) {
            console.warn("[VOSSynchronizationService] Create Input Entity Message does not contain: delete-with-client");
            return;
        }
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Create Input Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("tag")) {
            console.warn("[VOSSynchronizationService] Create Input Entity Message does not contain: tag");
            return;
        }
        if (!data.hasOwnProperty("position-percent")) {
            console.warn("[VOSSynchronizationService] Create Input Entity Message does not contain: position");
            return;
        }
        else {
            if (!data.position.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Input Entity Message does not contain: position.x");
                return;
            }
            if (!data.position.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Input Entity Message does not contain: position.y");
                return;
            }
            if (!data.position.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Input Entity Message does not contain: position.z");
                return;
            }
        }
        if (session == null) {
            console.warn("[VOSSynchronizationService] No session to create entity in");
            return;
        }
        if (!CanCreateInputEntity(data["client-id"], data["client-token"], session.id)) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to create a input entity in session ${session.id}`);
            return;
        }
        clientToDeleteWith = null;
        if (data["delete-with-client"] == true) {
            clientToDeleteWith = data["client-id"];
        }
        
        entityuuid = data["entity-id"];
        if (data.hasOwnProperty("size-percent")) {
            if (!data.size.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Input Entity Message does not contain: size.x");
                return;
            }
            if (!data.size.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Input Entity Message does not contain: size.y");
                return;
            }
            if (!data.size.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Input Entity Message does not contain: size.z");
                return;
            }
            session.AddEntityWithCanvasTransform(entityuuid, data.tag, "input", null,
                data["parent-uuid"], data["position-percent"], data["size-percent"],
                null, null, null, clientToDeleteWith, null, null);
            return entityuuid;
        }
        else {
            console.warn("[VOSSynchronizationService] Create Input Entity Message does not contain: size-percent");
            return;
        }
    }

    /**
     * @function HandleCreateLightEntityMessage Handle a Create Light Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleCreateLightEntityMessage(session, data) {
        if (!data.hasOwnProperty("delete-with-client")) {
            console.warn("[VOSSynchronizationService] Create Light Entity Message does not contain: delete-with-client");
            return;
        }
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Create Light Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("tag")) {
            console.warn("[VOSSynchronizationService] Create Light Entity Message does not contain: tag");
            return;
        }
        if (!data.hasOwnProperty("position")) {
            console.warn("[VOSSynchronizationService] Create Light Entity Message does not contain: position");
            return;
        }
        else {
            if (!data.position.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Light Entity Message does not contain: position.x");
                return;
            }
            if (!data.position.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Light Entity Message does not contain: position.y");
                return;
            }
            if (!data.position.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Light Entity Message does not contain: position.z");
                return;
            }
        }
        if (!data.hasOwnProperty("rotation")) {
            console.warn("[VOSSynchronizationService] Create Light Entity Message does not contain: rotation");
            return
        }
        else {
            if (!data.rotation.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Light Entity Message does not contain: rotation.x");
                return;
            }
            if (!data.rotation.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Light Entity Message does not contain: rotation.y");
                return;
            }
            if (!data.rotation.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Light Entity Message does not contain: rotation.z");
                return;
            }
            if (!data.rotation.hasOwnProperty("w")) {
                console.warn("[VOSSynchronizationService] Create Light Entity Message does not contain: rotation.w");
                return;
            }
        }
        if (session == null) {
            console.warn("[VOSSynchronizationService] No session to create entity in");
            return;
        }
        if (!CanCreateLightEntity(data["client-id"], data["client-token"], session.id)) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to create a light entity in session ${session.id}`);
            return;
        }
        clientToDeleteWith = null;
        if (data["delete-with-client"] == true) {
            clientToDeleteWith = data["client-id"];
        }
        
        entityuuid = data["entity-id"];
        session.AddEntityWithScale(entityuuid, data.tag, "light", null,
            data["parent-uuid"], data.position, data.rotation, null, null,
            null, null, null, null, null, null, null, null, null, null, null, null,
            null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
            { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
            null, null, null, clientToDeleteWith, null, null);
        return entityuuid;
    }

    /**
     * @function HandleCreateTerrainEntityMessage Handle a Create Terrain Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleCreateTerrainEntityMessage(session, data) {
        if (!data.hasOwnProperty("delete-with-client")) {
            console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: delete-with-client");
            return;
        }
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("tag")) {
            console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: tag");
            return;
        }
        if (!data.hasOwnProperty("position")) {
            console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: position");
            return;
        }
        else {
            if (!data.position.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: position.x");
                return;
            }
            if (!data.position.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: position.y");
                return;
            }
            if (!data.position.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: position.z");
                return;
            }
        }
        if (!data.hasOwnProperty("rotation")) {
            console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: rotation");
            return;
        }
        else {
            if (!data.rotation.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: rotation.x");
                return;
            }
            if (!data.rotation.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: rotation.y");
                return;
            }
            if (!data.rotation.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: rotation.z");
                return;
            }
            if (!data.rotation.hasOwnProperty("w")) {
                console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: rotation.w");
                return;
            }
        }
        if (session == null) {
            console.warn("[VOSSynchronizationService] No session to create entity in");
            return;
        }
        if (!CanCreateTerrainEntity(data["client-id"], data["client-token"], session.id)) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to create a terrain entity in session ${session.id}`);
            return;
        }
        if (!data.hasOwnProperty("length")) {
            console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: length");
            return;
        }
        if (!data.hasOwnProperty("width")) {
            console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: width");
            return;
        }
        if (!data.hasOwnProperty("height")) {
            console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: height");
            return;
        }
        if (!data.hasOwnProperty("heights")) {
            console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: heights");
            return;
        }
        if (!data.hasOwnProperty("diffuse-texture")) {
            console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: diffuse-texture");
            return;
        }
        if (!data.hasOwnProperty("normal-texture")) {
            console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: normal-texture");
            return;
        }
        if (!data.hasOwnProperty("mask-texture")) {
            console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: mask-texture");
            return;
        }
        if (!data.hasOwnProperty("specular-values")) {
            console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: specular-values");
            return;
        }
        if (!data.hasOwnProperty("metallic-values")) {
            console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: metallic-values");
            return;
        }
        if (!data.hasOwnProperty("smoothness-values")) {
            console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: smoothness-values");
            return;
        }
        if (!data.hasOwnProperty("layer-mask")) {
            console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: layer-mask");
            return;
        }
        if (!data.hasOwnProperty("type")) {
            console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: layer-mask");
            return;
        }
        if (!data.hasOwnProperty("terrain-modification")) {
            console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: terrain-modification");
            return;
        }
        clientToDeleteWith = null;
        if (data["delete-with-client"] == true) {
            clientToDeleteWith = data["client-id"];
        }
        
        entityuuid = data["entity-id"];
        if (data.hasOwnProperty("scale")) {
            if (!data.scale.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: scale.x");
                return;
            }
            if (!data.scale.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: scale.y");
                return;
            }
            if (!data.scale.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: scale.z");
                return;
            }
            session.AddEntityWithScale(entityuuid, data.tag, "terrain", data.path,
                data["parent-uuid"], data.position, data.rotation, data.scale, null,
                data.length, data.width, data.height, data.heights, data["diffuse-texture"],
                data["normal-texture"], data["mask-texture"], data["specular-values"],
                data["metallic-values"], data["smoothness-values"], data["layer-mask"], data["type"],
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, data["terrain-modification"],
                null, null, null, clientToDeleteWith, null, null);
            return entityuuid;
        }
        else if (data.hasOwnProperty("size")) {
            if (!data.size.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: size.x");
                return;
            }
            if (!data.size.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: size.y");
                return;
            }
            if (!data.size.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: size.z");
                return;
            }
            session.AddEntityWithSize(entityuuid, data.tag, "terrain", data.path,
                data["parent-uuid"], data.position, data.rotation, data.scale, null,
                data.length, data.width, data.height, data.heights, data["diffuse-texture"],
                data["normal-texture"], data["mask-texture"], data["specular-values"],
                data["metallic-values"], data["smoothness-values"], data["layer-mask"], data["type"],
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, data["terrain-modification"],
                null, null, null, clientToDeleteWith, null, null);
            return entityuuid;
        }
        else {
            console.warn("[VOSSynchronizationService] Create Terrain Entity Message does not contain: scale");
            return;
        }
    }

    /**
     * @function HandleCreateTextEntityMessage Handle a Create Text Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleCreateTextEntityMessage(session, data) {
        if (!data.hasOwnProperty("delete-with-client")) {
            console.warn("[VOSSynchronizationService] Create Text Entity Message does not contain: delete-with-client");
            return;
        }
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Create Text Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("tag")) {
            console.warn("[VOSSynchronizationService] Create Text Entity Message does not contain: tag");
            return;
        }
        if (!data.hasOwnProperty("position-percent")) {
            console.warn("[VOSSynchronizationService] Create Text Entity Message does not contain: position");
            return;
        }
        else {
            if (!data.position.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Text Entity Message does not contain: position.x");
                return;
            }
            if (!data.position.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Text Entity Message does not contain: position.y");
                return;
            }
            if (!data.position.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Text Entity Message does not contain: position.z");
                return;
            }
        }
        if (session == null) {
            console.warn("[VOSSynchronizationService] No session to create entity in");
            return;
        }
        if (!CanCreateTextEntity(data["client-id"], data["client-token"], session.id)) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to create a text entity in session ${session.id}`);
            return;
        }
        if (!data.hasOwnProperty("text")) {
            console.warn("[VOSSynchronizationService] Create Text Entity Message does not contain: text");
            return;
        }
        if (!data.hasOwnProperty("font-size")) {
            console.warn("[VOSSynchronizationService] Create Text Entity Message does not contain: font-size");
            return;
        }
        clientToDeleteWith = null;
        if (data["delete-with-client"] == true) {
            clientToDeleteWith = data["client-id"];
        }
        
        entityuuid = data["entity-id"];
        if (data.hasOwnProperty("size-percent")) {
            if (!data.size.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Text Entity Message does not contain: size.x");
                return;
            }
            if (!data.size.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Text Entity Message does not contain: size.y");
                return;
            }
            if (!data.size.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Text Entity Message does not contain: size.z");
                return;
            }
            session.AddEntityWithCanvasTransform(entityuuid, data.tag, "text", null,
                data["parent-uuid"], data["position-percent"], data["size-percent"],
                null, entity.text, entity["font-size"],  clientToDeleteWith, null, null);
            return entityuuid;
        }
        else {
            console.warn("[VOSSynchronizationService] Create Text Entity Message does not contain: size-percent");
            return;
        }
    }

    /**
     * @function HandleCreateVoxelEntityMessage Handle a Create Voxel Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleCreateVoxelEntityMessage(session, data) {
        if (!data.hasOwnProperty("delete-with-client")) {
            console.warn("[VOSSynchronizationService] Create Voxel Entity Message does not contain: delete-with-client");
            return;
        }
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Create Voxel Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("tag")) {
            console.warn("[VOSSynchronizationService] Create Voxel Entity Message does not contain: tag");
            return;
        }
        if (!data.hasOwnProperty("position")) {
            console.warn("[VOSSynchronizationService] Create Voxel Entity Message does not contain: position");
            return;
        }
        else {
            if (!data.position.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Voxel Entity Message does not contain: position.x");
                return;
            }
            if (!data.position.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Voxel Entity Message does not contain: position.y");
                return;
            }
            if (!data.position.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Voxel Entity Message does not contain: position.z");
                return;
            }
        }
        if (!data.hasOwnProperty("rotation")) {
            console.warn("[VOSSynchronizationService] Create Voxel Entity Message does not contain: rotation");
            return;
        }
        else {
            if (!data.rotation.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Voxel Entity Message does not contain: rotation.x");
                return;
            }
            if (!data.rotation.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Voxel Entity Message does not contain: rotation.y");
                return;
            }
            if (!data.rotation.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Voxel Entity Message does not contain: rotation.z");
                return;
            }
            if (!data.rotation.hasOwnProperty("w")) {
                console.warn("[VOSSynchronizationService] Create Voxel Entity Message does not contain: rotation.w");
                return;
            }
        }
        if (session == null) {
            console.warn("[VOSSynchronizationService] No session to create entity in");
            return;
        }
        if (!CanCreateVoxelEntity(data["client-id"], data["client-token"], session.id)) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to create a voxel entity in session ${session.id}`);
            return;
        }
        clientToDeleteWith = null;
        if (data["delete-with-client"] == true) {
            clientToDeleteWith = data["client-id"];
        }
        
        entityuuid = data["entity-id"];
        if (data.hasOwnProperty("scale")) {
            if (!data.scale.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Voxel Entity Message does not contain: scale.x");
                return;
            }
            if (!data.scale.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Voxel Entity Message does not contain: scale.y");
                return;
            }
            if (!data.scale.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Voxel Entity Message does not contain: scale.z");
                return;
            }
            session.AddEntityWithScale(entityuuid, data.tag, "voxel", null,
                data["parent-uuid"], data.position, data.rotation, data.scale, null,
                null, null, null, null, null, null, null, null, null, null, null, null,
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
                null, null, null, clientToDeleteWith, null, null);
            return entityuuid;
        }
        else if (data.hasOwnProperty("size")) {
            if (!data.size.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Voxel Entity Message does not contain: size.x");
                return;
            }
            if (!data.size.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Voxel Entity Message does not contain: size.y");
                return;
            }
            if (!data.size.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Voxel Entity Message does not contain: size.z");
                return;
            }
            session.AddEntityWithSize(entityuuid, data.tag, "voxel", null,
                data["parent-uuid"], data.position, data.rotation, data.scale, null,
                null, null, null, null, null, null, null, null, null, null, null, null,
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
                null, null, null, clientToDeleteWith, null, null);
            return entityuuid;
        }
        else {
            console.warn("[VOSSynchronizationService] Create Voxel Entity Message does not contain: scale");
            return;
        }
    }

    /**
     * @function HandleCreateAirplaneEntityMessage Handle a Create Airplane Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleCreateAirplaneEntityMessage(session, data) {
        if (!data.hasOwnProperty("delete-with-client")) {
            console.warn("[VOSSynchronizationService] Create Airplane Entity Message does not contain: delete-with-client");
            return;
        }
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Create Airplane Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("tag")) {
            console.warn("[VOSSynchronizationService] Create Airplane Entity Message does not contain: tag");
            return;
        }
        if (!data.hasOwnProperty("path")) {
            console.warn("[VOSSynchronizationService] Create Airplane Entity Message does not contain: path");
            return;
        }
        if (!data.hasOwnProperty("mesh-position")) {
            console.warn("[VOSSynchronizationService] Create Airplane Entity Message does not contain: mesh-position");
            return;
        }
        if (!data.hasOwnProperty("mesh-rotation")) {
            console.warn("[VOSSynchronizationService] Create Airplane Entity Message does not contain: mesh-rotation");
            return;
        }
        if (!data.hasOwnProperty("mass")) {
            console.warn("[VOSSynchronizationService] Create Airplane Entity Message does not contain: mass");
            return;
        }
        if (!data.hasOwnProperty("position")) {
            console.warn("[VOSSynchronizationService] Create Airplane Entity Message does not contain: position");
            return;
        }
        else {
            if (!data.position.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Airplane Entity Message does not contain: position.x");
                return;
            }
            if (!data.position.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Airplane Entity Message does not contain: position.y");
                return;
            }
            if (!data.position.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Airplane Entity Message does not contain: position.z");
                return;
            }
        }
        if (!data.hasOwnProperty("rotation")) {
            console.warn("[VOSSynchronizationService] Create Airplane Entity Message does not contain: rotation");
            return;
        }
        else {
            if (!data.rotation.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Airplane Entity Message does not contain: rotation.x");
                return;
            }
            if (!data.rotation.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Airplane Entity Message does not contain: rotation.y");
                return;
            }
            if (!data.rotation.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Airplane Entity Message does not contain: rotation.z");
                return;
            }
            if (!data.rotation.hasOwnProperty("w")) {
                console.warn("[VOSSynchronizationService] Create Airplane Entity Message does not contain: rotation.w");
                return;
            }
        }
        if (session == null) {
            console.warn("[VOSSynchronizationService] No session to create entity in");
            return;
        }
        if (!CanCreateAirplaneEntity(data["client-id"], data["client-token"], session.id)) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to create an airplane entity in session ${session.id}`);
            return;
        }
        clientToDeleteWith = null;
        if (data["delete-with-client"] == true) {
            clientToDeleteWith = data["client-id"];
        }
        
        entityuuid = data["entity-id"];
        if (data.hasOwnProperty("scale")) {
            if (!data.scale.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Airplane Entity Message does not contain: scale.x");
                return;
            }
            if (!data.scale.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Airplane Entity Message does not contain: scale.y");
                return;
            }
            if (!data.scale.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Airplane Entity Message does not contain: scale.z");
                return;
            }
            session.AddEntityWithScale(entityuuid, data.tag, "airplane", data.path,
                data["parent-uuid"], data.position, data.rotation, data.scale, null,
                null, null, null, null, null, null, null, null, null, null, null, null,
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, data.mass, null,
                data["mesh-position"], data["mesh-rotation"], null, clientToDeleteWith, null, null);
            return entityuuid;
        }
        else if (data.hasOwnProperty("size")) {
            if (!data.size.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Airplane Entity Message does not contain: size.x");
                return;
            }
            if (!data.size.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Airplane Entity Message does not contain: size.y");
                return;
            }
            if (!data.size.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Airplane Entity Message does not contain: size.z");
                return;
            }
            session.AddEntityWithSize(entityuuid, data.tag, "airplane", data.path,
                data["parent-uuid"], data.position, data.rotation, data.scale, null,
                null, null, null, null, null, null, null, null, null, null, null, null,
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, data.mass, null,
                data["mesh-position"], data["mesh-rotation"], null, clientToDeleteWith, null, null);
            return entityuuid;
        }
        else {
            console.warn("[VOSSynchronizationService] Create Airplane Entity Message does not contain: scale");
            return;
        }
    }

    /**
     * @function HandleCreateAudioEntityMessage Handle a Create Audio Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleCreateAudioEntityMessage(session, data) {
        if (!data.hasOwnProperty("delete-with-client")) {
            console.warn("[VOSSynchronizationService] Create Audio Entity Message does not contain: delete-with-client");
            return;
        }
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Create Audio Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("tag")) {
            console.warn("[VOSSynchronizationService] Create Audio Entity Message does not contain: tag");
            return;
        }
        if (!data.hasOwnProperty("position")) {
            console.warn("[VOSSynchronizationService] Create Audio Entity Message does not contain: position");
            return;
        }
        else {
            if (!data.position.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Audio Entity Message does not contain: position.x");
                return;
            }
            if (!data.position.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Audio Entity Message does not contain: position.y");
                return;
            }
            if (!data.position.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Audio Entity Message does not contain: position.z");
                return;
            }
        }
        if (!data.hasOwnProperty("rotation")) {
            console.warn("[VOSSynchronizationService] Create Audio Entity Message does not contain: rotation");
            return;
        }
        else {
            if (!data.rotation.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Audio Entity Message does not contain: rotation.x");
                return;
            }
            if (!data.rotation.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Audio Entity Message does not contain: rotation.y");
                return;
            }
            if (!data.rotation.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Audio Entity Message does not contain: rotation.z");
                return;
            }
            if (!data.rotation.hasOwnProperty("w")) {
                console.warn("[VOSSynchronizationService] Create Audio Entity Message does not contain: rotation.w");
                return;
            }
        }
        if (session == null) {
            console.warn("[VOSSynchronizationService] No session to create entity in");
            return;
        }
        if (!CanCreateAudioEntity(data["client-id"], data["client-token"], session.id)) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to create an audio entity in session ${session.id}`);
            return;
        }
        clientToDeleteWith = null;
        if (data["delete-with-client"] == true) {
            clientToDeleteWith = data["client-id"];
        }
        
        entityuuid = data["entity-id"];
        if (data.hasOwnProperty("scale")) {
            if (!data.scale.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Audio Entity Message does not contain: scale.x");
                return;
            }
            if (!data.scale.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Audio Entity Message does not contain: scale.y");
                return;
            }
            if (!data.scale.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Audio Entity Message does not contain: scale.z");
                return;
            }
            session.AddEntityWithScale(entityuuid, data.tag, "audio", null,
                data["parent-uuid"], data.position, data.rotation, data.scale, null,
                null, null, null, null, null, null, null, null, null, null, null, null,
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
                null, null, null, clientToDeleteWith, null, null);
            return entityuuid;
        }
        else if (data.hasOwnProperty("size")) {
            if (!data.size.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Audio Entity Message does not contain: size.x");
                return;
            }
            if (!data.size.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Audio Entity Message does not contain: size.y");
                return;
            }
            if (!data.size.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Audio Entity Message does not contain: size.z");
                return;
            }
            session.AddEntityWithSize(entityuuid, data.tag, "audio", null,
                data["parent-uuid"], data.position, data.rotation, data.scale, null,
                null, null, null, null, null, null, null, null, null, null, null, null,
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
                null, null, null, clientToDeleteWith, null, null);
            return entityuuid;
        }
        else {
            console.warn("[VOSSynchronizationService] Create Audio Entity Message does not contain: scale");
            return;
        }
    }

    /**
     * @function HandleCreateAutomobileEntityMessage Handle a Create Automobile Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleCreateAutomobileEntityMessage(session, data) {
        if (!data.hasOwnProperty("delete-with-client")) {
            console.warn("[VOSSynchronizationService] Create Automobile Entity Message does not contain: delete-with-client");
            return;
        }
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Create Automobile Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("tag")) {
            console.warn("[VOSSynchronizationService] Create Automobile Entity Message does not contain: tag");
            return;
        }
        if (!data.hasOwnProperty("path")) {
            console.warn("[VOSSynchronizationService] Create Automobile Entity Message does not contain: path");
            return;
        }
        if (!data.hasOwnProperty("mesh-position")) {
            console.warn("[VOSSynchronizationService] Create Automobile Entity Message does not contain: mesh-position");
            return;
        }
        if (!data.hasOwnProperty("mesh-rotation")) {
            console.warn("[VOSSynchronizationService] Create Automobile Entity Message does not contain: mesh-rotation");
            return;
        }
        if (!data.hasOwnProperty("mass")) {
            console.warn("[VOSSynchronizationService] Create Automobile Entity Message does not contain: mass");
            return;
        }
        if (!data.hasOwnProperty("automobile-entity-type")) {
            console.warn("[VOSSynchronizationService] Create Automobile Entity Message does not contain: automobile-entity-type");
            return;
        }
        if (!data.hasOwnProperty("wheels")) {
            console.warn("[VOSSynchronizationService] Create Automobile Entity Message does not contain: wheels");
            return;
        }
        if (!data.hasOwnProperty("position")) {
            console.warn("[VOSSynchronizationService] Create Automobile Entity Message does not contain: position");
            return;
        }
        else {
            if (!data.position.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Automobile Entity Message does not contain: position.x");
                return;
            }
            if (!data.position.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Automobile Entity Message does not contain: position.y");
                return;
            }
            if (!data.position.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Automobile Entity Message does not contain: position.z");
                return;
            }
        }
        if (!data.hasOwnProperty("rotation")) {
            console.warn("[VOSSynchronizationService] Create Automobile Entity Message does not contain: rotation");
            return;
        }
        else {
            if (!data.rotation.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Automobile Entity Message does not contain: rotation.x");
                return;
            }
            if (!data.rotation.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Automobile Entity Message does not contain: rotation.y");
                return;
            }
            if (!data.rotation.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Automobile Entity Message does not contain: rotation.z");
                return;
            }
            if (!data.rotation.hasOwnProperty("w")) {
                console.warn("[VOSSynchronizationService] Create Automobile Entity Message does not contain: rotation.w");
                return;
            }
        }
        if (session == null) {
            console.warn("[VOSSynchronizationService] No session to create entity in");
            return;
        }
        if (!CanCreateAutomobileEntity(data["client-id"], data["client-token"], session.id)) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to create an automobile entity in session ${session.id}`);
            return;
        }
        clientToDeleteWith = null;
        if (data["delete-with-client"] == true) {
            clientToDeleteWith = data["client-id"];
        }
        
        entityuuid = data["entity-id"];
        if (data.hasOwnProperty("scale")) {
            if (!data.scale.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Automobile Entity Message does not contain: scale.x");
                return;
            }
            if (!data.scale.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Automobile Entity Message does not contain: scale.y");
                return;
            }
            if (!data.scale.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Automobile Entity Message does not contain: scale.z");
                return;
            }
            session.AddEntityWithScale(entityuuid, data.tag, "automobile", data.path,
                data["parent-uuid"], data.position, data.rotation, data.scale, null,
                null, null, null, null, null, null, null, null, null, null, null, data["automobile-entity-type"],
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, data.mass, null,
                data["mesh-position"], data["mesh-rotation"], null, clientToDeleteWith, null, data.wheels);
            return entityuuid;
        }
        else if (data.hasOwnProperty("size")) {
            if (!data.size.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Automobile Entity Message does not contain: size.x");
                return;
            }
            if (!data.size.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Automobile Entity Message does not contain: size.y");
                return;
            }
            if (!data.size.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Automobile Entity Message does not contain: size.z");
                return;
            }
            session.AddEntityWithSize(entityuuid, data.tag, "automobile", data.path,
                data["parent-uuid"], data.position, data.rotation, data.scale, null,
                null, null, null, null, null, null, null, null, null, null, null, null,
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, data.mass, null,
                data["mesh-position"], data["mesh-rotation"], null, clientToDeleteWith, null, data.wheels);
            return entityuuid;
        }
        else {
            console.warn("[VOSSynchronizationService] Create Automobile Entity Message does not contain: scale");
            return;
        }
    }

    /**
     * @function HandleCreateDropdownEntityMessage Handle a Create Dropdown Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleCreateDropdownEntityMessage(session, data) {
        if (!data.hasOwnProperty("delete-with-client")) {
            console.warn("[VOSSynchronizationService] Create Dropdown Entity Message does not contain: delete-with-client");
            return;
        }
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Create Dropdown Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("tag")) {
            console.warn("[VOSSynchronizationService] Create Dropdown Entity Message does not contain: tag");
            return;
        }
        if (!data.hasOwnProperty("position-percent")) {
            console.warn("[VOSSynchronizationService] Create Dropdown Entity Message does not contain: position");
            return;
        }
        else {
            if (!data.position.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Dropdown Entity Message does not contain: position.x");
                return;
            }
            if (!data.position.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Dropdown Entity Message does not contain: position.y");
                return;
            }
            if (!data.position.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Dropdown Entity Message does not contain: position.z");
                return;
            }
        }
        if (session == null) {
            console.warn("[VOSSynchronizationService] No session to create entity in");
            return;
        }
        if (!CanCreateDropdownEntity(data["client-id"], data["client-token"], session.id)) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to create a dropdown entity in session ${session.id}`);
            return;
        }
        clientToDeleteWith = null;
        if (data["delete-with-client"] == true) {
            clientToDeleteWith = data["client-id"];
        }
        
        entityuuid = data["entity-id"];
        if (data.hasOwnProperty("size-percent")) {
            if (!data.size.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Dropdown Entity Message does not contain: size.x");
                return;
            }
            if (!data.size.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Dropdown Entity Message does not contain: size.y");
                return;
            }
            if (!data.size.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Dropdown Entity Message does not contain: size.z");
                return;
            }
            session.AddEntityWithCanvasTransform(entityuuid, data.tag, "dropdown", null,
                data["parent-uuid"], data["position-percent"], data["size-percent"],
                null, null, null, clientToDeleteWith, data["on-change"], data.options);
            return entityuuid;
        }
        else {
            console.warn("[VOSSynchronizationService] Create Dropdown Entity Message does not contain: size-percent");
            return;
        }
    }

    /**
     * @function HandleCreateHTMLEntityMessage Handle a Create HTML Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleCreateHTMLEntityMessage(session, data) {
        if (!data.hasOwnProperty("delete-with-client")) {
            console.warn("[VOSSynchronizationService] Create HTML Entity Message does not contain: delete-with-client");
            return;
        }
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Create HTML Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("tag")) {
            console.warn("[VOSSynchronizationService] Create HTML Entity Message does not contain: tag");
            return;
        }
        if (!data.hasOwnProperty("on-message")) {
            console.warn("[VOSSynchronizationService] Create HTML Entity Message does not contain: on-message");
            return;
        }
        if (!data.hasOwnProperty("position")) {
            console.warn("[VOSSynchronizationService] Create HTML Entity Message does not contain: position");
            return;
        }
        else {
            if (!data.position.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create HTML Entity Message does not contain: position.x");
                return;
            }
            if (!data.position.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create HTML Entity Message does not contain: position.y");
                return;
            }
            if (!data.position.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create HTML Entity Message does not contain: position.z");
                return;
            }
        }
        if (!data.hasOwnProperty("rotation")) {
            console.warn("[VOSSynchronizationService] Create HTML Entity Message does not contain: rotation");
            return;
        }
        else {
            if (!data.rotation.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create HTML Entity Message does not contain: rotation.x");
                return;
            }
            if (!data.rotation.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create HTML Entity Message does not contain: rotation.y");
                return;
            }
            if (!data.rotation.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create HTML Entity Message does not contain: rotation.z");
                return;
            }
            if (!data.rotation.hasOwnProperty("w")) {
                console.warn("[VOSSynchronizationService] Create HTML Entity Message does not contain: rotation.w");
                return;
            }
        }
        if (session == null) {
            console.warn("[VOSSynchronizationService] No session to create entity in");
            return;
        }
        if (!CanCreateHTMLEntity(data["client-id"], data["client-token"], session.id)) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to create an html entity in session ${session.id}`);
            return;
        }
        clientToDeleteWith = null;
        if (data["delete-with-client"] == true) {
            clientToDeleteWith = data["client-id"];
        }
        
        entityuuid = data["entity-id"];
        if (data.hasOwnProperty("scale")) {
            if (!data.scale.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create HTML Entity Message does not contain: scale.x");
                return;
            }
            if (!data.scale.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create HTML Entity Message does not contain: scale.y");
                return;
            }
            if (!data.scale.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create HTML Entity Message does not contain: scale.z");
                return;
            }
            session.AddEntityWithScale(entityuuid, data.tag, "html", null,
                data["parent-uuid"], data.position, data.rotation, data.scale, null,
                null, null, null, null, null, null, null, null, null, null, null, null,
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
                null, null, null, clientToDeleteWith, data["on-message"], null);
            return entityuuid;
        }
        else if (data.hasOwnProperty("size")) {
            if (!data.size.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create HTML Entity Message does not contain: size.x");
                return;
            }
            if (!data.size.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create HTML Entity Message does not contain: size.y");
                return;
            }
            if (!data.size.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create HTML Entity Message does not contain: size.z");
                return;
            }
            session.AddEntityWithSize(entityuuid, data.tag, "html", null,
                data["parent-uuid"], data.position, data.rotation, data.scale, null,
                null, null, null, null, null, null, null, null, null, null, null, null,
                null, null, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, true,
                { x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 0 }, false, 0, null,
                null, null, null, clientToDeleteWith, data["on-message"], null);
            return entityuuid;
        }
        else {
            console.warn("[VOSSynchronizationService] Create HTML Entity Message does not contain: scale");
            return;
        }
    }

    /**
     * @function HandleCreateImageEntityMessage Handle a Create Image Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleCreateImageEntityMessage(session, data) {
        if (!data.hasOwnProperty("delete-with-client")) {
            console.warn("[VOSSynchronizationService] Create Image Entity Message does not contain: delete-with-client");
            return;
        }
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Create Image Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("tag")) {
            console.warn("[VOSSynchronizationService] Create Image Entity Message does not contain: tag");
            return;
        }
        if (!data.hasOwnProperty("image-file")) {
            console.warn("[VOSSynchronizationService] Create Image Entity Message does not contain: image-file");
            return;
        }
        if (!data.hasOwnProperty("position-percent")) {
            console.warn("[VOSSynchronizationService] Create Image Entity Message does not contain: position");
            return;
        }
        else {
            if (!data.position.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Image Entity Message does not contain: position.x");
                return;
            }
            if (!data.position.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Image Entity Message does not contain: position.y");
                return;
            }
            if (!data.position.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Create Image Entity Message does not contain: position.z");
                return;
            }
        }
        if (session == null) {
            console.warn("[VOSSynchronizationService] No session to create entity in");
            return;
        }
        if (!CanCreateImageEntity(data["client-id"], data["client-token"], session.id)) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to create a image entity in session ${session.id}`);
            return;
        }
        clientToDeleteWith = null;
        if (data["delete-with-client"] == true) {
            clientToDeleteWith = data["client-id"];
        }
        
        entityuuid = data["entity-id"];
        if (data.hasOwnProperty("size-percent")) {
            if (!data.size.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Create Image Entity Message does not contain: size.x");
                return;
            }
            if (!data.size.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Create Image Entity Message does not contain: size.y");
                return;
            }
            if (!data.size.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Image Entity Message does not contain: size.z");
                return;
            }
            session.AddEntityWithCanvasTransform(entityuuid, data.tag, "image", data["image-file"],
                data["parent-uuid"], data["position-percent"], data["size-percent"],
                null, null, null, clientToDeleteWith, null, null);
            return entityuuid;
        }
        else {
            console.warn("[VOSSynchronizationService] Create Image Entity Message does not contain: size-percent");
            return;
        }
    }

    /**
     * @function HandleSendMessageMessage Handle a Send Message Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleSendMessageMessage(session, data) {
        if (!data.hasOwnProperty("client-id")) {
            console.warn("[VOSSynchronizationService] Send Message Message does not contain: client-id");
            return;
        }
        if (!data.hasOwnProperty("topic")) {
            console.warn("[VOSSynchronizationService] Send Message Message does not contain: topic");
            return;
        }
        if (!data.hasOwnProperty("message")) {
            console.warn("[VOSSynchronizationService] Send Message Message does not contain: message");
            return;
        }
        if (session == null) {
            console.warn("[VOSSynchronizationService] No session to send message in");
            return;
        }
        if (!CanSendMessage(data["client-id"], data["client-token"], session.id)) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to send a message in session ${session.id}`);
            return;
        }
    }

    /**
     * @function HandleDeleteEntityMessage Handle a Delete Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleDeleteEntityMessage(session, data) {
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Delete Entity Message does not contain: entity-id");
            return;
        }
        if (!CanDeleteEntity(data["client-id"], data["client-token"], session.id, data["entity-id"])) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to delete an entity in session ${session.id}`);
            return;
        }
        session.RemoveEntity(data["entity-id"]);
    }

    /**
     * @function HandleRemoveEntityMessage Handle a Remove Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleRemoveEntityMessage(session, data) {
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Remove Entity Message does not contain: entity-id");
            return;
        }
        if (!CanRemoveEntity(data["client-id"], data["client-token"], session.id, data["entity-id"])) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to remove an entity in session ${session.id}`);
            return;
        }
        session.RemoveEntity(data["entity-id"]);
    }

    /**
     * @function HandlePositionEntityMessage Handle a Position Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandlePositionEntityMessage(session, data) {
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Position Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("position")) {
            console.warn("[VOSSynchronizationService] Position Entity Message does not contain: position");
            return;
        }
        else {
            if (!data.position.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Position Entity Message does not contain: position.x");
                return;
            }
            if (!data.position.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Position Entity Message does not contain: position.y");
                return;
            }
            if (!data.position.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Position Entity Message does not contain: position.z");
                return;
            }
        }
        if (!CanPositionEntity(data["client-id"], data["client-token"], session.id, data["entity-id"])) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to position an entity in session ${session.id}`);
            return;
        }
        session.PositionEntity(data["entity-id"], data.position);
    }

    /**
     * @function HandleRotateEntityMessage Handle a Rotate Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleRotateEntityMessage(session, data) {
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Rotate Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("rotation")) {
            console.warn("[VOSSynchronizationService] Rotate Entity Message does not contain: rotation");
            return;
        }
        else {
            if (!data.rotation.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Rotate Entity Message does not contain: rotation.x");
                return;
            }
            if (!data.rotation.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Rotate Entity Message does not contain: rotation.y");
                return;
            }
            if (!data.rotation.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Rotate Entity Message does not contain: rotation.z");
                return;
            }
            if (!data.rotation.hasOwnProperty("w")) {
                console.warn("[VOSSynchronizationService] Rotate Entity Message does not contain: rotation.w");
                return;
            }
        }
        if (!CanRotateEntity(data["client-id"], data["client-token"], session.id, data["entity-id"])) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to rotate an entity in session ${session.id}`);
            return;
        }
        session.RotateEntity(data["entity-id"], data.rotation);
    }

    /**
     * @function HandleScaleEntityMessage Handle a Scale Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleScaleEntityMessage(session, data) {
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Scale Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("scale")) {
            console.warn("[VOSSynchronizationService] Scale Entity Message does not contain: scale");
            return;
        }
        else {
            if (!data.scale.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Scale Entity Message does not contain: scale.x");
                return;
            }
            if (!data.scale.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Scale Entity Message does not contain: scale.y");
                return;
            }
            if (!data.scale.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Scale Entity Message does not contain: scale.z");
                return;
            }
        }
        if (!CanScaleEntity(data["client-id"], data["client-token"], session.id, data["entity-id"])) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to scale an entity in session ${session.id}`);
            return;
        }
        session.ScaleEntity(data["entity-id"], data.scale);
    }

    /**
     * @function HandleSizeEntityMessage Handle a Size Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleSizeEntityMessage(session, data) {
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Size Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("size")) {
            console.warn("[VOSSynchronizationService] Size Entity Message does not contain: size");
            return;
        }
        else {
            if (!data.size.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Size Entity Message does not contain: size.x");
                return;
            }
            if (!data.size.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Size Entity Message does not contain: size.y");
                return;
            }
            if (!data.size.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Size Entity Message does not contain: size.z");
                return;
            }
        }
        if (!CanSizeEntity(data["client-id"], data["client-token"], session.id, data["entity-id"])) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to size an entity in session ${session.id}`);
            return;
        }
        session.SizeEntity(data["entity-id"], data.size);
    }

    function HandleModifyTerrainEntityMessage(session, data) {
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Modify Terrain Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("modification")) {
            console.warn("[VOSSynchronizationService] Modify Terrain Entity Message does not contain: modification");
            return;
        }
        if (!data.hasOwnProperty("position")) {
            console.warn("[VOSSynchronizationService] Modify Terrain Entity Message does not contain: position");
            return;
        }
        else {
            if (!data.position.hasOwnProperty("x")) {
                console.warn("[VOSSynchronizationService] Modify Terrain Entity Message does not contain: position.x");
                return;
            }
            if (!data.position.hasOwnProperty("y")) {
                console.warn("[VOSSynchronizationService] Modify Terrain Entity Message does not contain: position.y");
                return;
            }
            if (!data.position.hasOwnProperty("z")) {
                console.warn("[VOSSynchronizationService] Modify Terrain Entity Message does not contain: position.z");
                return;
            }
        }
        if (!data.hasOwnProperty("brush-type")) {
            console.warn("[VOSSynchronizationService] Modify Terrain Entity Message does not contain: brush-type");
            return;
        }
        if (!data.hasOwnProperty("layer")) {
            console.warn("[VOSSynchronizationService] Modify Terrain Entity Message does not contain: layer");
            return;
        }
        if (!CanModifyTerrainEntity(data["client-id"], data["client-token"], session.id, data["entity-id"])) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to modify a terrain entity in session ${session.id}`);
            return;
        }
        session.ModifyTerrainEntity(data["entity-id"],
            data.modification, data.position, data["brush-type"], data.layer);
    }

    /**
     * @function HandleCanvasTypeEntityMessage Handle a Canvas Type Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleCanvasTypeEntityMessage(session, data) {
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Canvas Type Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("canvas-type")) {
            console.warn("[VOSSynchronizationService] Canvas Type Entity Message does not contain: canvas-type");
            return;
        }
        if (!CanSetEntityCanvasType(data["client-id"], data["client-token"], session.id, data["entity-id"])) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to set entity canvas type in session ${session.id}`);
            return;
        }
        session.SetCanvasType(data["entity-id"], data["canvas-type"]);
    }

    /**
     * @function HandleHighlightStateEntityMessage Handle a Highlight State Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleHighlightStateEntityMessage(session, data) {
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Highlight State Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("highlighted")) {
            console.warn("[VOSSynchronizationService] Highlight State Entity Message does not contain: highlighted");
            return;
        }
        if (!CanSetEntityHighlightState(data["client-id"], data["client-token"], session.id, data["entity-id"])) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to set entity highlight state in session ${session.id}`);
            return;
        }
        session.SetHighlightState(data["entity-id"], data.highlighted);
    }

    /**
     * @function HandleMotionEntityMessage Handle a Motion Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleMotionEntityMessage(session, data) {
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Motion Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("angular-velocity")) {
            console.warn("[VOSSynchronizationService] Motion Entity Message does not contain: angular-velocity");
            return;
        }
        if (!data.hasOwnProperty("velocity")) {
            console.warn("[VOSSynchronizationService] Motion Entity Message does not contain: velocity");
            return;
        }
        if (!data.hasOwnProperty("stationary")) {
            console.warn("[VOSSynchronizationService] Motion Entity Message does not contain: stationary");
            return;
        }
        session.SetMotionState(data["entity-id"], data["angular-velocity"], data.velocity, data.stationary);
    }

    /**
     * @function HandleParentEntityMessage Handle a Parent Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleParentEntityMessage(session, data) {
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Parent Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("parent-id")) {
            console.warn("[VOSSynchronizationService] Parent Entity Message does not contain: parent-id");
            return;
        }
        session.ParentEntity(data["entity-id"], data["parent-id"]);
    }

    /**
     * @function HandlePhysicalPropertiesEntityMessage Handle a Physical Properties Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandlePhysicalPropertiesEntityMessage(session, data) {
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Physical Properties Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("angular-drag")) {
            console.warn("[VOSSynchronizationService] Physical Properties Entity Message does not contain: angular-drag");
            return;
        }
        if (!data.hasOwnProperty("center-of-mass")) {
            console.warn("[VOSSynchronizationService] Physical Properties Entity Message does not contain: center-of-mass");
            return;
        }
        if (!data.hasOwnProperty("drag")) {
            console.warn("[VOSSynchronizationService] Physical Properties Entity Message does not contain: drag");
            return;
        }
        if (!data.hasOwnProperty("gravitational")) {
            console.warn("[VOSSynchronizationService] Physical Properties Entity Message does not contain: gravitational");
            return;
        }
        if (!data.hasOwnProperty("mass")) {
            console.warn("[VOSSynchronizationService] Physical Properties Entity Message does not contain: mass");
            return;
        }
        session.SetPhysicalState(data["entity-id"], data["angular-drag"], data["center-of-mass"],
            data.drag, data.gravitational, data.mass);
    }

    /**
     * @function HandleVisibilityEntityMessage Handle a Visibility Entity Message.
     * @param {*} session Session.
     * @param {*} data Data.
     */
    function HandleVisibilityEntityMessage(session, data) {
        if (!data.hasOwnProperty("entity-id")) {
            console.warn("[VOSSynchronizationService] Visibility Entity Message does not contain: entity-id");
            return;
        }
        if (!data.hasOwnProperty("visible")) {
            console.warn("[VOSSynchronizationService] Visibility Entity Message does not contain: angular-drag");
            return;
        }
        session.SetVisibility(data["entity-id"], entity.visible);
    }

    /**
     * @function HandleSessionMessage Handle a Session Message (MSG/CMD).
     * @param {*} data Data.
     * @returns {object} Result object with broadcast flag.
     */
    function HandleSessionMessage(data) {
        if (!data.hasOwnProperty("session-id")) {
            console.warn("[VOSSynchronizationService] Session Message does not contain: session-id");
            return { broadcast: false };
        }
        if (!data.hasOwnProperty("client-id")) {
            console.warn("[VOSSynchronizationService] Session Message does not contain: client-id");
            return { broadcast: false };
        }
        if (!data.hasOwnProperty("type")) {
            console.warn("[VOSSynchronizationService] Session Message does not contain: type");
            return { broadcast: false };
        }
        if (!data.hasOwnProperty("content")) {
            console.warn("[VOSSynchronizationService] Session Message does not contain: content");
            return { broadcast: false };
        }

        const session = GetSynchronizedSession(data["session-id"]);
        if (session == null) {
            console.warn(`[VOSSynchronizationService] Session ${data["session-id"]} not found`);
            return { broadcast: false };
        }

        // Validate client permissions
        if (!CanSendMessage(data["client-id"], data["client-token"], data["session-id"])) {
            Log(`[VOSSynchronizationService] Client ${data["client-id"]} is not allowed to send messages in session ${data["session-id"]}`);
            return { broadcast: false };
        }

        const messageType = data["type"].toUpperCase();
        const content = data["content"];

        if (messageType === "MSG") {
            // MSG messages are broadcast to all clients in the session
            Log(`[VOSSynchronizationService] MSG from client ${data["client-id"]} in session ${data["session-id"]}: ${content}`);
            return { broadcast: true };
        } else if (messageType === "CMD") {
            // CMD messages are processed as world commands
            Log(`[VOSSynchronizationService] CMD from client ${data["client-id"]} in session ${data["session-id"]}: ${content}`);
            
            const commandResult = worldCommands.ProcessCommand(content, data["session-id"], data["client-id"]);
            
            if (commandResult.success && commandResult.message) {
                // Send command result back as a MSG to the issuing client
                const responseMessage = {
                    "message-id": uuidv4(),
                    "session-id": data["session-id"],
                    "client-id": "system",
                    "type": "MSG",
                    "content": commandResult.message
                };
                
                const responseTopic = `vos/status/${data["session-id"]}/message`;
                SendMessage(responseTopic, JSON.stringify(responseMessage));
            }
            
            // CMD messages are not broadcast (only the response is sent)
            return { broadcast: false };
        } else {
            console.warn(`[VOSSynchronizationService] Unknown message type: ${messageType}`);
            return { broadcast: false };
        }
    }

    /**
     * @function CanCreateSession Determine whether or not the client can create a session.
     * @param {*} clientID Client ID.
     * @returns Whether or not the client can create a session.
     */
    this.CanCreateSession = function(clientID, clientToken) {
        if (this.createSessionAuthCallback != null) {
            if (this.createSessionAuthCallback(clientID, clientToken) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanDestroySession Determine whether or not the client can destroy a session.
     * @param {*} clientID Client ID.
     * @returns Whether or not the client can destroy a session.
     */
    this.CanDestroySession = function(clientID, clientToken) {
        if (this.destroySessionAuthCallback != null) {
            if (this.destroySessionAuthCallback(clientID, clientToken) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanJoinSession Determine whether or not the client can join a session.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can join a session.
     */
    async function CanJoinSession(clientID, clientToken, sessionID, callback) {
        if (callback != null) {
            if (await callback(clientID, clientToken, sessionID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanExitSession Determine whether or not the client can exit a session.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can exit a session.
     */
    function CanExitSession(clientID, clientToken, sessionID) {
        if (this.exitSessionAuthCallback != null) {
            if (this.exitSessionAuthCallback(clientID, clientToken, sessionID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanGiveHeartbeat Determine whether or not the client can give a heartbeat.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can give a heartbeat.
     */
    function CanGiveHeartbeat(clientID, clientToken, sessionID) {
        if (this.giveHeartbeatAuthCallback != null) {
            if (this.GiveHeartbeatAuthCallback(clientID, clientToken, sessionID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanGetSessionState Determine whether or not the client can get the session state.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can get the session state.
     */
    function CanGetSessionState(clientID, clientToken, sessionID) {
        if (this.getSessionStateAuthCallback != null) {
            if (this.getSessionStateAuthCallback(clientID, clientToken, sessionID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanCreateContainerEntity Determine whether or not the client can create a container entity.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can create a container entity.
     */
    function CanCreateContainerEntity(clientID, clientToken, sessionID) {
        if (this.createContainerEntityAuthCallback != null) {
            if (this.createContainerEntityAuthCallback(clientID, clientToken, sessionID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanCreateMeshEntity Determine whether or not the client can create a mesh entity.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can create a mesh entity.
     */
    function CanCreateMeshEntity(clientID, clientToken, sessionID) {
        if (this.createMeshEntityAuthCallback != null) {
            if (this.createMeshEntityAuthCallback(clientID, clientToken, sessionID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanCreateCharacterEntity Determine whether or not the client can create a character entity.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can create a character entity.
     */
    function CanCreateCharacterEntity(clientID, clientToken, sessionID) {
        if (this.createCharacterEntityAuthCallback != null) {
            if (this.createCharacterEntityAuthCallback(clientID, clientToken, sessionID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanCreateButtonEntity Determine whether or not the client can create a button entity.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can create a button entity.
     */
    function CanCreateButtonEntity(clientID, clientToken, sessionID) {
        if (this.createButtonEntityAuthCallback != null) {
            if (this.createButtonEntityAuthCallback(clientID, clientToken, sessionID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanCreateCanvasEntity Determine whether or not the client can create a canvas entity.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can create a canvas entity.
     */
    function CanCreateCanvasEntity(clientID, clientToken, sessionID) {
        if (this.createCanvasEntityAuthCallback != null) {
            if (this.createCanvasEntityAuthCallback(clientID, clientToken, sessionID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanCreateInputEntity Determine whether or not the client can create an input entity.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can create an input entity.
     */
    function CanCreateInputEntity(clientID, clientToken, sessionID) {
        if (this.createInputEntityAuthCallback != null) {
            if (this.createInputEntityAuthCallback(clientID, clientToken, sessionID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanCreateLightEntity Determine whether or not the client can create a light entity.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can create a light entity.
     */
    function CanCreateLightEntity(clientID, clientToken, sessionID) {
        if (this.createLightEntityAuthCallback != null) {
            if (this.createLightEntityAuthCallback(clientID, clientToken, sessionID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanCreateTerrainEntity Determine whether or not the client can create a terrain entity.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can create a terrain entity.
     */
    function CanCreateTerrainEntity(clientID, clientToken, sessionID) {
        if (this.createTerrainEntityAuthCallback != null) {
            if (this.createTerrainEntityAuthCallback(clientID, clientToken, sessionID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanCreateTextEntity Determine whether or not the client can create a text entity.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can create a text entity.
     */
    function CanCreateTextEntity(clientID, clientToken, sessionID) {
        if (this.createTextEntityAuthCallback != null) {
            if (this.createTextEntityAuthCallback(clientID, clientToken, sessionID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanCreateVoxelEntity Determine whether or not the client can create a voxel entity.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can create a voxel entity.
     */
    function CanCreateVoxelEntity(clientID, clientToken, sessionID) {
        if (this.createVoxelEntityAuthCallback != null) {
            if (this.createVoxelEntityAuthCallback(clientID, clientToken, sessionID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanCreateAirplaneEntity Determine whether or not the client can create a airplane entity.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can create a airplane entity.
     */
    function CanCreateAirplaneEntity(clientID, clientToken, sessionID) {
        if (this.createAirplaneEntityAuthCallback != null) {
            if (this.createAirplaneEntityAuthCallback(clientID, clientToken, sessionID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanCreateAudioEntity Determine whether or not the client can create a audio entity.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can create a audio entity.
     */
    function CanCreateAudioEntity(clientID, clientToken, sessionID) {
        if (this.createAudioEntityAuthCallback != null) {
            if (this.createAudioEntityAuthCallback(clientID, clientToken, sessionID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanCreateAutomobileEntity Determine whether or not the client can create a automobile entity.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can create a automobile entity.
     */
    function CanCreateAutomobileEntity(clientID, clientToken, sessionID) {
        if (this.createAutomobileEntityAuthCallback != null) {
            if (this.createAutomobileEntityAuthCallback(clientID, clientToken, sessionID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanCreateDropdownEntity Determine whether or not the client can create a dropdown entity.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can create a dropdown entity.
     */
    function CanCreateDropdownEntity(clientID, clientToken, sessionID) {
        if (this.createDropdownEntityAuthCallback != null) {
            if (this.createDropdownEntityAuthCallback(clientID, clientToken, sessionID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanCreateHTMLEntity Determine whether or not the client can create a HTML entity.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can create a HTML entity.
     */
    function CanCreateHTMLEntity(clientID, clientToken, sessionID) {
        if (this.createHTMLEntityAuthCallback != null) {
            if (this.createHTMLEntityAuthCallback(clientID, clientToken, sessionID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanCreateImageEntity Determine whether or not the client can create a image entity.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can create a image entity.
     */
    function CanCreateImageEntity(clientID, clientToken, sessionID) {
        if (this.createImageEntityAuthCallback != null) {
            if (this.createImageEntityAuthCallback(clientID, clientToken, sessionID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanSendMessage Determine whether or not the client can send a message.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can send a message.
     */
    function CanSendMessage(clientID, clientToken, sessionID) {
        if (this.sendMessageAuthCallback != null) {
            if (this.sendMessageAuthCallback(clientID, clientToken, sessionID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanDeleteEntity Determine whether or not the client can delete an entity.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can delete an entity.
     */
    function CanDeleteEntity(clientID, clientToken, sessionID, entityID) {
        if (this.deleteEntityAuthCallback != null) {
            if (this.deleteEntityAuthCallback(clientID, clientToken, sessionID, entityID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanRemoveEntity Determine whether or not the client can remove an entity.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can remove an entity.
     */
    function CanRemoveEntity(clientID, clientToken, sessionID, entityID) {
        if (this.removeEntityAuthCallback != null) {
            if (this.removeEntityAuthCallback(clientID, clientToken, sessionID, entityID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanPositionEntity Determine whether or not the client can position an entity.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can position an entity.
     */
    function CanPositionEntity(clientID, clientToken, sessionID, entityID) {
        if (this.positionEntityAuthCallback != null) {
            if (this.positionEntityAuthCallback(clientID, clientToken, sessionID, entityID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanRotateEntity Determine whether or not the client can rotate an entity.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can rotate an entity.
     */
    function CanRotateEntity(clientID, clientToken, sessionID, entityID) {
        if (this.rotateEntityAuthCallback != null) {
            if (this.rotateEntityAuthCallback(clientID, clientToken, sessionID, entityID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanScaleEntity Determine whether or not the client can scale an entity.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can scale an entity.
     */
    function CanScaleEntity(clientID, clientToken, sessionID, entityID) {
        if (this.scaleEntityAuthCallback != null) {
            if (this.scaleEntityAuthCallback(clientID, clientToken, sessionID, entityID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanSizeEntity Determine whether or not the client can size an entity.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can size an entity.
     */
    function CanSizeEntity(clientID, clientToken, sessionID, entityID) {
        if (this.sizeEntityAuthCallback != null) {
            if (this.sizeEntityAuthCallback(clientID, clientToken, sessionID, entityID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanModifyTerrainEntity Determine whether or not the client can modify a terrain entity.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can modify a terrain entity.
     */
    function CanModifyTerrainEntity(clientID, clientToken, sessionID, entityID) {
        if (this.modifyTerrainEntityAuthCallback != null) {
            if (this.modifyTerrainEntityAuthCallback(clientID, clientToken, sessionID, entityID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanSetEntityCanvasType Determine whether or not the client set an entity canvas type.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can set an entity canvas type.
     */
    function CanSetEntityCanvasType(clientID, clientToken, sessionID, entityID) {
        if (this.setEntityCanvasTypeAuthCallback != null) {
            if (this.setEntityCanvasTypeAuthCallback(clientID, clientToken, sessionID, entityID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function CanSetEntityHighlightState Determine whether or not the client can set an entity highlight state.
     * @param {*} clientID Client ID.
     * @param {*} sessionID Session ID
     * @returns Whether or not the client can set an entity highlight state.
     */
    function CanSetEntityHighlightState(clientID, clientToken, sessionID, entityID) {
        if (this.setEntityHighlightStateAuthCallback != null) {
            if (this.setEntityHighlightStateAuthCallback(clientID, clientToken, sessionID, entityID) != true) {
                return false;
            }
        }

        return true;
    }

    /**
     * @function Log Log a message.
     * @param {*} text Text to log.
     */
    function Log(text) {
        console.log(text);
        if (process.platform == "win32") {
            fs.appendFile(".\\vss.log", text + "\n", function(err){
                
            });
        } else {
            fs.appendFile("./vss.log", text + "\n", function(err){

            });
        }
    }

    /**
     * @function CheckHeartbeats Check Heartbeats.
     */
    this.CheckHeartbeats = function()  {
        for (session in vosSynchronizationSessions) {
            sess = GetSynchronizedSession(session);
            if (sess == null) {
                console.warn(`[VOSSynchronizationService->CheckHeartbeats] Session ${session} invalid`);
                continue;
            }
            sess.clients.forEach(client => {
                if (Date.now() - client.lastHeartbeat > 250000) {
                    console.warn(`[VOSSynchronizationService->CheckHeartbeats] ClientID: ${client.uuid} timed out`);
                    sess.clients.forEach(cl => {
                        if (cl.uuid == client.uuid) {
                            index = sess.clients.indexOf(cl);
                            if (index > -1) {
                                sess.clients[index].entitiesToDestroyOnExit.forEach(entity => {
                                    topic = "vos/status/" + sess.id + "/entity/" + entity + "/delete";
                                    message = {};
                                    message["message-id"] = uuidv4();
                                    message["session-id"] = sess.id;
                                    message["entity-id"] = entity;
                                    SendMessage(topic, JSON.stringify(message));
                                });
                            }
                            return;
                        }
                    });
                    sess.RemoveClient(client.uuid);
                }
            });
        }
    }

    setInterval(() => { this.CheckHeartbeats() }, 5000);
};