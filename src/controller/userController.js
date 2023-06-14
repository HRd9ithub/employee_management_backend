const user = require("../models/UserSchema")
const expressValidator = require("express-validator");

// create user function
const createUser = async(req,res) => {
    try {
        console.log('req.body', req.body)
        const errors = expressValidator.validationResult(req)
        console.log('errors', errors)
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array(),success:false })
        }
        // check email exist or not
        const email = await user.findOne({email:req.body.email})
        console.log(email, "====> email")

        if(email){
            return res.status(400).json({ message: "email address already exists." ,success:false})
        }else{
            const userData =  new user(req.body);
            const response = await userData.save();
            console.log('response', response)
           return  res.status(201).json({success:true,message:"user create successfully."})
        }
    } catch (error) {
        console.log('error', error)
        res.status(500).send("internal server")
    }
}

// single user data fetch function
const activeUser = async(req,res) => {
    try {
        if(req.user){   
            const userData = await  user.findOne({_id: req.params.id}).select("-password");
            if(userData){
                return  res.status(200).json({success:true,message:"User data fetch successfully.",data:userData})
            }else{
                return  res.status(404).json({success:false,message:"User is not found"})
            }
        }
    } catch (error) {
        console.log('error', error)
        res.status(500).send("internal server")
    }
}

// all user data fetch function
const getUser = async(req,res) => {
    try {
        if(req.user){     
            const userData = await  user.find().select("-password")
           return  res.status(200).json({success:true,message:"User data fetch successfully.",data:userData})
        }
    } catch (error) {
        console.log('error', error)
        res.status(500).send("internal server")
    }
}

// update user data function
const updateUser = async(req,res) => {
    try {
        console.log('req.body', req.params)
        const errors = expressValidator.validationResult(req)
        console.log('errors', errors)
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array(),success:false })
        }
        // check email exist or not
        const data = await user.findOne({email:req.body.email})
        console.log(data, "====> email")

        if(data && data._id != req.params.id){
            return res.status(400).json({ message: "email address already exists." ,success:false})
        }else{
            req.body.update_Date = Date.now()
            // data update method
            const response = await user.findByIdAndUpdate({_id :req.user.id},req.body);
            console.log('response', response)
           return  res.status(200).json({success:true,message:"User update successfully."})
        }
    } catch (error) {
        console.log('error', error)
        res.status(500).send("internal server")
    }
}


module.exports = {createUser,activeUser,getUser,updateUser}