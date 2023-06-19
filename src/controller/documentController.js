const { validationResult } = require('express-validator');
const document = require('../models/documentSchema');

// add document function
const addDocument = async(req,res) => {
    try {
        // check error or not
        const errors = validationResult(req)

        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array(), success: false })
        }
    
        req.body.image = "uploads/image_1681201506761.png"

        const documentData = new document(req.body);

        const response = await documentData.save();

        return res.status(200).json({success:true,message:"successfully added a new document."})

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