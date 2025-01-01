const express = require("express");
const cors = require("cors");
require("./db/config");

const User = require('./db/User');
const Product= require('./db/Product');
const Jwt= require('jsonwebtoken');
const jwtKey='e-comm';
const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
    res.send("app is working...")
});
app.post("/register", async (req, res) => {
    let user = new User(req.body);
    let result = await user.save();
    result= result.toObject();
    delete result.password;
    Jwt.sign({user},jwtKey,{expiresIn: "2h"} ,(err, token)=>{
        if(err){
            res.send({result: "Something went wrong"});
        }
        else{
        res.send({user, auth:token});
        }
    })
})
app.post("/login", async (req, res) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            Jwt.sign({user},jwtKey,{expiresIn: "2h"} ,(err, token)=>{
                if(err){
                    res.send({result: "Something went wrong"});
                }
                else{
                res.send({user, auth:token});
                }
            })
            // res.send(user);
        }
        else
            res.send({result: "No User found"})
    }
    else{
        res.send({result: "No User found"})
    }
})
app.post("/add-product",verifyToken,async (req, res)=>{
    let product= new Product(req.body);
    let result= await product.save();
    res.send(result);
})
app.get("/products",verifyToken, async (req, res)=>{
    const product = await Product.find();
    if(product.length>0){
        res.send(product);
    }
    else{
        res.send({result: "no product found"});
    }
})
app.delete("/products/:id",verifyToken, async(req, res)=>{
    let result= await Product.deleteOne({_id: req.params.id});

    res.send(result);
})
app.get("/products/:id",verifyToken, async (req, res)=>{
    let result= await Product.findOne({_id:req.params.id});
    if(result){
        res.send(result);
    }
    else{
        res.send({"result": "no record found"});
    }
})
app.put("/products/:id", verifyToken, async (req,res)=>{
    let result= await Product.updateOne(
        {_id: req.params.id},
        {$set: req.body}
    )
    res.send(result);
})
app.get("/search/:key", verifyToken, async (req,res)=>{
    let result= await Product.find({
        "$or":[
            {
                name:{$regex:req.params.key},
                
            },
            {
                company:{$regex:req.params.key}
            }
        ]
    }) ;
    res.send(result);   
})
function verifyToken(req, res, next){
    console.warn(req.headers['authorization']);
    let token= req.headers['authorization'];
    if(token){
        token= token.split(' ')[1];
        Jwt.verify(token,jwtKey, (err, valid)=>{
            if(err){
                res.send('Plz provide valid token');
            }
            else{
                next();
            }
        })
    }
    else{
        res.send('Please provide a token');
    }
    
}
app.listen(5000);