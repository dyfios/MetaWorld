const fs = require("fs");
const sqliteDatabase = require("../sqlite/sqliteDatabase");
const { exit } = require("process");

const defaultRegionOwner = "";
const defaultOwnerRead = 1;
const defaultOwnerWrite = 1;
const defaultOwnerUse = 1;
const defaultOwnerTake = 1;
const defaultOtherRead = 0;
const defaultOtherWrite = 0;
const defaultOtherUse = 0;
const defaultOtherTake = 0;

async function CreateWorld(context, dbFile) {
    console.log("Creating world " + dbFile + "...");

    OpenWorldDatabase(context, dbFile);

    console.log("Creating tables...");

    await CreateTimeTable(context);
    await CreateBiomesTable(context);

    console.log("World " + dbFile + " initialized.");
}

OpenWorldDatabase = async function(context, dbFile) {
    context.db = new sqliteDatabase();

    dbAlreadySetup = fs.existsSync(dbFile);
    if (dbAlreadySetup) {
        console.log("File " + dbFile + " already exists. Aborting...");
        exit();
    }
    await context.db.Open(dbFile);
}

CreateTimeTable = async function(context) {
    await context.db.CreateTable("time", {
        "'day'": "INT", "'seconds'": "INT"
    });
    await context.db.InsertIntoTable("time", { "day": 0, "seconds": 0 });
}

CreateBiomesTable = async function(context) {
    await context.db.CreateTable("biomes", {
        "'xindex'": "INT", "'yindex'": "INT", "'biomeid'": "INT", "'state'": "INT",
        "'owner'": "STRING",
        "'ownerread'": "INT", "'ownerwrite'": "INT", "'owneruse'": "INT", "'ownertake'": "INT",
        "'otherread'": "INT", "'otherwrite'": "INT", "'otheruse'": "INT", "'othertake'": "INT"
    });
    // TODO populate biomes.
}

SetBiome = async function(context, x, y, biome) {
    biomes = await context.db.GetRows("biomes",
        { "xindex": x, "yindex": y });
    if (biomes == null || biomes.length == 0) {
        await context.db.InsertIntoTable("biomes",
            { "xindex": x, "yindex": y, "biomeid": biome, "state": -1,
                "owner": defaultRegionOwner,
                "ownerread": defaultOwnerRead, "ownerwrite": defaultOwnerWrite, "owneruse": defaultOwnerUse, "ownertake": defaultOwnerTake,
                "otherread": defaultOtherRead, "otherwrite": defaultOtherWrite, "otheruse": defaultOtherUse, "othertake": defaultOtherTake
             }, false);
    }
    else {
        await context.db.UpdateInTable("biomes",
            { "layerid": id },
            { "xindex": x, "yindex": y, "biomeid": biome, "state": -1 });
    }
}

CreateWorld(this, "../world/world.db");