const multer = require("multer");
const path = require("path");


const imgConfig = multer.diskStorage({
    destination: './uploads/document',
    filename: (req, file, callback) => {
        // image/png,image/jpeg,image/jpg,.doc,.pdf
        // console.log('file.mimetype ', file)
        // if (file !== undefined) {
        //     if (file.mimetype === "application/pdf") {
        //         return callback(null, `${file.originalname}`);
        //     } else if (file.mimetype === "text/csv") {
        //         return callback(null, `${file.originalname}`);
        //     } else {
        return callback(null, file.originalname);
        // }
        // }
    }
})

const documentUpload = multer({
    storage: imgConfig,
    dest: 'uploads/',
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.svg' && ext !== '.jpeg' && ext !== '.pdf' && ext !== '.doc') {
            return callback(new Error('The file is invalid or the image type is not allowed. Allowed types: SVG, jpeg, jpg, png, pdf, doc'))
        }
        callback(null, true)
    }
})

module.exports = imgConfig