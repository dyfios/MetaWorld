const fs = require("fs");
const { exit } = require("process");
const metaworld = require("./metaworld");

data = fs.readFileSync("entitytable.json");
if (data == null) {
    exit(-1);
}
entityTable = JSON.parse(data.toString());

let metawrld = new metaworld("./world", entityTable, 25, 16, 128, 4, 32);
metawrld.StartServer();