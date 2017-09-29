const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const TARGET_IMAGES_PATH = 'uploads';

const multer = require('multer'); // v1.0.5
const upload = multer({dest: TARGET_IMAGES_PATH + '/'}); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Serve index html file
app.get('/', function (req, res) {
    res.sendFile('index.html', {root: __dirname });
})

// Route to handle image upload
app.post('/api/print', upload.single('img-upld'), function (req, res) {
    const tmpPath = req.file.path;
    const targetPath = TARGET_IMAGES_PATH + '/' + req.file.originalname;

     /** A better way to copy the uploaded file. **/
    const src = fs.createReadStream(tmpPath);
    const dest = fs.createWriteStream(targetPath);
    src.pipe(dest);
    src.on('end', function() { res.render('complete'); });
    src.on('error', function(err) { res.render('error'); });

    res.send('Hello World');  
});

app.listen(3000, function () {
    console.info('Initialising server');
});
