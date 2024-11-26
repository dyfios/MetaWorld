const fs = require("fs");
const PNG = require("pngjs").PNG;
const sqliteDatabase = require("./sqliteDatabase");

let tropicalRainforest = { r: 0, g: 0, b: 0, a: 255, id: 0 };
let coldDesert = { r: 64, g: 64, b: 64, a: 255, id: 1 };
let hotDesert = { r: 255, g: 0, b: 0, a: 255, id: 2 };
let mountains = { r: 255, g: 106, b: 0, a: 255, id: 3 };
let temperateSwamp = { r: 255, g: 216, b: 0, a: 255, id: 4 };
let temperateRainforest = { r: 182, g: 255, b: 0, a: 255, id: 5 };
let grassland = { r: 0, g: 255, b: 33, a: 255, id: 6 };
let temperateOcean = { r: 0, g: 255, b: 255, a: 255, id: 7 };
let coldOcean = { r: 0, g: 38, b: 255, a: 255, id: 8 };
let mediterranean = { r: 178, g: 0, b: 255, a: 255, id: 9 };
let savanna = { r: 255, g: 0, b: 220, a: 255, id: 10 };
let polarDesert = { r: 255, g: 255, b: 255, a: 255, id: 11 };
let hotSwamp = { r: 127, g: 51, b: 0, a: 255, id: 12 };
let forest = { r: 31, g: 127, b: 0, a: 255, id: 13 };
let tundra = { r: 128, g: 128, b: 128, a: 255, id: 14 };
let plains = { r: 255, g: 127, b: 127, a: 255, id: 15 };
let hotOcean = { r: 0, g: 148, b: 255, a: 255, id: 16 };
let coldSwamp = { r: 127, g: 63, b: 118, a: 255, id: 17 };
let frozenOcean = { r: 0, g: 19, b: 127, a: 255, id: 18 };
let taiga = { r: 127, g: 106, b: 0, a: 255, id: 19 };
let coldPlains = { r: 255, g: 215, b: 181, a: 255, id: 20 };

let margin = 10;

this.dbFile = "./biomes.db";
this.pngFile = "./biomes.png";

