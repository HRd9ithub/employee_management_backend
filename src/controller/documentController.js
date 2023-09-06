const { validationResult } = require('express-validator');
const document = require('../models/documentSchema');
const { importDocument } = require('../middleware/documentUpload');

// add document function
const addDocument = async(req,res) => {
    try {
        const errors = validationResult(req)

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: err, success: false })
        }
    
        importDocument(req, res, async function (err) {
            if (err) {
                return res.status(422).send({ message: err.message })
            }
            console.log(req.file)
            if(req.file){
                let {name,description} = req.body;
                let {filename} = req.file;
                const documentData = new document({
                    name,
                    description,
                    image : filename
                });
        
                const response = await documentData.save();
        
                return res.status(200).json({success:true,message:"successfully added a new document."})
                
            }else{
                return res.status(400).send({ message: "File is Required."})
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// update document
const updateDocument = async(req,res) => {
    try {
        const errors = validationResult(req)

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: err, success: false })
        }
    
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
            
                    return res.status(200).json({success:true,message:"successfully edited a document."})
                    
                }else{
                    return res.status(400).send({ message: "File is Required."})
                }
            })
        }else{
            return res.status(404).json({success:false,message:"Document not found."})
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// delete document
const deleteDocument = async(req,res) => {
    try {
        const response = await document.findByIdAndDelete({_id: req.params.id},req.body)
        
        if(response){
            return res.status(200).json({success:true,message:"successfully deleted a document."})
        }else{
            return res.status(404).json({success:false,message:"Document not found."})
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// get function
const getDocument = async(req,res) => {
    try {
        const response = await document.find();

        return res.status(200).json({success:true,message:"successfully fetch for document.",data:response,permissions: req.permissions})

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

module.exports = {addDocument,getDocument,updateDocument,deleteDocument}