const express = require('express')
const cors = require('cors')
const colors = require('colors')
const morgan = require('morgan')
const dotenv = require('dotenv').config()
const connectDB = require('./configs/db')
const port = process.env.PORT || 8888
const goalRoutes = require('./routes/goal')
const userRoutes = require('./routes/user')
const {errorHandler} = require("./middlewares/errorHandlerMiddleware");
const path = require("path");

const app = express()

app.use(express.json({ type: "*/*"}))
app.use(express.urlencoded({extended: false}))

//db connection
connectDB()

app.use('/api/goals', goalRoutes);
app.use('/api/users', userRoutes);

//serving the frontend
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')))
}

//middlewares
app.use(morgan('tiny'))
app.use(errorHandler)

app.listen(port, ()=> {
    console.log(`Goal Server running on port: ${port}`.yellow)
})