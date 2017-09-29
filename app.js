const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const TARGET_IMAGES_PATH = 'uploads';

const CONFIG = require('./lib/config');

const multer = require('multer'); // v1.0.5
const printAPI = require('./lib/converter/');

const upload = multer({dest: CONFIG.TARGET_IMAGES_PATH + '/'}); // for parsing multipart/form-data
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Serve index html file
app.get('/', function (req, res) {
    res.sendFile('public/index.html', {root: __dirname });
})

// Route to handle image upload
app.post('/api/print', upload.single('img-upld'), function (req, res) {
    const tmpPath = req.file.path;
    const targetPath = CONFIG.TARGET_IMAGES_PATH + '/' + req.file.originalname;

    /** A better way to copy the uploaded file. **/
    const src = fs.createReadStream(tmpPath);
    const dest = fs.createWriteStream(targetPath);
    
    src.pipe(dest);
    src.on('end', function() { 
        console.info('File copied from ' + tmpPath + ' to ' + targetPath);
        
        // TODO: Fix this as it may be printing all black images
        printAPI.generateImages(req.file.originalname, 0.5, 0.5);
    });
    src.on('error', function(err) {
        console.error('An error occurred processing file streams');
    });

    // Handle this properly, return a json with a status code.
    res.json({
        response: 'Hello World'
    });
});

app.listen(3000, function () {
    console.info('Initialising server');
});
