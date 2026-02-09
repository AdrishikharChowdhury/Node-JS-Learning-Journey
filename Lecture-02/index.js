const express=require("express");
const app=express()

app.use((req,res,next)=>{
    console.log('Middleware working');
    next();
})

app.get('/',(req,res)=>{
    res.send('Hello World');
})

app.get('/user',(req,res)=>{
    res.send('My name is Adrishikhar Chowdhury');
})

app.use((err,req,res,next)=>{
    console.log(err.stack)
    res.status(500).send("Something Broke");
})

app.listen(3000);