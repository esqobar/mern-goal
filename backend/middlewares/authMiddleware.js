const asyncHandler = require('express-async-handler')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const protect = asyncHandler (async (req, res, next) => {
    let token
    if(req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')){
        try {
            //Get token from header
            token = req.headers.authorization.split(' ')[1]
            // verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            //Getting the user from the token
            req.user = await User.findById(decoded.id).select('-password')

            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Not Authorized')
        }
    }
    if(!token){
        res.status(401)
        throw new Error('Not Authorized, Missing Token')
    }
})

module.exports = { protect }