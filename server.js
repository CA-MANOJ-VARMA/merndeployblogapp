// get all the packages
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const colors = require("colors")
const dotenv = require("dotenv")
const connectDB = require("./config/db")

//env config
dotenv.config()

//router import
const userRoutes = require('./routes/userRoutes')
const blogRoutes = require('./routes/blogRoutes')

//mongodb connection
connectDB();

// rest object
const app = express()
//middleware body parser
app.use(express.json())
// middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// routes
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/blog', blogRoutes)

// port allocation using secure
const PORT = process.env.PORT || 3005
   

// listen
app.listen(PORT, ()=>{
    console.log(`Server Running on ${process.env.DEV_MODE} Port number ${PORT}`.bgCyan.white);
})