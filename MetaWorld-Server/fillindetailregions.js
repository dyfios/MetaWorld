const { argv } = require("process");
const fs = require("fs");
const { spawnSync } = require("child_process");
const path = require("path");

this.minXIndex = parseInt(argv[2]);
this.maxXIndex = parseInt(argv[3]);
this.minYIndex = parseInt(argv[4]);
this.maxYIndex = parseInt(argv[5]);

for (var x = this.minXIndex; x <= this.maxXIndex; x++) {
    for (var y = this.minYIndex; y <= this.maxYIndex; y++) {
        if (!fs.existsSync(path.join("./world", "world-chunks", "chunk-" + x + "." + y + ".db"))) {
            continue;
        } console.log(x + " " + y);
        let child = spawnSync('node', [ "./fillindetailregion.js", x, y ]);
        fs.copyFileSync("./terrain-highdetail-new.png", "./terrain-highdetail.png");
    }
}