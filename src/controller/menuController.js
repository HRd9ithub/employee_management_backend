const menu = require("../models/menuSchema");

// create menu function
const createMenu = async (req, res) => {
    try {
        console.log('req.body', req.body)
        // find menu name in database
        const data = await menu.findOne({ name: req.body.name })
        console.log('data', data)
        if (data) {
            // exists menu name for send message
            return res.status(400).json({ message: "The menu name already exists.", success: false })
        }

        // not exists menu name for add database
        const menuData = new menu(req.body);
        const response = await menuData.save();
        console.log('response', response)
        return res.status(201).json({ success: true, message: "Successfully added a new menu." })

    } catch (error) {
        console.log('error =======> ', error);
        res.status(500).send("Internal server error")
    }
}

// update menu function
const updateMenu = async (req, res) => {
    try {
        console.log('req.body', req.body)
        // find menu name in database
        const data = await menu.findOne({ name: req.body.name })
        console.log('data', data)
        if (data && data._id != req.params.id) {
            // exists menu name for send message
            return res.status(400).json({ message: "The menu name already exists.", success: false })
        }

        // not exists menu name for update database
        const response = await menu.findByIdAndUpdate({ _id: req.params.id }, req.body)
        console.log('response', response)
        if(response){
            return res.status(200).json({ success: true, message: "Successfully edited a menu." })
        }else{
            return res.status(404).json({ success: false, message: "Menu is not found." })
        }

    } catch (error) {
        console.log('error =======> ', error);
        res.status(500).send("Internal server error")
    }
}

// update menu function
const deleteMenu = async (req, res) => {
    try {
        const response = await menu.findByIdAndDelete({ _id: req.params.id })
        console.log('response', response)
        if(response){
            return res.status(200).json({ success: true, message: "Successfully deleted a menu." })
        }else{
            return res.status(404).json({ success: false, message: "Menu is not found." })
        }

    } catch (error) {
        console.log('error =======> ', error);
        res.status(500).send("Internal server error")
    }
}

// get menu function
const getMenu = async (req, res) => {
    try {
        // get menu data in database
        const data = await menu.find()
        console.log('data', data)

        return res.status(200).json({ success: true, message: "Successfully fetch a menu data.",data:data })

    } catch (error) {
        console.log('error =======> ', error);
        res.status(500).send("Internal server error")
    }
}



module.exports = { createMenu, updateMenu,deleteMenu,getMenu }