const fs = require("fs");
const entity = require("./entity");
const sqliteDatabase = require("./sqliteDatabase");

module.exports = function(directory, regionSize, regionXIndex, regionYIndex, zoneSize, xIndex, yIndex) {
    this.entityTable = "entities";

    this.groundTable = "ground";

    this.groundInitializationTable = "groundinitialization";

    this.directory = directory;

    this.regionSize = regionSize;

    this.regionXIndex = regionXIndex;

    this.regionYIndex = regionYIndex;

    this.zoneSize = zoneSize;
    
    this.xIndex = xIndex;

    this.yIndex = yIndex;

    this.db = null;

    this.Initialize = async function() {
        await this.CreateZoneDatabase();
    }

    this.AddEntity = async function(id, x, y, z) {
        await this.db.InsertIntoTable(this.entityTable,
            { "id": id, "x": x, "y": y, "z": z });
    }

    this.GetEntityAt = async function(x, y, z) {
        entities = await this.db.GetRows(this.entityTable,
            { "'x'": x, "'y'": y, "'z'": z });
        if (entities == null) {
            return null;
        }
        else {
            for (entity in entities) {
                return entity;
            }
        }
    }

    this.MoveEntity = async function(id, x, y, z) {

    }

    this.SetGround = async function(x, y, z, id, variant) {
        entities = await this.db.GetRows(this.groundTable,
            { "xindex": x, "yindex": y, "zindex": z });
        if (entities == null || entities.length == 0) {
            await this.db.InsertIntoTable(this.groundTable,
                { "xindex": x, "yindex": y, "zindex": z,
                "entityid": id, "entityvariant": variant }, false);
        }
        else {
            await this.db.UpdateInTable(this.groundTable,
                { "entityid": id, "entityvariant": variant },
                { "xindex": x, "yindex": y, "zindex": z });
        }
    }

    this.GetGround = async function(x, y, z) {
        entities = await this.db.Get(`SELECT * FROM ${this.groundTable}
            WHERE "xindex" = ${x} AND "yindex" = ${y} AND "zindex" = ${z}`);
        if (entities == null || entities.length == 0) {
            return null;
        }
        else {
            return entities[0];
        }
    }

    this.GetGroundRange = async function(startX, endX, startY, endY, startZ, endZ) {
        entities = await this.db.Get(`SELECT * FROM ${this.groundTable}
            WHERE "xindex" >= ${startX} AND "xindex" <= ${endX}
            AND "yindex" >= ${startY} AND "yindex" <= ${endY}
            AND "zindex" >= ${startZ} AND "zindex" <= ${endZ}`);
        if (entities == null || entities.length == 0) {
            return null;
        }
        else {
            return entities;
        }
    }

    this.SetGroundInitializationState = async function(startX, startY) {
        await this.db.InsertIntoTable(this.groundInitializationTable,
            { "startx": startX, "startY": startY });
    }

    this.GetGroundInitializationState = async function(startX, startY) {
        initializationState = await this.db.GetRows(this.groundInitializationTable,
            { "startx": startX, "starty": startY });
        if (initializationState != null && initializationState.length > 0) {
            return true;
        }
        return false;
    }

    this.CreateZoneDatabase = async function() {
        this.db = new sqliteDatabase();
        if (!fs.existsSync(this.directory)) {
            fs.mkdirSync(this.directory);
        }
        await this.db.Open(this.directory + "/" + xIndex + "-" + yIndex);
        await this.CreateEntityTable();
        await this.CreateGroundTable();
        await this.CreateGroundInitializationTable();
    }

    this.CreateEntityTable = async function() {
        await this.db.CreateTable(this.entityTable, {
            "id": this.db.text,
            "x": this.db.double, "y": this.db.double, "z": this.db.double
        });
    }

    this.CreateGroundTable = async function() {
        await this.db.CreateTable(this.groundTable, {
            "'xindex'": this.db.integer, "'yindex'": this.db.integer, "'zindex'": this.db.integer,
            "'entityid'": this.db.integer, "'entityvariant'": this.db.integer
        });
    }

    this.CreateGroundInitializationTable = async function() {
        await this.db.CreateTable(this.groundInitializationTable, {
            "'startx'": this.db.integer, "'starty'": this.db.integer
        });
    }
}