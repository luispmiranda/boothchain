const TARGET_IMAGES_PATH = 'uploads';

const THERMAL_PRINTER_CONFIG = {
    SERIAL_PORT: {
        MAX_PRINTING_DOTS: 5,
        HEATING_TIME: 250,
        HEATING_INTERVAL: 100,
        COMMAND_DEAY: 500
    }
}

const PATHS = {
    system    : 'uploads/system',
    tmp       : 'uploads/tmp',
    originals : 'uploads/originals',
    finals    : 'uploads/finals'
};

module.exports = {
    TARGET_IMAGES_PATH,
    THERMAL_PRINTER_CONFIG,
    PATHS
};
