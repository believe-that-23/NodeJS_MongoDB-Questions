const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../middleware/upload');
const fs = require('fs');
const CleanCSS = require('clean-css');
const UglifyJS = require('uglify-js');

// Define the destination folder for uploaded files
const uploadMulter = multer({ storage: upload.storage });

router.get('/', (req, res) => {
    res.render('upload');
});

router.post('/reduce', uploadMulter.fields([{ name: 'cssFile' }, { name: 'jsFile' }]), (req, res) => {
    const cssFile = req.files.cssFile[0];
    const jsFile = req.files.jsFile[0];
    const minifiedFolderPath = 'public/minified';

    const cssContent = fs.readFileSync(cssFile.path, 'utf-8');
    const minifiedCSS = new CleanCSS().minify(cssContent).styles;

    const jsContent = fs.readFileSync(jsFile.path, 'utf-8');
    const minifiedJS = UglifyJS.minify(jsContent).code;

    fs.writeFileSync(`${minifiedFolderPath}/minified.css`, minifiedCSS);
    fs.writeFileSync(`${minifiedFolderPath}/minified.js`, minifiedJS);

    res.render('result', {
        minifiedCSS,
        minifiedJS
    });
});

router.get('/download', (req, res) => {
    const fileType = req.query.file;

    if (fileType === 'minifiedCSS') {
        res.download('public/minified/minified.css', 'minified.css');
    } else if (fileType === 'minifiedJS') {
        res.download('public/minified/minified.js', 'minified.js');
    } else {
        res.status(404).send('File not found');
    }
});

module.exports = router;
