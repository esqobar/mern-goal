const asyncHandler = require('express-async-handler')
const Goal = require('../models/goal')
const User = require('../models/user')

const getAllGoals = asyncHandler (async (req, res) => {
    const goals = await Goal.find({user: req.user.id });
    res.status(200).json(goals)
})

const getGoal = asyncHandler (async (req, res) => {
    const goal = await Goal.findById(req.params.id)
    if(!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }

    res.status(200).json(goal)
})

const createGoal = asyncHandler (async (req, res) => {
    if(!req.body.text){
        res.status(400)
        throw new Error('Please add a text field')
    }
    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id
    })

    res.status(200).json(goal)
})

const updateGoal = asyncHandler (async (req, res) => {
    const goal = await Goal.findById(req.params.id)
    if(!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }

    //checking for user
    if(!req.user){
        res.status(401)
        throw new Error('User Not Found')
    }

    //making sure the loggedin user matches the goal user
    if(goal.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('User Not Authorized')
    }
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true})
    res.status(200).json(updatedGoal)
})

const deleteGoal = asyncHandler (async (req, res) => {
    const goal = await Goal.findById(req.params.id)
    if(!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }

    //checking for user
    if(!req.user){
        res.status(401)
        throw new Error('User Not Found')
    }

    //making sure the loggedin user matches the goal user
    if(goal.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('User Not Authorized')
    }
    await goal.remove()
    res.status(200).json({id: req.params.id})
})

module.exports = {
    getAllGoals, getGoal, createGoal, updateGoal, deleteGoal
}