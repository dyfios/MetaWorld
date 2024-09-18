const entity = require("./entity");

module.exports = function() {
    this.entityTable = {}

    this.AddEntity = function(id, entityToAdd) {
        this.entityTable[id] = entityToAdd;
    }

    this.GetEntityByID = function(id) {
        return this.entityTable[id];
    }
}