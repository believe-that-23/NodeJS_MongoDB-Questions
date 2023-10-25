const multer = require('multer');

// Define the destination folder and file naming
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'cssFile') {
            cb(null, 'public/css');
        } else if (file.fieldname === 'jsFile') {
            cb(null, 'public/js');
        } else {
            cb(new Error('Invalid field name'));
        }
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

module.exports = {
    storage,
};
