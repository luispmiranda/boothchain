const converter = require('./imagemagick-converter');
const CONFIG = require('../config');

function generateImages(filePath, contrast, brightness) {
    const IMAGE_PARAMS = [
        '-resize',
        '384x2000',
        '-level',
        (contrast*100)+'%,'+(brightness*100)+'%',
        '-colorspace',
        'gray'
    ];

    const timestamp = new Date().getTime();
    const finalPaths = CONFIG.TARGET_IMAGES_PATH + '/final_' + timestamp;
    
    // Needs to be absolute path
    converter.convert(CONFIG.TARGET_IMAGES_PATH + '/' + filePath, finalPaths + '-%d.png', IMAGE_PARAMS, (err, response) => {
        if (err) {
            console.error('An error ocurred converting images', err);
        }
        
        console.info('Image ' + response + ' generated with success');
        return response;
    });
}

module.exports = {
    generateImages
};