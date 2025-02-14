/// @file vossynchronization.js
/// Module for a VOS synchronizer.

class VOSSynchronizer {
    constructor(host, port, tls = false, transport = "tcp", sessionToConnectTo = null, onConnect = null, onJoinedSession = null, onMessage = null) {
        this.host = host;
        this.port = port;
        this.tls = tls;
        this.transport = transport;
        this.sessionToConnectTo = sessionToConnectTo;
        this.onJoinedSession = onJoinedSession;
        this.onMessage = onMessage;
        this.clientID = null;
        
        this.OnConnected = function() {
            if (onConnect != null) {
                OnConnect();
            }
        }
        
        Context.DefineContext("VOSSynchronizationContext", this);
    }

    Connect() {
        var context = Context.GetContext("VOSSynchronizationContext");
        var onJoinedAction =
        `
            var context = Context.GetContext("VOSSynchronizationContext");
            if (context.OnConnected != null) {
                context.OnConnected();
            }
            
            if (context.onMessage != null) {
                VOSSynchronization.RegisterMessageCallback(context.sessionToConnectTo.id, context.onMessage);
            }

            Logging.Log('[VOSSynchronization:Connect] Joined Session');
            if (context.onJoinedSession != null) {
                context.onJoinedSession();
            }
        `;
        Logging.Log(context.transport);
        if (context.transport === "tcp" || context.transport === "TCP") {
            VOSSynchronization.JoinSession(context.host, context.port, context.tls, context.sessionToConnectTo.id,
                context.sessionToConnectTo.tag, onJoinedAction, VSSTransport.TCP);
        }
        else if (context.transport === "websocket" || context.transport === "WEBSOCKET") {
            VOSSynchronization.JoinSession(context.host, context.port, context.tls, context.sessionToConnectTo.id,
                context.sessionToConnectTo.tag, onJoinedAction, VSSTransport.WebSocket);
        }
        else {
            Logging.LogError("[VOSSynchronization:Connect] Invalid transport.");
        }
    }
    
    Disconnect() {
        //VOSSynchronization.DisconnectService(this.host, this.port);
    }
    
    AddEntity(entityID, deleteWithClient = false, resources = null) {
        VOSSynchronization.StartSynchronizingEntity(this.sessionToConnectTo.id, entityID, deleteWithClient, resources);
    }
    
    SendMessage(topic, message) {
        VOSSynchronization.SendMessage(this.sessionToConnectTo.id, "CONSOLE." + topic, message);
    }
    
    SendEntityAddUpdate(entityID, position, rotation) {
        var messageInfo = {
            id: entityID,
            position: position,
            rotation: rotation
        };
        
        VOSSynchronization.SendMessage(this.sessionToConnectTo.id, "ENTITY.ADD", JSON.stringify(messageInfo));
    }
    
    SendEntityDeleteUpdate(entityID) {
        var messageInfo = {
            id: entityID
        };
        
        VOSSynchronization.SendMessage(this.sessionToConnectTo.id, "ENTITY.DELETE", JSON.stringify(messageInfo));
    }
    
    SendEntityMoveUpdate(entityID, position, rotation) {
        var messageInfo = {
            id: entityID,
            position: position,
            rotation: rotation
        };
        
        VOSSynchronization.SendMessage(this.sessionToConnectTo.id, "ENTITY.MOVE", JSON.stringify(messageInfo));
    }
    
    SendTerrainDigUpdate(position, brushType, lyr) {
        var messageInfo = {
            position: position,
            brushType: "'" + brushType + "'",
            lyr: lyr
        };
        
        VOSSynchronization.SendMessage(this.sessionToConnectTo.id, "TERRAIN.EDIT.DIG", JSON.stringify(messageInfo));
    }
    
    SendTerrainBuildUpdate(position, brushType, lyr) {
        var messageInfo = {
            position: position,
            brushType: "'" + brushType + "'",
            lyr: lyr
        };
        
        VOSSynchronization.SendMessage(this.sessionToConnectTo.id, "TERRAIN.EDIT.BUILD", JSON.stringify(messageInfo));
    }
}