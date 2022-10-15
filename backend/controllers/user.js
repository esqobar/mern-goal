const asyncHandler = require('express-async-handler')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const loginUser = asyncHandler (async (req, res) => {
    const {email, password} = req.body
    //checking the user email
    const user = await User.findOne({email})
    if(user && (await bcrypt.compare(password, user.password))){
        res.json({ _id: user.id, name: user.name,
            email: user.email, token: generateToken(user._id)})
    } else {
        res.status(400)
        throw new Error('Invalid Credentials')
    }
})

const registerUser = asyncHandler (async (req, res) => {
    const { name, email, password } = req.body

    if(!name || !email || !password){
        res.status(400)
        throw new Error('Please add all fields')
    }

    //checking if a user exists
    const userExist = await User.findOne({email})

    if(userExist){
        res.status(400)
        throw new Error('User already exists')
    }

    //hashing the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //creating the user
    const user = await User.create({
        name, email, password: hashedPassword
    })

    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid User Data')
    }
})

const getMe = asyncHandler (async (req, res) => {
    res.status(200).json(req.user)
})

// generating the JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

module.exports = {
    loginUser, registerUser, getMe
}