const express = require("express");
const app = express();
const userModel = require("./models/user");
const postModel = require("./models/post");

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/create", async (req, res) => {
  let user = await userModel.create({
    username: "Adrishikhar Chowdhury",
    email: "test@example.com",
    age: 21,
  });

  res.send(user);
});

app.get("/posts/create", async (req, res) => {
  let post = await postModel.create({
    postData: "Posting Something Interesting...",
    user: "69bd99d1a37ada9e68010bd0",
  });

  let user = await userModel.findOne({ _id: "69bd99d1a37ada9e68010bd0" });
  user.posts.push(post._id);
  await user.save()
  res.send(post);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
