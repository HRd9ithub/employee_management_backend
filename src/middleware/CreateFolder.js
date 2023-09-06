
const fs = require('fs');
const path = require("path")

const folderName = path.join(__dirname, "../../uploads")

const createFolder = () => {
    try {
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(path.join(__dirname,"../../uploads"));
        }
        if (!fs.existsSync(path.join(folderName,"document"))) {
            fs.mkdirSync(path.join(__dirname,"../../uploads/document"));
        }
    } catch (err) {
        console.error(err);
    }
}


module.exports = createFolder