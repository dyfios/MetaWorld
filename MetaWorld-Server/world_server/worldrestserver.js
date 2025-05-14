const express = require("express");
const bodyParser = require("body-parser");

module.exports = function(port, context, userAuthenticityFunction, userReadRegionPermissionFunction,
    userWriteRegionPermissionFunction, userUseRegionPermissionFunction, userTakeRegionPermissionFunction,
    userReadEntityPermissionFunction, userWriteEntityPermissionFunction, userUseEntityPermissionFunction,
    userTakeEntityPermissionFunction, terrainSetFunction, terrainModifyFunction, terrainGetRangeFunction,
    entityGetAllFunction, entityPositionFunction, entityDeleteFunction, getTimeFunction, regionInfoGetFunction,
    biomeListGetFunction) {
    let app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.get("/getterrain", async function(req, res) {
        user_id = req.query.userID;
        user_token = req.query.userToken;
        region_x = req.query.regionX;
        region_y = req.query.regionY;
        min_x = req.query.minX;
        max_x = req.query.maxX;
        min_y = req.query.minY;
        max_y = req.query.maxY;

        userAuthenticityFunction(context, user_id, user_token, (result) => {
            if (result == false) {
                res.send(JSON.stringify({
                    "response": "Invalid identity",
                    "accepted": false
                }));
            }
            else {
                userReadRegionPermissionFunction(context, region_x, region_y, user_id, (result) => {
                    if (result == false) {
                        res.send(JSON.stringify({
                            "response": "Permission denied",
                            "accepted": false
                        }));
                    }
                    else {
                        terrainGetRangeFunction(context, region_x, region_y, min_x, max_x, min_y, max_y, (result) => {
                            res.send(JSON.stringify(result));
                        });
                    }
                });
            }
        });
    });

    app.get("/modifyterrain", async function(req, res) {
        user_id = req.query.userID;
        user_token = req.query.userToken;
        region_x = req.query.regionX;
        region_y = req.query.regionY;
        x = req.query.x;
        y = req.query.y;
        z = req.query.z;
        operation = req.query.operation;
        brushType = req.query.brushType;
        layer = req.query.layer;
        brushSize = req.query.brushSize;
        
        userAuthenticityFunction(context, user_id, user_token, (result) => {
            if (result == false) {
                res.send(JSON.stringify({
                    "response": "Invalid identity",
                    "accepted": false
                }));
            }
            else {
                userWriteRegionPermissionFunction(context, region_x, region_y, user_id, (result) => {
                    if (result == false) {
                        res.send(JSON.stringify({
                            "response": "Permission denied",
                            "accepted": false
                        }));
                    }
                    else {
                        terrainModifyFunction(context, region_x, region_y, x, y, z, operation, brushType, layer, brushSize);

                        result = {
                            "accepted": true
                        };

                        res.send(JSON.stringify(result));
                    }
                });
            }
        });
    });

    app.get("/getentities", async function(req, res) {
        user_id = req.query.userID;
        user_token = req.query.userToken;
        region_x = req.query.regionX;
        region_y = req.query.regionY;

        userAuthenticityFunction(context, user_id, user_token, (result) => {
            if (result == false) {
                res.send(JSON.stringify({
                    "response": "Invalid identity",
                    "accepted": false
                }));
            }
            else {
                userReadRegionPermissionFunction(context, region_x, region_y, user_id, (result) => {
                    if (result == false) {
                        res.send(JSON.stringify({
                            "response": "Permission denied",
                            "accepted": false
                        }));
                    }
                    else {
                        entityGetAllFunction(context, region_x, region_y, (result) => {
                            res.send(JSON.stringify(result));
                        });
                    }
                });
            }
        });
    });

    app.get("/positionentity", async function(req, res) {
        user_id = req.query.userID;
        user_token = req.query.userToken;
        region_x = req.query.regionX;
        region_y = req.query.regionY;
        entityID = req.query.entityID;
        variantID = req.query.variantID;
        instanceID = req.query.instanceID;
        xPos = req.query.xPosition;
        yPos = req.query.yPosition;
        zPos = req.query.zPosition;
        xRot = req.query.xRotation;
        yRot = req.query.yRotation;
        zRot = req.query.zRotation;
        wRot = req.query.wRotation;

        userAuthenticityFunction(context, user_id, user_token, (result) => {
            if (result == false) {
                res.send(JSON.stringify({
                    "response": "Invalid identity",
                    "accepted": false
                }));
            }
            else {
                userWriteEntityPermissionFunction(context, region_x, region_y, user_id, (result) => {
                    if (result == false) {
                        res.send(JSON.stringify({
                            "response": "Permission denied",
                            "accepted": false
                        }));
                    }
                    else {
                        entityPositionFunction(context, region_x, region_y, entityID, variantID, instanceID,
                            xPos, yPos, zPos, xRot, yRot, zRot, wRot);
                        
                        result = {
                            "accepted": true
                        };
                
                        res.send(JSON.stringify(result));
                    }
                });
            }
        });
    });

    app.get("/deleteentity", async function(req, res) {
        user_id = req.query.userID;
        user_token = req.query.userToken;
        region_x = req.query.regionX;
        region_y = req.query.regionY;
        instanceID = req.query.instanceID;

        userAuthenticityFunction(context, user_id, user_token, (result) => {
            if (result == false) {
                res.send(JSON.stringify({
                    "response": "Invalid identity",
                    "accepted": false
                }));
            }
            else {
                userWriteEntityPermissionFunction(context, region_x, region_y, user_id, (result) => {
                    if (result == false) {
                        res.send(JSON.stringify({
                            "response": "Permission denied",
                            "accepted": false
                        }));
                    }
                    else {
                        entityDeleteFunction(context, region_x, region_y, instanceID);

                        result = {
                            "accepted": true
                        };

                        res.send(JSON.stringify(result));
                    }
                });
            }
        });
    });

    app.get("/gettime", async function(req, res) {
        getTimeFunction(context, (result) => {
            res.send(JSON.stringify(result));
        });
    });

    app.get("/getregioninfo", async function (req, res) {
        user_id = req.query.userID;
        user_token = req.query.userToken;
        region_x = req.query.regionX;
        region_y = req.query.regionY;

        userAuthenticityFunction(context, user_id, user_token, (result) => {
            if (result == false) {
                res.send(JSON.stringify({
                    "response": "Invalid identity",
                    "accepted": false
                }));
            }
            else {
                userReadRegionPermissionFunction(context, region_x, region_y, user_id, (result) => {
                    if (result == false) {
                        res.send(JSON.stringify({
                            "response": "Permission denied",
                            "accepted": false
                        }));
                    }
                    else {
                        regionInfoGetFunction(context, region_x, region_y, (result) => {
                            res.send(JSON.stringify(result));
                        });
                    }
                });
            }
        });
    });

    app.get("/getbiomeinfo", async function (req, res) {
        user_id = req.query.userID;
        user_token = req.query.userToken;
        biomeListGetFunction(context, (result) => {
            res.send(JSON.stringify(result));
        });
    });

    let server = app.listen(port);
}