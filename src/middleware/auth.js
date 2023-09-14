const jwt = require('jsonwebtoken');
const user = require('../models/UserSchema');
const SECRET_KEY = process.env.SECRET_KEY;

async function Auth(req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).send("Authorization failed. No access token.");
    }
    try {
        const token = authorization.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({
                message: 'Invalid Token Format'
            })
        }
        const decode = jwt.verify(token, SECRET_KEY);
        if (decode.date === new Date().toLocaleDateString()) {
            // console.log("authorization",decode)
            const data = await user.findOne({ _id: decode._id }).select("-password")
            if (data) {
                console.log("authorization",data)
                if (data.token == token && data.status === "Active" && !data.delete_at) {
                    console.log("authorization",data.token)
                    req.user = data
                    next()
                } else {
                    return res.status(401).json({ message: "Unauthentffficated.", success: false })
                }
            } else {
                return res.status(401).json({ message: "Unauthenticated.", success: false })
            }
        }
        else {
            return res.status(401).json({ message: "Unauthenticated.", success: false })
        }
    } catch (error) {
        console.log(error)
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: 'Session Expired',
                error: error.message,
            })
        }
        if (error instanceof jwt.JsonWebTokenError || error instanceof TokenError) {
            return res.status(401).json({
                message: 'Invalid Token',
                error: error.message,
            })
        }
        res.status(500).json({
            message: 'Internal server Error',
            error: error.message,
            stack: error.stack
        });
    }
}

module.exports = Auth