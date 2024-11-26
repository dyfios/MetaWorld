const express = require("express");
const bodyParser = require("body-parser");
const { minX } = require("./regiongenerator");

module.exports = function(port, context, terrainGetAllFunction, terrainSetFunction, terrainModifyFunction, terrainGetRangeFunction,
    entityGetAllFunction, entityPositionFunction, entityDeleteFunction, getTimeFunction) {
    let app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.get("/getterrain", async function(req, res) {
        min_x = req.query.minX;
        max_x = req.query.maxX;
        min_y = req.query.minY;
        max_y = req.query.maxY;
        terrainGetRangeFunction(context, min_x, max_x, min_y, max_y, (result) => {
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
        brushSize = req.query.brushSize;
        
        terrainModifyFunction(context, x, y, z, operation, brushType, layer, brushSize);

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

    app.get("/deleteentity", async function(req, res) {
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