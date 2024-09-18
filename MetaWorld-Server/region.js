const zone = require("./zone");

module.exports = function(directory, entityTable, regionSize, groundSeed, groundChunkSize, groundChunkHeight, terrainGenerator, xIndex, yIndex, zoneSize) {
    this.directory = directory;

    this.entityTable = entityTable;

    this.regionSize = regionSize;

    this.groundSeed = groundSeed;

    this.groundChunkSize = groundChunkSize;

    this.groundChunkHeight = groundChunkHeight;

    this.terrainGenerator = terrainGenerator;

    this.xIndex = xIndex;

    this.yIndex = yIndex;

    this.zoneSize = zoneSize;

    this.zones = [];

    this.Initialize = async function() {
        for (let i = 0; i < this.regionSize; i++) {
            this.zones[i] = [];
            for (let j = 0; j < this.regionSize; j++) {
                let nz = new zone(directory,
                    this.regionSize, this.xIndex, this.yIndex, this.zoneSize, i, j);
                    await nz.Initialize();
                    this.zones[i][j] = nz;
            }
        }
        var startX = this.xIndex * regionSize * zoneSize;
        var startY = this.yIndex * regionSize * zoneSize;
        numberOfChunks = (regionSize * zoneSize) / groundChunkSize;
        for (let i = 0; i < numberOfChunks; i++) {
            for (let j = 0; j < numberOfChunks; j++) {
                if (await this.GetGroundInitializationState(i * groundChunkSize, j * groundChunkSize)) {
                    continue;
                }
                heights = terrainGenerator.GetChunkHeights(
                    startX + i * groundChunkSize, startY + j * groundChunkSize);
                for (let y = 0; y < groundChunkSize; y++) {
                    for (let x = 0; x < groundChunkSize; x++) {
                        for (let z = 0; z < heights[x][y]; z++) {
                            await this.SetGround(i * groundChunkSize + x, j * groundChunkSize + y, z, 1, 0);
                        }
                    }
                }
                await this.SetGroundInitializationState(i * groundChunkSize, j * groundChunkSize);
            }
        }
    }

    this.AddEntity = async function(id, x, y, z) {
        zn = this.FindZone(x, y);
        coords = this.ToZoneCoords(zn, x, y, z);
        return await zn.AddEntity(id, coords.x, coords.y, coords.z);
    }

    this.SetGround = async function(x, y, z, id, variant) {
        zn = this.FindZone(x, y);
        coords = this.ToZoneCoords(zn, x, y, z);
        //console.log(x + " " + y + " zone " + zn.xIndex + " " + zn.yIndex);
        await zn.SetGround(x, y, z, id, variant);
    }

    this.GetGround = async function(x, y, z) {
        zn = this.FindZone(x, y);
        coords = this.ToZoneCoords(zn, x, y, z);
        return await zn.GetGround(x, y, z);
    }

    this.GetGroundChunk = async function (startX, startY) {
        zn = this.FindZone(x, y);
        startCoords = this.ToZoneCoords(zn, startX, startY, 0);
        return await zn.GetGroundRange(startX, startX + groundChunkSize - 1,
            startY, startY + groundChunkSize - 1, 0, groundChunkHeight - 1);
    }

    this.FindZone = function(x, y) {
        var xI = Math.floor(x / this.zoneSize);
        var yI = Math.floor(y / this.zoneSize);
        return this.zones[xI][yI];
    }

    this.SetGroundInitializationState = async function(startX, startY) {
        zn = this.FindZone(startX, startY);
        zn.SetGroundInitializationState(startX, startY);
    }

    this.GetGroundInitializationState = async function(startX, startY) {
        zn = this.FindZone(startX, startY);
        return zn.GetGroundInitializationState(startX, startY);
    }

    this.ToZoneCoords = function(zoneOfInterest, x, y, z) {
        var xI = Math.floor(x / this.zoneSize);
        var yI = Math.floor(y / this.zoneSize);
        var xCoord = x - xI * zoneOfInterest.zoneSize;
        var yCoord = y - yI * zoneOfInterest.zoneSize;
        
        return { x: xCoord, y: yCoord, z: z };
    }
}