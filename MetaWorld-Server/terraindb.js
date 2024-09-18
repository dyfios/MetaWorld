const fs = require("fs");
const sqliteDatabase = require("./sqliteDatabase");

this.SetGround = async function(x, y, z, id) {
    entities = await this.db.GetRows(this.groundTable,
        { "xindex": x, "yindex": y, "zindex": z });
    if (entities == null || entities.length == 0) {
        await this.db.InsertIntoTable(this.groundTable,
            { "xindex": x, "yindex": y, "zindex": z,
            "layerid": id }, false);
    }
    else {
        await this.db.UpdateInTable(this.groundTable,
            { "layerid": id },
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

this.CreateDatabase = async function() {
    this.db = new sqliteDatabase();
    if (!fs.existsSync(this.directory)) {
        fs.mkdirSync(this.directory);
    }
    await this.db.Open(this.directory + "/" + xIndex + "-" + yIndex);
    await this.CreateGroundTable();
}

this.CreateGroundTable = async function() {
    await this.db.CreateTable(this.groundTable, {
        "'xindex'": this.db.integer, "'yindex'": this.db.integer, "'height'": this.db.integer,
        "'layerid'": this.db.integer
    });
}