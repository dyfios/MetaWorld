const { argv } = require("process");
const sqliteDatabase = require("./sqlite/sqliteDatabase");
const fs = require("fs");
const PNG = require("pngjs").PNG;

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

this.dbFile = "./chunk-0.0.db";
this.layersFile = "./layers-0.0.png";
this.heightsFile = "./heights-0.0.png";
this.terrainFile = "./terrain-0.0.png";
this.terrainSize = 1024;

GetAllGround = async function(context, callback) {
    context.db.GetAllRows("ground", (ground) => {
        context.db.GetAllRows("ground_mods", (groundMods) => {
            result = {
                "base-ground": ground,
                "ground_mods": groundMods
            };
            callback(result);
        });
    });
}

ReadDB = async function (context, callback) {
    context.db = new sqliteDatabase();

    dbAlreadySetup = fs.existsSync(context.dbFile);
    if (!dbAlreadySetup) {
        console.log("Database file does not exist");
        return;
    }

    await context.db.Open(context.dbFile);

    GetAllGround(context, (result) => {
        //result["base-ground"].forEach(function(value){
        //    console.log(JSON.stringify(value));
        //  });
        callback(result["base-ground"]);
        //console.log(JSON.stringify(result["base-ground"][0]));
    });
}

this.terrainSize = parseInt(argv[2]);

this.dbFile = "./world/world-lowdetail.db";
this.layersFile = "./layers-lowdetail.png";
this.heightsFile = "./heights-lowdetail.png";
this.terrainFile = "./terrain-lowdetail.png";

/*let config = JSON.parse(fs.readFileSync("biomes.json", "utf8"));
let layers = {};
for (biome in config["biomes"]) {
    if (biome == this.biomeID) {
        layers = config["biomes"][biome]["terrain-layers"];
    }
}*/

ReadDB(this, (result) => {
    var layersArray = Array(this.terrainSize).fill().map(() => Array(this.terrainSize).fill(0));
    var heightsArray = Array(this.terrainSize).fill().map(() => Array(this.terrainSize).fill(0));
    result.forEach(function(value) {
        layersArray[value["xindex"]][value["yindex"]] = value["layerid"];
        heightsArray[value["xindex"]][value["yindex"]] = value["height"];
    });
    
    var layersPNG = new PNG({
        width: this.terrainSize,
        height: this.terrainSize,
        filterType: -1
    });

    var heightsPNG = new PNG({
        width: this.terrainSize,
        height: this.terrainSize,
        filterType: -1
    });

    var terrainPNG = new PNG({
        width: this.terrainSize,
        height: this.terrainSize,
        filterType: -1
    });

    for (var y = 0; y < layersPNG.height; y++) {
        for (var x = 0; x < layersPNG.width; x++) {
            var idx = (layersPNG.width * y + x) << 2;
            /*if (layersArray[x][y] == tropicalRainforest.id) {
                layersPNG.data[idx  ] = tropicalRainforest.r; // red
                layersPNG.data[idx+1] = tropicalRainforest.g; // green
                layersPNG.data[idx+2] = tropicalRainforest.b; // blue
                layersPNG.data[idx+3] = tropicalRainforest.a; // alpha (0 is transparent)
            }*/
            if (layersArray[x][y] == 7) {
                layersPNG.data[idx  ] = 209; // red
                layersPNG.data[idx+1] = 214; // green
                layersPNG.data[idx+2] = 222; // blue
                layersPNG.data[idx+3] = 255; // alpha (0 is transparent)
            }
            else if (layersArray[x][y] == 3) {
                layersPNG.data[idx  ] = 94; // red
                layersPNG.data[idx+1] = 95; // green
                layersPNG.data[idx+2] = 97; // blue
                layersPNG.data[idx+3] = 255; // alpha (0 is transparent)
            }
            else if (layersArray[x][y] == 5) {
                layersPNG.data[idx  ] = 163; // red
                layersPNG.data[idx+1] = 146; // green
                layersPNG.data[idx+2] = 108; // blue
                layersPNG.data[idx+3] = 255; // alpha (0 is transparent)
            }
            else if (layersArray[x][y] == 2) {
                layersPNG.data[idx  ] = 84; // red
                layersPNG.data[idx+1] = 107; // green
                layersPNG.data[idx+2] = 61; // blue
                layersPNG.data[idx+3] = 255; // alpha (0 is transparent)
            }
            else if (layersArray[x][y] == 4) {
                layersPNG.data[idx  ] = 138; // red
                layersPNG.data[idx+1] = 156; // green
                layersPNG.data[idx+2] = 121; // blue
                layersPNG.data[idx+3] = 255; // alpha (0 is transparent)
            }

            heightsPNG.data[idx  ] = heightsArray[x][y] / 2; // red
            heightsPNG.data[idx+1] = heightsArray[x][y] / 2; // green
            heightsPNG.data[idx+2] = heightsArray[x][y] / 2; // blue
            heightsPNG.data[idx+3] = 255; // alpha (0 is transparent)

            if (heightsArray[x][y] > 127) {
                if (heightsArray[x][y] < 129) {
                    terrainPNG.data[idx  ] = 163; // red
                    terrainPNG.data[idx+1] = 146; // green
                    terrainPNG.data[idx+2] = 108; // blue
                    terrainPNG.data[idx+3] = 255; // alpha (0 is transparent)
                }
                else if (heightsArray[x][y] < 190) {
                    terrainPNG.data[idx  ] = 50; // red
                    terrainPNG.data[idx+1] = 21 + heightsArray[x][y]; // green
                    terrainPNG.data[idx+2] = 135; // blue
                    terrainPNG.data[idx+3] = 255; // alpha (0 is transparent)
                }
                else if (heightsArray[x][y] < 200) {
                    terrainPNG.data[idx  ] = 101; // red
                    terrainPNG.data[idx+1] = 125 + heightsArray[x][y]; // green
                    terrainPNG.data[idx+2] = 114; // blue
                    terrainPNG.data[idx+3] = 255; // alpha (0 is transparent)
                }
                else {
                    terrainPNG.data[idx  ] = heightsArray[x][y] / 2; // red
                    terrainPNG.data[idx+1] = heightsArray[x][y] / 2; // green
                    terrainPNG.data[idx+2] = heightsArray[x][y] / 2; // blue
                    terrainPNG.data[idx+3] = 255; // alpha (0 is transparent)
                }
            }
            else {
                terrainPNG.data[idx  ] = 3; // red
                terrainPNG.data[idx+1] = 140; // green
                terrainPNG.data[idx+2] = 252; // blue
                terrainPNG.data[idx+3] = 255; // alpha (0 is transparent)
            }
        }
    }
    layersPNG.pack().pipe(fs.createWriteStream(this.layersFile));
    heightsPNG.pack().pipe(fs.createWriteStream(this.heightsFile));
    terrainPNG.pack().pipe(fs.createWriteStream(this.terrainFile));
});