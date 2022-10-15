const express = require('express');
const {getAllGoals, getGoal, createGoal, updateGoal, deleteGoal} = require("../controllers/goal");
const {protect} = require('../middlewares/authMiddleware');
const router = express.Router()

router.route('/').get(protect, getAllGoals).post(protect, createGoal);
router.route('/:id').get(protect, getGoal).put(protect, updateGoal).delete(protect, deleteGoal);

module.exports = router;