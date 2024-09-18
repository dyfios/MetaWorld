const express = require("express");
const bodyParser = require("body-parser");

module.exports = function(port, context, terrainGetAllFunction, terrainSetFunction, terrainModifyFunction,
    entityGetAllFunction, entityPositionFunction, entityDeleteFunction, getTimeFunction) {
    let app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.get("/getterrain", async function(req, res) {
        terrainGetAllFunction(context, (result) => {
            res.send(JSON.stringify(result));
        });
    });

    app.get("/modifyterrain", async function(req, res) {
        x = req.query.x;
        y = req.query.y;
        z = req.query.z;
        operation = req.query.operation;
        brushType = req.query.brushType;
        layer = req.query.layer;

        terrainModifyFunction(context, x, y, z, operation, brushType, layer);

        result = {
            "accepted": true
        };

        res.send(JSON.stringify(result));
    });

    app.get("/getentities", async function(req, res) {
        entityGetAllFunction(context, (result) => {
            res.send(JSON.stringify(result));
        })
    });

    app.get("/positionentity", async function(req, res) {
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

        entityPositionFunction(context, entityID, variantID, instanceID,
            xPos, yPos, zPos, xRot, yRot, zRot, wRot);
        
        result = {
            "accepted": true
        };

        res.send(JSON.stringify(result));
    });

    app.get("/deletentity", async function(req, res) {
        instanceID = req.query.instanceID;

        entityDeleteFunction(context, instanceID);

        result = {
            "accepted": true
        };

        res.send(JSON.stringify(result));
    });

    app.get("/gettime", async function(req, res) {
        getTimeFunction(context, (result) => {
            res.send(JSON.stringify(result));
        });
    });

    let server = app.listen(port);
}