const entityVariant = require("./entityvariant");

module.exports = function(tag, type, variants) {
    this.tag = tag;
    this.type = type;
    this.variants = variants;
}