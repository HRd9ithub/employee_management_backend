const { validationResult } = require('express-validator');
const role = require('../models/roleSchema');

// add role function
const addRole = async(req,res) => {
    try {
        // check error or not
        const errors = validationResult(req)

        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array(), success: false })
        }
    
        const roleData = new role(req.body);

        const response = await roleData.save();

        return res.status(200).json({success:true,message:"successfully added a new role.",data:response})

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

module.exports = {addRole,getDocument,updateDocument,deleteDocument}