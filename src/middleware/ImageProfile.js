const multer = require("multer");


const imgConfig = multer.diskStorage({
    destination : './uploads',
    filename: (req,res,callback) => {
        console.log('file.mimetype ', file)
        if (file !== undefined) {
            if (file.mimetype === "application/pdf") {
                return callback(null, `${file.originalname}`);
            } else if (file.mimetype === "text/csv") {
                return callback(null, `${file.originalname}`);
            } else {
                return callback(null, `image_${Date.now()}${path.extname(file.originalname)}`);
            }
        }
    }
})

const upload = multer({
    storage: imgConfig,
    dest: 'uploads/'
})

module.exports = upload