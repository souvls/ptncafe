const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv');

const path = require('path')

// Load environment variables from .env file
dotenv.config();

const app = express()

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Atlas connected'))
.catch(err => console.log(err));

//call router
const router = require('./routers/router')

//call cookie
const cookieParser = require("cookie-parser")

//dynamic file
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//static file
app.use(express.static(path.join(__dirname, 'public')))

//use cookie
app.use(cookieParser())

//use post method
app.use(express.urlencoded({extended:false}))




let port = process.env.PORT || 3000;
app.use(router)
const server = app.listen(port, () => {
    console.log("run server")
})
