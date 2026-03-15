const mongoose = require("mongoose");
const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const userModel = require("./models/user");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/create", async (req, res) => {
  const { username, url, email } = req.body;
  let newUser = await userModel.create({
    username,
    email,
    url,
  });
  res.redirect("/read");
});

app.get("/read", async (req, res) => {
  let users = await userModel.find();
  res.render("read", { users });
});

app.get("/delete/:id",async (req,res) => {
    let deletedUser=await userModel.findOneAndDelete({_id:req.params.id})
    res.redirect("/read")
})

app.get("/edit/:id",async(req,res)=>{
    let user=await userModel.findOne({_id:req.params.id})
    res.render("edit",{user})
})

app.post("/update/:id",async (req,res) => {
    const {username,email,url}=req.body
    let user=await userModel.findOneAndUpdate({_id:req.params.id},{username,email,url},{new:true})
    res.redirect("/read")        
})

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
