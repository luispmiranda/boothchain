const imageMagickAdapter = require('./imagemagick-adapter');
const CONFIG = require('./config');

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
    imageMagickAdapter.convert(CONFIG.TARGET_IMAGES_PATH + '/' + filePath, finalPaths + '-%d.png', IMAGE_PARAMS, (err, ok) => {

        console.log('err' + err);
        console.log(ok);
    });
    
}

module.exports = {
    generateImages
};