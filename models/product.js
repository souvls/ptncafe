// use mongoose
const mongoose = require('mongoose')

// design schema
let productSchema = mongoose.Schema({
    name:String,
    price:Number,
    unit:String,
    type:String,
    status:Number
})
//create model
let Product = mongoose.model("products",productSchema)

module.exports = Product