const imagemagick = require('imagemagick');
const IMAGE_CONFIGS = {
    maxHeight: 100,
    splitHeight: 100
};

function getDimensions(source, cb) {
    return imagemagick.identify(['-format', '%wx%h', source], function (err, output) {
        if (err) {
            console.error('Could not get image dimensions for source: ' + source, err);
            return cb(err);
        }

        // Calculate width and height
        output.match(/\s*(\d+)\s*x\s*(\d+)/);
        const dimensions = [RegExp.$1, RegExp.$2];

        console.info('Dimensions for image ' + source + ' are [' + dimensions[0] + ',' + dimensions[1] + ']');
        return cb(null, {w: +dimensions[0], h: +dimensions[1]});
        
    });
}

function convert(source, destination, params, cb) {
    const args = [source];

    return getDimensions(source, function (err, dimensions) {
        if (err) {
            console.error('Could not get convert image for ' + source + ':', err);
            return cb(err);
        }

        // If width is bigger than height, rotate and swap dimensions
        if (dimensions.w > dimensions.h) {
            params.unshift('-rotate', '90');

            dimensions = {
                h: dimensions.w,
                w: dimensions.h
            };
        }
        
        // If height is bigger than max height, adjust according to max height
        if (dimensions.h > IMAGE_CONFIGS.maxHeight) {
            params.push('-crop', '384x' + IMAGE_CONFIGS.splitHeight);
        }
        
        // Build params
        params.forEach((param) => {
            args.push(param);
        });
        args.push(destination);        

        console.info('Converting image ' + source + ' to ' + destination + ':');
        console.info('Convert ' + args.join(' '));
        
        return imagemagick.convert(args, cb);
    });
};

module.exports = {
    convert
};