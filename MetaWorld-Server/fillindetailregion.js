const { argv } = require("process");
const sharp = require('sharp');

async function changePartOfImage(xIndex, yIndex) {
    try {
        const originalImage = "./terrain-highdetail.png";
        const overlayImage = "./images/terrain-" + xIndex + "." + yIndex + ".png";
        const outputImage = "./terrain-highdetail-new.png";
        const resizedTile = "./tile-resized.png";

        const original = sharp(originalImage, { limitInputPixels: 2000000000000000 });
        //const overlay = sharp(overlayImage);

        // Get metadata of the original image
        const metadata = await original.metadata();

        // Define the region to replace
        const width = 64;
        const height = 64;
        const left = xIndex * width;
        const top = yIndex * height;
console.log(left + " " + top);
        const overlay = await sharp(overlayImage)
            .resize(width, height)
            .png()
            .toFile(resizedTile, (err, info) => {
                sharp(originalImage, { limitInputPixels: 2000000000000000 })
                    .composite([{
                        input: resizedTile,
                        left: left,
                        top: top
                    }])
                    .toFile(outputImage);

        console.log('Image modified successfully!');
            })
            /*.then( data => {
                
            })*/
  //.catch( err => { ... });*/
    } catch (error) {
        console.error('Error:', error);
    }
}

this.chunkXIndex = parseInt(argv[2]);
this.chunkYIndex = parseInt(argv[3]);
this.terrainSize = 512;

changePartOfImage(this.chunkXIndex, this.chunkYIndex);