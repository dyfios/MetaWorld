const { argv } = require("process");
const { spawnSync } = require("child_process");
const sqliteDatabase = require("../sqlite/sqliteDatabase");
const fs = require('fs');
const path = require("path");

this.db = null;
this.dbFile = "../world/world.db";

this.minX = parseInt(argv[2]);
this.maxX = parseInt(argv[3]);
this.minY = parseInt(argv[4]);
this.maxY = parseInt(argv[5]);
this.chunkDirectory = argv[6];

GetAllBiomes = async function(context, callback) {
    context.db.GetAllRows("biomes", (biomes) => {
        result = {
            "biomes": biomes
        };
        callback(result);
    });
}

GetBiome = async function(context, x, y, callback) {
    context.db.GetRows("biomes", { "xindex": x, "yindex": y }, (biomes) => {
        if (biomes == null || biomes.length < 1) {
            if (callback != null) callback(null);
        }
        else {
            if (biomes[0]["biomeid"] == null) {
                if (callback != null) callback(null);
            }
            else {
                if (callback != null) callback(biomes[0]["biomeid"]);
            }
        }
    });
}

OpenDB = async function (context, callback) {
    context.db = new sqliteDatabase();

    dbAlreadySetup = fs.existsSync(context.dbFile);
    if (!dbAlreadySetup) {
        console.log("Database file does not exist");
        return;
    }

    await context.db.Open(context.dbFile);
    callback();
}

let config = JSON.parse(fs.readFileSync("../biomes.json", "utf8"));

OpenDB(this, () => {
    for (let i = this.minX; i <= this.maxX; i++) {
        for (let j = this.minY; j <= this.maxY; j++) {
            GetBiome(this, i, j, (biomeID) => {
                var arguments = [ "regiongenerator.js", i, i, j, j,
                    this.chunkDirectory, config["world-seed"],
                    config["ground-chunk-size"], config["ground-chunk-height"],
                config["biomes"][biomeID.toString()]["terrain-variability"],
                config["ground-heightmap-scale"], config["water-level"] ];


                id = 0;
                largeFloraDensities = {};
                for (largeFloraEntity in config["biomes"][biomeID.toString()]["large-flora-entities"]) {
                    largeFloraDensities[id++] = {
                        "entity-id": config["biomes"][biomeID.toString()]["large-flora-entities"][largeFloraEntity]["entity-id"],
                        "variant-id": config["biomes"][biomeID.toString()]["large-flora-entities"][largeFloraEntity]["variant-id"],
                        "density":
                            config["biomes"][biomeID.toString()]["large-flora-entities"][largeFloraEntity]["proportion"]
                            * config["biomes"][biomeID.toString()]["large-flora"]
                    };
                }
                arguments.push(JSON.stringify(largeFloraDensities));

                id = 0;
                mediumFloraDensities = {};
                for (mediumFloraEntity in config["biomes"][biomeID.toString()]["medium-flora-entities"]) {
                    mediumFloraDensities[id++] = {
                        "entity-id": config["biomes"][biomeID.toString()]["medium-flora-entities"][mediumFloraEntity]["entity-id"],
                        "variant-id": config["biomes"][biomeID.toString()]["medium-flora-entities"][mediumFloraEntity]["variant-id"],
                        "density":
                            config["biomes"][biomeID.toString()]["medium-flora-entities"][mediumFloraEntity]["proportion"]
                            * config["biomes"][biomeID.toString()]["medium-flora"]
                    };
                }
                arguments.push(JSON.stringify(mediumFloraDensities));

                id = 0;
                smallFloraDensities = {};
                for (smallFloraEntity in config["biomes"][biomeID.toString()]["small-flora-entities"]) {
                    smallFloraDensities[id++] = {
                        "entity-id": config["biomes"][biomeID.toString()]["small-flora-entities"][smallFloraEntity]["entity-id"],
                        "variant-id": config["biomes"][biomeID.toString()]["small-flora-entities"][smallFloraEntity]["variant-id"],
                        "density":
                            config["biomes"][biomeID.toString()]["small-flora-entities"][smallFloraEntity]["proportion"]
                            * config["biomes"][biomeID.toString()]["small-flora"]
                    };
                }
                arguments.push(JSON.stringify(smallFloraDensities));

                for (layer in config["biomes"][biomeID.toString()]["terrain-layers"]) {
                    arguments.push(config["biomes"][biomeID.toString()]["terrain-layers"][layer]["max-height"]);
                    arguments.push(config["biomes"][biomeID.toString()]["terrain-layers"][layer]["layer"]);
                }
                
                if (!fs.existsSync(path.join("../world", "world-chunks", "chunk-" + i + "." + j + ".db"))) {
                    console.log("Creating " + i + "," + j);
                    let child = spawnSync('node', arguments);
                }

                /*child.stdout.on('data', (data) => {
                    console.log(`stdout: ${data}`);
                });
                    
                child.stderr.on('error', (data) => {
                    console.error(`stderr: ${data}`);
                });
                    
                child.on('close', (code) => {
                    console.log(`child process exited with code ${code}`);
                });*/

                //console.log(config["biomes"][biomeID.toString()]["terrain-layers"]);
            });
        }
    }
    /*var arguments = [ "regiongenerator.js", this.minX, this.maxX,
        this.minY, this.maxY, this.chunkDirectory,
        config["world-seed"], config["ground-chunk-size"],
        config["ground-chunk-height"], i.toString(), j.toString() ];
    
    let child = spawn('node', arguments);*/
});

/*for (var biome in config["biomes"]) {
    console.log(config["biomes"][biome]);
}*/


/*for (let i = 0; i < 512; i += 4) {
    for (let j = 0; j < 512; j+= 4) {
        execSync("node ./regiongenerator.js " + i + " " + (i + 3) +
            " " + j + " " + (j + 3) + " " + chunkDirectory + " " +
            seed + " " + chunkSize + " " + chunkHeight)
    }
}*/