import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'

//database
import db from './firebase_connection/firebase_connection.js'
import db_connect from './mongo_connection/mongo_connect.js'
db_connect()

//Routes
import account from './APIs/user_accout.js'
import data from './APIs/data.js'



const app=express()
app.use(bodyParser.json())
app.use(cors({
    origin:'http://localhost:5173',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true
}));

app.get("/",(req,res)=>{
    res.json({message:"Hello world"})
})

//Creating new data with auto ID
app.post("/create",(req,res)=>{
    var data=req.body;
    var ref=db.ref("cart/1")
    ref.push(data).then((ref)=>{res.json({message:"ok"})}).catch((err)=>{res.json({message:"not okay"})})
})

//Creating new data with auto ID
app.post("/create1",(req,res)=>{
    var data=req.body;
    var ref=db.ref("cart/1/"+data['name'])
    ref.set(data).then((ref)=>{res.json({message:"ok"})}).catch((err)=>{res.json({message:"not okay"})})
})

//Creating new data with auto ID
app.post("/new_data",(req,res)=>{
    var data=req.body;
    console.log(data)
    res.json({message:"ok"})
})

app.use("/account",account)
app.use("/data",data)


app.listen(5000,()=>{console.log("listenning on port 5000")})