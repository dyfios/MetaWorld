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
        var onJoinedAction =
        `
            context = Context.GetContext("VOSSynchronizationContext");
            Logging.Log('[VOSSynchronization:Connect] Joined Session');
            if (context.onJoinedSession != null) {
                context.onJoinedSession();
            }
        `;
        
        var onConnectedAction =
        `
            context = Context.GetContext("VOSSynchronizationContext");
            if (context.OnConnected != null) {
                context.OnConnected();
            }
            
            if (context.onMessage != null) {
                VOSSynchronization.RegisterMessageCallback(context.host, context.port, context.onMessage);
            }
            
            if (context.sessionToConnectTo != null) {
                context.clientID = VOSSynchronization.JoinSession(context.host, context.port, context.sessionToConnectTo.id,
                    context.sessionToConnectTo.tag, ` + "`" + onJoinedAction + "`" + `
                    );
                Context.DefineContext("VOSSynchronizationContext", context);
            }
        `;
        
        var result = null;
        if (this.transport === "tcp") {
            result = VOSSynchronization.ConnectToService(this.host, this.port, this.tls, onConnectedAction, VSSTransport.TCP);
        }
        else if (this.transport === "websocket") {
            result = VOSSynchronization.ConnectToService(this.host, this.port, this.tls, onConnectedAction, VSSTransport.WebSocket);
        }
        else {
            Logging.LogError("[VOSSynchronization:Connect] Invalid transport.");
        }
    }
    
    Disconnect() {
        VOSSynchronization.DisconnectService(this.host, this.port);
    }
    
    AddEntity(entityID, deleteWithClient = false, resources = null) {
        VOSSynchronization.StartSynchronizingEntity(this.host, this.port, entityID, deleteWithClient, resources);
    }
    
    SendMessage(topic, message) {
        VOSSynchronization.SendMessage(this.host, this.port, "CONSOLE." + topic, message);
    }
    
    SendEntityAddUpdate(entityID, position, rotation) {
        var messageInfo = {
            id: entityID,
            position: position,
            rotation: rotation
        };
        
        VOSSynchronization.SendMessage(this.host, this.port, "ENTITY.ADD", JSON.stringify(messageInfo));
    }
    
    SendEntityDeleteUpdate(entityID) {
        var messageInfo = {
            id: entityID
        };
        
        VOSSynchronization.SendMessage(this.host, this.port, "ENTITY.DELETE", JSON.stringify(messageInfo));
    }
    
    SendEntityMoveUpdate(entityID, position, rotation) {
        var messageInfo = {
            id: entityID,
            position: position,
            rotation: rotation
        };
        
        VOSSynchronization.SendMessage(this.host, this.port, "ENTITY.MOVE", JSON.stringify(messageInfo));
    }
    
    SendTerrainDigUpdate(position, brushType, lyr) {
        var messageInfo = {
            position: position,
            brushType: "'" + brushType + "'",
            lyr: lyr
        };
        
        VOSSynchronization.SendMessage(this.host, this.port, "TERRAIN.EDIT.DIG", JSON.stringify(messageInfo));
    }
    
    SendTerrainBuildUpdate(position, brushType, lyr) {
        var messageInfo = {
            position: position,
            brushType: "'" + brushType + "'",
            lyr: lyr
        };
        
        VOSSynchronization.SendMessage(this.host, this.port, "TERRAIN.EDIT.BUILD", JSON.stringify(messageInfo));
    }
}