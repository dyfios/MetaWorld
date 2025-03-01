// Copyright (c) 2019-2025 Five Squared Interactive. All rights reserved.

// argv[2]: TCP port.
// argv[3]: WebSockets port.
// argv[4]: CA file.
// argv[5]: Private key file.
// argv[6]: Certificate file.

const fs = require("fs");
const vosapp = require("../VOS/vosapp");
const VOSSynchronizationService = require("./VOS-Synchronization/vossynchronizationservice");
const { argv } = require("process");

function ConnectToVOS(context) {
    context.vosApp.ConnectToVOS("syncmanager", () => {
        context.vosApp.SubscribeToVOS("syncmanager", "vos/app/sync/#", (topic, msg) => {
            if (topic == "vos/app/sync/createsession") {
                if (msg == null) {
                    context.vosApp.Log("No content received for createsession message.");
                    return;
                }

                deserialized = JSON.parse(msg);

                if (deserialized["id"] == null) {
                    context.vosApp.Log("Missing required field id in createsession message.");
                    return;
                }

                if (deserialized["tag"] == null) {
                    context.vosApp.Log("Missing required field tag in createsession message.");
                    return;
                }
                
                context.vss.CreateSession(deserialized["id"], deserialized["tag"]);
            }
            else if (topic == "vos/app/sync/deletesession") {
                if (msg == null) {
                    context.vosApp.Log("No content received for deletesession message.");
                    return;
                }

                deserialized = JSON.parse(msg);

                if (deserialized["id"] == null) {
                    context.vosApp.Log("Missing required field id in deletesession message.");
                    return;
                }
                
                context.vss.DeleteSession(deserialized["id"]);
            }
            else if (topic == "vos/app/sync/getsessions") {
                if (msg == null) {
                    context.vosApp.Log("No content received for getsessions message.");
                    return;
                }

                deserialized = JSON.parse(msg);

                if (deserialized["replytopic"] == null) {
                    context.vosApp.Log("Missing required field replytopic in getsessions message.");
                    return;
                }

                context.vosApp.PublishOnVOS(deserialized["replytopic"], JSON.stringify(context.vss.GetSessions()));
            }
            else {
                context.vosApp.Log("Invalid VOS message topic: " + topic);
            }
        });
    });
}

this.vosApp = new vosapp();

this.vosApp.Log("Synchronization Manager Started");

this.vss = new VOSSynchronizationService();
this.vss.RunMQTT(argv[2], argv[3], argv[4], argv[5], argv[6]);
this.vss.ConnectToMQTT(argv[2]);

ConnectToVOS(this);