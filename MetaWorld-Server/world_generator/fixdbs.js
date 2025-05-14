const { argv } = require("process");
const sqliteDatabase = require("../sqlite/sqliteDatabase");
const fs = require('fs');
const path = require('path');

OpenDB = async function (path, callback) {
    var db = new sqliteDatabase();

    dbAlreadySetup = fs.existsSync(path);
    if (!dbAlreadySetup) {
        console.log("Database file does not exist");
        return;
    }

    await db.Open(path);
    callback(db);
}

fs.readdir(argv[2], (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
    } else {
        files.forEach((file) => {
        if (file.endsWith(".db")) {
            OpenDB(path.join(argv[2], file), (db) => {
                //db.AddColumnToTable("'entities'", "state", "STRING");
                db.AddColumnToTable("'entities'", "owner", "STRING");
                db.AddColumnToTable("'entities'", "ownerRead", "INTEGER");
                db.AddColumnToTable("'entities'", "ownerWrite", "INTEGER");
                db.AddColumnToTable("'entities'", "ownerUse", "INTEGER");
                db.AddColumnToTable("'entities'", "ownerTake", "INTEGER");
                db.AddColumnToTable("'entities'", "otherRead", "INTEGER");
                db.AddColumnToTable("'entities'", "otherWrite", "INTEGER");
                db.AddColumnToTable("'entities'", "otherUse", "INTEGER");
                db.AddColumnToTable("'entities'", "otherTake", "INTEGER");
            });
        }
        });
    }
});