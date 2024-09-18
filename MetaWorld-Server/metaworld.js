/*const redisClient = require("./redisClient");
const sqliteDatabase = require("./sqliteDatabase");
const zone = require("./zone");
const region = require("./region");*/

/*LogMessage("Connecting to Redis server");
rc = new redisClient("localhost", 6379);
LogMessage("Connected to Redis server");

(async () => {
    await rc.Connect();

    //await rc.Set("test", "value");

    found = await rc.Get("tes");
    console.log(found);
})();*/

/*db = new sqliteDatabase();

(async () => {
    await db.Open("test.db");
    columns = { "a": db.character, "b": db.integer };
    await db.CreateTable("test", columns);
    values = { "a": "'o'", "b": 1 }
    await db.InsertIntoTable("test", values)
    console.log(await db.GetTable("test"));
    search = { "a": "'o'" }
    console.log(await db.GetRows("test", search));
    console.log(await db.GetColumns("test", [ "a" ]));
})();*/
/*zn = new zone("./", 128, 0, 0, 128, 0, 0);

(async () => {
    await zn.Initialize();
    await zn.AddEntity("ergth", 1, 2, 3);
})();

zn2 = new zone("./test/", 128, 0, 0, 128, 1, 0);

(async () => {
    await zn2.Initialize();
    await zn2.AddEntity("ergth", 1, 2, 3);
})();*/

/*reg = new region("./region", null, 100, 0, 0, 100);

(async () => {
    await reg.Initialize();
    console.log("ready");
    for (let i = 0; i < 1000; i++) {
        await reg.AddEntity("'fewsd'", 1, 2, 3);
    }
})();


function LogMessage(msg) {
    console.log(Date() + ": " + msg);
}

function LogWarning(msg) {
    console.warn(Date() + ": " + msg);
}

function LogError(msg) {
    console.error(Date() + ": " + msg);
}*/

const express = require("express");
const bodyParser = require("body-parser");
const region = require("./region");
const BasicTerrainGenerator = require("./basicterraingenerator");
const fs = require("fs");
const path = require("path");

module.exports = function(regionDir, entityTable, groundSeed, groundChunkSize, groundChunkHeight, regionSize, zoneSize) {
    var regionDir = regionDir;

    var entityTable = entityTable;

    var groundSeed = groundSeed;

    var groundChunkSize = groundChunkSize;

    var groundChunkHeight = groundChunkHeight;

    var regionSize = regionSize;

    var zoneSize = zoneSize;

    var regions = [];

    var terrainGenerator = null;

    function CreateRegion(x, y) {
        LogMessage(`Creating region ${path.join(regionDir, x + "-" + y)}`);
        reg = new region(path.join(regionDir, x + "-" + y),
            entityTable, regionSize, groundSeed, groundChunkSize, groundChunkHeight,
            terrainGenerator, x, y, zoneSize);
        reg.Initialize();
        AddRegion(x, y, reg);
    }

    function AddRegion(x, y, region) {
        if (regions[x] == null) {
            regions[x] = [];
        }
        regions[x][y] = region;
    }

    function LogMessage(msg) {
        console.log(Date() + ": " + msg);
    }

    function LogWarning(msg) {
        console.warn(Date() + ": " + msg);
    }

    function LogError(msg) {
        console.error(Date() + ": " + msg);
    }

    let app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.get("/createregion", async function() {
        x = req.query.x;
        y = req.query.y;

        CreateRegion(x, y);
    });

    app.get("/getregioninfo", async function(req, res) {
        x = req.query.x;
        y = req.query.y;

        if (regions[x][y] == null) {
            CreateRegion(x, y);
        }

        regionInfo = {};
        regionInfo["directory"] = regions[x][y].directory;
        regionInfo["region-size"] = regions[x][y].regionSize;
        regionInfo["x-index"] = regions[x][y].xIndex;
        regionInfo["y-index"] = regions[x][y].yIndex;
        regionInfo["zone-size"] = regions[x][y].zoneSize;
        console.log(regionInfo);
        res.send(JSON.stringify(regionInfo));
    });

    app.get("/getregiongroundchunk", async function(req, res) {
        x = req.query.x;
        y = req.query.y;
        
        reg = GetRegion(x, y);
        if (reg == null) {
            return null;
        }
        regCoords = ToRegionCoords(x, y);

        chunkInfo = [];
        groundChunk = await reg.GetGroundChunk(regCoords.x, regCoords.y);
        /*ground = await reg.GetGround(regCoords.x, regCoords.y, 0);
        for (let i = 0; i < groundChunkSize; i++) {
            chunkInfo[i] = [];
            for (let j = 0; j < groundChunkSize; j++) {
                chunkInfo[i][j] = [];
                for (let k = 0; k < groundChunkHeight; k++) {
                    voxel = await reg.GetGround(regCoords.x + i, regCoords.y + j, k);
                    if (voxel != null) {
                        console.log(i + " " + j + " " + k);
                        chunkInfo[i][j][k] = voxel;
                    }
                }
            }
        }*/
        res.send(groundChunk);
    });

    function GetRegion(x, y) {
        var xI = Math.floor(x / regionSize);
        var yI = Math.floor(y / regionSize);
        return regions[xI][yI];
    }

    function ToRegionCoords(x, y) {
        var xI = Math.floor(x / regionSize);
        var yI = Math.floor(y / regionSize);
        var xCoord = x - xI * (zoneSize * regionSize) / groundChunkSize;
        var yCoord = y - yI * (zoneSize * regionSize) / groundChunkSize;
        
        return { x: xCoord, y: yCoord };
    }

    function CreateRegionDirectory() {
        fs.mkdirSync(regionDir);

        // Create 4 regions around 0.
        (async () => {
            CreateRegion(0, 0);
            CreateRegion(0, 1);
            CreateRegion(1, 0);
            CreateRegion(1, 1);
        })();
    }

    function LoadRegionInfo() {
        fs.readdirSync(regionDir).forEach(file => {
            LogMessage(`Loading region ${file}`);
            if (fs.lstatSync(path.join(regionDir, file)).isDirectory()) {
                coords = file.split("-");
                if (coords.length != 2) {
                    LogError("Invalid region");
                }
                else {
                    CreateRegion(coords[0], coords[1]);
                }
            }
        });
    }

    this.StartServer = function() {
        LogMessage("Starting server");
        terrainGenerator = new BasicTerrainGenerator(groundSeed, groundChunkSize, 1, groundChunkHeight);

        if (!fs.existsSync(regionDir)) {
            LogMessage("Creating region directory");
            CreateRegionDirectory();
        }
        else {
            LogMessage("Loading region directory");
            LoadRegionInfo();
        }
    }

    let server = app.listen("25525");
}