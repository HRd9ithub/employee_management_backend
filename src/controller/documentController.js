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
            return res.status(400).json({ error: err, success: false })
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
        console.log('error', error)
        res.status(500).send("internal server")
    }
}

// update document
const updateDocument = async(req,res) => {
    try {
        // check error or not
        const errors = validationResult(req)

        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array(), success: false })
        }
    
        const response = await document.findByIdAndUpdate({_id: req.params.id},req.body)
        
        if(response){
            return res.status(200).json({success:true,message:"successfully edited a document."})
        }else{
            return res.status(404).json({success:false,message:"Document not found."})
        }

    } catch (error) {
        console.log('error', error)
        res.status(500).send("internal server")
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
        console.log('error', error)
        res.status(500).send("internal server")
    }
}

// get function
const getDocument = async(req,res) => {
    try {
        const response = await document.find();

        return res.status(200).json({success:true,message:"successfully fetch for document.",data:response})

    } catch (error) {
        console.log('error', error)
        res.status(500).send("internal server")
    }
}

module.exports = {addDocument,getDocument,updateDocument,deleteDocument}