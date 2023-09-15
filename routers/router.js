const express = require('express')
const router = express.Router()
const path = require('path')

//call model product
const Product = require('../models/product.js')

//call user
const User = require('../models/user.js')

//router home
router.get("/",async (req,res)=>{
    //doc product form database
    await Product.find({}).sort({ name: 1 }).then(product =>{
        res.render('index',{product})
    })
})

//router page admin login
router.get("/adminlogin",(req,res)=>{
    const x = "admin login"
    console.log("=> page admin login")
    res.render("adminLogin",{x:x})

})
//router logout
router.get("/logout",(req,res)=>{
    res.clearCookie('UserName')
    res.redirect("/adminlogin")
})

// router page admin menu
router.get("/adminMenu",async(req,res)=>{
    //check login
    if(req.cookies.UserName){
        const x = "admin Menu"
        console.log("=> page admin menu")
        res.render("adminMenu",{x:x})
    }else{
        res.redirect("/adminlogin")
    }
})

//router page admin manage
router.get("/adminManage", async (req, res) => {
    //check login
    if (req.cookies.UserName) {
        const x = "admin Manage";

        //read data and sent to mangae page 
        await Product.find().sort({ name: 1 }).then(products => {
            res.render("adminManage", { x, products })
            console.log("=> read all data, page manage")
        })
    } else {
        res.redirect("/adminlogin")
    }
})

//router page admin add product
router.get("/adminAdd",(req,res)=>{
    //check login
    if (req.cookies.UserName) {
        const x = 'add product'
        console.log("=> page add product") 
        res.render("adminAdd",{x})
    } else {
        res.redirect("/adminlogin")
    }
})

//router page admin edit
router.get("/adminEdit",(req,res)=>{
    //check login
    if (req.cookies.UserName) {
        const x = 'edit product'
        //get parameter id
        const id = req.query.id
        console.log("=> page admin edit , id: "+id)
    
        //find data by id and sent to page edit
        Product.findOne({_id:id}).then(product =>{
            res.render("adminEdit",{x:x,product:product})
        })
    } else {
        res.redirect("/adminlogin")
    }
})

//router delete product
router.get("/delete", (req, res) => {
    //check login
    if (req.cookies.UserName) {
        const id = req.query.id
        Product.findByIdAndDelete(id).then(console.log("delete id: " + id))
        res.send("<script>alert('ລົບ ສຳເລັດແລ້ວ'); window.location.href='/adminManage';</script>");
    } else {
        res.redirect("/adminlogin")
    }
})


//////////////////////////////////

//router check login
router.post("/checkLogin",(req,res)=>{
    const userName = req.body.userName
    const pass = req.body.pass

    User.findOne({name:userName,pass:pass})
    .then(user=>{
        if(user !== null){
            res.cookie("UserName",userName,{maxAge:3600000})
            res.redirect("/adminMenu")
        }else{
            console.log("user or password not exit")
            res.send("<script>alert('ຊື່ ຫຼື ລະຫັດຜ່ານຜິດ'); window.location.href='/adminLogin';</script>");
        } 
    })
    
})
//router insert data to database
router.post("/insert",(req,res)=>{
    //get pronduct 
    let getProduct = new Product({
        name:req.body.name,
        price:req.body.price,
        unit:req.body.unit,
        type:req.body.type,
        status:1
    })
    //insert
    getProduct.save().then(()=>{
        console.log("=> insert success")

        //respon massage to client
        res.send("<script>alert('ເພີ່ມ ສຳເລັດແລ້ວ'); window.location.href='/adminAdd';</script>");
        
    })
})

//edit
router.post("/edit",(req,res)=>{
    const id = req.body._id
    //get pronduct 
    let data =  {
        name:req.body.name,
        price:req.body.price,
        unit:req.body.unit,
        type:req.body.type,
        status:req.body.status
    }
    Product.findByIdAndUpdate(id,data).then(console.log("update"))
    res.send("<script>alert('ອັບເດດ ສຳເລັດແລ້ວ'); window.location.href='/adminManage';</script>");
})

//serach
router.post("/search",(req,res)=>{
    const key = ".*"+req.body.key+".*";
    const x = "adminManage";

    if(req.body.key === ''){
        res.redirect("/adminManage")
    }else{
        Product.find({name:{$regex:key}}).then(products=>{
            console.log("=> find key: "+req.body.key)
            res.render("adminManage",{x,products})
        })
    }

})
module.exports = router