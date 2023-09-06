// use mongoose
const mongoose = require('mongoose')

// design schema
let userSchema = mongoose.Schema({
    userName:String,
    pass:String
})
//create model
let User = mongoose.model("users",userSchema)

module.exports = User