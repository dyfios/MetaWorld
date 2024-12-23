const express = require("express");
const bodyParser = require("body-parser");

module.exports = function(port, context, terrainSetFunction, terrainModifyFunction, terrainGetRangeFunction,
    entityGetAllFunction, entityPositionFunction, entityDeleteFunction, getTimeFunction, chunkInfoGetFunction,
    biomeListGetFunction) {
    let app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.get("/getterrain", async function(req, res) {
        chunk_x = req.query.chunkX;
        chunk_y = req.query.chunkY;
        min_x = req.query.minX;
        max_x = req.query.maxX;
        min_y = req.query.minY;
        max_y = req.query.maxY;
        terrainGetRangeFunction(context, chunk_x, chunk_y, min_x, max_x, min_y, max_y, (result) => {
            res.send(JSON.stringify(result));
        });
    });

    app.get("/modifyterrain", async function(req, res) {
        chunk_x = req.query.chunkX;
        chunk_y = req.query.chunkY;
        x = req.query.x;
        y = req.query.y;
        z = req.query.z;
        operation = req.query.operation;
        brushType = req.query.brushType;
        layer = req.query.layer;
        brushSize = req.query.brushSize;console.log(chunk_x + " " + chunk_y);
        
        terrainModifyFunction(context, chunk_x, chunk_y, x, y, z, operation, brushType, layer, brushSize);

        result = {
            "accepted": true
        };

        res.send(JSON.stringify(result));
    });

    app.get("/getentities", async function(req, res) {
        chunk_x = req.query.chunkX;
        chunk_y = req.query.chunkY;
        entityGetAllFunction(context, chunk_x, chunk_y, (result) => {
            res.send(JSON.stringify(result));
        })
    });

    app.get("/positionentity", async function(req, res) {
        chunk_x = req.query.chunkX;
        chunk_y = req.query.chunkY;
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

        entityPositionFunction(context, chunk_x, chunk_y, entityID, variantID, instanceID,
            xPos, yPos, zPos, xRot, yRot, zRot, wRot);
        
        result = {
            "accepted": true
        };

        res.send(JSON.stringify(result));
    });

    app.get("/deleteentity", async function(req, res) {
        chunk_x = req.query.chunkX;
        chunk_y = req.query.chunkY;
        instanceID = req.query.instanceID;

        entityDeleteFunction(context, chunk_x, chunk_y, instanceID);

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

    app.get("/getchunkinfo", async function (req, res) {
        chunk_x = req.query.chunkX;
        chunk_y = req.query.chunkY;

        chunkInfoGetFunction(context, chunk_x, chunk_y, (result) => {
            res.send(JSON.stringify(result));
        });
    });

    app.get("/getbiomeinfo", async function (req, res) {
        biomeListGetFunction(context, (result) => {
            res.send(JSON.stringify(result));
        });
    });

    let server = app.listen(port);
}