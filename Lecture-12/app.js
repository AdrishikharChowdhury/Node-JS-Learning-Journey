const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const multer=require("multer")
const mongoose = require("mongoose");

const upload=require("./config/multer")
const userModel = require("./models/user");
const postModel = require("./models/post");

const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/miniproject");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const isLoggedIn = (req, res, next) => {
  if (req.cookies.token === "") return res.send("You must be logged in");
  else {
    let data = jwt.verify(req.cookies.token, "verySecretKey");
    req.user = data;
  }
  next();
};

app.post("/create", upload.single('pfp'), async (req, res) => {
  const { username, name, age, email, password } = req.body;
  const {buffer,mimetype}=req.file
  let user = await userModel.findOne({ email });
  if (user) return res.status(500).send("User Already Have an Account");
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let user = await userModel.create({
        username,
        name,
        email,
        age,
        password: hash,
        pfp:{
          buffer,
          mimetype
        }
      });
      let token = jwt.sign({ email, userid: user._id }, "verySecretKey");
      res.cookie("token", token);
      res.redirect("/home");
    });
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await userModel.findOne({ email });
  if (!user) return res.status(500).send("Something Went Wrong");
  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      let token = jwt.sign({ email, userid: user._id }, "verySecretKey");
      res.cookie("token", token);
      return res.status(200).redirect("/home");
    }
    res.redirect("/login");
  });
});

app.post("/post/create", isLoggedIn, upload.single('image') , async (req, res) => {
  const { userid, email } = req.user;
  const {buffer,mimetype}=req.file
  let user = await userModel.findOne({ email });
  const { title, details, image } = req.body;
  let post = await postModel.create({
    user: userid,
    content: {
      title,
      details,
      image:{
        buffer,
        mimetype
      }
    },
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

app.post("/like/:id", isLoggedIn, async (req, res) => {
  const id = req.params.id;
  const { userid } = req.user;
  let post = await postModel.findOne({ _id: id }).populate("user");
  if (!post.likes.includes(userid)) {
    post.likes.push(userid);
  } else {
    post.likes.splice(post.likes.indexOf(userid), 1);
  }
  await post.save();
  const referrer = req.get("Referer") || "/home";
  res.redirect(referrer);
});

app.post("/post/edit/:id", upload.single('image'), isLoggedIn, async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  const { title, details } = req.body;
  
  let existingPost = await postModel.findById(id);
  if (!existingPost) return res.status(404).send("Post not found");
  
  let updateData = {
    date: new Date(),
    content: {
      title,
      details,
      
      image: req.file ? {
        buffer: req.file.buffer,
        mimetype: req.file.mimetype
      } : existingPost.content.image
    }
  };
  
  let post = await postModel.findByIdAndUpdate(id, updateData, { new: true });
  res.redirect(`/profile/${post.user}`);
});


app.get("/delete/:id",isLoggedIn,async (req,res) => {
  const id=req.params.id;
  const {userid}=req.user
  let post=await postModel.findOneAndDelete({_id:id})
  let user=await userModel.findOne({_id:userid})
  user.posts.pull(id)
  await user.save()
  res.redirect("/profile")
})

app.get("/edit/:id", isLoggedIn, async (req, res) => {
  const id = req.params.id;
  let post = await postModel.findOne({ _id: id });
  const { content } = post;
  res.render("editpost", { content, post });
});

app.get("/", (req, res) => {
  res.render("register");
});

app.get("/home", isLoggedIn, async (req, res) => {
  const { email } = req.user;
  let user = await userModel.findOne({ email });
  let posts = await postModel.find({}).populate("user", "username name _id");
  res.render("index", { user, posts,currentUser:req.user });
});

app.get("/profile", isLoggedIn, async (req, res) => {
  const { email } = req.user;
  let user = await userModel.findOne({ email });
  await user.populate("posts");
  res.render("profile", { user,currentUser:req.user });
});

app.get("/profile/:id", isLoggedIn, async (req, res) => {
  const id = req.params.id;
  const loggedInID = req.user.userid;
  if (id === loggedInID) return res.redirect("/profile");
  let user = await userModel.findOne({ _id: id });
  let posts = await postModel.find({ user: id });
  res.render("viewprofile", { user, posts,currentUser:req.user });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

app.get("/post", isLoggedIn, (req, res) => {
  res.render("post");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