CreateDatabase = async function (context, dbFile, pngFile) {
    context.db = new sqliteDatabase();

    dbAlreadySetup = fs.existsSync(dbFile);
    if (dbAlreadySetup) {
        console.log("File " + dbFile + " already exists. Aborting.");
    }
    await context.db.Open(dbFile);
    if (!dbAlreadySetup) {
        await CreateBiomesTable(context);

        fs.createReadStream(pngFile)
        .pipe(
            new PNG({
            filterType: 4,
            }),
        )
        .on('parsed', function () {
            let lastValid = forest.id;
            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    var idx = (this.width * y + x) << 2;

                    if (Math.abs(this.data[idx] - tropicalRainforest.r) < margin &&
                        Math.abs(this.data[idx + 1] - tropicalRainforest.g) < margin &&
                        Math.abs(this.data[idx + 2] - tropicalRainforest.b) < margin) {
                            lastValid = tropicalRainforest.id;
                            SetBiome(context, x, y, tropicalRainforest.id);
                    }
                    else if (Math.abs(this.data[idx] - coldDesert.r) < margin &&
                        Math.abs(this.data[idx + 1] - coldDesert.g) < margin &&
                        Math.abs(this.data[idx + 2] - coldDesert.b) < margin) {
                            lastValid = coldDesert.id;
                            SetBiome(context, x, y, coldDesert.id);
                    }
                    else if (Math.abs(this.data[idx] - hotDesert.r) < margin &&
                        Math.abs(this.data[idx + 1] - hotDesert.g) < margin &&
                        Math.abs(this.data[idx + 2] - hotDesert.b) < margin) {
                            lastValid = hotDesert.id;
                            SetBiome(context, x, y, hotDesert.id);
                    }
                    else if (Math.abs(this.data[idx] - mountains.r) < margin &&
                        Math.abs(this.data[idx + 1] - mountains.g) < margin &&
                        Math.abs(this.data[idx + 2] - mountains.b) < margin) {
                            lastValid = mountains.id;
                            SetBiome(context, x, y, mountains.id);
                    }
                    else if (Math.abs(this.data[idx] - temperateSwamp.r) < margin &&
                        Math.abs(this.data[idx + 1] - temperateSwamp.g) < margin &&
                        Math.abs(this.data[idx + 2] - temperateSwamp.b) < margin) {
                            lastValid = temperateSwamp.id;
                            SetBiome(context, x, y, temperateSwamp.id);
                    }
                    else if (Math.abs(this.data[idx] - temperateRainforest.r) < margin &&
                        Math.abs(this.data[idx + 1] - temperateRainforest.g) < margin &&
                        Math.abs(this.data[idx + 2] - temperateRainforest.b) < margin) {
                            lastValid = temperateRainforest.id;
                            SetBiome(context, x, y, temperateRainforest.id);
                    }
                    else if (Math.abs(this.data[idx] - grassland.r) < margin &&
                        Math.abs(this.data[idx + 1] - grassland.g) < margin &&
                        Math.abs(this.data[idx + 2] - grassland.b) < margin) {
                            lastValid = grassland.id;
                            SetBiome(context, x, y, grassland.id);
                    }
                    else if (Math.abs(this.data[idx] - temperateOcean.r) < margin &&
                        Math.abs(this.data[idx + 1] - temperateOcean.g) < margin &&
                        Math.abs(this.data[idx + 2] - temperateOcean.b) < margin) {
                            lastValid = temperateOcean.id;
                            SetBiome(context, x, y, temperateOcean.id);
                    }
                    else if (Math.abs(this.data[idx] - coldOcean.r) < margin &&
                        Math.abs(this.data[idx + 1] - coldOcean.g) < margin &&
                        Math.abs(this.data[idx + 2] - coldOcean.b) < margin) {
                            lastValid = coldOcean.id;
                            SetBiome(context, x, y, coldOcean.id);
                    }
                    else if (Math.abs(this.data[idx] - mediterranean.r) < margin &&
                        Math.abs(this.data[idx + 1] - mediterranean.g) < margin &&
                        Math.abs(this.data[idx + 2] - mediterranean.b) < margin) {
                            lastValid = mediterranean.id;
                            SetBiome(context, x, y, mediterranean.id);
                    }
                    else if (Math.abs(this.data[idx] - savanna.r) < margin &&
                        Math.abs(this.data[idx + 1] - savanna.g) < margin &&
                        Math.abs(this.data[idx + 2] - savanna.b) < margin) {
                            lastValid = savanna.id;
                            SetBiome(context, x, y, savanna.id);
                    }
                    else if (Math.abs(this.data[idx] - polarDesert.r) < margin &&
                        Math.abs(this.data[idx + 1] - polarDesert.g) < margin &&
                        Math.abs(this.data[idx + 2] - polarDesert.b) < margin) {
                            lastValid = polarDesert.id;
                            SetBiome(context, x, y, polarDesert.id);
                    }
                    else if (Math.abs(this.data[idx] - hotSwamp.r) < margin &&
                        Math.abs(this.data[idx + 1] - hotSwamp.g) < margin &&
                        Math.abs(this.data[idx + 2] - hotSwamp.b) < margin) {
                            lastValid = hotDesert.id;
                            SetBiome(context, x, y, hotSwamp.id);
                    }
                    else if (Math.abs(this.data[idx] - forest.r) < margin &&
                        Math.abs(this.data[idx + 1] - forest.g) < margin &&
                        Math.abs(this.data[idx + 2] - forest.b) < margin) {
                            lastValid = forest.id;
                            SetBiome(context, x, y, forest.id);
                    }
                    else if (Math.abs(this.data[idx] - tundra.r) < margin &&
                        Math.abs(this.data[idx + 1] - tundra.g) < margin &&
                        Math.abs(this.data[idx + 2] - tundra.b) < margin) {
                            lastValid = tundra.id;
                            SetBiome(context, x, y, tundra.id);
                    }
                    else if (Math.abs(this.data[idx] - plains.r) < margin &&
                        Math.abs(this.data[idx + 1] - plains.g) < margin &&
                        Math.abs(this.data[idx + 2] - plains.b) < margin) {
                            lastValid = plains.id;
                            SetBiome(context, x, y, plains.id);
                    }
                    else if (Math.abs(this.data[idx] - hotOcean.r) < margin &&
                        Math.abs(this.data[idx + 1] - hotOcean.g) < margin &&
                        Math.abs(this.data[idx + 2] - hotOcean.b) < margin) {
                            lastValid = hotOcean.id;
                            SetBiome(context, x, y, hotOcean.id);
                    }
                    else if (Math.abs(this.data[idx] - coldSwamp.r) < margin &&
                        Math.abs(this.data[idx + 1] - coldSwamp.g) < margin &&
                        Math.abs(this.data[idx + 2] - coldSwamp.b) < margin) {
                            lastValid = coldSwamp.id;
                            SetBiome(context, x, y, coldSwamp.id);
                    }
                    else if (Math.abs(this.data[idx] - frozenOcean.r) < margin &&
                        Math.abs(this.data[idx + 1] - frozenOcean.g) < margin &&
                        Math.abs(this.data[idx + 2] - frozenOcean.b) < margin) {
                            lastValid = frozenOcean.id;
                            SetBiome(context, x, y, frozenOcean.id);
                    }
                    else if (Math.abs(this.data[idx] - taiga.r) < margin &&
                        Math.abs(this.data[idx + 1] - taiga.g) < margin &&
                        Math.abs(this.data[idx + 2] - taiga.b) < margin) {
                            lastValid = taiga.id;
                            SetBiome(context, x, y, taiga.id);
                    }
                    else if (Math.abs(this.data[idx] - coldPlains.r) < margin &&
                        Math.abs(this.data[idx + 1] - coldPlains.g) < margin &&
                        Math.abs(this.data[idx + 2] - coldPlains.b) < margin) {
                            lastValid = coldPlains.id;
                            SetBiome(context, x, y, coldPlains.id);
                    }
                    else {
                        console.log("Out of range at index " + x + "," + y + ". Setting to last valid.");
                        SetBiome(context, x, y, lastValid);
                    }
                }
            }
        });
    }
}

CreateBiomesTable = async function(context) {
    await context.db.CreateTable("biomes", {
        "'xindex'": "INT", "'yindex'": "INT", "'biomeid'": "INT", "'state'": "INT"
    });
}

SetBiome = async function(context, x, y, biome) {
    biomes = await context.db.GetRows("biomes",
        { "xindex": x, "yindex": y });
    if (biomes == null || biomes.length == 0) {
        await context.db.InsertIntoTable("biomes",
            { "xindex": x, "yindex": y, "biomeid": biome, "state": -1 }, false);
    }
    else {
        await context.db.UpdateInTable("biomes",
            { "layerid": id },
            { "xindex": x, "yindex": y, "biomeid": biome, "state": -1 });
    }
}

CreateDatabase(this, this.dbFile, this.pngFile);