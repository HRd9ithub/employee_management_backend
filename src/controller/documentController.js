const document = require('../models/documentSchema');
const { importDocument } = require('../middleware/documentUpload');
const path = require("path");

// add document function
const addDocument = async(req,res) => {
    try {
        importDocument(req, res, async function (err) {
            if (err) {
                return res.status(422).send({ message: err.message })
            }
            if(req.file){
                let {name,description} = req.body;
                let {filename} = req.file;
                const documentData = new document({
                    name,
                    description,
                    image : filename
                });
        
                const response = await documentData.save();
        
                return res.status(200).json({success:true,message:"Data added successfully."})
                
            }else{
                return res.status(400).send({ message: "File is Required."})
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}
;
// update document
const updateDocument = async(req,res) => {
    try {
        const response = await document.findOne({_id: req.params.id})
        
        if(response){
            importDocument(req, res, async function (err) {
                if (err) {
                    return res.status(422).send({ message: err.message })
                }
                if(req.file || req.body.image){
                    let {name,description} = req.body;
                    const documentData = {
                        name,
                        description ,
                        image : req.file && req.file.filename
                    };
            
                    const response = await document.findByIdAndUpdate({_id: req.params.id},documentData)
            
                    return res.status(200).json({success:true,message:"Data updated successfully."})
                    
                }else{
                    return res.status(400).send({ message: "File is Required."})
                }
            })
        }else{
            return res.status(404).json({success:false,message:"Document not found."})
        }

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// delete document
const deleteDocument = async(req,res) => {
    try {
        const response = await document.findByIdAndDelete({_id: req.params.id},req.body)
        
        if(response){
            return res.status(200).json({success:true,message:"Data deleted successfully."})
        }else{
            return res.status(404).json({success:false,message:"Document not found."})
        }

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// get function
const getDocument = async(req,res) => {
    try {
        const response = await document.find();

        return res.status(200).json({success:true,message:"successfully fetch for document.",data:response,permissions: req.permissions})

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}


// downloadFile
const downloadFile = async(req,res) => {
    let filePath = path.join(__dirname,"../../uploads/document");
    try {
        let {file}  = req.query;
        if(!file){
            return res.status(400).json({ message: "File name is required.", success: false })
        }
        let route = path.join(filePath,file);
        res.download(route)
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

module.exports = {addDocument,getDocument,updateDocument,deleteDocument,downloadFile}