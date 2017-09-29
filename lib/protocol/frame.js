function Frame(path, contrast, brightness) {
    this.path = path;
    this.contrast = contrast;
    this.brightness = brightness;
}

Frame.prototype.toString() {
    return ['file=',this.path,'contrast=',this.contrast,'brightness',this.brightness].join(' ');
};

function parseFrame(frameString) {
    const file = frameString[0].split('=')[1];
    const contrast = frameString[1].split('=')[1];
    const brightness = frameString[2].split('=')[1];

    return new Frame(file, contrast, brightness);
}

module.exports = {
    Frame,
    parseFrame
};