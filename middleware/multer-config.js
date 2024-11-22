const multer = require('multer');
const sharp = require('sharp');
path = require('path');
fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        callback(null, name + Date.now() + '.webp');
    }
});

const filter = (req, file, callback) => {
    if (file.mimetype.split("/")[0] === 'image') {
        callback(null, true);
    } else {
        callback(new Error("Only image files are supported"));
    }
};

const upload = multer({ storage: storage, fileFilter: filter }).single('image');

const optimize = (req, res, next) => {
    if (req.file) {
        const filePath = req.file.path;
        const output = path.join('images', `opt_${req.file.filename}`);
        sharp(filePath)
            .resize({ width: null, height: 568, fit: 'inside', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .webp()
            .toFile(output)
            .then(() => {
                fs.unlink(filePath, () => {
                    req.file.path = output;
                    next();
                })
            })
            .catch(err => next(err));
    } else {
        return next();
    }
};

exports.upload = upload;
exports.optimize = optimize;